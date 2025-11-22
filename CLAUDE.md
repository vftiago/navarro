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

### State Management (Redux-like pattern with React Context)

- **Root reducer** (`src/state/reducer.ts`) combines 5 sub-reducers: player, server, turn, board, settings
- **Sub-reducers** (`src/state/reducers/`) manage slices of state
- **Thunks** (`src/state/thunks.ts`) for multi-step actions with side effects
- **Selectors** (`src/state/selectors.ts`) extract derived state (use `getXxx` naming)
- **Context** (`src/context/`) provides state via `useGameState()` and `useThunk()` hooks

### Component Structure

- `src/ui/` - Presentational components (Card, PlayerDashboard, IceRow, etc.)
- `src/ui/Card/` - Card rendering with type-specific components (CardFrontIce, CardFrontAgenda)
- `src/ui/PlayerDashboard/` - Player hand and resource management

### Card System

- `src/cardDefinitions/` - Card types, interfaces, and keyword definitions
- `src/cardDefinitions/createPlayingCard.ts` - Factory for creating card instances with unique IDs
- `src/decks/` - Deck definitions

### Game Flow

- `src/PhaseManager.tsx` - Manages turn progression
- Turn phases: Corp, Player (defined in `turnReducer.ts`)
- Modal state managed via Mantine's `useDisclosure()` in App.tsx

## Styling

Tailwind CSS is placed in a separate CSS layer to override Mantine defaults (see `src/index.css`). Dark mode is the default theme with custom colors defined in `src/index.tsx`.

## Code Style

- Double quotes, semicolons, trailing commas
- Arrow parens always required
- Props sorted: shorthand first, callbacks last, alphabetical
