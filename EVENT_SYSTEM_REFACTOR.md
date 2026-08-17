# Event System — Historical Note & Follow-ups

> **Status**: Historical. The original plan in this document was implemented on
> 2025-12-06 and then partially superseded the same week by the subphase
> elimination refactor. This file now records only what survived, what
> replaced the rest, and what remains open. The **current** event system
> architecture is documented in `CLAUDE.md` ("Event System" section).

## What survived (and is the current architecture)

- **Event bus** (`src/state/events/eventBus.ts`): emit / subscribe /
  `getHistory()`, dev-mode logging. UI components emit `GameEvent`s and never
  import phase thunks.
- **Event handler** (`src/state/events/eventHandler.ts`): centralized
  validation of all user actions.
- Event types (unified 2026-08-17): `CARD_CLICKED { instanceId }` — a click
  carries no intent, the handler resolves play/ice-click/access-select from
  the card's zone and the phase/run state — plus the two button intents,
  `PLAYER_INITIATE_RUN` and `PLAYER_END_TURN`. The original five card-specific
  events (and the never-implemented `CARD_ACTIVATE_ABILITY`) encoded state the
  handler re-derived for validation anyway; unifying them deleted that
  duplication. Add a specific event only when one click could mean two things.

## What was superseded

The plan's central mechanism — store user input in a `src/state/pending/`
module, transition phase, and let PhaseManager run parameterless
Start → Process → End subphase handlers that read pending state — was
implemented and then removed along with the entire subphase system. The
handler now **invokes user-driven phase thunks directly with the payload**
(e.g. `playPhase({ cardId, handIndex })`); PhaseManager orchestrates only the
automatic phases (Corp, Draw, Upkeep, Main, End).

The plan's goal #1, "uniform phase progression for all phases", was
deliberately abandoned: the split between automatic phases (PhaseManager) and
user-driven phases (direct invocation) is the intended design, not a gap.

## Open follow-ups

1. **Design the icebreaker interaction** — Sledgehammer ("Break barrier
   subroutine.") has no mechanics: the speculative `CARD_ACTIVATE_ABILITY` /
   `ON_CLICK` / `EffectCost` machinery was deleted (2026-08-17) rather than
   implemented. When the encounter interaction is designed, it should arrive
   as a targeted event (e.g. `PLAYER_BREAK_SUBROUTINE { programId, iceId }`)
   validated against `runProgressState`, with breaker capability as program
   data (e.g. `breaks: IceSubtype.BARRIER`).
2. **Add the import-boundary lint rule** — UI components must not import
   phase thunks; today this survives by convention only.
3. **Seed the RNG if event replay ever matters** — deck shuffle, corp ice
   picks, accessed-card generation, and net-damage discards all use unseeded
   `Math.random`, so replaying `eventBus.getHistory()` cannot reproduce a
   game. (Snapshot-based save/undo is the nearer path now that game state is
   fully serializable after the card registry refactor.)
4. **Write the first tests** — the decoupling was done for testability, but
   no test suite exists yet. Game logic can be driven headlessly via the
   store + event handler without rendering UI.
