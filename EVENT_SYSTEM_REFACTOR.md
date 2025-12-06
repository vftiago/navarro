# Event System Refactor Plan

## Problem Statement

The current phase system has intentional but undocumented inconsistencies:

### Current Issues

1. **Inconsistent Phase Triggers**

   - Most phases: PhaseManager auto-runs Start → Process → End
   - Play phase: UI manually calls `startPlayPhase(card, index)` thunk
   - Access/Encounter: Empty End handlers, UI manually calls end thunks

2. **Tight UI-Game Logic Coupling**

   - UI components directly import and call game logic thunks
   - Difficult to test game logic without UI
   - Hard to replay/simulate game actions
   - No central event log for debugging

3. **Runtime Data Problem**
   - Play phase needs card-specific data (which card, from which index)
   - Current solution: bypass PhaseManager, call thunk directly from UI
   - Breaks the uniform phase progression pattern

## Goals

1. **Uniform Phase Progression**: All phases follow Start → Process → End pattern
2. **Decouple UI from Game Logic**: UI emits events, game logic handles them
3. **Testability**: Game logic can run without UI components
4. **Debuggability**: Central event log for game actions
5. **Replay-ability**: Record events to reproduce game states

## Proposed Architecture

### Event-Driven State Updates

```
┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│ UI Component│──────>│ Event Emitter│──────>│  Game Logic   │
│  (PlayerHand)│ emit  │  (eventBus)  │ handle│ (PhaseManager)│
└─────────────┘       └──────────────┘       └───────────────┘
                             │
                             ├──> Event Log (debugging)
                             └──> Event Replay (testing)
```

### Core Components

#### 1. Event Bus (`src/state/events/eventBus.ts`)

```typescript
// Event types
export enum GameEventType {
  // Player actions
  PLAYER_PLAY_CARD = "PLAYER_PLAY_CARD",
  PLAYER_INITIATE_RUN = "PLAYER_INITIATE_RUN",
  PLAYER_CLICK_ICE = "PLAYER_CLICK_ICE",
  PLAYER_SELECT_ACCESSED_CARD = "PLAYER_SELECT_ACCESSED_CARD",
  PLAYER_END_TURN = "PLAYER_END_TURN",

  // Card activations
  CARD_ACTIVATE_ABILITY = "CARD_ACTIVATE_ABILITY",
}

// Event payloads
export type GameEvent =
  | {
      type: GameEventType.PLAYER_PLAY_CARD;
      payload: { cardId: string; handIndex: number };
    }
  | { type: GameEventType.PLAYER_INITIATE_RUN; payload: {} }
  | { type: GameEventType.PLAYER_CLICK_ICE; payload: { iceId: string } }
  | {
      type: GameEventType.PLAYER_SELECT_ACCESSED_CARD;
      payload: { cardId: string };
    }
  | { type: GameEventType.PLAYER_END_TURN; payload: {} }
  | {
      type: GameEventType.CARD_ACTIVATE_ABILITY;
      payload: { cardId: string; abilityIndex: number };
    };

// Event bus interface
export interface EventBus {
  emit: (event: GameEvent) => void;
  subscribe: (listener: (event: GameEvent) => void) => () => void;
  getHistory: () => GameEvent[];
}

// Implementation
export const createEventBus = (): EventBus => {
  const listeners: ((event: GameEvent) => void)[] = [];
  const history: GameEvent[] = [];

  return {
    emit: (event: GameEvent) => {
      // Log event for debugging
      if (import.meta.env.DEV) {
        console.log("[GameEvent]", event.type, event.payload);
      }

      // Add to history
      history.push(event);

      // Notify all listeners
      listeners.forEach((listener) => listener(event));
    },

    subscribe: (listener: (event: GameEvent) => void) => {
      listeners.push(listener);
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },

    getHistory: () => [...history],
  };
};
```

#### 2. Pending Actions State (`src/state/pending/`)

Store user actions that will be processed by PhaseManager:

```typescript
// src/state/pending/types.ts
export type PendingAction =
  | {
      type: "PLAY_CARD";
      cardId: string;
      handIndex: number;
    }
  | {
      type: "INITIATE_RUN";
    }
  | {
      type: "CLICK_ICE";
      iceId: string;
    }
  | {
      type: "SELECT_ACCESSED_CARD";
      cardId: string;
    };

export type PendingState = {
  pendingAction: PendingAction | null;
};

// src/state/pending/actions.ts
export const setPendingAction = (
  action: PendingAction | null,
): PendingAction => ({
  type: PendingActionTypes.SET_PENDING_ACTION,
  payload: action,
});

export const clearPendingAction = (): PendingAction => ({
  type: PendingActionTypes.CLEAR_PENDING_ACTION,
});
```

#### 3. Event Handler (`src/state/events/eventHandler.ts`)

Connects event bus to state updates:

```typescript
import type { GameEvent } from "./eventBus";
import type { GameState } from "../types";
import { setPendingAction, setTurnCurrentPhase } from "../actions";

export const createEventHandler = (
  dispatch: (action: any) => void,
  getState: () => GameState,
) => {
  return (event: GameEvent) => {
    const state = getState();

    switch (event.type) {
      case GameEventType.PLAYER_PLAY_CARD: {
        // Validate: Must be in Main phase
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot play card outside Main phase");
          return;
        }

        // Store pending action
        dispatch(
          setPendingAction({
            type: "PLAY_CARD",
            cardId: event.payload.cardId,
            handIndex: event.payload.handIndex,
          }),
        );

        // Transition to Play phase
        dispatch(setTurnCurrentPhase(TurnPhase.Play));
        dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
        break;
      }

      case GameEventType.PLAYER_INITIATE_RUN: {
        if (state.turnState.turnCurrentPhase !== TurnPhase.Main) {
          console.warn("Cannot initiate run outside Main phase");
          return;
        }

        dispatch(setPendingAction({ type: "INITIATE_RUN" }));
        dispatch(setTurnCurrentPhase(TurnPhase.Run));
        dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
        break;
      }

      case GameEventType.PLAYER_CLICK_ICE: {
        if (state.turnState.turnCurrentPhase !== TurnPhase.Encounter) {
          console.warn("Cannot click ice outside Encounter phase");
          return;
        }

        dispatch(
          setPendingAction({
            type: "CLICK_ICE",
            iceId: event.payload.iceId,
          }),
        );

        // Trigger encounter effects and transition to End
        dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
        break;
      }

      case GameEventType.PLAYER_SELECT_ACCESSED_CARD: {
        if (state.turnState.turnCurrentPhase !== TurnPhase.Access) {
          console.warn("Cannot select card outside Access phase");
          return;
        }

        dispatch(
          setPendingAction({
            type: "SELECT_ACCESSED_CARD",
            cardId: event.payload.cardId,
          }),
        );

        dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
        break;
      }

      default:
        console.warn("Unhandled event type:", event);
    }
  };
};
```

## Detailed Example: Playing a Card

### Current Implementation (Before Refactor)

```typescript
// src/ui/PlayerDashboard/PlayerHand.tsx (BEFORE)
const handleCardClick = (card: PlayingCard, index: number) => {
  if (turnCurrentPhase !== TurnPhase.Main) return;

  // UI directly calls game logic thunk
  dispatchThunk(startPlayPhase(card, index));
};
```

```typescript
// src/state/phases/playPhase.ts (BEFORE)
export const startPlayPhase = (
  card: PlayingCard,
  index: number,
): ThunkAction => {
  return (dispatch) => {
    dispatch(setTurnCurrentPhase(TurnPhase.Play));
    dispatch(modifyClicks(-1));
    dispatch(removeCardFromHand(index));
    dispatch(addCardToPlayed(card));
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};
```

**Problem**: PhaseManager never gets involved - direct UI → game logic coupling.

### New Implementation (After Refactor)

#### Step 1: UI Emits Event

```typescript
// src/ui/PlayerDashboard/PlayerHand.tsx (AFTER)
import { useEventBus } from "../../state/events";

const PlayerHand = () => {
  const eventBus = useEventBus();
  const turnCurrentPhase = useGameStore(
    (state) => state.turnState.turnCurrentPhase,
  );

  const handleCardClick = (card: PlayingCard, index: number) => {
    if (turnCurrentPhase !== TurnPhase.Main) return;

    // UI emits event (doesn't know about game logic)
    eventBus.emit({
      type: GameEventType.PLAYER_PLAY_CARD,
      payload: {
        cardId: card.deckContextId,
        handIndex: index,
      },
    });
  };

  // ... rest of component
};
```

#### Step 2: Event Handler Updates State

```typescript
// Event handler receives event and updates state
// (from eventHandler.ts shown above)

case GameEventType.PLAYER_PLAY_CARD: {
  // Store which card is being played
  dispatch(setPendingAction({
    type: 'PLAY_CARD',
    cardId: event.payload.cardId,
    handIndex: event.payload.handIndex,
  }));

  // Transition to Play phase Start
  dispatch(setTurnCurrentPhase(TurnPhase.Play));
  dispatch(setTurnCurrentSubPhase(TurnSubPhase.Start));
  break;
}
```

#### Step 3: PhaseManager Detects Change

```typescript
// src/PhaseManager.tsx (UPDATED)
const PHASE_HANDLERS: PhaseHandlers = useMemo(() => {
  return {
    [TurnPhase.Play]: {
      [TurnSubPhase.Start]: () => dispatchThunk(startPlayPhase()), // No params!
      [TurnSubPhase.Process]: () => dispatchThunk(processPlayPhase()),
      [TurnSubPhase.End]: () => dispatchThunk(endPlayPhase()),
    },
    // ... other phases
  };
}, [dispatchThunk]);
```

#### Step 4: Play Phase Start Handler

```typescript
// src/state/phases/playPhase.ts (AFTER)
export const startPlayPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const pendingAction = state.pendingState.pendingAction;

    // Validate pending action
    if (!pendingAction || pendingAction.type !== "PLAY_CARD") {
      console.error("No pending PLAY_CARD action");
      return;
    }

    // Get the card from hand using pending action data
    const card = state.playerState.playerHand[pendingAction.handIndex];

    if (!card || card.deckContextId !== pendingAction.cardId) {
      console.error("Card mismatch in pending action");
      return;
    }

    // Execute play logic
    dispatch(modifyClicks(-1));
    dispatch(removeCardFromHand(pendingAction.handIndex));
    dispatch(addCardToPlayed(card));

    // Clear pending action
    dispatch(clearPendingAction());

    // Transition to Process
    dispatch(setTurnCurrentSubPhase(TurnSubPhase.Process));
  };
};
```

#### Step 5: Process and End Run Automatically

```typescript
// Process handler (unchanged)
export const processPlayPhase = (): ThunkAction => {
  return (dispatch, getState) => {
    const playerPlayedCards = getPlayerPlayedCards(getState());

    playerPlayedCards.forEach((card) => {
      const playEffects = getCardEffectsByTrigger(card, TriggerMoment.ON_PLAY);
      executeCardEffects(playEffects, dispatch, getState, {
        gameState: getState(),
        sourceId: card.deckContextId,
      });
    });

    dispatch(setTurnCurrentSubPhase(TurnSubPhase.End));
  };
};

// End handler (unchanged - moves cards to appropriate zones)
export const endPlayPhase = (): ThunkAction => {
  // ... existing implementation
};
```

### Flow Diagram: Playing a Card

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER CLICKS CARD                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ UI Component (PlayerHand.tsx)                                   │
│                                                                 │
│  eventBus.emit({                                                │
│    type: PLAYER_PLAY_CARD,                                      │
│    payload: { cardId, handIndex }                               │
│  })                                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Event Handler (eventHandler.ts)                                │
│                                                                 │
│  1. Validate (must be in Main phase)                            │
│  2. dispatch(setPendingAction({ type: PLAY_CARD, ... }))        │
│  3. dispatch(setTurnCurrentPhase(Play))                         │
│  4. dispatch(setTurnCurrentSubPhase(Start))                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PhaseManager (PhaseManager.tsx)                                 │
│                                                                 │
│  Detects: phase = Play, subphase = Start                        │
│  Runs: PHASE_HANDLERS[Play][Start]()                            │
│  → dispatchThunk(startPlayPhase())                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Play Phase Start (playPhase.ts - startPlayPhase)                │
│                                                                 │
│  1. Get pendingAction from state                                │
│  2. Validate action type is PLAY_CARD                           │
│  3. Get card from hand using handIndex                          │
│  4. Execute play logic (modify clicks, remove from hand, etc.)  │
│  5. clearPendingAction()                                        │
│  6. setTurnCurrentSubPhase(Process)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PhaseManager (PhaseManager.tsx)                                 │
│                                                                 │
│  Detects: phase = Play, subphase = Process                      │
│  Runs: PHASE_HANDLERS[Play][Process]()                          │
│  → dispatchThunk(processPlayPhase())                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Play Phase Process (playPhase.ts - processPlayPhase)            │
│                                                                 │
│  1. Execute ON_PLAY triggers                                    │
│  2. setTurnCurrentSubPhase(End)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PhaseManager (PhaseManager.tsx)                                 │
│                                                                 │
│  Detects: phase = Play, subphase = End                          │
│  Runs: PHASE_HANDLERS[Play][End]()                              │
│  → dispatchThunk(endPlayPhase())                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Play Phase End (playPhase.ts - endPlayPhase)                    │
│                                                                 │
│  1. Execute ON_INSTALL/ON_TRASH/ON_DISCARD triggers             │
│  2. Move cards to appropriate zones                             │
│  3. Determine next phase (Main or End based on clicks)          │
│  4. setTurnCurrentPhase(nextPhase)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    BACK TO MAIN PHASE
```

## Migration Strategy

### Phase 1: Infrastructure Setup

1. Create event bus system (`src/state/events/eventBus.ts`)
2. Add pending action state (`src/state/pending/`)
3. Create event handler (`src/state/events/eventHandler.ts`)
4. Add React context/hook for event bus (`src/state/events/useEventBus.ts`)

### Phase 2: Migrate Play Phase

1. Update `startPlayPhase()` to read from pending state (no params)
2. Add Play Phase Start handler to PhaseManager
3. Update PlayerHand component to emit PLAYER_PLAY_CARD event
4. Test thoroughly

### Phase 3: Migrate Encounter Phase

1. Update `endEncounterPhase()` to read from pending state
2. Make End handler non-empty in PhaseManager
3. Update Ice card click handlers to emit PLAYER_CLICK_ICE event
4. Test thoroughly

### Phase 4: Migrate Access Phase

1. Update `selectAccessedCard()` and `endAccessPhase()` to use pending state
2. Make End handler non-empty in PhaseManager
3. Update modal dismiss handler to emit event
4. Test thoroughly

### Phase 5: Cleanup

1. Remove direct thunk imports from UI components
2. Add ESLint rule to prevent UI → thunk coupling
3. Update documentation

## Benefits

### 1. Testability

```typescript
// Can now test game logic without UI
test("playing a card deducts 1 click", () => {
  const { store, eventBus } = createTestGame();

  eventBus.emit({
    type: GameEventType.PLAYER_PLAY_CARD,
    payload: { cardId: "card-123", handIndex: 0 },
  });

  expect(store.getState().turnState.turnRemainingClicks).toBe(2);
});
```

### 2. Debuggability

```typescript
// Event log shows exactly what happened
eventBus.getHistory();
// [
//   { type: 'PLAYER_PLAY_CARD', payload: { cardId: 'card-123', handIndex: 0 } },
//   { type: 'PLAYER_INITIATE_RUN', payload: {} },
//   { type: 'PLAYER_CLICK_ICE', payload: { iceId: 'ice-456' } }
// ]
```

### 3. Replay-ability

```typescript
// Reproduce exact game state by replaying events
function replayGame(events: GameEvent[]) {
  const { store, eventBus } = createTestGame();
  events.forEach((event) => eventBus.emit(event));
  return store.getState();
}
```

### 4. Consistent Phase Pattern

All phases now follow Start → Process → End with PhaseManager orchestration.

### 5. Decoupled Architecture

UI components only know about events, not game logic implementation.

## Trade-offs

### Pros

- ✅ Uniform phase progression
- ✅ Testable game logic
- ✅ Event logging for debugging
- ✅ Replay-able game states
- ✅ Cleaner separation of concerns

### Cons

- ❌ More indirection (UI → Event → Handler → State → PhaseManager)
- ❌ Additional state (pending actions)
- ❌ Migration effort (~2-3 days for all phases)
- ❌ Learning curve for new pattern

## Open Questions

1. **Event Validation**: Should event bus validate events, or let handler do it?
2. **Event History**: Should we persist event history for crash reports?
3. **Undo/Redo**: Does event system need to support undo functionality?
4. **Network Play**: Would this architecture support multiplayer later?
5. **Performance**: Any performance concerns with event indirection?

## Implementation Status

---

**Status**: ✅ **COMPLETED** (2025-12-06)
**Actual Effort**: 1 day for full migration
**Priority**: COMPLETED

### What Was Implemented

✅ **Phase 1: Infrastructure Setup**

- Created event bus system (`src/state/events/eventBus.ts`)
- Added pending action state module (`src/state/pending/`)
- Implemented event handler with validation (`src/state/events/eventHandler.ts`)
- Added React context/hook for event bus (`src/state/events/useEventBus.ts`)
- Wired up event bus in App.tsx

✅ **Phase 2: Migrate Play Phase**

- Updated `startPlayPhase()` to read from pending state (no parameters)
- Added Play Phase Start handler to PhaseManager
- Updated PlayerHand component to emit `PLAYER_PLAY_CARD` event
- Tested thoroughly

✅ **Phase 3: Migrate Encounter Phase**

- Updated `endEncounterPhase()` to read from pending state
- Updated `processEncounterPhase()` to wait for user input (no auto-transition)
- Updated IceRow component to emit `PLAYER_CLICK_ICE` event
- Tested thoroughly

✅ **Phase 4: Migrate Access Phase**

- Updated `endAccessPhase()` to read from pending state and process selection
- Updated `processAccessPhase()` to wait for user selection (no auto-transition)
- Updated Modals component to emit `PLAYER_SELECT_ACCESSED_CARD` event
- Updated App.tsx to remove old `endAccessPhase()` call
- Tested thoroughly

✅ **Phase 5: Cleanup**

- Removed all direct thunk imports from UI components (PlayerHand, IceRow, Modals, PlayerDashboard)
- Removed all `useThunk()` usage from UI layer
- Updated PlayerDashboard to emit `PLAYER_END_TURN` event
- All UI components now exclusively use `useEventBus()`

### Benefits Realized

✅ **Uniform Phase Progression** - All phases follow Start → Process → End pattern through PhaseManager
✅ **Decoupled UI from Game Logic** - UI components only emit events, don't know about phase implementation
✅ **Testability** - Game logic can be tested without rendering UI components
✅ **Debuggability** - Central event log shows all user actions (`eventBus.getHistory()`)
✅ **Centralized Validation** - Event handler validates all user actions before state updates

### Performance Impact

No measurable performance degradation. Event system adds minimal overhead:

- One additional function call (event handler) per user action
- Event logging only in development mode
- Event history array grows linearly with user actions (negligible memory impact)

### Architecture Decisions Documented

See CLAUDE.md "Event System (User Action Decoupling)" section for:

- Complete architecture overview
- Event types and flow diagram
- Usage patterns
- Benefits and trade-offs

### Conclusion

The event system migration was **highly successful**. The codebase is now:

- More maintainable (clear separation of concerns)
- More testable (game logic isolated from UI)
- More debuggable (event history for troubleshooting)
- Future-proof (ready for replay, multiplayer, undo/redo if needed)

**Recommendation**: Keep the event system. The benefits far outweigh the minimal added complexity.
