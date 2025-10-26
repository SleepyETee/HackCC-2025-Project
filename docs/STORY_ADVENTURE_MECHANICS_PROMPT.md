# 🎮 Story Adventure Mode - Complete Mechanics Documentation

## 📋 Project Overview

**Project:** SpiderCalc - Educational Calculus Game  
**Mode:** Story Adventure Mode  
**Genre:** Educational Puzzle Platformer with Physics-Based Web Mechanics  
**Technology Stack:** React + TypeScript + Phaser 3 (Arcade Physics) + Zustand

---

## 🎯 Core Gameplay Concept

A hybrid gameplay experience combining:
1. **Angry Birds** trajectory preview mechanics
2. **Cut the Rope** physics-based puzzle solving
3. **Educational calculus** integration
4. **Story-driven** adventure progression

**The Player Controls:**
- A spider character that must navigate through calculus-themed levels
- Web shooting mechanics with trajectory preview
- Strategic cutting of web connections
- Answering calculus questions that modify physics

---

## 🕷️ Character Mechanics

### Spider Character
- **Visual:** Purple circular sprite (30x30 pixels)
- **Starting Position:** (150, 450) - Near bottom-left of screen
- **Physics:**
  - Gravity: 800 (modified by calculus answers)
  - Bounce: 0.2
  - World bounds collision enabled
- **Movement:**
  - Controlled by web attachments (no direct player control)
  - Swings/pulls toward web attachment points
  - Multiple webs can be attached simultaneously

### Web System
**Visual Representation:**
- **Web Lines:** 3px width, color `0x8b5cf6` (purple)
- **Connection:** From spider to target points
- **Update:** Every frame (60 FPS)

**Physics:**
- Web applies force to spider toward attachment point
- Force calculation: `(dx, dy) * 0.1` scaled vector
- Multiple webs create complex motion

---

## 🎯 Trajectory Preview System

### Visual Feedback
**Appearance:**
- **Line Color:** Yellow (`0xffff00`) at 60% opacity
- **Line Width:** 2px
- **Style:** Smooth parabolic curve
- **Markers:** Yellow dots every 5 points
- **Hit Indicator:** Red circle (5px) at target hit location

**Behavior:**
- **Activation:** While dragging to aim
- **Update:** Real-time during drag
- **Duration:** Hidden after web shot

### Calculation Method
**Physics Formula (Projectile Motion):**
```
x(t) = x₀ + v₀·cos(θ)·t
y(t) = y₀ + v₀·sin(θ)·t + 0.5·g·t²

Where:
- x₀, y₀ = spider position
- v₀ = web power (velocity)
- θ = web angle (radians)
- g = gravity (800)
- t = time steps (0 to 2 seconds, increment 0.05)
```

**Target Detection:**
- Check each trajectory point against all targets
- Hit radius: 25 pixels
- Returns closest target on path
- Stops calculation when target hit

---

## 🕸️ Web Shooting Mechanic

### Aiming System
**Input Method:** Mouse drag (or touch drag)
- **Start:** Pointer down event
- **Track:** Pointer move events
- **Calculate:**
  - `dx = pointer.x - dragStartX`
  - `dy = pointer.y - dragStartY`
  - `angle = atan2(dy, dx)` (radians)
  - `power = min(distance / 5, 200)`
- **Complete:** Pointer up event

**Angle System:**
- 0 radians = right (positive x-axis)
- π/2 radians = down (positive y-axis)
- Standard counter-clockwise orientation

### Shooting Process
1. **Calculate Trajectory:** Project physics path
2. **Find Target:** Detect collision with web targets
3. **Create Connection:** Store web connection data
4. **Apply Force:** Set spider velocity
5. **Update Resources:** Decrement webs remaining
6. **Check Victory:** If target is goal, complete level
7. **Play Sound:** Web shot audio cue

**Target Detection Algorithm:**
```typescript
for each time step (t = 0 to 2, step 0.05):
  x = spider.x + power * cos(angle) * t
  y = spider.y + power * sin(angle) * t + 0.5 * gravity * t^2
  
  for each target:
    distance = sqrt((x - target.x)^2 + (y - target.y)^2)
    if distance < 25:
      hitTarget = target
      break outer loop
```

### Web Connection Data
```typescript
type WebConnection = {
  fromX: number      // Spider position when shot
  fromY: number
  toX: number        // Target position
  toY: number
  cut: boolean       // Whether web has been cut
  target: WebTarget  // Target object reference
}
```

---

## ✂️ Cutting Mechanism

### Cutting Method
**Input:** Right-click (or right mouse button down)
**Detection:** 
- Calculate distance from pointer to each web line
- Line-to-point distance check
- Threshold: 30 pixels

**Process:**
1. Find closest web within threshold
2. Mark as cut (`connection.cut = true`)
3. Destroy web line visual
4. Decrement cuts remaining
5. Play cut sound effect
6. Apply physics effects if needed

**Visual Feedback:**
- Web line disappears immediately
- Sound cue plays
- No animation (instant removal)

### Resource Management
- **Starting Cuts:** 3 per level
- **Cost:** No point penalty
- **Limit:** Cannot cut if cutsRemaining ≤ 0
- **Strategic Value:** Frees spider, changes trajectory

---

## 🎯 Target System

### Target Types
**1. Web Anchors (Anchor)**
- From scene web points
- Golden glowing circles (20px radius)
- Pulsing animation
- Attach point for webs

**2. Goal (Goal)**
- Green circle (25px radius)
- "🎯 GOAL" text label
- Victory condition trigger
- Special target type

### Target Properties
```typescript
type WebTarget = {
  id: string                           // Unique identifier
  x: number                            // X position
  y: number                            // Y position
  type: 'anchor' | 'platform' | 'goal' // Target classification
  sprite?: Phaser.GameObjects.Sprite   // Visual representation
  active: boolean                      // Can be targeted
}
```

**Visual Effects:**
- Pulsing scale animation (1.0 to 1.3)
- Strobe/glow effect on anchors
- Special highlighting for goal

---

## 📐 Calculus Integration System

### Question System
**Question Display:** React component panel
**Question Timing:** Show at level start
**Answer Handling:** Custom event dispatching

**Event Flow:**
1. Scene requests question from data
2. Question displayed in React UI
3. User selects answer
4. Event dispatched: `spidercalc-action`
5. Scene receives event with answer data
6. Apply physics modification

**Answer Event:**
```typescript
window.dispatchEvent(new CustomEvent('spidercalc-action', {
  detail: {
    action: 'jump' | 'web',
    correct: boolean
  }
}))
```

### Physics Modification
**Gravity Adjustment:**
- **Correct Answer:** `gravity.y = 600` (easier)
- **Wrong Answer:** `gravity.y = 1000` (harder)
- **Effect:** Affects trajectory calculations

**Question Types:**
- **Trigonometry:** Angles, radians, sin/cos/tan
- **Derivatives:** Rates of change, slopes
- **Integration:** Areas, accumulation
- **Limits:** Approaching values

**Scoring:**
- Correct: +100 points
- Wrong: -50 points
- Web shot: +50 points

---

## 🎮 Input System

### Mouse/Touch Input

**1. Web Aiming (Left Click/Touch)**
- **Down:** Start aim, record start position
- **Move:** Calculate angle/power, update trajectory
- **Up:** Shoot web, hide trajectory

**2. Web Cutting (Right Click)**
- **Down:** Detect web near pointer
- **Cut:** Remove nearest web within range

**3. Dragging**
- Active while pointer down
- Continuous trajectory updates
- Visual feedback during drag

### Keyboard Input
**Not Currently Used:** All input via mouse/touch

---

## 🎨 Visual Systems

### Rendering Layers (Depth Order)
```
1000 - UI Text (top layer)
200  - Trajectory Line
150  - Spider
110  - Web Lines
100  - Targets, Goal
0    - Background
```

### Visual Effects

**Trajectory:**
- Yellow line with opacity fade
- Dotted markers every 5th point
- Red hit indicator
- Smooth curve rendering

**Webs:**
- Solid purple lines
- 3px width
- From spider to target
- Instant disappear on cut

**Targets:**
- Pulsing animation (800ms duration, -1 repeat)
- Scale 1.0 to 1.3
- Glow effect
- Interactive clickable

**Spider:**
- Static purple circle
- No animation
- Follows physics forces

---

## 🎯 Victory System

### Victory Conditions
1. **Web Shot to Goal:** Web attaches to green goal target
2. **Distance Check:** Spider position near goal (redundant)

### Victory Sequence
1. Detect goal hit during web shot
2. Play success sound
3. Show overlay (70% black opacity)
4. Display "Level Complete!" text
5. Show final score
6. Wait 3 seconds
7. Load next scene (if available)

### Progression
- Automatic scene advancement
- Scene restart on completion
- No level select menu
- Linear progression through story

---

## 📊 Scoring System

### Points Breakdown
- **Web Shot:** +50 (successful attachment)
- **Correct Answer:** +100 (good math)
- **Wrong Answer:** -50 (math error)
- **Cut Web:** No cost (free strategic action)

### Resource Tracking
**Webs Remaining:**
- Start: 3 per level
- Decrease: On successful web shot
- Limit: 0 disables shooting

**Cuts Remaining:**
- Start: 3 per level
- Decrease: On web cut
- Limit: 0 disables cutting

**Display:** Top-left UI panel

---

## 🎭 Story Integration

### Scene Data Structure
```typescript
type AdventureScene = {
  id: string          // Scene identifier (e.g., 'ch1-s1')
  name: string        // Display name
  chapter: number     // Chapter number
  description: string // Scene description
  storyContext: string // Narrative context
  background: string  // Background image key
  platforms: Platform[] // Platform objects
  webPoints: WebPoint[] // Web attachment points
  obstacles: Obstacle[] // Hazard objects
  goal: { x, y }      // Victory location
}
```

### Scene Progression
- **7 Total Scenes:** Across 4 chapters
- **Linear:** Must complete in order
- **Reset:** Each level restarts resources
- **Persistence:** Score carries between scenes

### Narrative Elements
- Story context displayed in React panel
- Chapter badges and scene titles
- Calculus integrated into narrative
- Educational flow through concepts

---

## 🔧 Technical Architecture

### File Structure
```
src/
├── game/
│   ├── adventure/
│   │   └── CutTheRopeScene.ts (Main scene)
│   ├── adventure.ts (Scene data)
│   └── gameTypes.ts (Type definitions)
├── ui/
│   ├── StoryAdventureCanvas.tsx (React wrapper)
│   ├── StoryPanel.tsx (Story UI)
│   └── AdventureQuestionPanel.tsx (Question UI)
└── state/
    └── store.ts (Zustand state)
```

### State Management
**Zustand Store:**
- `currentSceneId` - Active scene
- `currentAdventureQuestion` - Displayed question
- `adventureScore` - Player score
- `adventureLives` - Lives remaining

### Event System
**Custom Events:**
- `spidercalc-action` - Answer submission
- `story-adventure-scene-complete` - Level finish
- `story-adventure-game-complete` - All scenes done

### Physics Engine
**Phaser Arcade Physics:**
- Gravity-based movement
- Collision detection (world bounds)
- Force application
- Velocity manipulation

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
1. **Spider Control:** No direct movement (web-only)
2. **Physics:** Simplified rope physics
3. **Visuals:** Basic graphics, no animations
4. **Platforms:** Not interactable yet
5. **Obstacles:** Defined but not dangerous

### Planned Enhancements
- [ ] Multiple web types (strong/weak)
- [ ] Bouncy targets
- [ ] Moving platforms
- [ ] Wind effects from calculus
- [ ] Time challenges
- [ ] Star ratings per level
- [ ] Sound effects improvements
- [ ] Particle effects on cuts
- [ ] Spider animation
- [ ] Platform collision

### Code Quality Improvements
- [ ] Better error handling
- [ ] Performance optimization
- [ ] Code splitting
- [ ] Unit tests
- [ ] Documentation comments
- [ ] Type safety improvements

---

## 📝 Implementation Checklist

### Core Features
- [x] Trajectory preview system
- [x] Web shooting mechanics
- [x] Cutting mechanism
- [x] Target system
- [x] Calculus integration
- [x] Victory detection
- [x] Scoring system
- [x] UI integration
- [x] State management
- [x] Scene progression

### Polish Features
- [ ] Sound effects
- [ ] Visual feedback
- [ ] Animations
- [ ] Tutorial system
- [ ] Help text
- [ ] Pause menu
- [ ] Settings menu

---

## 🎓 Educational Value

### Calculus Concepts Covered
1. **Trigonometry:** Angles, radians, trigonometric functions
2. **Derivatives:** Rates of change, slopes, motion
3. **Integration:** Areas, accumulation
4. **Physics:** Projectile motion, forces, gravity

### Learning Outcomes
- Visual understanding of projectile motion
- Hands-on experience with trajectory calculations
- Immediate feedback on calculus concepts
- Progressive difficulty through story

### Engagement Strategies
- Game mechanics reinforce math concepts
- Real-time physics visualization
- Strategic puzzle solving
- Story narrative context

---

## 🚀 Testing & Debugging

### Key Test Cases
1. Trajectory calculation accuracy
2. Web target detection
3. Cutting mechanism responsiveness
4. Physics gravity modification
5. Victory condition detection
6. Scene progression
7. Resource management
8. Event dispatching

### Debug Tools
- Console logging at key points
- Visual trajectory debugging
- Physics overlay (disabled)
- Force visualization
- Event listener debugging

### Common Issues
- Trajectory not updating during drag
- Webs not attaching to targets
- Cutting not working
- Gravity not changing
- Victory not triggering

---

## 📖 Documentation Links

- [Hybrid Gameplay Implementation](./HYBRID_GAMEPLAY_IMPLEMENTATION.md)
- [Cut the Rope Implementation](./CUT_THE_ROPE_IMPLEMENTATION.md)
- [Story Adventure Summary](./ADVENTURE_MODE_SUMMARY.md)
- [Project Structure](./PROJECT_STRUCTURE.md)

---

## 🤖 LLM Prompt for Implementation

### For AI Assistants (ChatGPT, Claude, etc.)

```
I'm building a hybrid gameplay mechanics system combining Angry Birds trajectory preview, 
Cut the Rope physics, and educational calculus integration for a Phaser 3 game.

Core Mechanics:
1. Trajectory System: Real-time parabolic preview using projectile motion formulas
2. Web Shooting: Drag to aim, release to shoot web that attaches to targets
3. Cutting: Right-click to cut webs (like Cut the Rope)
4. Calculus: Answers modify gravity dynamically affecting trajectories

Key Implementation Details:
- Phaser 3 with Arcade Physics
- React + TypeScript
- Zustand state management
- Custom events for React-Phaser communication
- Physics formulas: x(t) = x₀ + v₀·cos(θ)·t, y(t) = y₀ + v₀·sin(θ)·t + 0.5·g·t²
- Web angle in radians: θ = atan2(dy, dx)
- Target detection radius: 25 pixels
- Cutting threshold: 30 pixels

Please help me:
1. Debug trajectory calculation issues
2. Improve web target detection accuracy
3. Optimize cutting mechanism responsiveness
4. Enhance physics gravity modification system
5. Add visual feedback improvements
6. Implement missing features from the enhancement list
```

---

## 📞 Support & Contribution

**Created:** 2025  
**Status:** Complete Core Features  
**Version:** 1.0  
**Last Updated:** Current

For questions or implementation help, reference this document and the associated code files.
