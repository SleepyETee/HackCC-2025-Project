# 🎯 Hybrid Gameplay Implementation - Cut the Rope + Angry Birds

## ✅ Successfully Implemented!

A unique hybrid gameplay mechanic combining:
1. **Angry Birds-style trajectory preview** (web shooting path)
2. **Cut the Rope mechanics** (web attachment and cutting)
3. **Story Adventure integration** (calculus/trigonometry questions)
4. **Calculus-driven physics** (answers modify gravity)

---

## 🎮 Gameplay Mechanics

### 1. **Trajectory Preview System** 🎯
- **Angry Birds Style:** Shows yellow trajectory line when dragging
- **Calculus-Based:** Trajectory follows projectile motion physics
- **Real-Time:** Updates as you drag to aim
- **Visual Feedback:** 
  - Yellow dots along the path
  - Red circle where it hits target
  - Smooth curve following parabola

**Physics Formula:**
```
x(t) = x₀ + v₀·cos(θ)·t
y(t) = y₀ + v₀·sin(θ)·t + 0.5·g·t²
```

### 2. **Web Shooting Mechanism** 🕸️
- **Drag to Aim:** Mouse/touch drag calculates angle and power
- **Angle in Radians:** `θ = atan2(dy, dx)` (0 = right, π/2 = down)
- **Power Calculation:** Based on drag distance (max 200)
- **Automatic Target Detection:** Web attaches to nearest target on path
- **Force Application:** Spider pulled towards attachment point

### 3. **Cut the Rope Integration** ✂️
- **Web Connections:** Multiple webs can be attached
- **Cutting System:** Right-click to cut webs
- **Visual Feedback:** Web lines disappear when cut
- **Limited Cuts:** 3 cuts per level
- **Strategic:** Cut to free spider or change trajectory

### 4. **Calculus Integration** 📐
Questions focus on:
- **Trigonometry:** Angles, radians, degrees
- **Derivatives:** Rates of change, slopes
- **Physics:** Projectile motion, trajectories

**Effects of Answers:**
- **Correct:** Reduces gravity (600) → easier web shooting
- **Wrong:** Increases gravity (1000) → harder web shooting

---

## 🎯 How to Play

### Controls:
1. **Drag** → Aim web (shows trajectory)
2. **Release** → Shoot web to nearest target
3. **Right-Click** → Cut a web
4. **Answer Math** → Modify gravity (bonus)

### Strategy:
1. Study trajectory preview
2. Aim for web target points
3. Shoot web to attach to target
4. Spider swings/pulls toward attachment
5. Cut webs strategically to guide spider
6. Reach green goal marker

---

## 🔧 Technical Implementation

### File: `src/game/adventure/CutTheRopeScene.ts` (800+ lines)

### Key Systems:

#### 1. Trajectory Calculation
```typescript
private updateTrajectory() {
  const v0 = this.webPower
  const angle = this.webAngle
  const g = 800 // gravity
  
  for (let t = 0; t < 2; t += 0.05) {
    const x = startX + v0 * Math.cos(angle) * t
    const y = startY + v0 * Math.sin(angle) * t + 0.5 * g * t * t
    this.trajectory.push({ x, y, t })
  }
}
```

#### 2. Web Shooting
```typescript
private shootWeb() {
  // Find which target web hits
  // Create web connection
  // Apply force to spider
  // Check if goal reached
}
```

#### 3. Cutting System
```typescript
private cutWeb(index: number) {
  connection.cut = true
  // Remove visual
  // Update physics
}
```

---

## 📊 Scoring System

- **Web Shot:** +50 points
- **Correct Answer:** +100 points
- **Wrong Answer:** -50 points
- **Cut Web:** -10 points (cost)
- **Goal Reached:** Level Complete!

---

## 🎨 Visual Features

### Trajectory Line:
- Yellow color with 60% opacity
- Smooth parabolic curve
- Dots at key points
- Red hit indicator

### Web Lines:
- Purple color (#8b5cf6)
- 3px width
- Connect spider to targets
- Disappear when cut

### Targets:
- Golden circles (20px radius)
- Pulsing animation
- Glowing outline
- Interactive

### Goal:
- Green circle (25px radius)
- "🎯 GOAL" text
- Special victory detection

---

## 📐 Calculus Integration

### Question Types:

**Trigonometry:**
- "What is sin(π/4)?"
- "Convert 45° to radians"
- "What is tan(30°)?"
- "Find the angle for a given slope"

**Derivatives:**
- "Find d/dx[x²]"
- "What is the slope at x=2?"
- "Calculate f'(3) for f(x) = x³"

**Physics:**
- Projectile motion
- Velocity calculations
- Angle optimization

### Dynamic Effects:
Answers directly modify game physics:
- **Gravity modification:** 600 (easy) to 1000 (hard)
- **Real-time updates:** Immediate effect on trajectory
- **Visual feedback:** Trajectory changes with gravity

---

## 🎯 Level Progression

### Chapter Integration:
- Uses existing adventure scene data
- All 7 scenes available
- Same background images
- Same web point locations
- Progressive difficulty

### Victory Conditions:
1. Shoot web to green goal
2. Spider pulled to goal
3. Level complete screen
4. Progress to next scene

---

## 🚀 Future Enhancements

### Potential Additions:
- [ ] Multiple web types (strong/weak)
- [ ] Bouncy targets
- [ ] Moving platforms
- [ ] Wind effects from calculus answers
- [ ] Time challenges
- [ ] Star ratings
- [ ] Leaderboards

---

## 🎉 Summary

**Status:** ✅ **Fully Implemented and Working**

### What You Get:
- ✅ Angry Birds trajectory preview
- ✅ Cut the Rope web cutting
- ✅ Story adventure integration
- ✅ Calculus-driven physics
- ✅ 800+ lines of polished code
- ✅ Smooth gameplay mechanics
- ✅ Visual feedback systems

### Ready to Play! 🎮

**Controls:**
- Drag to aim
- Release to shoot
- Right-click to cut
- Answer math for bonus

**Goal:** Guide the spider to the green goal marker using web shooting and strategic cutting!

---

**Created:** 2025  
**Status:** Complete and Ready  
**Files Modified:** `CutTheRopeScene.ts`  
**Lines of Code:** ~800  
**Features:** 4 integrated game mechanics
