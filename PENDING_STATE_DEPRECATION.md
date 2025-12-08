# Pending State Deprecation Plan

## Problem

The `pendingState` module duplicates data already present in event payloads:

```
Current: UI → eventBus.emit(payload) → eventHandler stores payload in pendingState → phase reads pendingState
Better:  UI → eventBus.emit(payload) → eventHandler invokes phase with payload directly
```

## Solution: Option A - Direct Phase Invocation

Event handler invokes phase thunks with payloads. PhaseManager remains for automatic phases only.

### Phase Categorization

**User-Driven (invoked by eventHandler with payload):**
- `playPhase({ cardId, handIndex })`
- `runPhase.clickIce({ iceId })`
- `runPhase.selectCard({ cardId })`
- `runPhase.initiate()`

**Automatic (invoked by PhaseManager):**
- `corpPhase()`
- `drawPhase()`
- `upkeepPhase()`
- `mainPhase()`
- `endPhase()`

### Changes Required

#### 1. Modify ThunkAction type to accept optional payload
```typescript
// src/state/types.ts
export type ThunkAction<P = void> = (
  dispatch: (action: GameAction) => void,
  getState: () => GameState,
  payload: P,
) => void;
```

#### 2. Update eventHandler to invoke phases directly
```typescript
// src/state/events/eventHandler.ts
case GameEventType.PLAYER_PLAY_CARD: {
  // Validate...
  dispatch(setTurnCurrentPhase(TurnPhase.Play));
  playPhase({ cardId, handIndex })(dispatch, getState);
  break;
}
```

#### 3. Update phase signatures
```typescript
// playPhase.ts
export const playPhase = (payload: { cardId: string; handIndex: number }): ThunkAction => {
  return (dispatch, getState) => {
    const card = getState().playerState.playerHand[payload.handIndex];
    // ... use payload directly, no pendingState lookup
  };
};
```

#### 4. Split runPhase into discrete functions
```typescript
// runPhase.ts
export const initiateRun = (): ThunkAction => { ... };
export const clickIce = (payload: { iceId: string }): ThunkAction => { ... };
export const selectAccessedCard = (payload: { cardId: string }): ThunkAction => { ... };
```

#### 5. Remove pending module entirely
- Delete `src/state/pending/` directory
- Remove from `reducer.ts`, `types.ts`
- Remove `pendingState` from `GameState`

### Files to Modify

| File | Change |
|------|--------|
| `src/state/types.ts` | Remove PendingState from GameState, update ThunkAction |
| `src/state/reducer.ts` | Remove pending imports and reducer |
| `src/state/events/eventHandler.ts` | Invoke phases directly with payloads |
| `src/state/phases/playPhase.ts` | Accept payload param, remove pending reads |
| `src/state/phases/runPhase.ts` | Split into 3 functions, accept payloads |
| `src/PhaseManager.tsx` | Remove Run/Play from handlers (user-driven) |

### Files to Delete

- `src/state/pending/types.ts`
- `src/state/pending/actions.ts`
- `src/state/pending/reducer.ts`
- `src/state/pending/selectors.ts`
- `src/state/pending/index.ts`

### Migration Notes

- Event bus remains for logging/debugging (history tracking)
- PhaseManager only handles automatic phase transitions
- User-driven phases execute synchronously in eventHandler
- `incrementPhaseCounter()` no longer needed for user actions
