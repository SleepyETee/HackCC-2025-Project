# Rope Physics Implementation & Fixes

## Overview
Successfully implemented realistic rope-swinging physics with proper pendulum motion, constraint enforcement, and single-active-rope mechanics.

## Key Changes

### 1. Event Handler Fixes
**Issue:** Duplicate event listener registration causing conflicts
**Solution:**
- Consolidated left and right click handling into single `onPointerDown` handler
- Removed duplicate `pointerdown` event registration
- Right-click is now handled as an else branch, preventing conflicts

```typescript
private onPointerDown(pointer: Phaser.Input.Pointer) {
  if (pointer.leftButtonDown() && this.webs > 0) {
    // Left click for aiming
    this.isDragging = true;
    // ...
  }
  else if (pointer.rightButtonDown()) {
    // Right click for cutting
    this.onRightClick(pointer);
  }
}
```

### 2. Rope Constraint Enforcement
**Issue:** Physics acceleration interfering with rope constraint
**Solution:**
- Added `body.setAcceleration(0, 0)` after constraint application
- Prevents Arcade physics from reintroducing forces
- Ensures only gravity and tangential velocity affect the spider

```typescript
// Clear any acceleration that might interfere
body.setAcceleration(0, 0);
```

### 3. Single Rope System
**Issue:** Multiple web connections creating complex interactions
**Solution:**
- Implemented single active rope system
- Only one web can be attached at a time
- Proper detachment before attaching new rope
- Simplified web cutting logic

### 4. Physics Mechanics

#### Constraint Enforcement
- Vector projection to maintain fixed rope length
- Radial velocity removal (keeps tangential for pendulum swing)
- Positional correction when rope is overstretched
- Damping factor (0.25) for smooth motion

#### Velocity Management
- Corrected = Gravity 600 (easier)
- Wrong = Gravity 1000 (harder)
- Rope length adjusts: correct = 92% (tighter), wrong = 108% (slacker)

### 5. Platform Collisions
**Issue:** Static rectangles not creating physics collisions
**Solution:**
- Added `this.physics.add.existing(rect, true)` for static bodies
- Proper body offsets for accurate collision detection
- Added drag (0.5) to reduce jitter

### 6. Trajectory Calculation
**Issue:** Incorrect velocity/gravity scaling
**Solution:**
- Use actual physics world gravity: `this.physics.world.gravity.y`
- Apply `WEB_SHOT_SCALE` (6 px/s) for velocity
- Proper projectile motion simulation

## Technical Implementation

### Rope Length Constraint
```typescript
const L = this.activeWeb.ropeLength;
if (d > L) {
  // Project back to circle
  const targetX = ax + rhatx * L;
  const targetY = ay + rhaty * L;
  this.spider.setPosition(nx, ny);
  
  // Remove radial velocity
  const vr = vx * rhatx + vy * rhaty;
  const tx = vx - vr * rhatx;
  const ty = vy - vr * rhaty;
}
```

### Velocity Manipulation
- Radial velocity: Direction toward/away from anchor (removed)
- Tangential velocity: Direction perpendicular to radial (kept)
- Pendulum effect: Gravity + tangential velocity = swing motion

## Gameplay Impact

### Before
- Multiple webs could attach simultaneously
- No proper rope length constraint
- Physics acceleration interfered with swinging
- Platforms didn't provide proper collisions
- Right-click cutting had event conflicts

### After
- Single active rope with fixed length
- Realistic pendulum swing motion
- Smooth constraint enforcement
- Proper platform landing
- Clean right-click cutting
- Visual trajectory preview

## Testing Checklist

- [x] Build succeeds without errors
- [x] Single rope attaches correctly
- [x] Pendulum swing works properly
- [x] Rope can be cut with right-click
- [x] New rope replaces old rope
- [x] Platform collisions work
- [x] Trajectory preview is accurate
- [x] Correct/wrong answers affect gravity
- [x] No console errors
- [x] No event handler conflicts

## Code Quality Improvements

1. **Single Responsibility:** Each method handles one aspect of rope physics
2. **Clear Naming:** Descriptive method names (`enforceRopeConstraint`, `attachWeb`, etc.)
3. **Type Safety:** Proper TypeScript types for all rope-related data
4. **Performance:** Efficient constraint checking with early returns
5. **Maintainability:** Clear comments explaining physics calculations

## Future Enhancements

Potential improvements:
1. Add rope stretching animation
2. Implement rope sound effects
3. Add momentum transfer on rope cuts
4. Create special rope types (elastic, short, long)
5. Add rope breaking mechanics at max load
6. Implement chain of ropes for complex swings

## Physics Notes

### Pendulum Motion
- Pendulum swings due to gravity + tangential velocity
- Natural frequency depends on rope length and gravity
- Maximum swing angle occurs at lowest point
- Energy conservation (kinetic ↔ potential)

### Constraint Enforcement
- Must be applied every frame
- Positional correction prevents tunneling
- Velocity projection maintains swing motion
- Damping prevents infinite oscillations

### Arcade Physics Tips
- Use `setVelocity` for direct velocity control
- Use `setAcceleration` sparingly (clears after constraint)
- Position updates require `setPosition` for Arcade bodies
- Collision bounds need proper body setup
