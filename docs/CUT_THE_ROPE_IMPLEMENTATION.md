# 🎣 Cut The Rope Mechanics - Implementation Guide

## 📍 QUICK REFERENCE: Where is the Physics Code?

**Main File:** `src/game/adventure/CutTheRopeScene.ts` (650 lines)

### Key Physics Methods (Line Numbers):
- **Gravity Setup:** Line 302 `setupPhysics()` - Sets world gravity to 800
- **Spider Physics:** Line 154 `createSpider()` - Gravity, bounce, collision
- **Rope Cutting Physics:** Line 361 `cutRope()` - Line intersection detection
- **Hook-Shot Physics:** Line 437 `hookToAnchor()` - Force application (200 units)
- **Calculus Effects:** Line 503 `applyCalculusEffect()` - **DYNAMIC GRAVITY MODIFICATION**
  - Correct answer: Gravity = 600 (easier jumps)
  - Wrong answer: Gravity = 1000 (harder jumps)
- **Platform Collision:** Line 312 `setupPhysics()` - Adds colliders for spider-platforms

### Physics Properties:
```typescript
// Line 158-160: Spider physics body
this.spiderBody.setGravityY(800)
this.spiderBody.setCollideWorldBounds(true)
this.spiderBody.setBounce(0.2)

// Line 302: World gravity
this.physics.world.gravity.y = 800

// Line 503-512: Dynamic gravity modification
if (correct) {
  this.physics.world.gravity.y = 600  // Easier
} else {
  this.physics.world.gravity.y = 1000 // Harder
}

// Line 455-456: Hook-shot force
const force = 200
this.spiderBody.setVelocity(dx / distance * force, dy / distance * force)
```

---

## 🆕 NEW: React Spider-Man Web-Swinging Mode

**File:** `src/ui/SpiderManWebSwinging.tsx` (NEW - 850+ lines)

### Features:
- **Phaser-based web-swinging physics** with trajectory preview
- **Cut the Rope-style mechanics** - shoot webs to anchor points
- **Right-click to cut webs** for dynamic movement
- **5 adventure scenes** across 4 chapters
- **Gravity affected by answers** - correct = easier (600), wrong = harder (1000)
- **Web targets** pulse and glow to guide players
- **Complete level progression** with victory screens

### How It Works:
```typescript
// Line 361-425: Trajectory Physics
private drawTrajectory(angle: number, power: number) {
  // Simulates projectile motion with gravity
  const x = startX + power * Math.cos(angle) * t;
  const y = startY + power * Math.sin(angle) * t + 0.5 * gravity * t * t;
}

// Line 547-559: Web Force Application
this.spider.setAcceleration(dx * 0.1, dy * 0.1);

// Line 427-488: Web Cutting Mechanics
private cutNearestWeb(x: number, y: number) {
  // Finds nearest web line and cuts it
  const dist = this.pointToLineDistance(px, py, x1, y1, x2, y2);
}
```

### Integration:
This component is standalone and can be added to the adventure mode selector. It uses the same event system as existing modes:
- `request-question` event to request questions
- `spidercalc-answer` event to submit answers

### Controls:
- 🖱️ **Left Click + Drag**: Aim and shoot web
- ✂️ **Right Click**: Cut nearest web
- 🎯 **Goal**: Reach green target to complete level

### Question Types:
- **🦘 JUMP Questions**: Enable jumping between platforms
- **🕸️ WEB Questions**: Enable web shooting mechanics

---

## ✅ Successfully Integrated into Story Adventure Mode!
