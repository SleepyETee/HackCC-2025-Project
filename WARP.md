# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**SpiderCalc** is an educational game that teaches calculus, algebra, and probability through interactive gameplay. It features two main game modes:
1. **Classic Mode**: Probability-based strategic gameplay where students adjust equations and answer math questions to control probability distributions
2. **Adventure Mode**: Story-driven platformer with calculus puzzles, featuring web-swinging physics and platforming challenges

**Tech Stack**: React, TypeScript, Phaser 3 (game engine), Zustand (state management), Matter.js (physics), Vite

## Essential Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build locally
```

### TypeScript
```bash
npx tsc --noEmit     # Type-check without building
npx tsc -b           # Build TypeScript (used in npm run build)
```

**Note**: This project does NOT have lint, test, or typecheck npm scripts configured. Always run `npx tsc --noEmit` manually to verify TypeScript errors before committing changes.

## Architecture Overview

### State Management Architecture

**Central State Store**: `src/state/store.ts` (Zustand)
- Single source of truth for all game state (classic + adventure modes)
- Exposes actions via `useGameStore` hook
- **Critical Pattern**: The store dispatches CustomEvents to communicate with Phaser scenes

**React ↔ Phaser Communication Pattern**:
```typescript
// React → Phaser: Dispatch events
window.dispatchEvent(new CustomEvent('spidercalc-fire'))
window.dispatchEvent(new CustomEvent('spidercalc-update-preview'))
window.dispatchEvent(new CustomEvent('spidercalc-action', { detail: { action, correct } }))

// Phaser → React: Update store directly
import { useGameStore } from '../state/store'
useGameStore.getState().setAnchors(anchors)
```

### Game Mode Architecture

The app has **two completely separate game modes** with different rendering systems:

#### Classic Mode
- **Entry Point**: `src/ui/HalloweenGraphCanvas.tsx` (custom Canvas renderer; not a Phaser scene)
- **Flow**: Adjust equation → Answer question → See probability beams → Fire grapple
- **UI Panels**: `EquationPanel.tsx`, `QuestionPanel.tsx`, `HUD.tsx`, `LevelSelector.tsx`

#### Adventure Mode
Has **two sub-modes**:
1. **Classic Adventure** (`adventureMode: 'classic'`):
   - **Entry Point**: `src/ui/ClassicAdventureCanvas.tsx`
   - **Scenes**: `src/game/MainMenuScene.ts`, `src/game/HalloweenClimbScene.ts`
   - Jump-based progression with calculus-triggered actions
   
2. **Story Adventure** (`adventureMode: 'story'`):
   - **Entry Point**: `src/ui/StoryAdventureCanvas.tsx`
   - React + Phaser implementation of web-swinging (no Matter.js)
   - Scene content and story text via `src/game/adventure.ts` and `src/ui/StoryPanel.tsx`
   - For Matter.js experimentation, see `src/game/TestWebSwingScene.ts` + `src/game/modules/PhysicsWebModule.ts`

### Question Bank System

**Classic Mode Questions**: `src/game/questions.ts`
- Organized by level (0-3+) with progressive difficulty
- Each level has `requiredCurveMode`, `targetPulls`, and question array
- Topics: Limits, derivatives, integrals, chain rule, etc.

**Adventure Mode Scenes & Story**: `src/game/adventure.ts`
- Scene metadata (platforms, anchors, obstacles, goal)
- Chapters organize scenes (Entrance Hall, Integral Library, Chamber of Limits, Throne Room)
- Used by the Story UI (`StoryPanel.tsx`) to render narrative context

**Calculus API**: `src/math/calculusAPI.ts`
- Comprehensive calculus question bank based on standard textbook
- Height-based difficulty progression (0-3000m)
- Used for generating dynamic questions in adventure modes

### Probability System (Classic Mode)

**Core Algorithm**: `src/math/probability.ts`
```typescript
// Probability calculation:
// R_i = α·S_i + β·C_i + γ·F_i + H_i
// where:
//   S_i = structural score (position-based)
//   C_i = correctness modifier (answer-based)
//   F_i = function fit (distance from curve)
//   H_i = hazard penalty (-1.0 for hazards)
// Then softmax(R_i) → probability distribution
```

**Key Functions**:
- `buildProbabilities()`: Generates probability distribution from game state
- `sampleCategorical()`: Samples one anchor from distribution
- `calculateEntropy()`: Measures distribution uncertainty (affects bonus scoring)

### Physics Systems

**Phaser 3 Arcade Physics**: Used in all scenes for basic collision/movement
- Platforms, obstacles, spider body

**Matter.js Integration (experimental)**: Used in the test scene for realistic web-swinging
- **Module**: `src/game/modules/PhysicsWebModule.ts` (used by `TestWebSwingScene.ts`)
- Provides rope constraints, angular physics, and pendulum dynamics
- Initialize Matter AFTER Phaser scene setup when integrating into a scene

## Project Structure Highlights

```
src/
├── game/
│   ├── MainMenuScene.ts          # Menu and mode entry (Phaser)
│   ├── HalloweenClimbScene.ts    # Classic Adventure scene (Phaser)
│   ├── questions.ts              # Classic mode question bank
│   ├── adventure.ts              # Story/chapter metadata for Story mode
│   ├── gameTypes.ts              # Adventure-specific types
│   ├── types.ts                  # Core math types (Anchor, Line)
│   ├── view.ts                   # Graph viewport utilities (classic mode)
│   └── modules/
│       └── PhysicsWebModule.ts   # Matter.js web physics (test scene)
├── math/
│   ├── probability.ts            # Softmax, entropy, sampling
│   ├── functions.ts              # Curve functions (quadratic, sin, exp)
│   └── calculusAPI.ts            # Calculus question generation
├── state/
│   └── store.ts                  # Zustand global state + event dispatch
├── ui/
│   ├── HalloweenGraphCanvas.tsx  # Classic mode canvas renderer (no Phaser)
│   ├── ClassicAdventureCanvas.tsx# Phaser wrapper for menu + climb scene
│   ├── StoryAdventureCanvas.tsx  # React + Phaser story/swinging (no Matter)
│   ├── StoryPanel.tsx            # Story/narrative panel driven by adventure.ts
│   ├── AdventureQuestionPanel.tsx# Adventure questions UI
│   ├── EquationPanel.tsx         # Equation controls (classic)
│   ├── QuestionPanel.tsx         # Classic questions
│   ├── HUD.tsx                   # Score/combo/pulls display
│   └── LevelSelector.tsx         # Level navigation
├── App.tsx
└── main.tsx
```

## Development Guidelines

### Adding New Questions

**Classic Mode** (`src/game/questions.ts`):
```typescript
{
  id: 'unique-id',
  text: 'What is d/dx [x³]?',
  options: [
    { text: 'A) 3x²', correct: true },
    { text: 'B) x²', correct: false },
    // ...
  ],
  hint: 'Use the power rule',
  concept: 'Power Rule'
}
```

**Adventure Mode** (`src/game/adventure.ts`):
```typescript
{
  id: 'unique-id',
  text: 'What is lim(x→2) [3x + 1]?',
  options: [
    { text: 'A) 7', correct: true, action: 'jump' },
    { text: 'B) 6', correct: false, action: 'web' },
    // ...
  ],
  storyContext: 'Story text here',
  concept: 'Limits'
}
```

### Tuning Probability Parameters

Edit `src/math/probability.ts`:
- `alpha`, `beta`, `gamma`: Weights for structural/correctness/curve-fit scores
- Hazard penalty (default: -1.0)
- Entropy calculation for confidence bonus (0-60 points)

### Working with Phaser Scenes

**Scene Lifecycle**:
1. `preload()`: Load assets (textures, audio)
2. `create()`: Initialize game objects, physics, listeners
3. `update()`: Game loop (not heavily used in this project)
4. `shutdown()`: Clean up event listeners

**Important**: Always remove event listeners in `shutdown()` to prevent memory leaks:
```typescript
shutdown() {
  window.removeEventListener('spidercalc-fire', this.onFire)
  window.removeEventListener('spidercalc-update-preview', this.updateLinePreview)
}
```

### React-Phaser Integration Pattern

**Canvas Wrapper Component** (e.g., `HalloweenGraphCanvas.tsx`):
```typescript
useEffect(() => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: parentId,
    scene: MainScene,
    physics: { default: 'arcade' }
  }
  const game = new Phaser.Game(config)
  return () => game.destroy(true)
}, [])
```

**Never initialize multiple Phaser games simultaneously** - destroy previous instances first.

### Matter.js Physics Integration

The `PhysicsWebModule` handles all Matter.js interactions:
- Initialize AFTER Phaser scene is fully created
- Use `createWeb()` to attach rope constraints
- Use `update()` in Phaser's update loop to sync visuals with Matter bodies
- Call `cleanupWeb()` when releasing web

**Common Pitfall**: Initializing Matter.js before Phaser scene setup causes rendering issues.

## Educational Alignment

This game is designed for high school/early college STEM students and aligns with:
- **Common Core**: HSF-IF.A.2, HSF-IF.C.7, HSA-CED.A.3, HSS-MD.A.1, HSS-MD.A.2
- **AP Calculus AB**: Derivatives, limits, function evaluation
- **AP Statistics**: Probability distributions, expected value, entropy

See `docs/TEACHER_GUIDE.md` for detailed classroom implementation strategies.

## Key Files to Understand First

1. `src/state/store.ts` — Global state + event bridge
2. `src/ui/HalloweenGraphCanvas.tsx` — Classic mode gameplay and scoring
3. `src/game/HalloweenClimbScene.ts` — Classic Adventure scene logic
4. `src/game/adventure.ts` + `src/ui/StoryPanel.tsx` — Story metadata and UI
5. `src/math/probability.ts` — Core probability/entropy helpers
6. `src/game/questions.ts` — Classic mode question bank
7. `src/App.tsx` — Mode switching and keyboard handling

## Common Tasks

### Fix TypeScript Errors
```bash
npx tsc --noEmit
# Fix reported errors in the codebase
```

### Add a New Level (Classic Mode)
1. Add level object to `LEVELS` array in `src/game/questions.ts`
2. Include questions array, requiredCurveMode, targetPulls
3. Level will auto-appear in level selector

### Add a New Scene (Adventure Mode)
1. Add scene definition to `ADVENTURE_SCENES` in `src/game/adventure.ts`
2. Add scene ID to appropriate chapter in `ADVENTURE_CHAPTERS`
3. Create questions with `action: 'jump' | 'web'` for that scene

### Debug Probability Distribution
- Check browser console for probability values
- Verify `buildProbabilities()` input parameters
- Use beam visualization (thickness = probability) to debug visually

### Modify Scoring System (Classic Mode)
Edit `src/ui/HalloweenGraphCanvas.tsx` in the `handleFire` flow:
- Safe pumpkin: +30 (regular) / +200 at finish
- Ghost: −50 (regular) / −100 at finish
- Combo: ×1.5 after 3+ correct; entropy affects confidence visuals
