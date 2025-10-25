# 📁 Spider-Calc Project Structure

## ✅ Clean & Organized Project

### **Root Directory:**
```
/Users/sleepyet/Downloads/spidercalc/
├── 📁 docs/                        # All documentation
│   ├── 3D_AUDIO_INTEGRATION.md
│   ├── ADVENTURE_MODE_SUMMARY.md
│   ├── CALCULUS_API_INTEGRATION.md
│   ├── COMPLETE_GAME_READY.md
│   ├── FINAL_FIXES.md
│   ├── GAMEPLAY_SUMMARY.md
│   ├── HALLOWEEN_SCENE_DESIGN.md
│   ├── HALLOWEEN_THEME_UPDATE.md
│   ├── HOW_TO_PLAY.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── MENU_IMPLEMENTATION.md
│   ├── SIMPLIFIED_GAME_LOGIC.md
│   └── TEACHER_GUIDE.md
│
├── 📁 public/                      # Static assets
│   ├── explosion.gif               # Game over animation
│   └── horror-halloween-dark-piano-film-video-background-cinematic-257663.mp3
│
├── 📁 src/                         # Source code
│   ├── 📁 game/                    # Game logic & scenes
│   │   ├── AudioManager.ts         # Sound system
│   │   ├── config.ts               # Game configuration
│   │   ├── gameTypes.ts            # Type definitions
│   │   ├── HalloweenClimbScene.ts  # Main game scene ⭐
│   │   ├── MainMenuScene.ts        # Menu scene ⭐
│   │   ├── MainScene.ts            # Classic mode scene
│   │   ├── questions.ts            # Classic mode questions
│   │   └── types.ts                # Game types
│   │
│   ├── 📁 math/                    # Math & calculus logic
│   │   ├── calculusAPI.ts          # Question database ⭐
│   │   ├── functions.ts            # Mathematical functions
│   │   └── probability.ts          # Probability calculations
│   │
│   ├── 📁 state/                   # State management
│   │   └── store.ts                # Zustand store ⭐
│   │
│   ├── 📁 ui/                      # React UI components
│   │   ├── AdventureCanvas.tsx     # Game canvas wrapper ⭐
│   │   ├── AdventureQuestionPanel.tsx  # Question panel ⭐
│   │   ├── EquationPanel.tsx       # Classic mode panel
│   │   ├── GraphCanvas.tsx         # Classic mode canvas
│   │   ├── HalloweenGraphCanvas.tsx # Classic mode canvas
│   │   ├── HUD.tsx                 # Heads-up display
│   │   ├── LevelSelector.tsx       # Classic mode selector
│   │   ├── QuestionPanel.tsx       # Classic mode questions
│   │   └── StoryPanel.tsx          # Adventure story panel ⭐
│   │
│   ├── App.tsx                     # Main React app ⭐
│   ├── main.tsx                    # Entry point
│   └── styles.css                  # Global styles
│
├── 📁 dist/                        # Build output
├── 📁 node_modules/                # Dependencies
├── index.html                      # HTML entry
├── package.json                    # Dependencies
├── README.md                       # Main documentation
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
└── functions_grouped.json          # Function data
```

**⭐ = Core files for adventure mode**

---

## 🎮 Active Game Files

### **Currently Used (Adventure Mode):**

1. **`src/game/MainMenuScene.ts`** (360 lines)
   - Menu screen with SPIDER-CALC title
   - Play button
   - Spider mascot
   - Audio initialization

2. **`src/game/HalloweenClimbScene.ts`** (1060 lines)
   - Main gameplay scene
   - Halloween outdoor setting
   - 3D pumpkins
   - Realistic spider
   - Jump/fall mechanics
   - Explosion game over

3. **`src/game/AudioManager.ts`** (130 lines)
   - Background music
   - Sound effects (5 types)
   - Volume control

4. **`src/math/calculusAPI.ts`** (400 lines)
   - 17 progressive calculus questions
   - Height-based difficulty
   - Chapter system

5. **`src/game/gameTypes.ts`** (15 lines)
   - Type definitions

6. **`src/ui/AdventureCanvas.tsx`** (45 lines)
   - Phaser game container

7. **`src/ui/AdventureQuestionPanel.tsx`** (150 lines)
   - Question display

8. **`src/ui/StoryPanel.tsx`** (120 lines)
   - Story/mission display

9. **`src/state/store.ts`** (110 lines)
   - Game state management

10. **`src/App.tsx`** (230 lines)
    - Main app with mode switcher

---

## 🗑️ Cleaned Up Files

**Removed (unused):**
- ❌ `src/game/AdventureScene.ts` - Old horizontal platformer
- ❌ `src/game/ClimbGameScene.ts` - Old simplified version
- ❌ `src/game/VerticalClimbScene.ts` - Old complex physics version
- ❌ `src/game/adventure.ts` - Old story structure

**Moved to docs/:**
- ✅ All `.md` documentation files
- ✅ Cleaner root directory
- ✅ Easy to find docs

---

## 📦 Dependencies

### **Installed:**
```json
{
  "dependencies": {
    "phaser": "^3.80.0",      // Game engine
    "react": "^18.3.1",       // UI framework
    "react-dom": "^18.3.1",   // React DOM
    "zustand": "^4.5.2",      // State management
    "three": "^0.x.x",        // 3D graphics (ready for enhancements)
    "@types/three": "^0.x.x"  // TypeScript support
  }
}
```

---

## 🎯 File Purpose Guide

### **Game Logic:**
- `MainMenuScene.ts` → Menu screen
- `HalloweenClimbScene.ts` → Main game
- `AudioManager.ts` → Sound system
- `gameTypes.ts` → Type definitions

### **Math & Questions:**
- `calculusAPI.ts` → Question bank
- `probability.ts` → Classic mode math
- `functions.ts` → Classic mode math

### **UI Components:**
- `AdventureCanvas.tsx` → Phaser wrapper
- `AdventureQuestionPanel.tsx` → Question UI
- `StoryPanel.tsx` → Story UI
- `App.tsx` → Main app

### **Classic Mode (Still Available):**
- `MainScene.ts` → Classic game
- `questions.ts` → Classic questions
- Other UI components

---

## 🚀 Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build
```

---

## 📊 Project Stats

- **Total Files:** ~30
- **Core Game Files:** 10
- **Documentation:** 14 files
- **Lines of Code:** ~3,000+
- **Build Size:** 1.7MB
- **Build Time:** ~4 seconds

---

## ✅ What's Working

- ✅ Main menu with SPIDER-CALC title
- ✅ Halloween outdoor scene
- ✅ 3D visual effects
- ✅ Background music
- ✅ Sound effects
- ✅ Explosion game over
- ✅ Progressive calculus questions
- ✅ Clear game logic
- ✅ Lives system
- ✅ Score tracking
- ✅ Mode switcher (Classic/Adventure)

---

## 📝 Git Status

**Branch:** Long-branch  
**Commits:** 3 previous commits  
**Unstaged changes:** All new features  
**Ready to commit:** Yes (when you approve)

---

**Status:** ✅ CLEAN & ORGANIZED  
**Build:** ✅ SUCCESSFUL  
**Ready:** 🎮 TEST NOW!

Run `npm run dev` to play! 🕷️🎃

