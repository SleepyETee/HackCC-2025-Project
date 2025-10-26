# Web Swinging Story Adventure Integration

## Overview
This document describes the complete integration of the SpiderMan Web Swinging mechanics into the Story Adventure mode, creating a unified gameplay experience that combines traditional platforming with physics-based web swinging.

## Integration Summary

### What Was Done
1. **Merged Two Web Systems**: Combined the existing web point system with the new drag-and-drop web swinging mechanics
2. **Calculus-Based Physics**: Correct/incorrect answers now affect gravity and rope length dynamically
3. **Manual + Question-Based Control**: Players can manually swing between questions AND get physics boosts from answering
4. **Unified UI**: Removed separate web-swinging mode, integrated everything into Story Adventure

## Game Mechanics

### Two Control Systems

#### 1. Question-Based Actions (Automatic)
- **Jump Questions**: Spider jumps toward platforms
  - ✅ Correct: Strong jump (400 power, -90° angle, 150 horizontal velocity)
  - ❌ Wrong: Weak jump (200 power, -60° angle, 75 horizontal velocity)

- **Web Questions**: Spider shoots web to nearest anchor point
  - ✅ Correct: Strong pull (300 velocity boost) + easier physics (600 gravity, 0.92 rope scale)
  - ❌ Wrong: Weak pull (150 velocity boost) + harder physics (1000 gravity, 1.08 rope scale)

#### 2. Manual Web Swinging (Player-Controlled)
- **Left Click + Drag**: Aim trajectory and shoot web
  - Shows yellow trajectory prediction line
  - Shoots web projectile toward anchor points
  - Creates rope constraint on contact
  - Uses current gravity/physics settings from last answer

- **Right Click**: Detach web
  - Cuts both old and new web systems
  - Releases spider for free fall

### Physics System

#### Constants
```typescript
WEB_SHOT_SCALE = 6         // Power multiplier for web shots
ROPE_DAMPING = 0.25        // Energy loss on rope constraint
CORRECT_GRAVITY = 600      // Easier gravity when correct
WRONG_GRAVITY = 1000       // Harder gravity when wrong
CORRECT_ROPE_SCALE = 0.92  // Shorter ropes (easier) when correct
WRONG_ROPE_SCALE = 1.08    // Longer ropes (harder) when wrong
```

#### Rope Constraint Physics
- Enforces maximum distance from anchor point
- Applies tangential velocity (perpendicular to rope)
- Includes damping for realistic energy loss
- Updates every frame in `enforceRopeConstraint()`

### Visual Feedback

#### Trajectory Line
- **Color**: Yellow (0xffff00)
- **Opacity**: 0.7
- **Depth**: 400 (above everything)
- **Shows**: Parabolic arc considering current gravity

#### Web Line
- **Color**: White (0xffffff)
- **Opacity**: 0.8
- **Width**: 2 pixels
- **Depth**: 300 (above gameplay)
- **Updates**: Every frame while attached

#### Web Anchor Points
- Created alongside visual web points
- Scale: 0.8
- Depth: 201
- Physics: Static bodies for collision detection

## Code Structure

### StoryAdventureScene.ts

#### New Properties
```typescript
// Web swinging state
private isDragging: boolean = false
private trajectoryLine: Phaser.GameObjects.Graphics
private activeWebSwing: WebSwingConnection | null = null
private webAnchorPoints: Phaser.Physics.Arcade.StaticGroup

// Physics constants
private readonly WEB_SHOT_SCALE = 6
private readonly ROPE_DAMPING = 0.25
private readonly CORRECT_GRAVITY = 600
private readonly WRONG_GRAVITY = 1000
private readonly CORRECT_ROPE_SCALE = 0.92
private readonly WRONG_ROPE_SCALE = 1.08
```

#### Key Methods

**Input Handlers**
- `onPointerDown()`: Starts drag or cuts web (blocks during questions)
- `onPointerMove()`: Updates trajectory preview
- `onPointerUp()`: Shoots web projectile

**Web Swinging**
- `drawTrajectory()`: Renders parabolic arc preview
- `attachWebSwing()`: Creates web projectile and rope on contact
- `detachWebSwing()`: Removes active web swing
- `enforceRopeConstraint()`: Applies rope physics each frame

**Question Handling**
- `executeWebShot()`: Applies calculus effects + attaches to nearest point
- `applyCalculusEffect()`: Modifies gravity and rope length based on correctness

**Update Loop**
- Draws trajectory if dragging
- Enforces rope constraint if web attached
- Updates web line position each frame

### App.tsx

#### Changes
- Removed `SpiderManWebSwinging` import
- Removed separate web-swinging mode button
- Updated Story Adventure button text: "🕷️ Story Adventure (with Web-Swinging)"
- Updated instructions to include web swinging controls

### store.ts

#### Type Updates
```typescript
adventureMode: 'classic' | 'story'  // Removed 'web-swinging'
setAdventureMode: (mode: 'classic' | 'story') => void
```

## Game Flow

### Normal Gameplay
1. Player enters Story Adventure mode
2. Scene loads with platforms, web points, and anchor points
3. Question appears (jump or web type)
4. Player answers question
5. **If Jump**: Spider jumps with power based on correctness
6. **If Web**: Physics adjusts + spider pulls toward nearest anchor
7. Between questions, player can manually web swing
8. Manual swinging uses current physics settings
9. Goal reached → Next scene

### Interaction States

#### During Question
- `waitingForAnswer = true`
- Manual web swinging DISABLED
- Player must answer to proceed

#### During Animation
- `isAnimating = true`
- Manual web swinging DISABLED
- Question effects playing out

#### Free Movement
- `waitingForAnswer = false`
- `isAnimating = false`
- Manual web swinging ENABLED
- Player can swing freely using click + drag

## Testing Checklist

### ✅ Core Integration
- [x] Removed duplicate web swinging mode
- [x] Merged input handlers with question system
- [x] Fixed type definitions in store
- [x] Updated UI to show unified mode
- [x] No linting errors

### 🔄 Mechanics to Test
- [ ] Trajectory preview shows correct arc
- [ ] Web projectile shoots and attaches
- [ ] Rope constraint works smoothly
- [ ] Jump questions work as before
- [ ] Web questions apply calculus effects
- [ ] Manual swinging blocked during questions
- [ ] Right-click detaches both web systems
- [ ] Gravity changes affect trajectory
- [ ] Rope length changes affect swing radius

### 🎮 Gameplay to Test
- [ ] Complete a jump question
- [ ] Complete a web question (correct)
- [ ] Complete a web question (wrong)
- [ ] Manual swing between questions
- [ ] Reach goal and progress to next scene
- [ ] Test all 7 scenes across 4 chapters
- [ ] Verify no crashes or freezes

### 🐛 Edge Cases
- [ ] Web shot with no anchor points
- [ ] Web shot while already attached
- [ ] Multiple rapid web shots
- [ ] Detach during rope constraint
- [ ] Spider falls off screen handling
- [ ] Camera follows during swing

## Known Issues & Fixes

### Issue 1: Two Web Systems Conflicting
**Problem**: Old `attachWeb()` and new `attachWebSwing()` competed
**Solution**: 
- Old system handles question-based actions
- New system handles manual player control
- Both share calculus effects through `applyCalculusEffect()`

### Issue 2: Manual Control During Questions
**Problem**: Players could swing during question animations
**Solution**: Added checks in input handlers:
```typescript
if (this.waitingForAnswer || this.isAnimating) return
```

### Issue 3: Type Errors in Store
**Problem**: Store still had 'web-swinging' mode
**Solution**: Updated types to only 'classic' | 'story'

## Future Enhancements

### Potential Additions
1. **Web Charge System**: Limited web shots that recharge over time
2. **Multi-Anchor Swinging**: Attach multiple webs simultaneously
3. **Web Abilities**: Special moves unlocked by answer streaks
4. **Physics Visualizer**: Show gravity/rope values in UI
5. **Combo System**: Bonus points for consecutive correct answers
6. **Web Trail Effects**: Visual effects for web lines
7. **Anchor Point Types**: Moving anchors, breakable anchors, etc.

### Performance Optimizations
1. Pool web projectiles instead of creating/destroying
2. Optimize trajectory calculation (cache segments)
3. Limit overlap checks to nearby anchor points
4. Use sprite sheet for web animations

## Conclusion

The web swinging mechanics are now fully integrated into Story Adventure mode, providing:
- ✅ Seamless gameplay combining jumping and swinging
- ✅ Calculus-based physics that rewards correct answers
- ✅ Manual control for exploration between questions
- ✅ Clear visual feedback for all actions
- ✅ No code duplication or conflicts
- ✅ Clean architecture for future enhancements

Players now have a rich, physics-based experience where their calculus knowledge directly affects their ability to navigate the world through both automatic question responses and manual web swinging control.

