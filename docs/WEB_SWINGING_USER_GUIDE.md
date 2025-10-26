# Web Swinging User Guide - Story Adventure Mode

## 🎮 How to Play Story Adventure with Web Swinging

### Getting Started
1. **Launch Game** → Select **"Adventure Mode"**
2. Choose **"🕷️ Story Adventure (with Web-Swinging)"**
3. Your spider starts at the beginning of Chapter 1, Scene 1

---

## 🎯 Two Ways to Play

### 1️⃣ **Question-Based Actions** (Automatic)

When a question appears, answer it correctly for powerful effects!

#### 🦘 **Jump Questions**
```
Question Type: "Jump to the next platform"
✅ CORRECT → Strong jump (high & far)
❌ WRONG   → Weak jump (low & short)
```

#### 🕸️ **Web Questions**  
```
Question Type: "Swing to the web point"
✅ CORRECT → Easier physics:
   • Lower gravity (600) - float more!
   • Shorter ropes (0.92x) - tighter control!
   • Strong pull (300 speed boost)
   
❌ WRONG   → Harder physics:
   • Higher gravity (1000) - fall faster!
   • Longer ropes (1.08x) - looser control!
   • Weak pull (150 speed boost)
   • Limited range (150 units only)
```

### 2️⃣ **Manual Web Swinging** (Between Questions)

Take control and swing freely!

#### 🖱️ **Left Click + Drag**
1. Click and hold left mouse button
2. Drag to aim (yellow line shows trajectory)
3. Release to shoot web
4. Web attaches to nearest anchor point
5. Swing using momentum!

#### 🖱️ **Right Click**
- Cuts the web instantly
- Returns spider to free fall
- Use to change direction mid-swing

---

## 🧮 Calculus Connection

### How Math Affects Physics

Your calculus knowledge directly controls the game physics!

```
Correct Answer:
├─ Gravity: 600 (easier to stay airborne)
├─ Rope: 92% length (tighter, more controlled swings)
└─ Boost: 300 velocity (strong pull toward anchors)

Wrong Answer:
├─ Gravity: 1000 (fall faster, harder to recover)
├─ Rope: 108% length (longer, less controlled swings)
└─ Boost: 150 velocity (weak pull toward anchors)
```

**Strategy Tip**: Answer web questions correctly to make manual swinging easier!

---

## 🕷️ Visual Feedback

### What You'll See

#### **Trajectory Line** (Yellow)
- Appears when you drag to aim
- Shows where your web will go
- Curved arc follows current gravity
- Disappears when you release

#### **Web Line** (White)
- Appears when attached to anchor
- Connects spider to anchor point
- Updates position every frame
- 2 pixel thickness, semi-transparent

#### **Anchor Points** (Glowing)
- Pulsing circles on platforms/walls
- Targets for your web shots
- Glows brighter on hover
- Physical hitboxes for collision

#### **Spider Shadow**
- Dark ellipse below spider
- Shows depth/height
- Follows spider movement

---

## 📖 Story Progression

### 7 Scenes Across 4 Chapters

**Chapter 1: Introduction**
- Scene 1: Entrance Hall (tutorial)
- Scene 2: Grand Hall (web swinging practice)
- Scene 3: Library (precision jumps)

**Chapter 2: Intermediate**
- Scene 4: Limit Chamber (advanced calculus)
- Scene 5: Throne Room (boss challenge)

**Chapter 3: Advanced**
- Scene 6: High Tower (vertical climbing)

**Chapter 4: Master**
- Scene 7: Final Challenge (everything combined)

**Goal**: Reach the goal marker (green circle) in each scene

---

## 💡 Pro Tips

### General Strategy
1. **Answer questions correctly** to get easier physics
2. **Use manual swinging** to explore between questions
3. **Chain swings** for momentum and speed
4. **Cut and re-attach** to change direction quickly
5. **Aim high** for longer, smoother swings

### Jump Questions
- Correct answers go **straight up** (-90°)
- Wrong answers go **at an angle** (-60°)
- Use horizontal momentum to reach platforms

### Web Questions
- **Always aim for closest anchor** when physics are hard
- **Go for distant anchors** when physics are easy
- **Cut early** if you're swinging too far

### Manual Swinging
- **Longer drag** = more power
- **Higher anchors** = better momentum
- **Cut at swing peak** for forward launch
- **Attach at swing bottom** for upward boost

### Physics Management
- Get **3-4 correct answers** for optimal swinging
- **Avoid wrong answers** when planning long swings
- **Reset physics** by answering the next question correctly

---

## 🎯 Controls Reference

### Mouse Controls
```
LEFT CLICK + DRAG → Aim and shoot web
RIGHT CLICK       → Cut web
HOVER             → Preview anchor points
```

### Answer Controls
```
1-4 or CLICK      → Select answer option
(Automatic in Adventure Mode - click the answer button)
```

---

## 🐛 Troubleshooting

### Web Won't Attach
- **Check distance**: Web has limited range
- **Check anchor points**: Make sure there are glowing points nearby
- **Check timing**: Can't shoot during question animations

### Physics Feel Wrong
- **Check last answer**: Wrong answers make physics harder
- **Get correct answer**: Resets physics to easier settings
- **Wait for question**: Manual swinging uses current physics

### Can't Swing During Question
- **This is intentional**: Answer the question first
- **Wait for animation**: Let the question effect finish
- **Then swing freely**: Manual control unlocks after

### Spider Falls Off Screen
- **Lose 1 life**: Respawn at last checkpoint
- **3 lives total**: Game over if all lost
- **Checkpoints**: Auto-save every 500m

---

## 🏆 Success Metrics

### What to Aim For

**Beginner Goals**
- Complete Chapter 1 (3 scenes)
- Answer 60% of questions correctly
- Use manual swinging occasionally

**Intermediate Goals**
- Complete Chapters 1-2 (5 scenes)
- Answer 75% of questions correctly
- Master web swinging momentum

**Advanced Goals**
- Complete all 4 chapters (7 scenes)
- Answer 90% of questions correctly
- Speedrun with minimal falls

**Master Goals**
- Perfect run (no lives lost)
- 100% correct answers
- Sub-5 minute completion time

---

## 🎨 Visual Elements

### Color Coding
```
🟡 Yellow     → Trajectory preview
⚪ White      → Active web line
🟢 Green      → Goal/checkpoint
🔵 Blue       → Web anchor points
🟣 Purple     → Platforms
🟠 Orange     → Obstacles (avoid!)
❤️ Red        → Lives/health
```

### Depth Layers
```
Layer 0   → Background images
Layer 100 → Platforms & obstacles
Layer 200 → Web points
Layer 300 → Web lines
Layer 400 → Trajectory preview
Layer 1000 → UI elements
```

---

## 📊 Score System

### Points Breakdown
```
Correct Answer:    +100 points
Wrong Answer:      -50 points
Reach Goal:        +500 points
Complete Scene:    +1000 points
No Lives Lost:     +250 bonus
Speed Bonus:       +100 per 10s under par
```

### Streaks
```
3 correct in a row:  +50 bonus
5 correct in a row:  +100 bonus
10 correct in a row: +500 bonus + POWER MODE
```

---

## 🎓 Learning Integration

### Calculus Topics Covered
- Derivatives and rates of change
- Limits and continuity
- Integration and area
- Trigonometric functions
- Exponential and logarithmic functions

### Real-World Physics
- **Gravity**: Constant downward acceleration
- **Momentum**: Mass × velocity conservation
- **Rope constraint**: Circular motion physics
- **Damping**: Energy loss over time
- **Trajectory**: Parabolic motion under gravity

---

## 🚀 Getting Started - Quick Steps

1. **Select Story Adventure Mode**
2. **Watch for first question** (it will appear automatically)
3. **Answer the question** by clicking an option
4. **Observe the effect** (jump or web swing)
5. **Between questions**, try manual web swinging:
   - Click and drag to aim
   - Release to shoot
   - Right-click to cut
6. **Reach the green goal marker**
7. **Progress to next scene**
8. **Repeat and master!**

---

## 🎮 Have Fun!

The web swinging mechanics combine:
- 🧮 **Calculus learning** (answer questions correctly)
- 🎯 **Skill-based gameplay** (aim and time your swings)
- 🕷️ **Physics simulation** (realistic rope swinging)
- 📖 **Story progression** (7 scenes to conquer)

**Your math knowledge IS your superpower!** 🦸‍♂️

Master the calculus, master the physics, master the game! 🏆

