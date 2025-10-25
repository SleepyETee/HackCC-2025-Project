# 🎃 SpiderCalc: Halloween Calculus - Complete Gameplay

## 🎮 **What You Now Have**

A **fully gamified Halloween-themed calculus teaching tool** where the spider jumps forward through a coordinate plane!

---

## 📺 **Left Side: Game Canvas**

### **Visual Elements:**

1. **📊 Coordinate Grid System**
   - Mathematical X and Y axes
   - Grid lines every 1 unit
   - Numbered tick marks
   - Proper coordinate labels

2. **🕷️ Animated Spider (Player)**
   - Purple body with 8 legs
   - Idle: Gentle bounce animation
   - Preparing: Glows GREEN + legs wiggle
   - Jumping: Arcs through the air!
   - Shows live (x, y) coordinates above

3. **🎃 Pumpkins (Safe Targets)**
   - Orange jack-o'-lanterns with faces
   - Scattered across the graph
   - Glow when selected by beams
   - Worth +100 points

4. **👻 Ghosts (Hazards)**
   - White floating spirits
   - Eyes and wavy bottom
   - Less desirable targets
   - Worth -100 points

5. **🦇 Flying Bats**
   - 5 bats flying around
   - Adds Halloween atmosphere
   - No gameplay impact

6. **🌙 Glowing Moon**
   - Pulses gently
   - Top-right corner
   - Creates spooky ambiance

7. **🏁 Finish Line**
   - At x = 14
   - Checkered stripe pattern
   - Goal to reach!

8. **📈 Progress Bar**
   - Top-left corner
   - Shows % to finish
   - Green → Orange gradient

### **Interactive Mechanics:**

#### **When Student Selects Answer:**
1. ✨ **Probability beams** shoot from spider to all targets
2. Beam **thickness** = probability of landing there
3. Beam **color**:
   - Orange (pumpkins) if correct answer
   - White (ghosts) if wrong answer
4. **Percentage labels** appear on high-probability targets

#### **800ms After Selection:**
1. Spider **glows GREEN**
2. **Dotted trajectory arc** appears
3. **Pulsing target circle** on most likely landing spot
4. Text appears: **"🎯 Press SPACE to JUMP!"**

#### **When Press Space:**
1. Spider **jumps** in parabolic arc (physics!)
2. Lands on sampled target (probabilistic)
3. Score updates based on landing
4. New question loads automatically
5. Process repeats!

---

## 📱 **Right Side: Control Panels**

### **Equation Panel**
- Mode selector (Line, Quadratic, Sin, Exp)
- Sliders for m and b (line mode)
- Real-time equation preview on graph

### **Question Panel**
- Calculus question
- 4 multiple choice answers
- Concept tag and hints
- Answer highlighting when selected

### **HUD (Top-Left)**
- Score (with gradient)
- Combo badge (appears at 3+)
- Pulls remaining
- Fire button

---

## 🎓 **Teacher Controls (Bottom of Graph)**

### **📐 Show Derivative**
- Displays **green tangent line** on curve
- Shows **f'(x) = [value]** label
- Interactive: Updates with equation changes
- **Teaching:** "This is the slope at this point!"

### **📊 Show Integral**
- Displays **purple rectangles** (Riemann sums)
- Shows **∫f(x)dx ≈ [value]** at top
- Calculates area from x=1 to x=8
- **Teaching:** "This is how we calculate area!"

---

## 🎯 **Complete Game Loop**

```
1. Student reads calculus question →
2. Student selects answer (keys 1-4) →
3. Beams show probability distribution →
4. Spider prepares (glows green, shows trajectory) →
5. Student presses SPACE →
6. Spider JUMPS in parabolic arc →
7. Lands on pumpkin or ghost →
8. Score updates →
9. Next question loads →
10. REPEAT until finish line or out of jumps!
```

---

## 🏆 **Scoring System**

### **Base Points:**
- 🎃 Pumpkin: +100
- 👻 Ghost: -100

### **Bonuses:**
- ✅ Correct answer: +150
- 📏 Forward progress: +0 to +80 (based on distance)
- 🎯 Confidence: +0 to +60 (concentrated beams)
- 🔥 Combo (3+): ×1.5 multiplier

### **Example:**
- Land on pumpkin (+100)
- Answered correctly (+150)
- Jumped far (+60)
- Low entropy (+40)
- **Total: 350 points!**
- With 3x combo: **525 points!**

---

## 📐 **The Math Connection**

### **"Under the Line" Concept:**
When you answer correctly:
- Points where `y ≤ mx + b` get BOOSTED probability
- This teaches **linear inequalities**
- Visual: Pumpkins below orange line light up!

### **Probability Distribution:**
- Each pumpkin/ghost gets a probability
- Softmax converts scores → probabilities
- Student **sees** the distribution via beam thickness
- **Random sampling** picks one target
- Teaches: Expected value, variance, entropy

### **Calculus Visualization:**
- **Derivative button:** Shows tangent line and slope
- **Integral button:** Shows area accumulation
- **Equation changes:** Update graph in real-time

---

## 👩‍🏫 **For Teachers**

### **How to Use:**

**Whole Class (Projector):**
1. Project on screen
2. Call on students for answers
3. Class watches spider jump
4. Discuss: "Why did it land there?"

**Individual Practice:**
1. Students play on own devices
2. Compete for high scores
3. Self-paced learning
4. Instant feedback

**Concept Demonstration:**
1. Set equation to specific value
2. Enable derivative/integral view
3. Step through examples
4. Pause and explain

### **Discussion Questions:**
- "What equation would make the spider favor forward pumpkins?"
- "How does your answer choice affect the beams?"
- "What's the derivative at the spider's current position?"
- "Can you estimate the integral by counting rectangles?"

---

## 🎨 **Visual States**

The spider changes based on game state:

| State | Spider Color | Message | Action |
|-------|--------------|---------|--------|
| **Idle** | Purple | "👉 Answer the question!" | Select answer |
| **Beams Active** | Purple | "📊 Probability beams active..." | Calculating |
| **Ready** | GREEN | "🎯 Press SPACE to JUMP!" | Press Space |
| **Jumping** | Moving | "🕷️ JUMPING!!!" | Watch |

---

## 🏅 **Achievements to Try**

- 🎯 **Perfect Run:** All correct answers
- 🚀 **Speed Demon:** Complete in minimum jumps
- 🎃 **Pumpkin Collector:** Never hit a ghost
- 🔥 **Combo Master:** Build 5+ combo
- 🏆 **High Score:** Beat 1000 points

---

## 🔧 **Controls Reference**

| Input | Action |
|-------|--------|
| **1** | Select answer A |
| **2** | Select answer B |
| **3** | Select answer C |
| **4** | Select answer D |
| **Space** | Jump! |
| **Enter** | Jump! (alternative) |
| **Mouse** | Click everything |

---

## 💡 **Tips for Success**

1. **Read question carefully** before answering
2. **Adjust equation** to favor forward pumpkins
3. **Watch the beams** - thicker = more likely
4. **Build combos** for score multipliers
5. **Learn from mistakes** - wrong answers teach too!

---

## 🎃 **Ready to Play?**

1. **Refresh browser:** http://localhost:5173
2. **Select a level** at the top
3. **Read the question** on the right
4. **Press 1-4** to answer
5. **Watch the beams** appear
6. **Press SPACE** to jump!
7. **Reach the finish line!** 🏁

---

**Have a Spooky Fun Learning Experience!** 🕷️📐🎃

*Where Calculus Meets Halloween Adventure!* ✨

