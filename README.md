
# 🕷️ SpiderCalc

An educational game that teaches calculus, algebra, and probability through interactive gameplay. Built with React, TypeScript, Phaser 3, Zustand, and Vite.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3-blueviolet)](https://phaser.io/)

---

## Overview

SpiderCalc has two distinct game modes:

- **Classic Mode**: Probability-based strategic gameplay on a graph canvas
- **Adventure Mode**: Story-driven platformer with calculus puzzles (two sub-modes)

Educational alignment: Common Core (HSF-IF, HSA-CED, HSS-MD), AP Calculus AB (limits, derivatives, integrals), AP Statistics (distributions, entropy).

---

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)

# Optional
npm run build        # Production build
npm run preview      # Preview production build

# Type-check (noEmit)
npx tsc --noEmit
```

Notes:
- No lint/test scripts are configured; run TypeScript checks manually.
- Env overrides (optional): VITE_DEFAULT_MODE=classic|adventure, VITE_DEFAULT_ADVENTURE_MODE=classic|story

---

## Game Modes

### Classic Mode (Graph + Probability)
- Flow: Adjust equation → Answer question → See probability beams → Fire grapple
- Equation controls: line y = mx + b or preset curves (quadratic x², sin x, exp)
- Probability beams: thickness/brightness = probability of grappling to an anchor
- Scoring (as implemented):
  - Regular pumpkin + correct: +30
  - Regular ghost: −50
  - Finish-line pumpkin + correct: +200
  - Finish-line ghost: −100
  - Wrong on pumpkin: 0, combo resets; correct increments combo
- Calculus visuals: optional derivative tangent marker and integral area preview toggles

Entry: `src/ui/HalloweenGraphCanvas.tsx`

### Adventure Mode (Phaser Platformer)
Two sub-modes:
- **Classic Adventure**: Phaser scene with vertical progression and calculus-triggered actions
  - Entry: `src/ui/ClassicAdventureCanvas.tsx`
  - Scene: `src/game/HalloweenClimbScene.ts`
  - **50+ calculus questions** across 0-500m height range
- **Story Adventure**: React + Phaser story scenes and web-swinging
  - Entry: `src/ui/StoryAdventureCanvas.tsx`
  - Story data/UI: `src/game/adventure.ts`, `src/ui/StoryPanel.tsx`

---

## Architecture

### State Management (Zustand)
Single global store in `src/state/store.ts` exposed via `useGameStore`. React ↔ Phaser bridge is event-based:

- **React → Phaser**: dispatch CustomEvents
  - `spidercalc-fire`
  - `spidercalc-update-preview`
  - `spidercalc-action` (detail: { action: 'jump'|'web', correct: boolean })
- **Phaser → React**: write to store directly (`useGameStore.getState().setAnchors(...)`, etc.)

### Project Structure

```
src/
├── game/
│   ├── MainMenuScene.ts          # Main menu with spider mascot
│   ├── HalloweenClimbScene.ts    # Classic Adventure gameplay
│   ├── AdventureScene.ts         # Story Adventure (unused)
│   ├── AudioManager.ts           # Centralized audio management
│   ├── questions.ts              # Classic mode questions
│   ├── adventure.ts              # Story Adventure data
│   ├── gameTypes.ts              # Type definitions
│   ├── types.ts                  # Shared types
│   └── view.ts                   # Canvas view utilities
├── math/
│   ├── probability.ts            # Probability calculations
│   ├── functions.ts              # Mathematical functions
│   └── calculusAPI.ts            # 50+ calculus questions (0-500m)
├── state/
│   └── store.ts                  # Zustand store
├── ui/
│   ├── HalloweenGraphCanvas.tsx  # Classic mode canvas
│   ├── ClassicAdventureCanvas.tsx # Classic Adventure wrapper
│   ├── StoryAdventureCanvas.tsx  # Story Adventure wrapper
│   ├── StoryPanel.tsx            # Quest/mission panel
│   ├── AdventureQuestionPanel.tsx # Adventure question UI
│   ├── EquationPanel.tsx         # Equation controls
│   ├── QuestionPanel.tsx         # Question display
│   ├── HUD.tsx                   # Heads-up display
│   └── LevelSelector.tsx         # Level selection
├── App.tsx                       # Main app component
└── main.tsx                      # Entry point
```

---

## Features

- **Visual probability beams** with softmax-based sampling
- **Level-based question banks** and height-based difficulty scaling
- **Story chapters**, platforming, and web points (Adventure)
- **Derivative and integral visual aids** (Classic)
- **Responsive canvas**, zoom/pan, and themed effects
- **50+ calculus questions** covering limits, derivatives, and integrals
- **Halloween-themed UI** with spider mascot and spooky effects
- **Audio system** with background music and sound effects

---

## Core Modules and Functions

### Global Store — `src/state/store.ts`
State slices:
- **Game mode**: `gameMode` ('classic'|'adventure'), `adventureMode` ('classic'|'story')
- **Classic**: line {m,b}, curveFunc (or null), curveMode ('line'|'quadratic'|'sin'|'exp'), selectedAnswer, answerCorrect, anchors, score, combo, pullsRemaining, currentLevel, currentQuestion, usedQuestionIds
- **Adventure**: currentSceneId, currentAdventureQuestion, adventureAction, adventureLives, adventureScore

Actions:
- `setGameMode(mode)`, `setAdventureMode(mode)`
- `setLine(m,b)`, `setCurveMode(mode)`
- `setAnswer(i, correct)`, `resetAnswer()`
- `setAnchors(a)`
- `addScore(n)`, `incrementCombo()`, `resetCombo()`
- `decrementPulls()`, `resetPulls(n)`
- `setLevel(n)`, `setCurrentQuestion(q)`, `addUsedQuestionId(id)`, `resetUsedQuestions()`
- `setCurrentSceneId(id)`, `setCurrentAdventureQuestion(q)`
- `setAdventureAction(action, correct)` → dispatches spidercalc-action
- `setAdventureLives(l)`, `addAdventureScore(points)`

### Probability — `src/math/probability.ts`
- `softmax(scores: number[]): number[]` — numerically stable softmax
- `sampleCategorical(p: number[]): number` — categorical sample index
- `calculateEntropy(p: number[]): number` — Shannon entropy (bits)
- `calculateConfidenceBonus(p: number[]): number` — maps low entropy to 0–60 bonus
- `buildProbabilities({ anchors, answerCorrect, line?, f? }): number[]` — computes anchor probabilities given structural score, correctness under line/curve, fit to f(x), and hazard penalty

### Curves — `src/math/functions.ts`
- `fx.x2(x): x²`
- `fx.sin(x): sin(x)`
- `fx.exp(x): e^x`

### Calculus API — `src/math/calculusAPI.ts`
- **Types**: `CalculusQuestion`, `CalculusTopic`, `DifficultyLevel`
- **Data**: `CALCULUS_CHAPTERS` (height ranges), `CALCULUS_QUESTION_BANK` (50+ questions)
- `getQuestionByHeight(height): CalculusQuestion` — weighted selection by height & difficulty
- `getChapterByHeight(height): { name, description }`
- `getDifficultyMultiplier(height): number` (1→3x across 0–3000m)

**Question Distribution (0-500m):**
- **0-100m**: 10 questions (direct substitution, basic limits)
- **100-200m**: 10 questions (polynomial limits, cubic functions)
- **200-300m**: 10 questions (radical functions, perfect squares)
- **300-400m**: 10 questions (factoring, difference of cubes, trigonometric limits)
- **400-500m**: 10 questions (advanced factoring, rational functions)

### Classic Questions — `src/game/questions.ts`
- **Types**: `Question`, `Level`
- **Data**: `LEVELS` — 10 rounds with progressive topics and curve modes
- `getRandomQuestion(levelId, excludeIds?): Question | null`
- `getLevel(levelId): Level | null`

### Classic Mode Canvas — `src/ui/HalloweenGraphCanvas.tsx`
Key responsibilities:
- Draw grid, axes, equation/curve, anchors, bats, finish line
- Compute scores per anchor and visualize probability beams
- Handle grapple firing (`spidercalc-fire`) and jump animation
- Victory/failure modals and level progression
- Calculus toggles: derivative tangent, integral area (Riemann sum)

### Adventure Scene — `src/game/HalloweenClimbScene.ts`
Highlights:
- Preload assets and create themed background, moon, bats, trees
- Generate pumpkin platforms with labels; spider animations and effects
- Request questions via `getQuestionByHeight()` and show feedback
- Listen for `spidercalc-action { correct }` to jump/fall between pumpkins
- Lives, score, height tracking, victory/game over logic
- **Enhanced randomization** to prevent repetitive questions

### Audio Management — `src/game/AudioManager.ts`
- Centralized audio system for background music and sound effects
- Prevents multiple instances of the same audio
- Manages victory sounds, projectile sounds, and background music
- Audio files organized in `public/sounds/`

---

## React ↔ Phaser Events

- `spidercalc-update-preview` — refresh line/curve preview
- `spidercalc-fire` — Classic: trigger probability sample + jump
- `spidercalc-action` — Adventure: perform 'jump'|'web' based on correctness

Always remove listeners in scene `shutdown()`: `window.removeEventListener(...)`.

---

## Asset Organization

### Images (`public/images/`)
- `goldenbug.png` - Victory animation
- `confetti.gif` - Victory celebration
- `trophy.gif` - Achievement display
- `explosion.gif` - Game over effects
- `spider web.jpg`, `web 2.jpg` - Main menu decorations
- `claw mark-Photoroom.png` - UI decorations
- `scene-ch*-s*-background.png` - Story Adventure backgrounds

### Audio (`public/sounds/`)
- `horror-halloween-dark-piano-film-video-background-cinematic-257663.mp3` - Background music
- `winners_W9Cpenj.mp3` - Victory sound
- `umgah-backzip.mp3` - Projectile sound
- `punch-gaming-sound-effect-hd_RzlG1GE.mp3` - Action sounds
- `dry-fart.mp3` - Game over sound

---

## Extending the Game

- **Add Classic Questions**: edit `src/game/questions.ts` (`LEVELS` array)
- **Add Adventure Scenes**: add to `ADVENTURE_SCENES` and chapters in `src/game/adventure.ts`
- **Add Calculus Questions**: edit `src/math/calculusAPI.ts` (`CALCULUS_QUESTION_BANK`)
- **Tune Probability**: adjust weights/penalties in `src/math/probability.ts`

---

## Development Tips

- **Type-check before commits**: `npx tsc --noEmit`
- **Only one Phaser.Game at a time**; destroy instances when unmounting
- **Keep UI responsive**; use `devicePixelRatio` for crisp canvas rendering
- **Asset management**: All assets go in `public/` and are copied to `dist/` during build
- **Question randomization**: Enhanced with shuffling and timestamp-based variation

---

## Recent Updates

- ✅ **Added 50+ calculus questions** for 0-500m height range
- ✅ **Fixed duplicate question IDs** and missing concept fields
- ✅ **Enhanced question randomization** to prevent repetition
- ✅ **Centralized audio management** to prevent overlapping sounds
- ✅ **Organized assets** into `public/images/` and `public/sounds/`
- ✅ **Fixed React component re-mounting** issues in Adventure mode
- ✅ **Improved game over detection** and state management

---

## License

Specify your license here (e.g., MIT).
