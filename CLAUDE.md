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
- `reducer.ts` - Root reducer that combines 5 sub-reducers using type guards
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

- `playPhase.ts`, `runPhase.ts`, `encounterPhase.ts`, etc.
- Each exports thunk functions that coordinate multiple actions and state changes
- Use via `useThunk()` hook or direct `dispatch` with `getGameState`

**Utilities** (`src/state/utils/`):

- `cardUtils.ts` - Card manipulation helpers
- `deckUtils.ts` - Deck management utilities

**Usage Patterns**:

- **Access state**: `useGameStore((state) => state.playerState)` or use specific selectors
- **Dispatch actions**: `const dispatch = useGameStore((state) => state.dispatch); dispatch(actionCreator())`
- **Dispatch thunks**: `const dispatchThunk = useThunk(); dispatchThunk(thunkAction)`
- **Granular subscriptions**: Use targeted selectors to prevent unnecessary re-renders

### Component Structure

- `src/ui/` - Presentational components (Card, PlayerDashboard, IceRow, etc.)
- `src/ui/Card/` - Card rendering with type-specific components (CardFrontIce, CardFrontAgenda)
- `src/ui/PlayerDashboard/` - Player hand and resource management

### Card System

- `src/cardDefinitions/` - Card types, interfaces, and keyword definitions
- `src/cardDefinitions/createPlayingCard.ts` - Factory for creating card instances with unique IDs
- `src/decks/` - Deck definitions

### Game Flow

- `src/PhaseManager.tsx` - Coordinates turn progression by dispatching phase thunks
- Turn phases defined in `src/state/turn/types.ts` (Draw, Play, Run, Encounter, Access, End, Corp)
- Phase logic implemented in `src/state/phases/` (start/process/end functions for each phase)
- Modal state managed via Mantine's `useDisclosure()` in App.tsx

## Turn Structure & Phase Flow

### Phase Architecture

Each turn follows a structured phase progression. Phases are managed by `PhaseManager.tsx` which watches `phaseChangeCounter` and dispatches the appropriate thunk based on the current phase/subphase combination.

**Subphase Pattern**: Most phases follow a three-part subphase structure:

- **Start**: Initialize phase state, set up conditions
- **Process**: Execute main phase logic, trigger card effects
- **End**: Clean up, determine next phase transition

### Complete Turn Cycle

```
Corp Phase (Turn End) → Draw Phase → Main Phase → Play/Run/Access Phases → End Phase → Corp Phase (loop)
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

- **Start**:
  - Reset player clicks to `playerClicksPerTurn`
  - Draw `playerCardsPerTurn` cards
- **Process**:
  - Execute `ON_DRAW` trigger effects for all cards in hand
- **End**:
  - If clicks > 0: transition to **Main** phase
  - If clicks = 0: transition to End phase

#### 3. Main Phase

- **Start**:
  - Execute `ON_TURN_START` trigger effects on all installed programs
  - Enter waiting state for player input
- **No Process/End**: Main phase persists until player takes action:
  - Play cards from hand (transitions to Play phase)
  - Initiate runs (transitions to Run phase)
  - End turn manually (transitions to End phase)

UI components check for `TurnPhase.Main` to enable/disable player actions (see src/ui/PlayerDashboard/PlayerDashboard.tsx:48)

#### 4. Play Phase

- **Start**: MISSING in PhaseManager (no handler defined)
  - Triggered manually by `startPlayPhase(card, index)` thunk
  - Deducts 1 click
  - Removes card from hand, adds to played cards area
- **Process**:
  - Execute `ON_PLAY` trigger effects for all played cards
- **End**:
  - Move cards to appropriate zones (with trigger execution):
    - Programs → Execute `ON_INSTALL` triggers, then add to `playerPrograms`
    - Cards with `Trash` keyword → Execute `ON_TRASH` triggers, then add to `playerTrash`
    - Others → Execute `ON_DISCARD` triggers, then add to `playerDiscard`
  - Clear played cards area
  - If `turnNextPhase` is set: go to that phase (e.g., Run)
  - Else if clicks > 0: return to Main phase
  - Else: go to End phase

#### 5. Run Phase

- **Start**:
  - Execute `ON_RUN_START` trigger effects on all installed programs
  - Initialize `serverUnencounteredIce` with all installed Ice (innermost to outermost)
- **Process**:
  - If unencountered Ice exists: transition to Encounter phase
  - If no Ice: transition to Access phase
- **End**:
  - Execute `ON_RUN_END` trigger effects on all installed programs
  - Reset subphase and transition to next phase

#### 6. Encounter Phase

- **Start**:
  - Set first unencountered Ice as `serverCurrentEncounteredIce`
- **Process**:
  - Wait for user interaction (UI-driven)
  - User clicks Ice card → triggers `triggerEncounterEffects()` thunk
  - Executes `ON_ENCOUNTER` effects on the encountered Ice
- **End**: Empty handler in PhaseManager (triggered by user click)
  - Manually called via `endEncounterPhase()` thunk:
    - Remove encountered Ice from unencountered list
    - Clear `serverCurrentEncounteredIce`
    - If more Ice exists: loop back to Encounter phase Start
    - If no more Ice: transition to Access phase

#### 7. Access Phase

- **Start**:
  - Generate 3 random server cards
  - Add to `playerAccessedCards`
- **Process**:
  - Execute `ON_ACCESS` trigger effects for all accessed cards
- **End**: Empty handler in PhaseManager (triggered by modal dismiss in App.tsx:54)
  - Manually called via `endAccessPhase()` thunk:
    - Player selects one card via `selectAccessedCard(card)`:
      - Triggers `ON_FETCH` effects
      - Agendas → `playerScoreArea`
      - Others → `playerDiscard`
    - Clear accessed cards
    - If clicks > 0: return to Main phase
    - Else: go to End phase

#### 8. End Phase

- **Start**: Set phase to End
- **Process**:
  - Discard entire hand
- **End**:
  - Transition to Corp phase (starts next turn cycle)

### Phase Transition Triggers

**Automatic Transitions** (handled by PhaseManager):

- Corp → Draw → Main (based on clicks)
- Draw/Play/Access → Main or End (based on remaining clicks)
- End → Corp (turn cycle)
- Run → Encounter or Access (based on Ice presence)
- Encounter → Encounter (loop) or Access (when Ice exhausted)

**Manual Transitions** (UI-driven):

- Main → Play (player plays card)
- Main → Run (player clicks Run button)
- Encounter progression (player clicks Ice card)
- Access completion (player selects card in modal)

**Card-Driven Transitions**:

- Play phase can set `turnNextPhase` (e.g., Run card sets next phase to Run)

## Trigger Moment Compendium

Card effects trigger at specific moments during gameplay. Each `CardEffect` has a `triggerMoment` property that determines when it executes.

### Active Trigger Moments

These triggers are actively executed in phase implementations:

#### `ON_TURN_START`

**When**: Main phase Start subphase (src/state/phases/mainPhase.ts:24)
**Executed on**: All installed programs in `playerInstalledPrograms`
**Example**: "Intrusive Thoughts" - draws 1 card and loses 1 click at turn start

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

1. **Subphase Pattern Violations**

   - Play phase: No Start handler in PhaseManager (line 83-86), started manually via thunk
   - Access/Encounter: Empty End handlers (user-triggered instead of automatic)
   - Inconsistent with other phases that follow Start → Process → End pattern
   - **Impact**: Confusing control flow, harder to maintain

2. **Modal-Phase Coupling** (App.tsx:52-55)

   - Card display modal closing directly calls `endAccessPhase()`
   - Tight coupling between UI state and game state
   - **Impact**: Difficult to test, breaks separation of concerns

3. **Copy-Paste Error** (cardDefinitions/serverCards/ice.ts:100)
   - Fire Wall error message says "Bad Moon"
   - **Impact**: Confusing error messages for developers

### Redundancies

_All redundancies have been cleaned up. Unused TurnPhase enum values (Start, Fetch, Discard) have been removed._

## Points for Improvement

### High Priority

1. **Standardize Subphase Pattern**

   - Document which phases use automatic vs manual transitions
   - Consider creating base phase classes/utilities for common patterns
   - Add runtime validation for phase/subphase combinations

2. **Decouple UI from Phase Logic**

   - Move modal-triggered phase transitions to dedicated handlers
   - Use events/callbacks instead of direct thunk calls from components
   - Makes game logic testable independent of UI

3. **Add Phase Validation**

   - Runtime checks for undefined phase handlers
   - TypeScript exhaustiveness checking on phase switches
   - Development-mode warnings for unused trigger moments

4. **Consolidate Phase Transition Logic**
   - Many phases have identical "check clicks → Main or End" logic
   - Extract to shared utility function
   - Reduces duplication in drawPhase.ts:47, playPhase.ts:63, accessPhase.ts:94

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

## Recently Completed (Session 2025-12-05)

### Critical Fixes

1. **Main Phase Handler** - Added explicit handler with `ON_TURN_START` trigger execution
2. **Trigger Moment System** - Implemented all 6 missing trigger moments (ON_RUN_START, ON_RUN_END, ON_INSTALL, ON_DISCARD, ON_TRASH; removed ON_REVEAL)
3. **Server Lockdown Card** - Fixed to use ON_ACCESS and TurnPhase.End
4. **Unused Enum Cleanup** - Removed unused TurnPhase values (Start, Fetch, Discard)

### Cards Fixed

- **Running Sneakers** - Now properly gains 1 click on run completion
- **Intrusive Thoughts** - Now draws card and loses click at turn start
- **Server Lockdown** - Now works with ON_ACCESS trigger
- **Ethereal/Trash keywords** - Now properly execute trigger effects

### Files Created

- `src/state/phases/mainPhase.ts` - Main phase handler

### Files Modified

- `src/state/turn/types.ts` - Removed unused TurnPhase enum values, alphabetized remaining values

### Utilities Added

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
