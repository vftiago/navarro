Analysis of PERFORMANCE_OPTIMIZATION.md

HIGH IMPACT (H1-H5)

H1. queueMicrotask in PhaseManager ✅ Makes sense

- Valid technique for yielding to browser
- However, queueMicrotask runs before the next paint, not after. You'd want requestAnimationFrame or setTimeout(0) to actually let the
  browser paint first.
- Verdict: Correct idea, wrong API. Use requestAnimationFrame instead.

H2. Remove layout prop ⚠️ Your concern is valid

- The layout prop on both <motion.ol> and <motion.li> is what animates cards smoothly repositioning when a card is removed from the
  hand.
- Removing it would cause cards to "jump" instantly to their new positions instead of sliding.
- The document claims "we're already manually calculating positions" but that's for rotation/top offset, not for the horizontal
  repositioning when hand size changes.
- Verdict: Removing layout will break the smooth card reflow animation. This is a lateral downgrade, not an optimization.

H3. Memoize rotation/top calculations ✅ Makes sense

- These are pure functions of playerHand.length
- Currently recalculated every render
- Verdict: Low-effort, safe win.

H4. React.memo for Card components ⚠️ Partially correct

- The document notes the requirement: "Card objects must be referentially stable"
- Current architecture creates new card objects on every state change (spread operators in reducers)
- Without stable references, React.memo will actually add overhead (comparison cost + re-render anyway)
- Verdict: Only useful after fixing reference stability (M1/Immer). Premature without that.

H5. Custom equality for array selectors ✅ Makes sense

- Correct approach for Zustand
- The example comparing by deckContextId is sound
- Verdict: Solid improvement, moderate effort.

---

MEDIUM IMPACT (M1-M5)

M1. Immer for reducers ✅ Makes sense

- Correct analysis: current reducers return { ...state } creating new references for unchanged properties
- Immer's structural sharing would help
- Verdict: Valid, but adds dependency and refactor cost.

M2. Split GameStore ⚠️ Overkill

- Document correctly notes: "Need to coordinate updates across stores"
- Playing a card touches turn, player, and pending state simultaneously
- Multi-store coordination is complex and error-prone
- Verdict: The cure is worse than the disease. Zustand selectors with proper equality functions (H5) achieve similar benefits without
  the complexity.

M3. Move phase logic to reducers ❌ Mistake

- This is the opposite direction from the PENDING_STATE_DEPRECATION plan
- Creates massive monolithic reducers
- Loses the clean separation of concerns
- The document even says: "Loses modularity, enormous reducers, hard to maintain"
- Verdict: Architecturally wrong. Don't do this.

M4. Virtual scrolling ⚠️ Not applicable

- Hand size is typically 5-10 cards
- Virtual scrolling has setup overhead
- Verdict: Irrelevant for this use case. Maybe useful for deck/discard modals if they show 50+ cards.

M5. Web Workers ❌ Overkill

- Ice strength calculation is trivial arithmetic
- Serialization overhead would dwarf any gains
- Verdict: Wrong tool for the problem.

---

LOW IMPACT (L1-L3)

L1. Cache getState() ⚠️ Misleading

- getGameState() doesn't "create a new object" - it returns a reference to the current store state
- Multiple calls are fine, they're just property access
- The reducers create new objects, not the getter
- Verdict: Incorrect diagnosis. Harmless micro-optimization at best.

L2. Lazy load Framer Motion ✅ Correct but irrelevant

- Document correctly notes: "Doesn't help runtime performance"
- Verdict: Off-topic for this performance issue.

L3. Debounce state updates ❌ Counterproductive

- Would make the game feel sluggish
- The problem isn't update frequency, it's work per update
- Verdict: Wrong approach.

---

AGGRESSIVE (A1-A6)

A1. Remove setTimeout delay ⚠️ Tradeoff

- Would cause state update to race with animation
- Card might disappear from hand before animation completes
- Could look broken
- Verdict: Depends on desired UX. Worth testing but risky.

A2-A6 ❌ Destructive

- All of these compromise game functionality for performance
- Verdict: Nuclear options, not real solutions.

---

EXPERIMENTAL (E1-E4)

E1. React Compiler ✅ Worth investigating

- React 19 is already in use
- Low risk to try
- Verdict: Good suggestion.

E2. Jotai/Recoil ❌ Massive overkill

- Complete rewrite for uncertain gains
- Verdict: Not justified.

E3. Canvas rendering ❌ Nuclear

- Loses all React benefits
- Verdict: Not a real option.

E4. useTransition ✅ Makes sense

- Built for exactly this use case
- Low effort to try
- Verdict: Should be higher priority than listed.

---

Key Mistakes in the Document

1. H2 (layout prop): Would break smooth card reflow - this is not redundant, it's essential
2. L1 (getState caching): Misunderstands how Zustand works
3. M3 (reducer consolidation): Contradicts the clean architecture direction
4. queueMicrotask vs requestAnimationFrame: Wrong API for the goal

---

Ranked Solutions by Actual Impact

| Rank | Solution                          | Effort | Risk   | Notes                           |
| ---- | --------------------------------- | ------ | ------ | ------------------------------- |
| 1    | H3 Memoize calculations           | 1      | None   | Pure win                        |
| 2    | H5 Custom selector equality       | 2      | Low    | Prevents unnecessary re-renders |
| 3    | E4 useTransition                  | 2      | Low    | Built for this, try it          |
| 4    | H1 (with RAF, not queueMicrotask) | 1      | Low    | Yield to browser correctly      |
| 5    | E1 React Compiler                 | 2      | Medium | Experimental but promising      |
| 6    | M1 Immer                          | 3      | Medium | Enables H4                      |
| 7    | H4 React.memo                     | 2      | Low    | Only after M1                   |
| 8    | A1 Remove setTimeout              | 1      | Medium | Test UX impact first            |

Skip entirely: H2, L1, L3, M2, M3, M4, M5, A2-A6, E2, E3
