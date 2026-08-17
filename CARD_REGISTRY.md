# Card Registry Refactor Plan

Goal: cards become **pure data**. Adding a new card means listing its properties (title, image, rarity, effects, keywords) in a TypeScript object literal — no new logic unless the card introduces a genuinely new mechanic. Game state stores lightweight card *instances* that reference their *definition* by id.

Decisions already made:

- **Authoring format**: TypeScript object literals checked with `satisfies CardDefinition` (not JSON).
- **Scope**: full definition/instance split — Zustand state holds `{ instanceId, definitionId, ...mutableState }`, never definitions.
- **Card text**: auto-generated from effect params by default, with optional per-card override.
- **Keywords**: fully mechanical — a keyword is a named, reusable bundle of behavior defined once, queried by the engine.

---

## 1. Problems with the current system

| Problem | Where | Consequence |
| --- | --- | --- |
| Effects are not parameterized | `effects/registry.ts` has `DRAW_CARDS_1`, `DRAW_CARDS_3`, `GAIN_CLICKS_1`, `GAIN_CLICKS_3`… | Every new number requires a new hand-written effect + registry entry. "Draw 2" is a code change. |
| Card definitions contain functions | `CardEffect.getActions/getThunk/getText`, `IceCardDefinitions.getStrength` | Cards aren't serializable data; can't be diffed, saved, or validated. |
| Definitions are spread into game state | `createPlayingCard.ts` does `{ ...card, deckContextId: uuid() }` | Zustand state contains closures. No save games, no replay, devtools noise, and per-instance copies of static data. |
| Keywords are empty stubs | `keywords.ts` — every `KEYWORD_EFFECTS` entry returns `[]` | Actual keyword behavior (`Trash`) is special-cased inside `playPhase.ts`. `Stealthy`, `Ethereal`, `Crash` do nothing. |
| Card text is hand-maintained | `getText: () => "Gain 3 ticks."` (typo, already drifted) | Text and behavior can silently disagree. |
| Legacy name-based factories | bottom of `createPlayingCard.ts` | Dead weight, string-fragile. |

---

## 2. Target architecture

New top-level module `src/cards/` (replaces `src/cardDefinitions/`):

```
src/cards/
├── engine/
│   ├── effects/
│   │   ├── primitives.ts    # Parameterized effect implementations (draw, gainClicks, …)
│   │   ├── unique.ts        # Card-specific effects that are genuinely one-off
│   │   ├── registry.ts      # EffectId const + effectRegistry map
│   │   └── types.ts         # EffectSpec, EffectImplementation, EffectContext
│   ├── keywords/
│   │   ├── registry.ts      # KeywordId const + keyword definitions
│   │   └── types.ts         # KeywordDefinition
│   ├── text.ts              # renderCardText(definition) — generated rules text
│   ├── resolve.ts           # getDefinition(id), resolveEffects(card, trigger)
│   └── stats.ts             # getIceStrength(instance, gameState) — static modifiers
├── definitions/
│   ├── types.ts             # CardDefinition union (pure data, no functions)
│   ├── ids.ts               # CardId const objects (moves from registry.ts)
│   ├── agendas.ts, ice.ts, programs.ts, scripts.ts, traps.ts
│   └── index.ts             # CARD_DEFINITIONS map, getCardDefinition(id)
└── instance.ts              # CardInstance type + createCardInstance(id)
```

### 2.1 Effect primitives (the core fix)

An effect is split into two halves:

- **`EffectSpec`** — pure data, what card definitions contain:

  ```typescript
  type EffectSpec = {
    effect: EffectId;                 // which primitive
    params?: Record<string, unknown>; // typed per-primitive via a params map (see below)
    trigger?: TriggerMoment;          // override the primitive's default trigger
    costs?: EffectCost[];             // e.g. [EffectCost.CLICK] for activated abilities
    text?: string;                    // optional override of generated text
  };
  ```

- **`EffectImplementation`** — code, registered once per primitive:

  ```typescript
  type EffectImplementation<P = void> = {
    defaultTrigger: TriggerMoment;
    getText: (params: P) => string;                       // "Draw 3 cards."
    getActions?: (params: P, ctx: EffectContext) => GameAction[];
    getThunk?: (params: P, ctx: EffectContext) => ThunkAction;
  };
  // EffectContext = { gameState, sourceId, targetId } (same as today's EffectParams)
  ```

Type safety between spec and implementation comes from a **params interface map**, so `effect: "draw"` forces `params: { amount: number }` at compile time:

```typescript
interface EffectParamsMap {
  draw: { amount: number };
  modify_clicks: { amount: number };          // negative = lose
  modify_signal: { amount: number };
  modify_tags: { amount: number };
  gain_victory_points: { amount: number };
  modify_server_security: { amount: number };
  deal_net_damage: { amount: number };
  end_run: void;
  initiate_run: void;
  break_subroutine: { iceSubtype: IceSubtype };
  // genuinely unique, card-specific effects would register here too
  // (currently there are none — everything decomposed into primitives)
}

type EffectSpec = {
  [K in keyof EffectParamsMap]: {
    effect: K;
    trigger?: TriggerMoment;
    costs?: EffectCost[];
    text?: string;
  } & (EffectParamsMap[K] extends void ? {} : { params: EffectParamsMap[K] });
}[keyof EffectParamsMap];
```

This replaces today's ten `CommonEffectId` entries with ~6 primitives, and kills the `_1`/`_3` suffix pattern permanently. Genuinely unique effects stay as code — that's normal in every card engine — but they live in the engine (`unique.ts`, recreated when the first one appears) and are still referenced from card data by id.

**Conditions** ("on trigger: if condition, effect"): an `EffectSpec` can carry an optional `condition` gating its execution:

```typescript
// Server Lockdown, as pure data:
{
  effect: "end_run",
  trigger: TriggerMoment.ON_ACCESS,
  condition: { check: "server_security_at_least", params: { level: 3 } },
}
```

Conditions mirror the effects design exactly: a `ConditionParamsMap` binds each condition id to typed params, and a `ConditionImplementation` provides `isMet(params, context)` plus a generated text fragment ("if the server security level is 3 or more"). Conditions are deliberately **named predicates**, not a generic `{ stat, op, value }` expression language — a registry of typed predicates stays honest; a mini-DSL is how card engines accidentally grow a bad programming language.

### 2.2 Keywords as mechanics

```typescript
type KeywordDefinition = {
  id: Keyword;
  name: string;                 // "Stealthy"
  reminderText: string;         // "(Does not raise server security when running.)"
  grants?: EffectSpec[];        // triggered effects the keyword contributes
  // Static rule-flags the engine queries instead of hardcoding card checks:
  flags?: Partial<{
    trashOnUse: boolean;        // Trash: goes to trash pile instead of discard
    unplayable: boolean;        // Unplayable: cannot be played from hand
  }>;
};
```

- A card lists `keywords: [Keyword.TRASH]` in its definition.
- `resolveEffects(card, trigger)` merges the card's own `effects` with every `grants` from its keywords — keyword effects are indistinguishable from printed effects at execution time.
- Phase logic replaces special-casing with queries: `hasKeywordFlag(card, "trashOnUse")` in `playPhase.ts` instead of `card.cardEffects.some((e) => e.keyword === Keyword.TRASH)`.
- Card UI renders `Stealthy` in bold with `reminderText` as tooltip — for free, from the registry.

Adding a future keyword = one entry in the keyword registry (+ one flag check in the engine if it's a static rule, added once, not per card).

### 2.3 Card definitions — pure data

```typescript
type BaseCardDefinition = {
  id: CardId;
  name: string;
  type: CardType;
  rarity: CardRarity;
  image: string;
  effects: EffectSpec[];
  keywords?: Keyword[];
  text?: string;          // full-card text override (rare)
  flavorText?: string;
};

type IceCardDefinition = BaseCardDefinition & {
  type: CardType.ICE;
  subtype: IceSubtype;
  strength: number;       // BASE strength — a plain number, see 2.4
  damage: number;
};
// Program/Agenda/Script/Trap variants as today, minus all functions.
```

Example — what adding a card looks like after the refactor:

```typescript
// definitions/scripts.ts
{
  id: CardId.FOCUS,
  name: "Focus",
  type: CardType.SCRIPT,
  rarity: CardRarity.COMMON,
  image: "focus.jpg",
  effects: [{ effect: "draw", params: { amount: 3 } }],
} satisfies ScriptCardDefinition,
```

No `getText` (generated: "Draw 3 cards."), no imports from `state/`, no closures.

### 2.4 Dynamic stats without functions

`IceCardDefinitions.getStrength` (Fire Wall scales with security, Bad Moon buffs others) is replaced by:

- `strength: number` on the definition = base value.
- A `static_modifier` effect primitive for auras, e.g. Bad Moon:
  `{ effect: "modify_other_ice_strength", params: { amount: 1 } }`
- Self-scaling as a primitive, e.g. Fire Wall:
  `{ effect: "strength_per_server_security", params: { perLevel: 1 } }`
- `engine/stats.ts` exposes `getIceStrength(instance, gameState)`: base + sum of applicable modifier effects from all cards in play. UI and run logic call this selector instead of `card.getStrength(state)`.

This is the standard "continuous effects" approach (MtG layers, simplified to one additive pass — sufficient at this scale).

### 2.5 Definition/instance split

```typescript
// cards/instance.ts
type CardInstance = {
  instanceId: string;      // uuid — replaces deckContextId
  definitionId: CardId;
  // room for future mutable per-card state: counters, damage, isRezzed…
};

const createCardInstance = (id: CardId): CardInstance => ({
  instanceId: uuid(),
  definitionId: id,
});
```

- All Zustand slices (`playerHand`, `playerInstalledPrograms`, `serverIce`, discard/trash piles, decks…) store `CardInstance[]` instead of `PlayingCard[]`.
- `isRezzed` moves from the Ice *definition* (where it's currently a lie — it's mutable state) onto the instance.
- Components receive a **resolved view**: a small hook/selector `useCardView(instance)` → `{ instance, definition, text, strength? }`. UI reads `view.definition.name`, `view.text`, etc.
- State becomes fully serializable → save games, undo, and replay become possible; Redux devtools output becomes readable.

### 2.6 Generated card text

`engine/text.ts`:

```
renderCardText(def) =
  def.text ??
  [ ...keyword names (+ reminder text),
    ...def.effects.map(spec =>
        spec.text ?? `${triggerLabel(spec)}${impl.getText(spec.params)}`) ]
```

- `triggerLabel` prefixes non-default triggers: "On Encounter: lose 1 click."
- **Trigger grouping**: consecutive effects sharing the same effective trigger render under a single label — e.g. Intrusive Thoughts (`draw` + `modify_clicks`, both `ON_UPKEEP`) generates "On Upkeep: Draw 1 card. Lose 1 click." instead of two separately-labeled lines. This makes card-level overrides unnecessary for most multi-effect cards.
- **Condition composition**: a conditioned effect renders as `if <condition fragment>, <effect text lowercased>` — e.g. Server Lockdown generates "On Access: if the server security level is 3 or more, end the run."
- Precedence: card-level `text` override > per-effect `text` override > generated.
- Fixes the "Gain 3 ticks" class of bug permanently; also fixes the Fire Wall/"Bad Moon" copy-paste error listed in Known Issues, since bespoke strings mostly disappear.

---

## 3. Migration plan

Each phase leaves the game compiling and playable (`pnpm build` green). Order chosen so risky/wide changes come after the data model is proven.

### Phase 1 — Engine skeleton + parameterized effects ✅ DONE

1. ✅ Created `src/cards/engine/effects/` with `EffectParamsMap`, `EffectSpec`, `EffectImplementation` (`types.ts`), primitive implementations (`primitives.ts`), one-offs (`unique.ts`), and the registry (`registry.ts`).
2. ✅ Adapter written: `specToCardEffect(spec): CardEffect` in `legacyAdapter.ts`.
3. ✅ Nothing deleted; old `cardDefinitions/effects/` untouched and still in use.

Implementation notes:

- More effects were generalizable than first cataloged — **no unique effects remain** (`unique.ts` was deleted; recreate it when the first genuinely novel mechanic appears). Deep Thoughts → `modify_cards_per_turn`, Bad Moon → `modify_other_ice_strength`, Fire Wall → `strength_per_server_security` + `net_damage_per_security`, Sledgehammer → `break_subroutine`, all ten `CommonEffectId`s → 6 primitives. Intrusive Thoughts is not an effect at all — it's two primitive specs (`draw` + `modify_clicks`, both `trigger: ON_UPKEEP`). Server Lockdown decomposed into the condition system: `end_run` gated by `server_security_at_least: { level: 3 }`.
- **Deliberate behavior change (decided 2026-08-17)**: Server Lockdown's old implementation dispatched a raw `setTurnCurrentPhase(TurnPhase.End)` — force-ending the *turn*, skipping run-state cleanup, ignoring remaining clicks — while its printed text said "end the run". The decomposed version uses the real `endRun()` thunk (proper cleanup, back to Main if clicks remain), matching the printed text. Takes effect when the card definition migrates in Phase 2.
- `strength_per_server_security` faithfully ports an existing quirk: the old Fire Wall permanent effect closes over `gameState` at creation time, so its strength freezes at the security level when it was played. `PermanentEffectT.getModifier` can't read live state; fixing this belongs to Phase 2 (`engine/stats.ts`), not the port.
- Type guarantees verified with `@ts-expect-error` probes: missing params, wrong-shaped params, params on void effects, and unknown ids are all compile errors.

### Phase 2 — Pure-data card definitions ✅ DONE

1. ✅ Created `src/cards/definitions/` — function-free `CardDefinition` union (`types.ts`) and all five card data files. Every card is now a pure object literal; the old data files and the entire old `cardDefinitions/effects/` module were deleted (nothing else imported them).
2. ✅ Implemented `engine/text.ts`: `renderEffectText` (trigger labels for non-default triggers; ON_PLAY/ON_ENCOUNTER/ON_CLICK intentionally unlabeled — the UI conveys those via position/subroutine-arrow/cost-prefix), `renderCardText` (keyword lines + trigger grouping + condition composition). The legacy adapter routes per-effect text through `renderEffectText`, so generated text is already live in the UI.
3. ✅ `createPlayingCard.ts` rebuilt: converts definitions → legacy `PlayingCard` shape (keywords become `KEYWORD_EFFECTS` entries until Phase 3; `getStrength` synthesized from `strength`). Same exported API, so state, UI, and the deck files needed no changes. The unused deprecated name-based factories were deleted.
4. ✅ Verified: tsc, lint, production build, and a headless-browser smoke test of the running game (cards render with generated text, no console errors).

Implementation notes / deviations:

- `engine/stats.ts` was **not needed**: the existing selectors (`getIceStrength`, `calculateIceStrength`, `getPlayerCardsPerTurn`) already aggregate base + permanent-effect modifiers. The Fire Wall fix landed inside `strength_per_server_security` instead: default trigger changed to ON_REZ (the old FIRE_WALL_DYNAMIC_STRENGTH was ON_PLAY, which **never fires on ice** — its live strength actually came from the definition's `getStrength`), and `getModifier` now reads the `gameState` passed at evaluation time, so strength tracks the live security level. Fire Wall's definition is `strength: 0` + that modifier.
- `CardId` stayed in `cardDefinitions/registry.ts` for now (the planned `definitions/ids.ts` move happens with the Phase 5 relocation, to avoid churning every import twice).
- Added `destroy_all_programs` primitive (still a no-op placeholder, ported from Flush's inline TODO).
- **Implicit effects** (`engine/resolve.ts`, pulled forward from Phase 3): effects implied by a stat or type rule are derived, not printed — an agenda's `victoryPoints` stat generates its `gain_victory_points` ON_FETCH effect and "Score N." text, so the stat and the scoring can never disagree (they did: Signal Broadcast said 2 but scored 3, Corporate Secrets said 1 but scored 2 — resolved to 3 and 2). `resolveEffectSpecs(definition)` = printed effects + implicit effects; Phase 3 extends it with keyword grants.
- Gameplay-visible changes shipped in this phase: Server Lockdown now truly ends the run (decided earlier); Fire Wall's strength digit now renders in the UI's "buffed" green (base 0 + modifier instead of dynamic base); keyword lines render before printed effects everywhere; text fixes ("Gain 3 clicks.", "On Draw: Lose 1 click."); Intrusive Thoughts shows two labeled lines until the grouped `renderCardText` reaches the UI in Phase 4.

### Phase 3 — Mechanical keywords ✅ DONE

1. ✅ Keyword registry built (`engine/keywords.ts`): each keyword defines `reminderText`, optional `grants` (effect specs), and optional `flags`. Flags implemented: `unplayable`, `trashAfterPlay` (Trash), `trashOnHandDiscard` (Ethereal), `noNoiseOnPlay` (Stealthy).
2. ✅ `resolveEffectSpecs` now merges keyword grants first, then printed effects, then implicit effects. (No keyword currently grants effects — all four real keywords are pure rule-flags — but the seam exists.)
3. ✅ All keyword special-cases replaced with `hasKeywordFlag(card.keywords, flag)` queries: `playPhase.ts` (noise + trash-after-play), `deckUtils.discardHand` (ethereal), `PlayerHand.tsx` (unplayable). The legacy `PlayingCard` shape gained a `keywords` field carried through the converter; `KEYWORD_EFFECTS` and `cardUtils.hasKeyword` are deleted.
4. ✅ Semantics settled: `Stealthy` = playing cards usually generates noise, Stealthy cards generate none — the `noNoiseOnPlay` flag (it was already implemented in playPhase; the plan's earlier claim it was unimplemented was wrong). `Crash` had no semantics and no cards using it — removed from the `Keyword` enum entirely (decided 2026-08-17).

Bonus: card UI now shows each keyword's reminder text as a tooltip (`CardEffects.tsx` reads the registry) — e.g. hovering "Trash." shows "(Goes to the trash after being played.)".

### Phase 4 — Definition/instance split (the big one) ✅ DONE

1. ✅ `src/cards/instance.ts`: `CardInstance` (`{ instanceId, definitionId }`), `IceCardInstance` (+ `isRezzed`, moved off the definition), `createCardInstance`/`createIceCardInstance`, `resolveCard`/`resolveIceCard`.
2. ✅ All state slices store instances: player module (deck/hand/piles/programs/accessed/score), server module (installed/unencountered/current ice). `deckContextId` → `instanceId` everywhere (state, phases, eventHandler, UI keys).
3. ✅ UI resolves definitions at the edge: `CardFront` takes an instance, resolves once, routes to `CardFrontIce`/`CardFrontGeneric`/`CardFrontFullArt` with typed definitions. Rules text renders via a new `getCardTextLines(definition)` engine API — `CardTextLine[]` carries the metadata the UI styles (subroutine marker, cost prefix, keyword tooltip) — with `renderCardText` now a thin plain-string wrapper over it.
4. ✅ Phases and utils execute effects via a new engine executor (`engine/execute.ts`): `executeTriggers(instance, trigger, dispatch, getState)` resolves the definition, filters `resolveEffectSpecs` by effective trigger, and runs implementations with condition gating. `cardUtils` shrank to the two random-card factories.

Phase 5 work absorbed early (dead code deleted as consumers vanished): `createPlayingCard.ts`, the effects `legacyAdapter.ts`, all legacy `CardEffect`/`PlayingCard`/`CardDefinitions` types (`card.ts` is now enums only), the unused `getIceStrength` selector, `getCardById`, and the `CardSubtype` enum.

Verified: tsc, lint, build, and a CDP-driven multi-turn browser session — corp installed 3 ice over 4 turns with correct live strength math (Biometric 5+1=6 from Bad Moon's aura, Bad Moon 4 excluding itself, Wall of Static 5+1=6), subroutine markers rendered, zero console errors.

### Phase 5 — Cleanup ✅ DONE

Most of it was absorbed into Phases 2–4 (legacy types, `KEYWORD_EFFECTS`, the adapter, both card factories, and `DRAW_CARDS_1`-style ids were deleted as their consumers vanished). The remainder:

1. ✅ Enums moved to `src/cards/enums.ts`, `CardId` registry to `src/cards/ids.ts`; `src/cardDefinitions/` deleted.
2. ✅ `CLAUDE.md` updated: new Card System section, "How to Add a Card" guide, project structure, trigger execution pattern, stale known-issues cleared.
3. ✅ `pnpm tsc && pnpm lint && pnpm build` zero-warning check + browser smoke test.

**The migration is complete.** All five phases landed; the target architecture in §2 is now the actual architecture.

---

## 4. What "adding a card" looks like when done

**Typical card (zero code):** add a `CardId` entry, add one object literal to a definitions file, add it to a deck. Compile-time checked, text auto-generated.

**Card with a new number on an existing effect:** same — `{ effect: "draw", params: { amount: 2 } }` just works.

**Card with a new keyword:** one entry in the keyword registry (data + maybe one engine flag check), then list it on cards.

**Card with a truly novel mechanic:** one `EffectParamsMap` entry + one implementation in `unique.ts` (or promote to a primitive if reusable), then reference it from data. The code lives in the engine, never in the card file.

---

## 5. Risks & notes

- **Phase 4 is the widest diff** — it touches most UI components and all phase thunks. Mitigation: land phases 1–3 first (small, verifiable), and split phase 4 by state slice.
- **No test suite exists.** The compiler is the main safety net (a good one here — the definition types make illegal states unrepresentable). Worth adding a few vitest specs for `resolveEffects`, `renderCardText`, and `getIceStrength` in Phase 1–2 since the engine is now UI-free and trivially testable.
- **Effect ordering:** merged keyword + printed effects execute in array order (keywords first). Fine today; revisit if ordering ever matters.
- **`Record<string, unknown>` never appears in card files** — the `EffectSpec` distributive union keeps params fully typed per effect id.
