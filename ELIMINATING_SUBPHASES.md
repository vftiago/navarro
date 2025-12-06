# Eliminating Subphases - Migration Plan

**Status**: 🚧 PLANNING
**Date**: 2025-12-06
**Rationale**: Subphases add unnecessary complexity and performance overhead for most game phases. The original intent (organizing trigger moments) can be achieved more simply by executing triggers at the appropriate points within single-handler phase functions.

---

## Executive Summary

### Current Problems
- **Performance**: Each subphase transition = 1 React re-render (9+ transitions for a single run)
- **Complexity**: 24 potential handler slots (8 phases × 3 subphases), most unused or empty
- **Confusion**: Inconsistent patterns - some phases use all 3 subphases, others skip some
- **Cognitive Overhead**: Developers must track which subphase does what across multiple files

### Solution
- **Eliminate `TurnSubPhase` enum entirely** for simple phases (Corp, Draw, End, Main, Play)
- **Restructure Run phase** as an orchestrator that encompasses Encounter/Access as internal states
- **Reduce transitions**: 9+ subphase transitions per run → 3-4 phase transitions
- **Simplify PhaseManager**: 8 phases × 3 subphases = 24 handlers → ~8 single handlers + Run orchestrator

---

## Migration Phases

### Phase 1: Eliminate Simple Phase Subphases ✅ RECOMMENDED START

**Target Phases**: Corp, Draw, End, Main, Play

**Changes**:
1. Consolidate all Start/Process/End logic into single phase handler
2. Execute trigger moments at appropriate points within handler
3. Update PhaseManager to call single handler per phase
4. Remove `setTurnCurrentSubPhase()` calls from these phase handlers
5. Update phase counter mechanism

**Example - Draw Phase**:

**Before** (3 handlers):
```typescript
// startDrawPhase: reset clicks, draw cards
// processDrawPhase: trigger ON_DRAW effects
// endDrawPhase: transition to Main or End based on clicks
```

**After** (1 handler):
```typescript
export const drawPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    // Reset clicks
    dispatch(modifyClicks(playerClicksPerTurn));

    // Draw cards
    for (let i = 0; i < playerCardsPerTurn; i++) {
      dispatch(drawCards(1));
    }

    // Trigger ON_DRAW effects on all cards in hand
    const hand = getState().playerState.playerHand;
    hand.forEach((card) => {
      const drawEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_DRAW);
      executeCardEffects(drawEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    // Transition to next phase
    const remainingClicks = getState().turnState.turnRemainingClicks;
    if (remainingClicks > 0) {
      dispatch(setTurnCurrentPhase(TurnPhase.Main));
    } else {
      dispatch(setTurnCurrentPhase(TurnPhase.End));
    }
  };
};
```

**Benefits**:
- All Draw phase logic in one place
- Clear execution order (read top to bottom)
- No need to track which subphase does what
- 2 fewer React re-renders per Draw phase

---

### Phase 2: Restructure Run as Orchestrator ⚠️ COMPLEX

**Goal**: Make Run the parent phase that orchestrates Encounter/Access as internal progression states

**Conceptual Model**:
- A "run" is a complete flow: start run → encounter ice (0-N times) → access cards → select card → end run
- Encounter and Access are **steps within a run**, not independent phases
- ON_RUN_START fires at run start, ON_RUN_END fires at run completion (after access/fetch)

**Option A: Internal RunProgressState** (Recommended)

Add new state field to track position within run:
```typescript
enum RunProgressState {
  NOT_IN_RUN = "NOT_IN_RUN",
  ENCOUNTERING_ICE = "ENCOUNTERING_ICE",  // Waiting for PLAYER_CLICK_ICE
  ACCESSING_CARDS = "ACCESSING_CARDS",    // Waiting for PLAYER_SELECT_ACCESSED_CARD
}
```

**Turn State Changes**:
```typescript
export type TurnState = {
  phaseCounter: number;              // NEW: replaces phaseChangeCounter
  turnCurrentPhase: TurnPhase;
  turnCurrentSubPhase?: TurnSubPhase; // REMOVED
  runProgressState: RunProgressState; // NEW: tracks position within run
  turnNextPhase: TurnPhase | null;
  // ... rest unchanged
};
```

**Run Phase Handler**:
```typescript
export const runPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const progressState = state.turnState.runProgressState;

    switch (progressState) {
      case RunProgressState.NOT_IN_RUN:
        // First entry into run phase
        // Trigger ON_RUN_START
        const programs = getPlayerInstalledPrograms(state);
        programs.forEach((card) => {
          const effects = getCardEffectsByTrigger(card, TriggerMoment.ON_RUN_START);
          executeCardEffects(effects, dispatch, getState, {
            gameState: getState(),
            sourceId: card.deckContextId,
          });
        });

        // Initialize unencountered ice
        const ice = state.serverState.serverInstalledIce;
        [...ice].reverse().forEach((ice) => {
          dispatch(addToUnencounteredIce(ice));
        });

        // Determine first step
        if (getServerUnencounteredIce(getState()).length > 0) {
          // Set first ice as current
          dispatch(setCurrentEncounteredIce(getServerUnencounteredIce(getState())[0]));
          dispatch(setRunProgressState(RunProgressState.ENCOUNTERING_ICE));
        } else {
          // No ice, go straight to access
          dispatch(generateAccessedCards()); // Helper to generate 3 random cards
          dispatch(setRunProgressState(RunProgressState.ACCESSING_CARDS));
        }
        break;

      case RunProgressState.ENCOUNTERING_ICE:
        // User clicked ice, pending action is set
        const pendingAction = getPendingAction(state);
        if (!pendingAction || pendingAction.type !== "CLICK_ICE") {
          console.error("Expected CLICK_ICE pending action");
          return;
        }

        const currentIce = state.serverState.serverCurrentEncounteredIce;

        // Trigger ON_ENCOUNTER effects
        const encounterEffects = getCardEffectsByTrigger(currentIce, TriggerMoment.ON_ENCOUNTER);
        executeCardEffects(encounterEffects, dispatch, getState, {
          gameState: getState(),
          sourceId: currentIce.deckContextId,
        });

        // Remove from unencountered
        dispatch(removeFromUnencounteredIce(currentIce));
        dispatch(clearPendingAction());

        // Check for more ice
        const remainingIce = getServerUnencounteredIce(getState());
        if (remainingIce.length > 0) {
          // Set next ice as current, stay in ENCOUNTERING_ICE state
          dispatch(setCurrentEncounteredIce(remainingIce[0]));
          // State stays ENCOUNTERING_ICE, re-render to show next ice
        } else {
          // No more ice, transition to access
          dispatch(setCurrentEncounteredIce(null));
          dispatch(generateAccessedCards());
          dispatch(setRunProgressState(RunProgressState.ACCESSING_CARDS));
        }
        break;

      case RunProgressState.ACCESSING_CARDS:
        // User selected a card, pending action is set
        const accessPending = getPendingAction(state);
        if (!accessPending || accessPending.type !== "SELECT_ACCESSED_CARD") {
          console.error("Expected SELECT_ACCESSED_CARD pending action");
          return;
        }

        const selectedCard = state.playerState.playerAccessedCards.find(
          (card) => card.deckContextId === accessPending.cardId
        );

        // Trigger ON_FETCH effects
        const fetchEffects = getCardEffectsByTrigger(selectedCard, TriggerMoment.ON_FETCH);
        executeCardEffects(fetchEffects, dispatch, getState, {
          gameState: getState(),
          sourceId: selectedCard.deckContextId,
        });

        // Move card to appropriate zone
        if (selectedCard.type === CardType.AGENDA) {
          dispatch(addToScoreArea(selectedCard));
        } else {
          executeCardTriggers(selectedCard, TriggerMoment.ON_DISCARD, dispatch, getState);
          dispatch(addToDiscard(selectedCard));
        }

        // Clear accessed cards
        dispatch(clearAccessedCards());
        dispatch(clearPendingAction());

        // Trigger ON_RUN_END (run is complete!)
        const endPrograms = getPlayerInstalledPrograms(getState());
        endPrograms.forEach((card) => {
          const runEndEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_RUN_END);
          executeCardEffects(runEndEffects, dispatch, getState, {
            gameState: getState(),
            sourceId: card.deckContextId,
          });
        });

        // Reset run state
        dispatch(setRunProgressState(RunProgressState.NOT_IN_RUN));

        // Transition to Main or End based on clicks
        const clicks = getState().turnState.turnRemainingClicks;
        if (clicks > 0) {
          dispatch(setTurnCurrentPhase(TurnPhase.Main));
        } else {
          dispatch(setTurnCurrentPhase(TurnPhase.End));
        }
        break;
    }
  };
};
```

**Event Handler Changes**:
```typescript
case GameEventType.PLAYER_CLICK_ICE: {
  // Validate: Must be in Run phase with ENCOUNTERING_ICE state
  if (
    state.turnState.turnCurrentPhase !== TurnPhase.Run ||
    state.turnState.runProgressState !== RunProgressState.ENCOUNTERING_ICE
  ) {
    console.warn("Cannot click ice outside run encounter state");
    return;
  }

  // Set pending action
  dispatch(setPendingAction({ type: "CLICK_ICE", iceId: event.payload.iceId }));

  // Increment phase counter to trigger PhaseManager to re-run runPhase
  dispatch(incrementPhaseCounter());
  break;
}

case GameEventType.PLAYER_SELECT_ACCESSED_CARD: {
  // Validate: Must be in Run phase with ACCESSING_CARDS state
  if (
    state.turnState.turnCurrentPhase !== TurnPhase.Run ||
    state.turnState.runProgressState !== RunProgressState.ACCESSING_CARDS
  ) {
    console.warn("Cannot select card outside run access state");
    return;
  }

  // Set pending action
  dispatch(setPendingAction({ type: "SELECT_ACCESSED_CARD", cardId: event.payload.cardId }));

  // Increment phase counter to trigger PhaseManager to re-run runPhase
  dispatch(incrementPhaseCounter());
  break;
}
```

**UI Changes**:
```typescript
// IceRow.tsx
const isEncounterActive =
  turnCurrentPhase === TurnPhase.Run &&
  runProgressState === RunProgressState.ENCOUNTERING_ICE;

// App.tsx - show access modal
useEffect(() => {
  if (
    turnCurrentPhase === TurnPhase.Run &&
    runProgressState === RunProgressState.ACCESSING_CARDS &&
    playerAccessedCards.length > 0
  ) {
    openCardDisplayModal();
  }
}, [turnCurrentPhase, runProgressState, playerAccessedCards, openCardDisplayModal]);
```

**Benefits**:
- Semantically correct: Encounter/Access are steps within a run
- ON_RUN_START and ON_RUN_END fire at run boundaries (Running Sneakers works correctly!)
- Fewer phase transitions: Run enters once, exits once (not 9+ subphase changes)
- Clearer code: entire run flow in one file, readable top to bottom

**Risks**:
- Complex switch statement (but well-organized)
- New state field `runProgressState` (but replaces subphase concept)
- Requires careful testing of encounter loop and access flow

---

**Option B: Nested Phase Naming** (Alternative)

Keep Encounter/Access as phases but make naming explicit:
```typescript
enum TurnPhase {
  Corp = "Corp",
  Draw = "Draw",
  End = "End",
  Main = "Main",
  Play = "Play",
  Run = "Run",
  Run_Encounter = "Run_Encounter",
  Run_Access = "Run_Access",
}
```

- Semantically clearer that Encounter/Access are part of Run
- ON_RUN_START fires when entering `TurnPhase.Run`
- ON_RUN_END fires when leaving `Run_Access` back to Main/End
- UI can check `phase.startsWith("Run_")` to know we're in a run

**Trade-off**: More phases (8 → 10), but clearer semantics than current approach

---

### Phase 3: Update PhaseManager ✅ STRAIGHTFORWARD

**Changes**:
1. Remove `TurnSubPhase` from handler lookup
2. Change from `PHASE_HANDLERS[phase][subphase]` to `PHASE_HANDLERS[phase]`
3. Watch `phaseCounter` instead of `phaseChangeCounter`

**Before**:
```typescript
type PhaseHandlers = {
  [P in TurnPhase]?: {
    [S in TurnSubPhase]?: () => void | (() => void);
  };
};

const PHASE_HANDLERS: PhaseHandlers = {
  [TurnPhase.Draw]: {
    [TurnSubPhase.Start]: () => dispatchThunk(startDrawPhase()),
    [TurnSubPhase.Process]: () => dispatchThunk(processDrawPhase()),
    [TurnSubPhase.End]: () => dispatchThunk(endDrawPhase()),
  },
  // ... 7 more phases × 3 subphases
};

useEffect(() => {
  if (phaseChangeCounter === lastCounterRef.current) return;
  lastCounterRef.current = phaseChangeCounter;

  const action = PHASE_HANDLERS[turnCurrentPhase]?.[turnCurrentSubPhase];
  if (action) action();
}, [PHASE_HANDLERS, phaseChangeCounter, turnCurrentPhase, turnCurrentSubPhase]);
```

**After**:
```typescript
type PhaseHandlers = {
  [P in TurnPhase]?: () => void | (() => void);
};

const PHASE_HANDLERS: PhaseHandlers = {
  [TurnPhase.Corp]: () => dispatchThunk(corpPhase()),
  [TurnPhase.Draw]: () => dispatchThunk(drawPhase()),
  [TurnPhase.End]: () => dispatchThunk(endPhase()),
  [TurnPhase.Main]: () => dispatchThunk(mainPhase()),
  [TurnPhase.Play]: () => dispatchThunk(playPhase()),
  [TurnPhase.Run]: () => dispatchThunk(runPhase()),
};

useEffect(() => {
  if (phaseCounter === lastCounterRef.current) return;
  lastCounterRef.current = phaseCounter;

  const action = PHASE_HANDLERS[turnCurrentPhase];
  if (action) action();
}, [PHASE_HANDLERS, phaseCounter, turnCurrentPhase]);
```

**Benefits**:
- Much simpler handler lookup
- No need to track subphase in useEffect dependencies
- Easier to understand at a glance

---

### Phase 4: Clean Up State & Actions ✅ STRAIGHTFORWARD

**Files to Update**:

1. **src/state/turn/types.ts**:
   - Remove `TurnSubPhase` enum
   - Remove `turnCurrentSubPhase` from `TurnState`
   - Remove `phaseChangeCounter`, add `phaseCounter`
   - Add `runProgressState` field

2. **src/state/turn/actions.ts**:
   - Remove `setTurnCurrentSubPhase()` action creator
   - Update `setTurnCurrentPhase()` to increment `phaseCounter`
   - Add `setRunProgressState()` action creator
   - Add `incrementPhaseCounter()` action creator (for event handler use)

3. **src/state/turn/reducer.ts**:
   - Remove `SET_TURN_CURRENT_SUBPHASE` case
   - Update `SET_TURN_CURRENT_PHASE` to increment counter
   - Add `SET_RUN_PROGRESS_STATE` case
   - Add `INCREMENT_PHASE_COUNTER` case

4. **Event Handler** (src/state/events/eventHandler.ts):
   - Remove all `setTurnCurrentSubPhase()` calls
   - Use `incrementPhaseCounter()` when pending action is set and phase handler needs re-trigger

5. **UI Components**:
   - Remove all `turnCurrentSubPhase` checks
   - Update to check `runProgressState` for Run-related UI state

---

## Migration Steps (Execution Order)

### Step 1: Add New State Fields (Backwards Compatible)
- Add `phaseCounter` to turn state (parallel to `phaseChangeCounter`)
- Add `runProgressState` to turn state
- Add action creators for new fields
- Update reducer to handle new actions
- **No breaking changes yet** - both old and new systems coexist

### Step 2: Migrate Simple Phases (One at a Time)
- Start with **End phase** (simplest, no user interaction)
- Consolidate start/process/end into single `endPhase()` handler
- Update PhaseManager to call new handler
- Test thoroughly
- Repeat for Corp, Draw, Main, Play

### Step 3: Migrate Run Phase (High Risk)
- Create new `runPhase()` handler with switch statement on `runProgressState`
- Update event handler to use `runProgressState` and `incrementPhaseCounter()`
- Update UI components to check `runProgressState`
- Remove old Encounter/Access phase handlers
- **Extensive testing required** - this is the complex one

### Step 4: Remove Old Subphase System
- Remove `TurnSubPhase` enum
- Remove `turnCurrentSubPhase` from state
- Remove `phaseChangeCounter` (replaced by `phaseCounter`)
- Remove `setTurnCurrentSubPhase()` action
- Clean up all imports across codebase

### Step 5: Update Documentation
- Update CLAUDE.md with new phase flow
- Remove all subphase references from docs
- Document `runProgressState` pattern
- Update phase diagrams/flowcharts

---

## Testing Strategy

### Unit Tests (New)
- Test each phase handler in isolation
- Verify trigger moments fire in correct order
- Test Run phase state machine transitions
- Test edge cases (no ice, no cards to access, etc.)

### Integration Tests
- Full turn cycle: Corp → Draw → Main → Play → Run → Main → End
- Run with 0 ice (straight to access)
- Run with 3 ice (encounter loop)
- Multiple runs in one turn (clicks permitting)

### UI Tests
- Ice clickability during encounter state
- Access modal opens/closes correctly
- Phase indicators show correct state
- No flashing/flickering from eliminated re-renders

### Performance Tests
- Measure render count before/after
- Time full run cycle completion
- Profile React DevTools to confirm re-render reduction

---

## Rollback Plan

If migration goes wrong:
1. Git revert to commit before migration started
2. Or: Keep old phase handlers with `_legacy` suffix during migration
3. Feature flag: `USE_SUBPHASES` boolean in settings to toggle old/new system

---

## Expected Outcomes

### Performance
- **Estimated re-render reduction**: 60-70% per full turn cycle
- **Specific improvement**: Run flow goes from 9+ transitions to 3-4

### Code Quality
- **Line count reduction**: ~30% in phase handler files
- **Cognitive complexity**: Down 50% (no subphase tracking)
- **Handler count**: 24 potential handlers → 6-8 actual handlers

### Developer Experience
- Easier to understand phase flow (read top to bottom in one file)
- Easier to add new phases (one handler, not three)
- Clearer trigger moment execution order

### User Experience
- Snappier phase transitions (fewer re-renders)
- No visible change in functionality
- Potential for smoother animations (fewer interruptions)

---

## Open Questions

1. **Should we keep Encounter/Access as separate phases with Run_ prefix, or use runProgressState?**
   - Leaning toward `runProgressState` for cleaner phase enum

2. **Should Main phase have a waiting state, or is the phase itself the waiting state?**
   - Main phase IS the waiting state (no special flag needed)

3. **How do we handle Run interruption (e.g., card effect that ends run early)?**
   - Add action `abortRun()` that sets `runProgressState = NOT_IN_RUN` and transitions to Main

4. **Should PhaseManager be renamed to PhaseOrchestrator?**
   - Worth considering for clarity, but not required for migration

---

## Timeline Estimate

- **Step 1** (Add new state): 1-2 hours
- **Step 2** (Migrate simple phases): 4-6 hours (1 hour per phase × 5 phases)
- **Step 3** (Migrate Run phase): 6-8 hours (complex, needs careful testing)
- **Step 4** (Remove old system): 2-3 hours
- **Step 5** (Update docs): 1-2 hours

**Total**: 14-21 hours of focused development + testing time

---

## Success Criteria

- [ ] All phases use single handler (no subphases)
- [ ] PhaseManager simplified to flat handler map
- [ ] Run phase correctly orchestrates Encounter/Access flow
- [ ] ON_RUN_START fires at run start, ON_RUN_END fires at run completion
- [ ] Running Sneakers grants +1 click after completing run
- [ ] All trigger moments fire at correct times
- [ ] UI interaction states work correctly (ice clickable, modal opens)
- [ ] No performance regressions (must be faster, not slower)
- [ ] All TypeScript/ESLint checks pass
- [ ] Full turn cycle tested and working
- [ ] Documentation updated

---

**Next Steps**: Review this plan, adjust as needed, then proceed with Step 1 (adding new state fields in backwards-compatible way).
