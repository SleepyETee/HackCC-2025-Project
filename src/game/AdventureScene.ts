import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getScene, getQuestionsForScene, getNextScene, type StoryScene, type Obstacle } from './adventure'

export default class AdventureScene extends Phaser.Scene {
  spider!: Phaser.GameObjects.Container
  spiderBody!: Phaser.GameObjects.Arc
  currentScene!: StoryScene
  platforms: Phaser.GameObjects.Rectangle[] = []
  obstacles: Phaser.GameObjects.Graphics[] = []
  webPoints: Phaser.GameObjects.Arc[] = []
  webLine!: Phaser.GameObjects.Graphics
  goalMarker!: Phaser.GameObjects.Container
  
  // Physics
  spiderVelocity = { x: 0, y: 0 }
  gravity = 0.5
  isGrounded = false
  canJump = false
  canShootWeb = false
  webAttached = false
  webAnchor = { x: 0, y: 0 }
  
  // Background elements
  backgroundElements: Phaser.GameObjects.Graphics[] = []
  moonLight!: Phaser.GameObjects.Arc
  
  create() {
    console.log('🕷️ AdventureScene.create() - Starting adventure!')
    
    // Load initial scene
    const store = useGameStore.getState()
    const sceneId = store.currentSceneId || 'ch1-s1'
    this.currentScene = getScene(sceneId) || getScene('ch1-s1')!
    
    // Create background based on scene
    this.createBackground()
    
    // Create spider character
    this.createSpider()
    
    // Create obstacles and platforms
    this.createObstacles()
    
    // Create goal marker
    this.createGoal()
    
    // Create web line (initially hidden)
    this.webLine = this.add.graphics()
    
    // Listen for game events
    window.addEventListener('spidercalc-action', this.handleAction)
    
    console.log('✅ AdventureScene initialized!', this.currentScene.title)
  }
  
  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAction)
  }
  
  update() {
    // Apply gravity
    if (!this.isGrounded) {
      this.spiderVelocity.y += this.gravity
    }
    
    // Update spider position
    this.spider.x += this.spiderVelocity.x
    this.spider.y += this.spiderVelocity.y
    
    // Check platform collisions
    this.checkPlatformCollisions()
    
    // Handle web physics
    if (this.webAttached) {
      this.handleWebSwing()
    }
    
    // Update web line rendering
    this.updateWebLine()
    
    // Check if reached goal
    this.checkGoalReached()
    
    // Apply friction when grounded
    if (this.isGrounded) {
      this.spiderVelocity.x *= 0.85
      if (Math.abs(this.spiderVelocity.x) < 0.1) {
        this.spiderVelocity.x = 0
      }
    }
    
    // Limit spider to screen bounds
    const W = this.scale.width
    const H = this.scale.height
    if (this.spider.x < 0) this.spider.x = 0
    if (this.spider.x > W) this.spider.x = W
    if (this.spider.y > H) {
      // Fell off screen - reset to start
      this.resetSpiderPosition()
    }
  }
  
  private createBackground() {
    const W = this.scale.width
    const H = this.scale.height
    const bg = this.add.graphics()
    
    // Background color based on scene
    switch (this.currentScene.backgroundDescription) {
      case 'dark-entrance':
        // Dark gradient
        bg.fillGradientStyle(0x1a0033, 0x1a0033, 0x0a001a, 0x0a001a, 1)
        bg.fillRect(0, 0, W, H)
        // Add spooky trees silhouettes
        this.addTreeSilhouettes(bg)
        break
        
      case 'chandelier-hall':
        // Purple/gold ambiance
        bg.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1a0f2e, 0x1a0f2e, 1)
        bg.fillRect(0, 0, W, H)
        // Add chandelier glow
        this.moonLight = this.add.circle(400, 100, 40, 0xffd700, 0.3)
        this.tweens.add({
          targets: this.moonLight,
          alpha: 0.5,
          scale: 1.2,
          duration: 2000,
          yoyo: true,
          repeat: -1
        })
        break
        
      case 'locked-door':
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0f1e, 0x0f0f1e, 1)
        bg.fillRect(0, 0, W, H)
        break
        
      case 'library-shelves':
        bg.fillGradientStyle(0x2e1a1a, 0x2e1a1a, 0x1a0f0a, 0x1a0f0a, 1)
        bg.fillRect(0, 0, W, H)
        // Add floating book particles
        this.addFloatingBooks()
        break
        
      case 'scroll-room':
        bg.fillGradientStyle(0x2e2e1a, 0x2e2e1a, 0x1a1a0f, 0x1a1a0f, 1)
        bg.fillRect(0, 0, W, H)
        break
        
      case 'narrow-ledge':
        bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x000000, 0x000000, 1)
        bg.fillRect(0, 0, W, H)
        // Add abyss effect
        this.addAbyssEffect()
        break
        
      case 'throne-room':
        bg.fillGradientStyle(0x3d1a4e, 0x3d1a4e, 0x2d0a3e, 0x2d0a3e, 1)
        bg.fillRect(0, 0, W, H)
        // Add crown glow
        this.addCrownGlow()
        break
        
      default:
        bg.fillStyle(0x0a0a0f, 1)
        bg.fillRect(0, 0, W, H)
    }
    
    // Add moon in corner
    if (!this.moonLight) {
      this.moonLight = this.add.circle(W - 80, 80, 30, 0xffffcc, 0.8)
      this.tweens.add({
        targets: this.moonLight,
        alpha: 0.6,
        duration: 3000,
        yoyo: true,
        repeat: -1
      })
    }
    
    // Add atmospheric particles (dust/mist)
    for (let i = 0; i < 30; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.1, 0.3)
      )
      
      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0,
        duration: Phaser.Math.Between(5000, 10000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000)
      })
    }
  }
  
  private addTreeSilhouettes(bg: Phaser.GameObjects.Graphics) {
    bg.fillStyle(0x000000, 0.5)
    // Simple tree shapes
    for (let i = 0; i < 5; i++) {
      const x = i * 200 + 50
      const y = 450
      bg.fillTriangle(x, y, x + 30, y - 80, x + 60, y)
    }
  }
  
  private addFloatingBooks() {
    for (let i = 0; i < 8; i++) {
      const book = this.add.rectangle(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(50, 400),
        20,
        30,
        0x8b4513,
        0.6
      )
      
      this.tweens.add({
        targets: book,
        y: book.y - 30,
        rotation: 0.3,
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }
  
  private addAbyssEffect() {
    const W = this.scale.width
    const H = this.scale.height
    const abyss = this.add.graphics()
    abyss.fillGradientStyle(0x000000, 0x000000, 0x1a0033, 0x1a0033, 1, 0.8, 0.3, 0.8)
    abyss.fillRect(0, H - 200, W, 200)
  }
  
  private addCrownGlow() {
    const goal = this.currentScene.goal
    const glow = this.add.circle(goal.x, goal.y, 50, 0xffd700, 0.2)
    this.tweens.add({
      targets: glow,
      scale: 1.5,
      alpha: 0.4,
      duration: 1500,
      yoyo: true,
      repeat: -1
    })
  }
  
  private createSpider() {
    const pos = this.currentScene.spiderPosition
    this.spider = this.add.container(pos.x, pos.y)
    
    // Spider body - larger and more detailed
    this.spiderBody = this.add.circle(0, 0, 12, 0x8b4789)
    this.spider.add(this.spiderBody)
    
    // Spider eyes
    const eye1 = this.add.circle(-4, -3, 2, 0xff0000)
    const eye2 = this.add.circle(4, -3, 2, 0xff0000)
    this.spider.add([eye1, eye2])
    
    // Spider legs - 8 legs
    const legColor = 0x5a3a5a
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4) - Math.PI / 2
      const leg = this.add.line(
        0, 0,
        0, 0,
        Math.cos(angle) * 18,
        Math.sin(angle) * 18,
        legColor
      )
      leg.setLineWidth(2)
      this.spider.add(leg)
    }
    
    // Idle animation
    this.tweens.add({
      targets: this.spider,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    console.log('Spider created at:', pos)
  }
  
  private createObstacles() {
    this.currentScene.obstacles.forEach(obs => {
      switch (obs.type) {
        case 'platform':
          this.createPlatform(obs)
          break
        case 'gap':
          this.createGap(obs)
          break
        case 'wall':
          this.createWall(obs)
          break
        case 'web-point':
          this.createWebPoint(obs)
          break
      }
    })
  }
  
  private createPlatform(obs: Obstacle) {
    const platform = this.add.rectangle(
      obs.x + (obs.width || 0) / 2,
      obs.y + (obs.height || 0) / 2,
      obs.width || 100,
      obs.height || 20,
      0x4a4a4a
    )
    platform.setStrokeStyle(2, 0x6a6a6a)
    this.platforms.push(platform)
    
    // Add some texture
    const texture = this.add.graphics()
    texture.fillStyle(0x3a3a3a, 0.5)
    for (let i = 0; i < 5; i++) {
      texture.fillRect(
        obs.x + i * ((obs.width || 100) / 5),
        obs.y,
        2,
        obs.height || 20
      )
    }
  }
  
  private createGap(obs: Obstacle) {
    // Visual indicator of gap
    const gap = this.add.graphics()
    gap.fillStyle(0x000000, 0.3)
    gap.fillRect(obs.x, obs.y || 400, obs.width || 100, obs.height || 200)
    
    // Add warning stripes
    gap.lineStyle(2, 0xff0000, 0.5)
    for (let i = 0; i < 10; i += 2) {
      gap.beginPath()
      gap.moveTo(obs.x + i * 10, obs.y || 400)
      gap.lineTo(obs.x + (i + 1) * 10, obs.y || 400)
      gap.strokePath()
    }
    
    this.obstacles.push(gap)
  }
  
  private createWall(obs: Obstacle) {
    const wall = this.add.rectangle(
      obs.x + (obs.width || 0) / 2,
      obs.y + (obs.height || 0) / 2,
      obs.width || 50,
      obs.height || 400,
      0x2a2a2a
    )
    wall.setStrokeStyle(3, 0xff6600)
    this.platforms.push(wall)
    
    // Add mystical runes
    const runes = ['∫', '∂', 'Σ', 'π', '∞']
    for (let i = 0; i < 3; i++) {
      const rune = this.add.text(
        obs.x + (obs.width || 50) / 2,
        obs.y + i * 80 + 50,
        runes[i % runes.length],
        {
          fontSize: '24px',
          color: '#ff6600'
        }
      ).setOrigin(0.5)
      
      this.tweens.add({
        targets: rune,
        alpha: 0.3,
        duration: 1500,
        yoyo: true,
        repeat: -1
      })
    }
  }
  
  private createWebPoint(obs: Obstacle) {
    const point = this.add.circle(obs.x, obs.y, 8, 0xffd700)
    point.setStrokeStyle(2, 0xffaa00)
    this.webPoints.push(point)
    
    // Pulsing animation
    this.tweens.add({
      targets: point,
      scale: 1.3,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
    
    // Add icon
    const icon = this.add.text(obs.x, obs.y, '🕸️', {
      fontSize: '16px'
    }).setOrigin(0.5)
  }
  
  private createGoal() {
    const goal = this.currentScene.goal
    this.goalMarker = this.add.container(goal.x, goal.y)
    
    // Goal platform
    const goalPlatform = this.add.rectangle(0, 0, 80, 60, 0x00ff00, 0.3)
    goalPlatform.setStrokeStyle(3, 0x00ff00)
    this.goalMarker.add(goalPlatform)
    
    // Goal flag
    const flag = this.add.triangle(0, -30, -10, 0, -10, -20, 10, -10, 0xffd700)
    this.goalMarker.add(flag)
    
    // Goal text
    const text = this.add.text(0, 40, '🎯 GOAL', {
      fontSize: '14px',
      color: '#00ff00'
    }).setOrigin(0.5)
    this.goalMarker.add(text)
    
    // Pulsing animation
    this.tweens.add({
      targets: this.goalMarker,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
  }
  
  private checkPlatformCollisions() {
    const spiderBottom = this.spider.y + 12 // Spider radius
    const spiderTop = this.spider.y - 12
    const spiderLeft = this.spider.x - 12
    const spiderRight = this.spider.x + 12
    
    this.isGrounded = false
    
    this.platforms.forEach(platform => {
      const bounds = platform.getBounds()
      
      // Check if spider is above platform and falling onto it
      if (
        spiderBottom >= bounds.top &&
        spiderBottom <= bounds.bottom &&
        spiderRight >= bounds.left &&
        spiderLeft <= bounds.right &&
        this.spiderVelocity.y >= 0
      ) {
        // Land on platform
        this.spider.y = bounds.top - 12
        this.spiderVelocity.y = 0
        this.isGrounded = true
        this.canJump = true
        this.canShootWeb = true
      }
      
      // Check side collisions (walls)
      if (
        spiderBottom > bounds.top &&
        spiderTop < bounds.bottom
      ) {
        if (spiderRight > bounds.left && spiderRight < bounds.right) {
          this.spider.x = bounds.left - 12
          this.spiderVelocity.x = 0
        }
        if (spiderLeft < bounds.right && spiderLeft > bounds.left) {
          this.spider.x = bounds.right + 12
          this.spiderVelocity.x = 0
        }
      }
    })
  }
  
  private handleWebSwing() {
    // Web swing physics (pendulum motion)
    const dx = this.spider.x - this.webAnchor.x
    const dy = this.spider.y - this.webAnchor.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const webLength = 150 // Fixed web length
    
    if (dist > webLength) {
      // Pull spider toward anchor
      const angle = Math.atan2(dy, dx)
      const pullX = Math.cos(angle) * (dist - webLength) * 0.1
      const pullY = Math.sin(angle) * (dist - webLength) * 0.1
      
      this.spiderVelocity.x -= pullX
      this.spiderVelocity.y -= pullY
    }
    
    // Apply pendulum force
    const tension = 0.02
    this.spiderVelocity.x -= dx * tension
    this.spiderVelocity.y -= dy * tension
  }
  
  private updateWebLine() {
    this.webLine.clear()
    
    if (this.webAttached) {
      // Draw web strand
      this.webLine.lineStyle(2, 0xffffff, 0.8)
      this.webLine.beginPath()
      this.webLine.moveTo(this.spider.x, this.spider.y)
      this.webLine.lineTo(this.webAnchor.x, this.webAnchor.y)
      this.webLine.strokePath()
      
      // Add shimmer effect
      this.webLine.lineStyle(1, 0x00e5ff, 0.5)
      this.webLine.beginPath()
      this.webLine.moveTo(this.spider.x, this.spider.y)
      this.webLine.lineTo(this.webAnchor.x, this.webAnchor.y)
      this.webLine.strokePath()
    }
  }
  
  private checkGoalReached() {
    const goal = this.currentScene.goal
    const dist = Phaser.Math.Distance.Between(
      this.spider.x,
      this.spider.y,
      goal.x,
      goal.y
    )
    
    if (dist < 50) {
      this.onGoalReached()
    }
  }
  
  private onGoalReached() {
    console.log('🎉 Goal reached!')
    
    // Celebration effect
    const W = this.scale.width / 2
    const H = this.scale.height / 2
    
    const celebration = this.add.text(W, H, '✨ GOAL REACHED! ✨', {
      fontSize: '48px',
      color: '#00ff00',
      stroke: '#003300',
      strokeThickness: 6
    }).setOrigin(0.5).setAlpha(0)
    
    this.tweens.add({
      targets: celebration,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      ease: 'Elastic.easeOut',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          celebration.destroy()
          this.loadNextScene()
        })
      }
    })
    
    // Add points
    const store = useGameStore.getState()
    store.addScore(500)
  }
  
  private loadNextScene() {
    const nextScene = getNextScene(this.currentScene.id)
    
    if (nextScene) {
      console.log('Loading next scene:', nextScene.title)
      const store = useGameStore.getState()
      store.setCurrentSceneId(nextScene.id)
      
      // Reset the scene
      this.scene.restart()
    } else {
      console.log('🎊 ADVENTURE COMPLETE!')
      this.showVictoryScreen()
    }
  }
  
  private showVictoryScreen() {
    const W = this.scale.width / 2
    const H = this.scale.height / 2
    
    const victory = this.add.text(W, H, '👑 YOU WIN! 👑\nThe Derivative Crown is yours!', {
      fontSize: '42px',
      color: '#ffd700',
      stroke: '#663300',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5)
    
    this.tweens.add({
      targets: victory,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
  }
  
  private resetSpiderPosition() {
    const pos = this.currentScene.spiderPosition
    this.spider.setPosition(pos.x, pos.y)
    this.spiderVelocity = { x: 0, y: 0 }
    this.webAttached = false
  }
  
  private handleAction = (e: Event) => {
    const event = e as CustomEvent
    const { action, correct } = event.detail
    
    console.log('Action triggered:', action, 'Correct:', correct)
    
    if (action === 'jump' && this.canJump) {
      this.performJump(correct)
    } else if (action === 'web' && this.canShootWeb) {
      this.performWebShoot(correct)
    }
  }
  
  private performJump(correct: boolean) {
    console.log('🦘 JUMP!')
    
    // Jump power based on correctness
    const jumpPower = correct ? -15 : -10
    const forwardPower = correct ? 8 : 4
    
    this.spiderVelocity.y = jumpPower
    this.spiderVelocity.x = forwardPower
    this.canJump = false
    this.isGrounded = false
    
    // Visual effect
    const jumpEffect = this.add.circle(this.spider.x, this.spider.y, 15, 0x00ff00, 0.6)
    this.tweens.add({
      targets: jumpEffect,
      scale: 2,
      alpha: 0,
      duration: 400,
      onComplete: () => jumpEffect.destroy()
    })
    
    // Rotate spider during jump
    this.tweens.add({
      targets: this.spider,
      rotation: correct ? Math.PI * 2 : Math.PI,
      duration: 600,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.spider.rotation = 0
      }
    })
  }
  
  private performWebShoot(correct: boolean) {
    console.log('🕸️ WEB SHOOT!')
    
    // Find closest web point
    let closestPoint: Phaser.GameObjects.Arc | null = null
    let closestDist = Infinity
    
    this.webPoints.forEach(point => {
      const dist = Phaser.Math.Distance.Between(
        this.spider.x, this.spider.y,
        point.x, point.y
      )
      
      if (dist < closestDist) {
        closestPoint = point
        closestDist = dist
      }
    })
    
    if (closestPoint && (correct || closestDist < 300)) {
      const point = closestPoint as Phaser.GameObjects.Arc
      // Attach web
      this.webAnchor = { x: point.x, y: point.y }
      this.webAttached = true
      this.canShootWeb = false
      
      // Add initial swing velocity
      const angle = Math.atan2(
        point.y - this.spider.y,
        point.x - this.spider.x
      )
      this.spiderVelocity.x += Math.cos(angle) * (correct ? 6 : 3)
      this.spiderVelocity.y += Math.sin(angle) * (correct ? 6 : 3)
      
      // Flash effect on web point
      this.tweens.add({
        targets: point,
        scale: 2,
        duration: 200,
        yoyo: true
      })
      
      // Auto-release web after a while
      this.time.delayedCall(2000, () => {
        this.webAttached = false
        this.canShootWeb = true
      })
    } else {
      // Failed web shot
      const failText = this.add.text(this.spider.x, this.spider.y - 30, '❌ MISS', {
        fontSize: '16px',
        color: '#ff0000'
      }).setOrigin(0.5)
      
      this.tweens.add({
        targets: failText,
        alpha: 0,
        y: failText.y - 30,
        duration: 1000,
        onComplete: () => failText.destroy()
      })
    }
  }
}

