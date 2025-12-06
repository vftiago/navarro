# Performance Optimization Analysis

## Current Issue
Sub-second freeze when playing a card, occurring between the card exit animation completing (200ms) and the game state updating visually.

## Timeline Analysis

### Current Flow (with batching)
```
0ms     User clicks card
0-200ms Exit animation plays (SMOOTH ✅)
200ms   setTimeout callback fires
        → eventBus.emit()
        → Event handler validation
        → batchDispatch([setPendingAction, setTurnCurrentPhase(Play)])
        → Zustand update #1
        → React re-render #1 (ALL components subscribed to store)
        → PhaseManager useEffect fires
        → dispatchThunk(playPhase())
        → playPhase() executes:
           - batchDispatch([modifyClicks, removeCard, addToPlayed, clearPending])
           - Zustand update #2
           - React re-render #2 (ALL components)
           - getPlayerPlayedCards(getState()) - NEW STATE READ
           - ON_PLAY effects (may dispatch more)
           - executeCardTriggers (may dispatch more)
           - batchDispatch([addToPrograms, clearPlayedCards])
           - Zustand update #3
           - React re-render #3 (ALL components)
           - batchDispatch or dispatch phase transition
           - Zustand update #4
           - React re-render #4 (ALL components)
           - PhaseManager useEffect fires AGAIN
           - dispatchThunk(mainPhase())
           - mainPhase() executes (empty, but still function call overhead)
???ms   Visual update finally appears
```

**FREEZE DURATION**: Likely 200-500ms of synchronous JavaScript execution + re-renders

## Critical Performance Issues

### 🔴 CRITICAL #1: Global Re-Render Storm
**Location**: ALL components using `useGameStore`
**Problem**: Every Zustand update triggers re-render of EVERY subscribed component, even if their selected data hasn't changed.

**Evidence**:
- App.tsx subscribes to `dispatch`, `playerAccessedCards`, `runProgressState`, `turnCurrentPhase`
- PhaseManager subscribes to `phaseCounter`, `turnCurrentPhase`
- PlayerDashboard subscribes to 8 different values
- PlayerHand subscribes to `playerHand`, `turnCurrentPhase`
- IceRow subscribes to 3 values
- StatusRow subscribes to 3 values
- ProgramRow subscribes to 2 values
- Modals subscribes to 4 arrays
- CardFrontIce subscribes to entire `boardState`

**Even with `useShallow`**, Zustand still:
1. Calls ALL selector functions on EVERY update
2. Compares results with `Object.is` (shallow equality)
3. Re-renders if ANY array/object reference changed

**Playing a card changes**:
- `turnState.turnCurrentPhase` (2 times: Main→Play→Main)
- `turnState.phaseCounter` (3+ times)
- `turnState.turnRemainingClicks` (once)
- `playerState.playerHand` (array, new reference)
- `playerState.playerPlayedCards` (array, new reference multiple times)
- `playerState.playerInstalledPrograms` (possibly, new reference)
- `pendingState` (2 times)

**Result**: 7-10+ components re-render 3-4 times each = **21-40 React render cycles**

### 🔴 CRITICAL #2: Framer Motion Layout Recalculation
**Location**: `PlayerHand.tsx`
**Problem**: `motion.li` with `layout` prop triggers expensive layout calculations on EVERY re-render

**Evidence**:
```tsx
<motion.li
  layout  // ← EXPENSIVE: Re-measures DOM on every render
  style={{
    rotate: isExiting ? 0 : rotationValues[index],
    scale: isExiting ? 1.1 : 1,
    top: isExiting ? topValues[index] - 40 : topValues[index],
  }}
  variants={itemVariants}
  whileHover={{ rotate: 0, scale: 1.1, top: -40, zIndex: 1 }}
/>
```

**Cost**:
- Layout recalculation for each card (5-10 cards in hand)
- Re-calculation of rotationValues and topValues (even though they haven't changed)
- Framer Motion's internal diffing and animation system

**Multiplied by**: 3-4 re-renders = 12-16 layout recalculations

### 🔴 CRITICAL #3: Synchronous Phase Execution Chain
**Location**: PhaseManager + playPhase
**Problem**: Entire phase logic executes synchronously, blocking the main thread

**Evidence**:
```typescript
// This ALL runs synchronously in one tick:
eventBus.emit()
  → eventHandler validation
  → batchDispatch (reducer runs N times synchronously)
  → setState (triggers re-renders)
  → PhaseManager useEffect
  → playPhase()
    → batchDispatch (reducer runs 4 times synchronously)
    → setState
    → getPlayerPlayedCards (state read)
    → forEach with effect execution
    → batchDispatch (reducer runs N times)
    → setState
    → batchDispatch or dispatch
    → setState
  → PhaseManager useEffect AGAIN
  → mainPhase()
```

**No yielding to browser** = janky freeze

### 🔴 CRITICAL #4: Multiple State Reads Inside playPhase
**Location**: `playPhase.ts` lines 63, 111, 121
**Problem**: Calling `getState()` multiple times during phase execution

**Evidence**:
```typescript
const playerPlayedCards = getPlayerPlayedCards(getState()); // Read #1
// ... effects execution ...
const turnNextPhase = getTurnNextPhase(getState());          // Read #2
const turnRemainingClicks = getTurnRemainingClicks(getState()); // Read #3
```

**Cost**: Each `getGameState()` creates a new object with 6 properties, triggering GC

### 🔴 CRITICAL #5: Array Operations Creating New References
**Location**: ALL player state reducers
**Problem**: Every card operation creates new array references

**Evidence**:
```typescript
// In removeCardFromHand:
playerHand: state.playerHand.filter((_, i) => i !== handIndex) // New array

// In addCardToPlayed:
playerPlayedCards: [...state.playerPlayedCards, card] // New array

// In addToPrograms:
playerInstalledPrograms: [...state.playerInstalledPrograms, card] // New array
```

**Result**: Every mutation creates new arrays, triggering re-renders in ALL components that subscribe to those arrays

## Potential Optimizations

---

## 🟢 HIGH IMPACT - Quick Wins

### H1. Defer Phase Execution with `queueMicrotask`
**Impact**: ⭐⭐⭐⭐⭐ (Eliminates perceived freeze)
**Effort**: ⭐ (5 minutes)
**Location**: `PhaseManager.tsx` line 59

**Change**:
```typescript
// Before:
const action = PHASE_HANDLERS[turnCurrentPhase];
if (action) {
  const cleanup = action();
  if (typeof cleanup === "function") return cleanup;
}

// After:
const action = PHASE_HANDLERS[turnCurrentPhase];
if (action) {
  queueMicrotask(() => {
    const cleanup = action();
    if (typeof cleanup === "function") return cleanup;
  });
}
```

**Why**: Allows browser to paint between animation completion and phase execution. User sees smooth animation, then state updates.

**Tradeoff**: Introduces ~1-4ms delay, but makes it feel instant because browser paints in between.

---

### H2. Remove `layout` Prop from PlayerHand Cards
**Impact**: ⭐⭐⭐⭐⭐ (Eliminates most expensive DOM work)
**Effort**: ⭐⭐ (Need to manually animate position changes)
**Location**: `PlayerHand.tsx` line 176

**Change**:
```tsx
// Remove layout prop, manually handle position with useEffect
<motion.li
  // layout ← REMOVE THIS
  style={{
    rotate: rotationValues[index],
    top: topValues[index],
  }}
/>
```

**Why**: Framer Motion's `layout` prop triggers expensive FLIP calculations. We're already manually calculating positions via `rotationValues` and `topValues`, so `layout` is redundant.

**Tradeoff**: Need to manually animate when cards are removed (but we already do this with exit animation).

---

### H3. Memoize PlayerHand Rotation/Top Calculations
**Impact**: ⭐⭐⭐⭐ (Prevents recalculation on every re-render)
**Effort**: ⭐ (Add useMemo)
**Location**: `PlayerHand.tsx` lines 89-90

**Change**:
```typescript
// Before:
const rotationValues = calculateCardRotations(playerHand.length);
const topValues = calculateCardTopValues(playerHand.length);

// After:
const rotationValues = useMemo(
  () => calculateCardRotations(playerHand.length),
  [playerHand.length]
);
const topValues = useMemo(
  () => calculateCardTopValues(playerHand.length),
  [playerHand.length]
);
```

**Why**: These calculations run on every render, even when hand size hasn't changed.

---

### H4. Use React.memo for Card Components
**Impact**: ⭐⭐⭐⭐ (Prevents unnecessary card re-renders)
**Effort**: ⭐⭐ (Wrap components, ensure props are stable)
**Location**: `CardFront.tsx`, `CardFrontLayout.tsx`, `CardFrontIce.tsx`, etc.

**Change**:
```typescript
export const CardFront = React.memo(({ card }: { card: PlayingCard }) => {
  // ...
});
```

**Why**: Cards re-render even when their props haven't changed, due to parent re-renders.

**Requirement**: Card objects must be referentially stable (current issue: cards are recreated on every state change).

---

### H5. Optimize Zustand Selectors with Equality Functions
**Impact**: ⭐⭐⭐⭐ (Prevents re-renders when array contents haven't changed)
**Effort**: ⭐⭐ (Custom equality for arrays)
**Location**: All components selecting arrays

**Change**:
```typescript
// Before:
const { playerHand } = useGameStore(
  useShallow((state) => ({ playerHand: state.playerState.playerHand }))
);

// After:
const playerHand = useGameStore(
  (state) => state.playerState.playerHand,
  (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((card, i) => card.deckContextId === b[i]?.deckContextId);
  }
);
```

**Why**: Array references change even when contents are identical, triggering re-renders.

**Tradeoff**: Custom equality check has cost, but cheaper than re-rendering entire component tree.

---

## 🟡 MEDIUM IMPACT - Architectural Changes

### M1. Use Immer for Immutable Updates
**Impact**: ⭐⭐⭐⭐ (Prevents unnecessary array reference changes)
**Effort**: ⭐⭐⭐⭐ (Refactor all reducers)
**Location**: All state reducers

**Change**:
```typescript
import { produce } from 'immer';

export const playerReducer = produce((draft: PlayerState, action: PlayerAction) => {
  switch (action.type) {
    case PlayerActionTypes.REMOVE_CARD_FROM_HAND:
      draft.playerHand.splice(action.payload, 1); // Mutate draft directly
      break;
  }
});
```

**Why**: Immer only creates new references for objects that actually changed. If we remove card at index 0, only `playerHand` gets new reference, not `playerInstalledPrograms`, `playerDeck`, etc.

**Current problem**: Our reducers return `{ ...state }` which creates new references for EVERYTHING.

---

### M2. Selector Granularity - Split GameStore
**Impact**: ⭐⭐⭐⭐ (Prevents unrelated re-renders)
**Effort**: ⭐⭐⭐⭐⭐ (Major refactor)
**Location**: `store.ts`

**Change**: Create separate stores for different state domains:
```typescript
const usePlayerStore = create(() => ({ ...initialPlayerState }));
const useServerStore = create(() => ({ ...initialServerState }));
const useTurnStore = create(() => ({ ...initialTurnState }));
```

**Why**: Components only re-render when their specific store updates. Playing a card doesn't trigger IceRow re-render.

**Tradeoff**: Need to coordinate updates across stores, more complex architecture.

---

### M3. Move Phase Logic to Reducers (Redux-Saga Pattern)
**Impact**: ⭐⭐⭐⭐⭐ (Single state update per phase)
**Effort**: ⭐⭐⭐⭐⭐ (Massive refactor)
**Location**: All phase files

**Change**: Instead of thunks that dispatch multiple actions, create compound actions:
```typescript
// Before: 4 dispatches
dispatch(modifyClicks(-1));
dispatch(removeCardFromHand(index));
dispatch(addCardToPlayed(card));
dispatch(clearPendingAction());

// After: 1 dispatch with all data
dispatch({
  type: 'EXECUTE_PLAY_PHASE',
  payload: { card, handIndex }
});

// Reducer handles ALL logic:
case 'EXECUTE_PLAY_PHASE':
  return {
    ...state,
    turnState: { ...state.turnState, turnRemainingClicks: state.turnState.turnRemainingClicks - 1 },
    playerState: {
      ...state.playerState,
      playerHand: state.playerState.playerHand.filter((_, i) => i !== payload.handIndex),
      playerPlayedCards: [...state.playerState.playerPlayedCards, payload.card],
    },
    pendingState: { pendingAction: null },
  };
```

**Why**: True atomic updates, single Zustand update, single re-render.

**Tradeoff**: Loses modularity, enormous reducers, hard to maintain.

---

### M4. Virtual Scrolling for Card Lists
**Impact**: ⭐⭐⭐ (Only for large hands/decks)
**Effort**: ⭐⭐⭐
**Location**: `PlayerHand.tsx`, modal card lists

**Change**: Use react-window or react-virtual to only render visible cards.

**Why**: Don't need to render/animate 50 cards if user can only see 10.

**Tradeoff**: Only matters for large collections.

---

### M5. Web Workers for Card Effect Calculation
**Impact**: ⭐⭐⭐ (Offload calculation from main thread)
**Effort**: ⭐⭐⭐⭐⭐
**Location**: Ice strength calculations, effect resolution

**Change**: Move `calculateIceStrength` and complex effect logic to web worker.

**Why**: Frees up main thread for rendering.

**Tradeoff**: Async overhead, serialization cost, architecture complexity.

---

## 🔵 LOW IMPACT - Micro-optimizations

### L1. Cache getGameState() Result
**Impact**: ⭐⭐ (Reduces object creation)
**Effort**: ⭐
**Location**: `playPhase.ts` and other thunks

**Change**:
```typescript
const state = getState();
const playerPlayedCards = state.playerState.playerPlayedCards;
const turnNextPhase = state.turnState.turnNextPhase;
const turnRemainingClicks = state.turnState.turnRemainingClicks;
```

**Why**: Avoid multiple `getGameState()` calls creating new objects.

---

### L2. Lazy Load Framer Motion
**Impact**: ⭐ (Faster initial load, doesn't fix runtime)
**Effort**: ⭐⭐
**Location**: All components using motion

**Change**: Use `lazy` and `Suspense` for motion components.

**Why**: Reduces initial bundle size.

**Tradeoff**: Doesn't help runtime performance.

---

### L3. Debounce State Updates
**Impact**: ⭐⭐ (Reduces update frequency)
**Effort**: ⭐⭐
**Location**: Event handler

**Change**: Use `requestAnimationFrame` to batch updates.

**Why**: Coalesces rapid updates into single frame.

**Tradeoff**: Adds delay, may feel laggy.

---

## 🔴 AGGRESSIVE - Game Logic Changes

### A1. Remove Exit Animation Delay
**Impact**: ⭐⭐⭐⭐⭐ (Eliminates perceived freeze entirely)
**Effort**: ⭐
**Location**: `PlayerHand.tsx` line 118

**Change**:
```typescript
// Before:
setTimeout(() => {
  eventBus.emit({ type: GameEventType.PLAYER_PLAY_CARD, ... });
}, EXIT_ANIMATION_DURATION); // 200ms

// After:
eventBus.emit({ type: GameEventType.PLAYER_PLAY_CARD, ... });
// Let animation and state update happen in parallel
```

**Why**: User doesn't wait for animation to complete before state updates. Card fades out WHILE effects are processing.

**Tradeoff**: Visual disconnect - card might disappear before reaching "played" position. Less polished feel.

---

### A2. Instant Card Play (No Animation)
**Impact**: ⭐⭐⭐⭐⭐ (Zero freeze, instant feedback)
**Effort**: ⭐
**Location**: `PlayerHand.tsx`

**Change**: Remove all exit animations, instant state update.

**Why**: Eliminates ALL animation overhead.

**Tradeoff**: Game feels mechanical, loses polish and game feel.

---

### A3. Disable ON_PLAY Effects
**Impact**: ⭐⭐⭐ (Reduces phase execution time)
**Effort**: ⭐
**Location**: `playPhase.ts` lines 62-73

**Change**: Comment out ON_PLAY effect execution.

**Why**: Simplifies phase logic, fewer dispatches.

**Tradeoff**: Breaks game features (cards like "Run" won't work).

---

### A4. Remove Trigger System Entirely
**Impact**: ⭐⭐⭐⭐ (Massively simplifies state updates)
**Effort**: ⭐⭐⭐⭐⭐ (Breaks entire game)
**Location**: All phase handlers

**Change**: Remove all `executeCardTriggers` and `executeCardEffects` calls.

**Why**: No dynamic effect resolution, predictable state updates.

**Tradeoff**: Game becomes static, no card abilities.

---

### A5. Limit Hand Size to 5 Cards
**Impact**: ⭐⭐⭐ (Fewer components to render)
**Effort**: ⭐
**Location**: Game rules

**Change**: Auto-discard excess cards, cap at 5.

**Why**: Fewer cards = fewer DOM nodes = faster renders.

**Tradeoff**: Changes game balance.

---

### A6. Pre-render Cards as Images
**Impact**: ⭐⭐⭐⭐ (Eliminates card component re-renders)
**Effort**: ⭐⭐⭐⭐
**Location**: Card rendering system

**Change**: Render each unique card to canvas/image once, reuse image everywhere.

**Why**: Static images are cheap to render, no component logic.

**Tradeoff**: Loses interactivity (hover effects, dynamic strength calculations).

---

## 🧪 EXPERIMENTAL - Research Needed

### E1. Use React 19 Compiler
**Impact**: ⭐⭐⭐⭐? (Automatic memoization)
**Effort**: ⭐⭐
**Location**: Build config

**Change**: Enable React Compiler (experimental).

**Why**: Auto-memoizes components and values.

**Tradeoff**: Experimental, may have bugs.

---

### E2. Switch to Jotai/Recoil (Atomic State)
**Impact**: ⭐⭐⭐⭐⭐? (Fine-grained reactivity)
**Effort**: ⭐⭐⭐⭐⭐ (Complete state refactor)
**Location**: Entire state management

**Change**: Replace Zustand with atomic state library.

**Why**: Components only re-render when specific atoms change.

**Tradeoff**: Massive migration, different mental model.

---

### E3. Canvas Rendering Instead of DOM
**Impact**: ⭐⭐⭐⭐⭐? (Bypass React entirely)
**Effort**: ⭐⭐⭐⭐⭐ (Rewrite entire UI)
**Location**: Entire UI layer

**Change**: Render game to canvas with PixiJS or custom renderer.

**Why**: No DOM overhead, no React overhead, full control.

**Tradeoff**: Loses accessibility, SEO, browser features. Massive undertaking.

---

### E4. Concurrent Rendering with useTransition
**Impact**: ⭐⭐⭐? (Deprioritizes non-urgent updates)
**Effort**: ⭐⭐
**Location**: Event handler, phase execution

**Change**: Wrap state updates in `startTransition`.

**Why**: Allows browser to prioritize user interactions.

**Tradeoff**: May introduce perceived lag.

---

## 🎯 Recommended Implementation Order

### Phase 1: Immediate Wins (< 1 hour)
1. **H1**: queueMicrotask in PhaseManager
2. **H3**: Memoize rotation/top calculations
3. **L1**: Cache getState() in playPhase
4. **A1**: Remove setTimeout delay (if acceptable)

**Expected Impact**: 50-80% reduction in perceived freeze

---

### Phase 2: Component Optimization (1-2 hours)
1. **H2**: Remove layout prop from PlayerHand
2. **H4**: React.memo for card components
3. **H5**: Custom equality for array selectors

**Expected Impact**: Additional 30-50% improvement

---

### Phase 3: Architectural (1-2 days)
1. **M1**: Implement Immer for reducers
2. **M2**: Split into multiple stores (if still needed)

**Expected Impact**: Eliminates remaining micro-stutters

---

### Phase 4: Research (if still not satisfied)
1. **E1**: Try React 19 compiler
2. **E4**: Experiment with useTransition
3. **E2**: Prototype with Jotai (new branch)

---

## 🔬 Profiling Recommendations

Before implementing changes, profile with:

1. **React DevTools Profiler**
   - Record playing a card
   - Identify which components re-render and why
   - Check "Highlight updates when components render"

2. **Chrome Performance Tab**
   - Record with "Screenshots" enabled
   - Find the exact frame where freeze occurs
   - Check "Bottom-Up" view for expensive functions

3. **Zustand DevTools**
   - Log every state update
   - Count number of updates per card play
   - Identify which state changes trigger most re-renders

4. **Console Timings**
   - Add `console.time()` / `console.timeEnd()` in:
     - Event handler
     - playPhase start/end
     - Each batchDispatch call
   - Measure exact timing of freeze

---

## 🎮 Nuclear Option: Simplified Game Mode

If performance remains unsatisfactory:

**Create "Performance Mode" setting**:
- Disable all animations
- Disable trigger effects
- Instant card play
- Static card images
- No hover effects

**Why**: Gives users choice between polish and performance.

**Implementation**: ⭐⭐ (2-3 hours)

---

## Summary

**Most Likely Culprits**:
1. 🔴 **Framer Motion layout prop** causing expensive recalculations
2. 🔴 **Global re-render storm** from Zustand updates
3. 🔴 **Synchronous phase execution** blocking main thread
4. 🔴 **setTimeout delay** making freeze more noticeable

**Highest ROI**:
- **H1** (queueMicrotask): 5 min, huge perceived improvement
- **H2** (remove layout): 15 min, eliminates most expensive work
- **A1** (remove setTimeout): 2 min, makes everything feel instant

**Start with these 3 changes and measure results before going deeper.**
