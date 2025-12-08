# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Navarro is a React-based interactive card game interface (Netrunner-inspired) built with React 19, TypeScript, Vite 6, Mantine UI, and Tailwind CSS v4.

**Requirements:** Node.js 22, pnpm 9

## Commands

```bash
pnpm dev        # Start Vite dev server with HMR
pnpm build      # TypeScript check + production build
pnpm lint       # ESLint (zero warnings enforced)
pnpm format     # Prettier formatting
pnpm tsc        # TypeScript type checking only
```

Pre-commit hook runs: Prettier → TypeScript → ESLint (all must pass with zero warnings)

## Architecture

### State Management (Zustand with Redux-like reducers)

The state is organized into modular slices with a Redux-like architecture:

**Core Store** (`src/state/`):

- `store.ts` - Zustand store with devtools middleware; exports `useGameStore()` hook
- `reducer.ts` - Root reducer that combines sub-reducers using type guards
- `types.ts` - `GameState` and `GameAction` union types
- `hooks.ts` - `useThunk()` hook for dispatching thunk actions

**State Modules** (`src/state/{player|server|turn|board|settings}/`):

Each module follows a consistent structure:

- `types.ts` - State shape, action types enum, and action type definitions
- `actions.ts` - Action creators (plain functions that return action objects)
- `reducer.ts` - Pure reducer function with initial state
- `selectors.ts` - Selector functions for derived state (use `getXxx` naming)
- `index.ts` - Re-exports all module components

**Complex Game Logic** (`src/state/phases/`):

Thunk actions for multi-step game phase flows:

- `playPhase.ts` - Play card logic (accepts payload from eventHandler)
- `runPhase.ts` - Run logic split into `initiateRun()`, `clickIce()`, `selectAccessedCard()`
- `corpPhase.ts`, `drawPhase.ts`, `upkeepPhase.ts`, `mainPhase.ts`, `endPhase.ts` - Automatic phases
- Use via `useThunk()` hook for automatic phases, or invoke directly with payload for user-driven phases

**Utilities** (`src/state/utils/`):

- `cardUtils.ts` - Card manipulation helpers
- `deckUtils.ts` - Deck management utilities

**Usage Patterns**:

- **Access state**: `useGameStore((state) => state.playerState)` or use specific selectors
- **Dispatch actions**: `const dispatch = useGameStore((state) => state.dispatch); dispatch(actionCreator())`
- **Emit user events** (UI layer): `const eventBus = useEventBus(); eventBus.emit({ type: GameEventType.PLAYER_PLAY_CARD, payload: {...} })`
- **Dispatch thunks** (phase logic only): `const dispatchThunk = useThunk(); dispatchThunk(thunkAction)`
- **Granular subscriptions**: Use targeted selectors to prevent unnecessary re-renders

### Component Structure

- `src/ui/` - Presentational components (Card, PlayerDashboard, IceRow, etc.)
- `src/ui/Card/` - Card rendering with type-specific components (CardFrontIce, CardFrontAgenda)
- `src/ui/PlayerDashboard/` - Player hand and resource management

### Card System

- `src/cardDefinitions/` - Card types, interfaces, and keyword definitions
- `src/cardDefinitions/createPlayingCard.ts` - Factory for creating card instances with unique IDs
- `src/decks/` - Deck definitions

### Event System (User Action Decoupling)

The game uses an event-driven architecture to decouple UI from game logic:

**Event Bus** (`src/state/events/`):

- `eventBus.ts` - Core event bus with emit, subscribe, and history tracking
- `eventHandler.ts` - Validates events and invokes phase thunks directly with payloads
- `useEventBus.ts` - React context and hook for accessing event bus

**Flow**:
```
UI Component → eventBus.emit(event) → Event Handler validates →
  Invokes phase thunk directly with payload → Phase executes and transitions state
```

**User-Driven Phases** (invoked directly by triggering code):
- `playPhase({ cardId, handIndex })` - Called by eventHandler when user plays card
- `initiateRun()` - Called by eventHandler (Run button) or playPhase (Run card)
- `clickIce({ iceId })` - Called by eventHandler during ice encounter
- `selectAccessedCard({ cardId })` - Called by eventHandler during card access

**Automatic Phases** (handled by PhaseManager):
- `corpPhase()`, `drawPhase()`, `upkeepPhase()`, `mainPhase()`, `endPhase()`

**Event Types**:
- `PLAYER_PLAY_CARD` - User plays a card from hand
- `PLAYER_INITIATE_RUN` - User clicks "Run" button
- `PLAYER_CLICK_ICE` - User clicks ice during encounter
- `PLAYER_SELECT_ACCESSED_CARD` - User selects accessed card in modal
- `PLAYER_END_TURN` - User clicks "End Turn" button
- `CARD_ACTIVATE_ABILITY` - User activates card ability (future)

**Benefits**:
- UI components never import phase thunks directly
- Centralized validation of all user actions
- Event history for debugging (`eventBus.getHistory()`)
- Testable game logic without UI rendering

### Game Flow

- `src/PhaseManager.tsx` - Handles automatic phase transitions only (Corp, Draw, Upkeep, Main, End)
- User-driven phases (Play, Run) are handled directly by the event handler
- Turn phases defined in `src/state/turn/types.ts` (Corp, Draw, Upkeep, Main, Play, Run, End)
- Phase logic implemented in `src/state/phases/` (single-handler pattern for each phase)
- Modal state managed via Mantine's `useDisclosure()` in App.tsx
- User actions handled via event bus (see Event System above)

## Turn Structure & Phase Flow

### Phase Architecture

Each turn follows a structured phase progression. Phases are managed by `PhaseManager.tsx` which watches `phaseCounter` and dispatches the appropriate phase handler based on the current phase.

**Single-Handler Pattern**: Each phase has a single handler that executes all phase logic atomically:

- Phase handlers are pure functions that return thunks
- PhaseManager increments `phaseCounter` on every phase transition
- When `phaseCounter` changes, PhaseManager executes the handler for `turnCurrentPhase`
- Run phase uses internal `runProgressState` for sub-states (NOT_IN_RUN, ENCOUNTERING_ICE, ACCESSING_CARDS)

### Complete Turn Cycle

```
Corp Phase (Turn End) → Draw Phase → Upkeep Phase → Main Phase → Play/Run Phases → End Phase → Corp Phase (loop)
```

**Detailed Phase Breakdown**:

#### 1. Corp Phase

- **Start**: Set subphase to Process (src/state/phases/corpPhase.ts:16)
- **Process** (1 second delay):
  - Increment server security level by 1
  - Install random Ice card if slots available
  - Trigger `ON_REZ` effects on newly installed Ice
- **End**: Transition to Draw phase

#### 2. Draw Phase

- Reset player clicks to `playerClicksPerTurn`
- Draw `playerCardsPerTurn` cards
- Execute `ON_DRAW` trigger effects for all cards in hand
- Transition:
  - If clicks > 0: transition to **Upkeep** phase
  - If clicks = 0: transition to End phase

#### 3. Upkeep Phase

- Execute `ON_UPKEEP` trigger effects on all installed programs
- This phase runs exactly once per turn after Draw and before Main
- Example: "Intrusive Thoughts" draws 1 card and loses 1 click during Upkeep
- Automatically transitions to Main phase after upkeep effects complete

#### 4. Main Phase

- Pure waiting state for player input (no effects triggered)
- Main phase persists until player takes action:
  - Play cards from hand (transitions to Play phase)
  - Initiate runs (transitions to Run phase)
  - End turn manually (transitions to End phase)
- Can be re-entered multiple times per turn (after Play/Run phases)
- UI components check for `TurnPhase.Main` to enable/disable player actions

#### 5. Play Phase

- Deducts 1 click
- Removes card from hand, adds to played cards area
- Execute `ON_PLAY` trigger effects for all played cards
- Move cards to appropriate zones (with trigger execution):
  - Programs → Execute `ON_INSTALL` triggers, then add to `playerPrograms`
  - Cards with `Trash` keyword → Execute `ON_TRASH` triggers, then add to `playerTrash`
  - Others → Execute `ON_DISCARD` triggers, then add to `playerDiscard`
- Clear played cards area
- Transition:
  - If `turnNextPhase` is set: go to that phase (e.g., Run)
  - Else if clicks > 0: return to Main phase
  - Else: go to End phase

#### 6. Run Phase

- Execute `ON_RUN_START` trigger effects on all installed programs
- Initialize `serverUnencounteredIce` with all installed Ice (innermost to outermost)
- Uses `runProgressState` internal state machine:
  - **NOT_IN_RUN**: Initialize run
  - **ENCOUNTERING_ICE**: Process ice clicks (user-driven), trigger `ON_ENCOUNTER` effects, loop through ice
  - **ACCESSING_CARDS**: Process card selection (user-driven), trigger `ON_ACCESS` and `ON_FETCH` effects
- Execute `ON_RUN_END` trigger effects on all installed programs
- Transition:
  - If clicks > 0: return to Main phase
  - Else: go to End phase

#### 7. End Phase

- Discard entire hand
- Transition to Corp phase (starts next turn cycle)

### Phase Transition Triggers

**Automatic Transitions** (handled by PhaseManager):

- Corp → Draw (turn cycle begins)
- Draw → Upkeep or End (based on clicks)
- Upkeep → Main (always)
- Play/Run → Main or End (based on remaining clicks)
- End → Corp (turn cycle)

**Manual Transitions** (UI-driven):

- Main → Play (player plays card)
- Main → Run (player clicks Run button)
- Main → End (player ends turn)
- Run internal: Ice clicks, card selection (via `runProgressState`)

**Card-Driven Transitions**:

- Play phase can set `turnNextPhase` (e.g., Run card sets next phase to Run)

## Trigger Moment Compendium

Card effects trigger at specific moments during gameplay. Each `CardEffect` has a `triggerMoment` property that determines when it executes.

### Active Trigger Moments

These triggers are actively executed in phase implementations:

#### `ON_UPKEEP`

**When**: Upkeep phase (src/state/phases/upkeepPhase.ts)
**Executed on**: All installed programs in `playerInstalledPrograms`
**Runs**: Exactly once per turn after Draw and before Main
**Example**: "Intrusive Thoughts" - draws 1 card and loses 1 click during upkeep

#### `ON_DRAW`

**When**: Draw phase Process subphase (src/state/phases/drawPhase.ts:34)
**Executed on**: Each card currently in player's hand
**Example**: "Scintillating Scotoma" trap - loses 1 click when drawn

#### `ON_PLAY`

**When**: Play phase Process subphase (src/state/phases/playPhase.ts:51)
**Executed on**: All cards in `playerPlayedCards` area
**Example**: "Run" script - initiates run phase when played

#### `ON_ENCOUNTER`

**When**: Encounter phase via `triggerEncounterEffects()` (src/state/phases/encounterPhase.ts:47)
**Executed on**: Current encountered Ice card
**Example**: "Ice Wall" - player loses 1 click on encounter

#### `ON_REZ`

**When**: Corp phase when new Ice is installed (src/state/phases/corpPhase.ts:35)
**Executed on**: Newly installed Ice card
**Example**: "Bad Moon" - gives other Ice +1 strength when rezzed

#### `ON_ACCESS`

**When**: Access phase Process subphase (src/state/phases/accessPhase.ts:41)
**Executed on**: All cards in `playerAccessedCards` array
**Example**: Trap cards that trigger when accessed from server

#### `ON_FETCH`

**When**: Access phase when player selects a card via `selectAccessedCard()` (src/state/phases/accessPhase.ts:59)
**Executed on**: The selected accessed card
**Example**: Agenda cards - award victory points when fetched

#### `ON_RUN_START`

**When**: Run phase Start subphase (src/state/phases/runPhase.ts:19)
**Executed on**: All installed programs in `playerInstalledPrograms`
**Example**: Effects that trigger when a run begins

#### `ON_RUN_END`

**When**: Run phase End subphase (src/state/phases/runPhase.ts:66)
**Executed on**: All installed programs in `playerInstalledPrograms`
**Example**: "Running Sneakers" - gain 1 click when completing a run

#### `ON_INSTALL`

**When**: Play phase End subphase when programs are installed (src/state/phases/playPhase.ts:71)
**Executed on**: Program card being installed
**Example**: Effects that trigger when a program enters play

#### `ON_DISCARD`

**When**: When a card is moved to discard pile (src/state/phases/playPhase.ts:79)
**Executed on**: Card being discarded
**Locations**:

- Play phase End (non-program, non-trash cards)
- Access phase when selecting non-agenda cards
- Net damage resolution (damageUtils.ts:26)
  **Example**: "Ethereal" keyword - additional effects when discarded

#### `ON_TRASH`

**When**: When a card is moved to trash pile (src/state/phases/playPhase.ts:75)
**Executed on**: Card being trashed
**Note**: Different from `Keyword.TRASH` which determines card destination
**Example**: Effects that trigger when cards with Trash keyword are trashed

#### `ON_CLICK`

**When**: User manually activates card ability (UI-driven)
**Requires**: `EffectCost.CLICK` cost to be paid
**Example**: "Sledgehammer" - breaks barrier subroutine on click

### Trigger Execution Pattern

All trigger executions follow this pattern (see src/state/utils/cardUtils.ts:46):

```typescript
const effects = getCardEffectsByTrigger(card, TriggerMoment.ON_PLAY);
executeCardEffects(effects, dispatch, getState, {
  gameState: getState(),
  sourceId: card.deckContextId,
  targetId: optionalTargetId,
});
```

Effects can return either:

- **Actions** (`getActions`): Dispatched immediately
- **Thunks** (`getThunk`): Complex multi-step operations with state access

## Known Issues & Improvements

#### Active Issues

1. **Copy-Paste Error** (cardDefinitions/serverCards/ice.ts:100)
   - Fire Wall error message says "Bad Moon"
   - **Impact**: Confusing error messages for developers

### Redundancies

_All redundancies have been cleaned up. Unused TurnPhase enum values and subphase system have been removed._

## Points for Improvement

### High Priority

1. ~~**Eliminate Subphase System**~~ ✅ **COMPLETED (2025-12-06)**

   - ✅ Migrated all phases to single-handler pattern
   - ✅ Removed TurnSubPhase enum and subphase state
   - ✅ Run phase uses internal `runProgressState` instead of separate phases
   - ✅ Main phase is now a pure waiting state (no ON_TURN_START bug)
   - ✅ New Upkeep phase for once-per-turn effects (ON_UPKEEP trigger)

2. ~~**Decouple UI from Phase Logic**~~ ✅ **COMPLETED (2025-12-06)**

   - ✅ Implemented event bus system for all user actions
   - ✅ UI components emit events instead of calling thunks
   - ✅ Event handler validates and coordinates state updates
   - ✅ Game logic fully testable independent of UI

3. **Add Phase Validation**

   - Runtime checks for undefined phase handlers
   - TypeScript exhaustiveness checking on phase switches
   - Development-mode warnings for unused trigger moments

4. **Consolidate Phase Transition Logic**
   - Many phases have identical "check clicks → Main or End" logic
   - Extract to shared utility function
   - Reduces duplication across phase files

### Medium Priority

5. **Fix Remaining Issues**

   - Fix Fire Wall error message (says "Bad Moon" instead of "Fire Wall")
   - Add ESLint rule to catch unused enum values

6. **Improve Phase Observability**

   - Add phase transition logging/debugging utilities
   - Visualize phase flow in dev tools
   - Track phase timing metrics

7. **Document Phase Responsibilities**
   - Create state machine diagram for phase transitions
   - Document which phases are automatic vs user-driven

## Recently Completed

### Session 2025-12-06 (Part 2): Upkeep Phase & Subphase Elimination

**Major Achievement:** Complete elimination of subphase system, introduction of Upkeep phase

**Problem Solved:** After subphase elimination, `mainPhase()` was firing ON_TURN_START effects every time the game returned to Main phase (after Play/Run), causing cards like "Intrusive Thoughts" to trigger multiple times per turn instead of once. This created a perceived performance issue (stutter) that was actually unexpected state changes.

**Solution:** Introduced a new Upkeep phase that runs exactly once per turn after Draw and before Main, replacing ON_TURN_START with ON_UPKEEP trigger moment. Main phase is now a pure waiting state that can be safely re-entered multiple times.

**Changes Made:**

1. **New Upkeep Phase**
   - Added `TurnPhase.Upkeep` to enum
   - Created `src/state/phases/upkeepPhase.ts` with ON_UPKEEP trigger execution
   - Runs once per turn: Draw → Upkeep → Main

2. **Trigger Moment Migration**
   - Added `TriggerMoment.ON_UPKEEP` to replace `ON_TURN_START`
   - Updated "Intrusive Thoughts" card to use ON_UPKEEP
   - Main phase now has no trigger effects (pure waiting state)

3. **Phase Transitions Updated**
   - `drawPhase()`: Now transitions to Upkeep (or End) instead of Main
   - `upkeepPhase()`: Executes ON_UPKEEP effects, then transitions to Main
   - `mainPhase()`: Removed all ON_TURN_START logic (empty handler)

4. **PhaseManager Updated**
   - Added Upkeep handler to PHASE_HANDLERS
   - Turn cycle now: Corp → Draw → Upkeep → Main → Play/Run → End → Corp

**Files Created:**
- `src/state/phases/upkeepPhase.ts` - New upkeep phase handler

**Files Modified:**
- `src/state/turn/types.ts` - Added Upkeep to TurnPhase enum
- `src/cardDefinitions/card.ts` - Added ON_UPKEEP to TriggerMoment enum
- `src/cardDefinitions/playerCards/programs.ts` - Updated Intrusive Thoughts to use ON_UPKEEP
- `src/state/phases/drawPhase.ts` - Transitions to Upkeep instead of Main
- `src/state/phases/mainPhase.ts` - Removed ON_TURN_START logic (now pure waiting state)
- `src/PhaseManager.tsx` - Added Upkeep phase handler
- `src/state/phases/index.ts` - Exported upkeepPhase
- `CLAUDE.md` - Updated all documentation to reflect new architecture

**Benefits Achieved:**
- ✅ Main phase can be re-entered multiple times without side effects
- ✅ Once-per-turn effects (ON_UPKEEP) guaranteed to run exactly once
- ✅ No more "stutter" from unexpected state changes
- ✅ Clean separation: Upkeep = effects, Main = waiting
- ✅ Maintains single-handler pattern without needing subphases

### Session 2025-12-06 (Part 1): Event System Migration

**Major Achievement:** Full event-driven architecture for user actions

1. **Event Bus Infrastructure**
   - Created event bus with emit, subscribe, and history tracking
   - Implemented event handler with centralized validation
   - Added React context provider for event bus access

2. **Pending Actions System**
   - New state module to store runtime data for user-triggered phases
   - Used by phase handlers to read user selections from state
   - Enables PhaseManager to handle all phases uniformly

3. **Phase Migrations**
   - **Play Phase**: Reads card/index from pending state, triggered by PLAYER_PLAY_CARD event
   - **Encounter Phase**: Reads ice ID from pending state, triggered by PLAYER_CLICK_ICE event
   - **Access Phase**: Reads selected card from pending state, triggered by PLAYER_SELECT_ACCESSED_CARD event
   - **End Turn**: Triggered by PLAYER_END_TURN event

4. **UI Component Cleanup**
   - Removed all direct thunk imports from UI components
   - Removed all `useThunk()` usage from UI layer
   - All UI now exclusively uses `useEventBus()` for user actions

**Files Created:**
- `src/state/events/` - Event bus system (eventBus.ts, eventHandler.ts, useEventBus.ts, index.ts)
- `src/state/pending/` - Pending actions module (types.ts, actions.ts, reducer.ts, selectors.ts, index.ts)

**Files Modified:**
- `src/state/phases/playPhase.ts` - Now reads from pending state
- `src/state/phases/encounterPhase.ts` - Now reads from pending state, triggers effects in End
- `src/state/phases/accessPhase.ts` - Now reads from pending state, processes selection in End
- `src/ui/PlayerDashboard/PlayerHand.tsx` - Emits PLAYER_PLAY_CARD event
- `src/ui/IceRow.tsx` - Emits PLAYER_CLICK_ICE event
- `src/ui/Modals.tsx` - Emits PLAYER_SELECT_ACCESSED_CARD event
- `src/ui/PlayerDashboard/PlayerDashboard.tsx` - Emits PLAYER_END_TURN event
- `src/App.tsx` - Initializes event bus and wires event handler

**Benefits Achieved:**
- ✅ Complete UI/logic separation - UI never imports phase thunks
- ✅ Centralized validation - All user actions validated before execution
- ✅ Event logging - Every user action logged in dev mode console
- ✅ Testability - Game logic can be tested without UI rendering
- ✅ Debuggability - Event history available via `eventBus.getHistory()`

### Session 2025-12-05: Phase System & Trigger Moments

**Critical Fixes:**

1. **Main Phase Handler** - Added explicit handler with `ON_TURN_START` trigger execution
2. **Trigger Moment System** - Implemented all 6 missing trigger moments (ON_RUN_START, ON_RUN_END, ON_INSTALL, ON_DISCARD, ON_TRASH; removed ON_REVEAL)
3. **Server Lockdown Card** - Fixed to use ON_ACCESS and TurnPhase.End
4. **Unused Enum Cleanup** - Removed unused TurnPhase values (Start, Fetch, Discard)

**Cards Fixed:**
- **Running Sneakers** - Now properly gains 1 click on run completion
- **Intrusive Thoughts** - Now draws card and loses click at turn start
- **Server Lockdown** - Now works with ON_ACCESS trigger
- **Ethereal/Trash keywords** - Now properly execute trigger effects

**Files Created:**
- `src/state/phases/mainPhase.ts` - Main phase handler

**Utilities Added:**
- `executeCardTriggers()` in cardUtils.ts - Standardized trigger execution helper

## Styling

Tailwind CSS is placed in a separate CSS layer to override Mantine defaults (see `src/index.css`). Dark mode is the default theme with custom colors defined in `src/index.tsx`.

## Code Style

- Double quotes, semicolons, trailing commas
- Arrow parens always required
- Props sorted: shorthand first, callbacks last, alphabetical
- Use `eslint-plugin-perfectionist` for automatic sorting (imports, props, etc.)
- TypeScript strict mode enabled

## Key Dependencies

- **State**: Zustand v5 (with devtools middleware)
- **UI**: Mantine v7 (components), Tailwind CSS v4 (utility styles)
- **Animation**: Framer Motion v12
- **Build**: Vite v6 with React plugin
- **Utilities**: uuid (card IDs), clsx (conditional classes), array-shuffle (deck shuffling)

## Project Structure

```
src/
├── state/              # State management (Zustand + Redux pattern)
│   ├── player/         # Player state module
│   ├── server/         # Server (Corp) state module
│   ├── turn/           # Turn & phase state module
│   ├── board/          # Board state module
│   ├── settings/       # Settings state module
│   ├── phases/         # Complex phase logic (thunks)
│   ├── utils/          # State utilities
│   ├── store.ts        # Zustand store creation
│   ├── reducer.ts      # Root reducer
│   ├── types.ts        # Core types
│   └── hooks.ts        # useThunk hook
├── ui/                 # React components
│   ├── Card/           # Card rendering components
│   ├── PlayerDashboard/
│   └── ...
├── cardDefinitions/    # Card types and definitions
├── decks/              # Deck configurations
├── PhaseManager.tsx    # Phase orchestration
└── App.tsx             # Root component
```

## Development Guidelines

### Adding New State

When adding new state to an existing module:

1. Define types in `types.ts` (state shape, action types enum, action interfaces)
2. Create action creators in `actions.ts`
3. Update reducer in `reducer.ts`
4. Add selectors to `selectors.ts` as needed
5. Export from `index.ts`

### Creating Complex Actions

For multi-step operations that need to:

- Read current state
- Dispatch multiple actions
- Coordinate across state modules

Create a thunk action in `src/state/phases/` or add to an existing phase file.

### Working with Cards

- Use `createPlayingCard()` from `src/cardDefinitions/createPlayingCard.ts` to create card instances
- Each card gets a unique ID via `uuid`
- Card definitions in `src/cardDefinitions/` define static properties
- Card state (location, status) managed in player/server state modules
