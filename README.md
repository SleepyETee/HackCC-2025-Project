
# 🕷️ SpiderCalc: Grapple of Probability

**A fast, visual way to *feel* math.**

An interactive educational game that teaches algebra, calculus, and probability through strategic gameplay. Built for high school and early college STEM learners.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3.80-blueviolet)](https://phaser.io/)

---

## 🎮 What is SpiderCalc?

**SpiderCalc now features TWO exciting game modes:**

### 🎮 Adventure Mode (NEW!)
Embark on **"The Calculus Chronicles"** - a story-driven platformer adventure! You are a brave spider mathematician navigating through the Haunted Mansion of Functions to recover the legendary Derivative Crown.

- **Story-driven gameplay** with 7 unique scenes across 4 chapters
- **Answer calculus questions** to control your spider's actions:
  - 🦘 **Jump questions** make the spider leap forward
  - 🕸️ **Web questions** make the spider shoot web and swing
- **Correct answers** = More powerful actions!
- **Platformer physics** with real gravity, jumps, and web swinging
- **Educational narrative** that makes calculus concepts feel like part of an epic quest

### 📊 Classic Mode (Original)
The strategic probability-based gameplay:
1. ✏️ **Adjust an equation** (line or curve) to control which anchors are reachable
2. 📝 **Answer a math question** that reshapes a probability field over visible targets
3. 🎯 **Fire a grapple** — your web samples one anchor based on the probability distribution

**Correct reasoning concentrates the distribution on safe, forward anchors. Mistakes bias toward hazards and detours.**

Complete each level in the target number of pulls. Build combos, maximize scores, and master functions, derivatives, inequalities, and probability intuition!

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production
```bash
npm run build
npm run preview  # Preview the production build
```

Deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.

---

## 🎓 Educational Features

### Learning Outcomes
- **LO1:** Linear functions, slopes, intercepts, and inequalities (y ≤ mx + b)
- **LO2:** Function recognition (quadratic, sinusoidal, exponential) and evaluation
- **LO3:** Derivatives (f'(x) as tangent slope) and integral intuition
- **LO4:** Probability distributions, entropy, expected value, and strategic decision-making

### Standards Alignment
- Common Core: HSF-IF.A.2, HSF-IF.C.7, HSA-CED.A.3, HSS-MD.A.1, HSS-MD.A.2
- AP Calculus AB: Derivatives, function evaluation
- AP Statistics: Probability distributions, expected value

See **[TEACHER_GUIDE.md](./TEACHER_GUIDE.md)** for detailed classroom implementation strategies, assessment ideas, and concept breakdowns.

---

## 🎯 How to Play

### Controls
- **Mouse:** Click sliders, buttons, and answer choices
- **Keyboard:**
  - `1-4` keys to select answers (A, B, C, D)
  - `Space` or `Enter` to fire grapple

### Game Flow
1. **Select a Level:** Tutorial → Level 1 → Level 2 → Level 3
2. **Adjust Equation:** Use sliders (for lines) or select a curve mode
   - **Line Mode:** y = mx + b (adjust slope and intercept)
   - **Curve Modes:** Quadratic (x²), Sinusoidal (sin x), Exponential (eˣ)
3. **Watch Preview:** See your equation/curve drawn on the canvas in real-time
4. **Answer Question:** Choose one of four multiple-choice options
   - Correct answers boost safe anchors under/near your equation
   - Wrong answers penalize safe anchors and may favor hazards
5. **Observe Beams:** Probability distribution visualized as colored beams
   - Thickness/brightness = probability weight
   - Cyan beams = safe anchors
   - Red beams = hazard anchors
6. **Fire:** Press the Fire button (or Space) to sample one anchor and grapple to it
7. **Score & Progress:** Earn points, build combos, and advance through pulls

### Scoring System
- **Base:** +100 (safe) or -100 (hazard)
- **Progress Bonus:** +0 to +80 based on forward distance
- **Correctness Bonus:** +150 for correct answers
- **Confidence Bonus:** +0 to +60 (based on low entropy = concentrated distribution)
- **Combo Multiplier:** ×1.5 after 3+ correct answers in a row

---

## 📚 Levels

### Tutorial: Linear Basics (5 pulls)
**Concepts:** Slope calculation, intercept, linear inequalities  
**Curve Mode:** Line  
**Questions:** Basic slope/intercept problems, inequality tests

### Level 1: Linear Launch (4 pulls)
**Concepts:** Lines from two points, inequality gating, probability mechanics  
**Curve Mode:** Line  
**Questions:** Find line equations, predict anchor eligibility

### Level 2: Curve Fit (4 pulls)
**Concepts:** Quadratic evaluation, derivatives (f'(x)), function recognition  
**Curve Mode:** Quadratic (x²)  
**Questions:** f(3)=?, f'(1)=?, match parabola to function

### Level 3: Risk & Reward (3 pulls)
**Concepts:** Entropy/uncertainty, expected value, strategic thinking  
**Curve Mode:** Line (with advanced strategy)  
**Questions:** Entropy meaning, expected progress, combo mechanics

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React** | UI components, state management hooks |
| **Phaser 3** | Canvas-based game engine (anchors, beams, animations) |
| **TypeScript** | Type-safe development |
| **Zustand** | Lightweight state management (scores, levels, questions) |
| **Vite** | Fast build tool and dev server |

### Project Structure
```
src/
├── game/
│   ├── MainScene.ts       # Phaser scene: anchors, beams, grapple logic
│   ├── config.ts          # Phaser game configuration
│   ├── types.ts           # Anchor, Line type definitions
│   └── questions.ts       # Question bank, level definitions
├── math/
│   ├── probability.ts     # Softmax, entropy, sampling
│   └── functions.ts       # Curve functions (x², sin, exp)
├── state/
│   └── store.ts           # Zustand store (global game state)
├── ui/
│   ├── HUD.tsx            # Score, combo, pulls, fire button
│   ├── EquationPanel.tsx  # Equation controls (sliders, curve selector)
│   ├── QuestionPanel.tsx  # MCQ display, answer selection
│   └── LevelSelector.tsx  # Level navigation
├── App.tsx                # Main app component, keyboard handling
├── main.tsx               # Entry point
└── styles.css             # Global styles
```

---

## 🎨 Design Highlights

### Visual Feedback
- **Line/Curve Preview:** Real-time visualization of your equation on the canvas
- **Probability Beams:** Thicker/brighter beams = higher probability
- **Anchor Animations:** Pulsing hazards (red), glowing safe anchors (cyan)
- **Impact Effects:** Ripple effect on anchor hit
- **Rope Rendering:** Dynamic rope drawn during grapple motion

### Accessibility
- ✅ High contrast colors (cyan/red with brightness cues)
- ✅ Keyboard-only play supported
- ✅ Large fonts and clear button states
- ✅ Not reliant on color alone (beams have width/alpha variation)

---

## 🔬 Math Deep Dive

### Probability Model
Each anchor `i` gets a score:
```
R_i = α·S_i + β·C_i + γ·F_i + H_i
```
- **S_i:** Structural progress (0 to 1, based on x-position)
- **C_i:** Correctness modifier (big + if correct & under line; − if wrong)
- **F_i:** Function fit (−|y − f(x)| for curve modes)
- **H_i:** Hazard penalty (−1.0 for hazards)

Then **softmax** converts scores to probabilities:
```
p_i = exp(R_i − max_R) / Σ_j exp(R_j − max_R)
```

Finally, **sample** one anchor from the categorical distribution `{p_i}`.

### Entropy & Confidence Bonus
Entropy measures uncertainty:
```
H = −Σ(p_i · log₂ p_i)
```
Lower entropy (more concentrated distribution) earns a higher confidence bonus (0–60 points).

---

## 🧪 Development

### Commands
```bash
npm run dev       # Start dev server with hot reload
npm run build     # Compile TypeScript and build for production
npm run preview   # Preview production build locally
```

### Adding Questions
Edit `src/game/questions.ts`:
```typescript
{
  id: 'unique-id',
  text: 'What is 2 + 2?',
  options: [
    { text: 'A) 4', correct: true },
    { text: 'B) 5', correct: false },
    // ...
  ],
  hint: 'Optional hint text',
  concept: 'addition'
}
```

### Tuning Parameters
Adjust in `src/math/probability.ts`:
- `alpha`, `beta`, `gamma`: Weights for structural/correctness/fit
- Hazard penalty
- Entropy formula for confidence bonus

---

## 🏆 Future Enhancements

- 🎵 Sound effects (grapple zip, correct ping, hazard buzz)
- 📊 Results screen with star ratings (⭐⭐⭐) per level
- 🎓 More levels (exponential, logarithmic, trigonometric deep dives)
- 🌐 Localization (i18n) for multiple languages
- 📈 Teacher analytics dashboard (aggregate student success by concept)
- 🎮 Challenge mode with leaderboards and daily seeds
- 🖼️ Tangent line preview (for derivative levels)
- 🟦 Area tokens (for integral concept levels)

---

## 📖 Resources

- **Teacher Guide:** [TEACHER_GUIDE.md](./TEACHER_GUIDE.md) — Classroom strategies, assessment ideas, standards alignment
- **GDD:** See the full Game Design Document for detailed mechanics and content structure
- **Math References:**
  - [Khan Academy: Functions](https://www.khanacademy.org/math/algebra)
  - [3Blue1Brown: Calculus](https://www.youtube.com/c/3blue1brown)
  - [Probability Intro](https://seeing-theory.brown.edu/)

---

## 🤝 Contributing

Contributions welcome! Ideas:
- Additional question banks
- New curve types (logarithmic, piecewise)
- Improved visual effects
- Accessibility enhancements
- Bug fixes

Open an issue or pull request on GitHub.

---

## 📜 License

This project is created for educational purposes. Free to use and modify for teaching and learning.

**Credits:**
- Built with React, Phaser, TypeScript, Zustand, Vite
- Designed to align with Common Core and AP standards

---

## 🎉 Acknowledgments

Thank you to math educators, students, and open-source contributors who inspire better educational tools.

**Help students see math as an active, visual, and strategic adventure!**

---

**Questions? Feedback?**  
Open an issue or contact the development team.

**Version 1.0** • October 2025
