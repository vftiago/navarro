# Performance Notes

> Supersedes `PERFORMANCE_OPTIMIZATION.md` and `PERFORMANCE_OPTIMIZATION_REIVEW.md`
> (deleted 2026-08-17). Those documented a "sub-second freeze when playing a
> card" plus 24 candidate fixes and a critical review of them. None were ever
> implemented, and the landscape has since changed twice.

## Status: symptom unverified — profile before optimizing

Two later changes likely reduced or eliminated the original freeze:

1. **The Upkeep-phase fix** (2025-12-06): the perceived stutter was largely a
   *bug* — `ON_TURN_START` effects re-fired on every return to Main phase,
   causing unexpected state changes that read as jank. Once-per-turn effects
   now run in a dedicated Upkeep phase.
2. **The card registry refactor** (2026-08-17): game state now stores tiny
   `{ instanceId, definitionId }` instances instead of full card objects with
   closures — reducer spreads and GC pressure shrank substantially.

No profiling has been done since either change. Before implementing anything
below, reproduce a measurable problem: React DevTools Profiler ("highlight
updates") while playing a card, plus a Chrome Performance recording of the
click → visual-update window.

## If profiling shows work is needed — surviving ranked list

Updated for the instance architecture; items whose premises died are gone.

| # | Change | Effort | Notes |
| - | ------ | ------ | ----- |
| 1 | Cache `getCardTextLines(definition)` per definition id | Low | **New since the refactor**: it rebuilds the same strings on every card render, but is a pure function of a static definition — memoize in a `Map<CardId, CardTextLine[]>`. |
| 2 | `useMemo` the hand's `calculateCardRotations` / `calculateCardTopValues` | Low | Pure functions of `playerHand.length`, currently recomputed every render (`PlayerHand.tsx`). |
| 3 | `React.memo` on `CardFront` (and children) | Low | **Now viable immediately**: instances are stable references moved between arrays, definitions are module constants. (The old blocker — "needs Immer first for referential stability" — is obsolete.) |
| 4 | Custom equality for array selectors (compare by `instanceId`) | Med | Prevents re-renders when array contents are unchanged but references differ. |
| 5 | `useTransition` around phase execution | Low | Built for deprioritizing non-urgent updates; cheap to try. |
| 6 | Defer phase handler execution with `requestAnimationFrame` | Low | Lets the browser paint between the card animation and the synchronous phase chain. (RAF, not `queueMicrotask` — microtasks run before paint.) |
| 7 | Narrow `CardFrontIce`'s subscription | Med | It subscribes to the entire `boardState` and recomputes strength imperatively via `getGameState()`; a selector on the relevant permanent effects would be cleaner and cheaper. |
| 8 | Immer for reducers | Med | Structural sharing for unchanged state branches. Less valuable now that card arrays hold tiny instances; do only if profiling still shows reducer/GC cost. |
| 9 | React Compiler | Med | Auto-memoization; React 19 already in use. Experimental. |

**Rejected — do not revisit** (per the original critical review, still correct):
removing the Framer Motion `layout` prop (it powers the hand's reflow
animation), splitting the Zustand store, moving phase logic into monolithic
reducers, web workers, virtual scrolling for a 5–10 card hand, debouncing
state updates, canvas rendering, switching state libraries, and every option
that traded game features for speed (disabling effects/animations, capping
hand size, pre-rendered card images).

**UX-dependent, decide separately**: the 200ms exit-animation `setTimeout` in
`PlayerHand.tsx` delays the state update by design; removing it makes play
feel instant but lets the card vanish mid-animation.
