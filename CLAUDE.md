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
