# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Navarro is a browser-based single-player card game (Netrunner × Slay the Spire) built with React 19, TypeScript, Vite, Mantine, Tailwind CSS v4, and Zustand.

**Requirements:** Node.js 24 (`.nvmrc`), pnpm 11 (pinned via `packageManager` / corepack)

## Commands

```bash
pnpm dev        # Vite dev server with HMR
pnpm build      # TypeScript check + production build
pnpm lint       # ESLint (zero warnings enforced)
pnpm format     # Prettier
pnpm tsc        # Type checking only
```

Pre-commit hook runs Prettier → tsc → ESLint; all must pass with zero warnings. Commit messages use gitmoji (`✨ add card size to the settings drawer`).

## Architecture

Three layers with lint-enforced boundaries (see `eslint.config.ts`): **UI never imports phase thunks** (it emits GameEvents), and **card definitions never import game state** (they are pure data).

### Card System (`src/cards/`)

Cards are pure data; behavior lives in the engine; game state stores lightweight instances. Full design record: `CARD_REGISTRY.md`.

```
src/cards/
├── enums.ts            # CardType, CardRarity, TriggerMoment, Keyword, subtypes
├── ids.ts              # CardId registry — type-safe union of all card ids
├── instance.ts         # CardInstance { instanceId, definitionId } (+ IceCardInstance
│                       #   with isRezzed), createCardInstance(), resolveCard()
├── definitions/        # Pure-data card definitions (object literals, no functions)
└── engine/
    ├── effects/        # EffectParamsMap/EffectSpec (typed data) + implementations,
    │                   #   conditions, registry (compile-time-complete)
    ├── keywords.ts     # Keyword registry: rule-flags + effect grants + reminder text
    ├── resolve.ts      # resolveEffectSpecs = keyword grants + printed + implicit effects
    ├── execute.ts      # executeTriggers(instance, trigger, dispatch, getState)
    └── text.ts         # getCardTextLines / renderCardText — generated rules text
```

Key concepts:

- **EffectSpec** (pure data): `{ effect: "draw", params: { amount: 3 } }`. Params typed per effect id via `EffectParamsMap` — wrong or missing params are compile errors. Optional overrides: `trigger`, `condition`, `text`.
- **Conditions**: `{ check: "server_security_at_least", params: { level: 3 } }` gates an effect. Named predicates, deliberately not a `{ stat, op, value }` DSL.
- **Keywords are mechanical**: registry entries with rule-`flags` (queried via `hasKeywordFlag` — `trashAfterPlay`, `unplayable`, `noNoiseOnPlay`, `trashOnHandDiscard`) and/or effect `grants`. Never special-case a keyword in phase logic.
- **Implicit effects**: effects implied by stats/type rules (an agenda's `victoryPoints` generates its scoring effect and "Score N." text). One source of truth — never duplicate a stat as an effect.
- **Instances**: state stores `{ instanceId, definitionId }` only (serializable). Resolve with `resolveCard(instance)` at the point of use.
- **Generated text**: rules text derives from effect params (per-effect or card-level `text` overrides available), so text can never drift from behavior. UI renders `getCardTextLines(definition)`.
- All trigger execution goes through `executeTriggers(instance, trigger, dispatch, getState)` — phases never touch effect implementations directly.

### State (`src/state/`)

Zustand store with Redux-like slices (`player`, `server`, `turn`, `board`, `settings`), each with `types/actions/reducer/selectors`. `useGameStore((s) => ...)` to read; `dispatch(actionCreator())` to write; `batchDispatch([...])` to coalesce re-renders. Multi-step game logic lives in thunks under `src/state/phases/`.

`board.permanentEffects` holds ongoing modifiers (e.g. Bad Moon's aura, Fire Wall's dynamic strength) applied by selectors like `getPlayerCardsPerTurn` and `calculateIceStrength` — modifiers read live `gameState` at evaluation time.

### Events (`src/state/events/`)

```
UI → eventBus.emit(event) → eventHandler resolves & validates → phase thunk → state
```

Deliberately minimal vocabulary — a click carries no intent; the handler derives meaning from where the card lives and the phase/run state:

- `CARD_CLICKED { instanceId }` — in hand during Main → play; the encountered ice → click through; an accessed card → select; anything else → ignored.
- `PLAYER_INITIATE_RUN`, `PLAYER_END_TURN` — button intents.

The event handler is the single authority on click rules; any state checks in UI components are cosmetic affordances only. Add a more specific event only when one click could mean two different things (e.g. a future `PLAYER_BREAK_SUBROUTINE`). Debug with `eventBus.getHistory()`; the handler logs resolved intents in dev mode.

### Turn Flow

```
Corp → Draw → Upkeep → Main ⇄ (Play | Run) → End → Corp …
```

- **Automatic phases** (`PhaseManager.tsx` watches `phaseCounter`): Corp (security +1, install ice, ON_REZ), Draw (reset clicks, draw, ON_DRAW; → End if 0 clicks), Upkeep (ON_UPKEEP on installed programs, exactly once per turn), Main (pure waiting state, safely re-enterable), End (discard hand — Ethereal cards go to trash).
- **User-driven phases** (invoked by the event handler with payloads): `playPhase({ cardId })`, `initiateRun()` (also via the Run card's effect), `clickIce({ iceId })`, `selectAccessedCard({ cardId })`. Play/Run return to Main if clicks remain, else End.
- Run uses an internal state machine (`runProgressState`): `NOT_IN_RUN` → `ENCOUNTERING_ICE` (loop) → `ACCESSING_CARDS`.

### Trigger Moments

| Trigger | Fires | On |
| --- | --- | --- |
| ON_REZ | Corp installs ice | the new ice |
| ON_DRAW | Draw phase | each card in hand |
| ON_UPKEEP | Upkeep phase (once/turn) | installed programs |
| ON_PLAY | Card played | played cards |
| ON_INSTALL / ON_TRASH / ON_DISCARD | Zone moves after play, access resolution, net damage | the moved card |
| ON_RUN_START / ON_RUN_END | Run boundaries | installed programs |
| ON_ENCOUNTER | Ice clicked (subroutines) | the encountered ice |
| ON_ACCESS | Access begins | each accessed card |
| ON_FETCH | Accessed card selected | the selected card |

## Development Guidelines

### Adding a Card (usually zero code)

1. Add the id to `src/cards/ids.ts` in the right category object.
2. Add an object literal to the matching file in `src/cards/definitions/`:

```typescript
{
  id: CardId.MY_CARD,
  name: "My Card",
  type: CardType.SCRIPT,
  rarity: CardRarity.COMMON,
  image: "my_card.jpg",
  keywords: [Keyword.TRASH],                            // optional
  effects: [{ effect: "draw", params: { amount: 2 } }],
}
```

3. Add it to a deck (`src/decks/`). Rules text is generated.

- **New effect primitive** (genuinely new mechanics only): add its params shape to `EffectParamsMap`, its implementation to `primitives.ts`. The mapped-type registry makes a missing/extra implementation a compile error.
- **New keyword**: one entry in `engine/keywords.ts`; if it needs a static rule the engine doesn't know, add one `hasKeywordFlag` check at the relevant spot — once, not per card.
- **New condition**: add params to `ConditionParamsMap`, predicate to `conditions.ts`.
- **New state**: extend the slice's `types/actions/reducer/selectors`; multi-step logic becomes a thunk in `src/state/phases/`.

### Conventions

- Strict TS + strict type-checked ESLint; double quotes, semicolons, trailing commas; arrow-function components; `eslint-plugin-perfectionist` auto-sorts imports/props/objects.
- Tailwind sits in a separate CSS layer to override Mantine (`src/index.css`); dark theme by default (`src/index.tsx`).
- Card ability text conventions live in `engine/text.ts`: trigger labels only for non-default triggers; ON_ENCOUNTER renders as a subroutine marker; consecutive same-trigger effects group under one label.

## Open Items

- First test suite (vitest) — engine and event handler are pure/headless-drivable.
- Icebreaker interaction (Sledgehammer is text-only) — see `EVENT_SYSTEM_REFACTOR.md` follow-ups.
- `destroy_all_programs` (Flush) is a no-op placeholder.
- Pre-existing React duplicate-key warning during play (likely `PlayerHand` AnimatePresence).
- Performance: profile before optimizing — see `PERFORMANCE.md`.
