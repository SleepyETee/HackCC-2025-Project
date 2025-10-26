import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getSceneById, getQuestionByScene, getNextScene, isSceneCompleted, type AdventureScene as AdventureSceneData } from './adventure'
import { audioManager } from './AudioManager'

/**
 * ADVENTURE SCENE - Story-driven platformer with physics-based gameplay
 * Features jump/web mechanics, scene progression, and story integration
 */

type WebConnection = {
  point: Phaser.GameObjects.Arc
  line: Phaser.GameObjects.Line
  isActive: boolean
}

export default class AdventureScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AdventureScene' })
    console.log('🏗️ AdventureScene constructor called')
  }
  
  // Scene data
  currentSceneData!: AdventureSceneData
  currentSceneId = 'ch1-s1'
  
  // Spider character
  spider!: Phaser.Physics.Arcade.Sprite
  spiderBody!: Phaser.Physics.Arcade.Body
  
  // Game objects
  platforms: Phaser.Physics.Arcade.StaticGroup = this.physics.add.staticGroup()
  webPoints: Phaser.GameObjects.Group = this.add.group()
  obstacles: Phaser.Physics.Arcade.Group = this.physics.add.group()
  webConnections: WebConnection[] = []
  
  // Physics state
  isWebSwinging = false
  webSwingPoint: Phaser.GameObjects.Arc | null = null
  webSwingAngle = 0
  webSwingVelocity = 0
  webSwingLength = 0
  
  // Game state
  lives = 3
  score = 0
  isAnimating = false
  isGameOver = false
  waitingForAnswer = false
  
  // UI
  livesDisplay!: Phaser.GameObjects.Container
  scoreText!: Phaser.GameObjects.Text
  sceneTitleText!: Phaser.GameObjects.Text
  feedbackText!: Phaser.GameObjects.Text
  
  // Camera
  cameraFollowY = 0
  
  preload() {
    console.log('📦 AdventureScene preload called')
    
    // Load sound effects
    this.load.audio('punch-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('fart-sound', '/sounds/dry-fart.mp3')
    this.load.audio('jump-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('web-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('victory-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    
    // Create spider texture
    this.createSpiderTexture()
    
    // Create platform textures
    this.createPlatformTextures()
    
    // Create web point texture
    this.createWebPointTexture()
    
    console.log('✅ AdventureScene preload completed')
  }
  
  create() {
    console.log('🎮 AdventureScene - Story-driven platformer!')
    
    // Create a simple test background first
    this.add.rectangle(400, 300, 800, 600, 0x2d1b4e)
    this.add.text(400, 200, '🕷️ Adventure Mode', {
      fontSize: '48px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.add.text(400, 300, 'The Calculus Chronicles', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    this.add.text(400, 400, 'Loading scene...', {
      fontSize: '18px',
      color: '#88ccff'
    }).setOrigin(0.5)
    
    // Reset game state
    this.resetGameState()
    
    // Load current scene
    this.loadScene(this.currentSceneId)
    
    // Create spider
    this.createSpider()
    
    // Create UI
    this.createUI()
    
    // Setup physics
    this.setupPhysics()
    
    // Setup camera
    this.setupCamera()
    
    // Listen for answers
    window.addEventListener('spidercalc-action', this.handleAnswer as EventListener)
    
    // Load first question
    this.requestQuestion()
    
    console.log('✅ Adventure scene ready!')
  }
  
  private resetGameState() {
    this.lives = 3
    this.score = 0
    this.isAnimating = false
    this.isGameOver = false
    this.waitingForAnswer = false
    this.isWebSwinging = false
    this.webSwingPoint = null
    this.webConnections = []
    
    // Reset store
    const store = useGameStore.getState()
    store.addScore(-store.score)
    store.setCurrentAdventureQuestion(null)
    
    console.log('🔄 Adventure game state reset')
  }
  
  private loadScene(sceneId: string) {
    console.log('🔍 Attempting to load scene:', sceneId)
    this.currentSceneId = sceneId
    this.currentSceneData = getSceneById(sceneId)!
    
    console.log('📊 Scene data:', this.currentSceneData)
    
    if (!this.currentSceneData) {
      console.error('Scene not found:', sceneId)
      // Create a fallback scene
      this.createFallbackScene()
      return
    }
    
    console.log(`📖 Loading scene: ${this.currentSceneData.name}`)
    
    // Clear existing objects
    this.platforms.clear(true, true)
    this.webPoints.clear(true, true)
    this.obstacles.clear(true, true)
    this.webConnections = []
    
    // Create background
    this.createBackground()
    
    // Create platforms
    this.createPlatforms()
    
    // Create web points
    this.createWebPoints()
    
    // Create obstacles
    this.createObstacles()
    
    // Create goal
    this.createGoal()
  }
  
  private createFallbackScene() {
    console.log('Creating fallback scene')
    
    // Create simple platforms
    this.platforms.create(100, 500, 'platform-solid').setDisplaySize(200, 20).setTint(0x8b5cf6)
    this.platforms.create(400, 400, 'platform-solid').setDisplaySize(200, 20).setTint(0x8b5cf6)
    this.platforms.create(700, 300, 'platform-solid').setDisplaySize(200, 20).setTint(0x8b5cf6)
    
    // Create simple goal
    this.add.circle(800, 280, 30, 0x00ff00, 0.8)
    this.add.text(800, 250, '🎯 GOAL', {
      fontSize: '16px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5)
  }
  
  private createBackground() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create gradient background based on scene theme
    const bg = this.add.graphics()
    
    switch (this.currentSceneData.background) {
      case 'haunted-mansion-entrance':
        bg.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1a0f2e, 0x1a0f2e, 1)
        break
      case 'grand-hall-chandeliers':
        bg.fillGradientStyle(0x4a3020, 0x4a3020, 0x2a1810, 0x2a1810, 1)
        break
      case 'mystical-library':
        bg.fillGradientStyle(0x3d2914, 0x3d2914, 0x1a0f0a, 0x1a0f0a, 1)
        break
      case 'limit-chamber':
        bg.fillGradientStyle(0x0f3460, 0x0f3460, 0x062a4a, 0x062a4a, 1)
        break
      case 'royal-throne-room':
        bg.fillGradientStyle(0x4a1a1a, 0x4a1a1a, 0x2a0f0f, 0x2a0f0f, 1)
        break
      default:
        bg.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1a0f2e, 0x1a0f2e, 1)
    }
    
    bg.fillRect(0, 0, W, H)
    bg.setDepth(-1000)
  }
  
  private createPlatforms() {
    this.currentSceneData.platforms.forEach((platform, index) => {
      const platformSprite = this.platforms.create(platform.x, platform.y, `platform-${platform.type}`) as Phaser.Physics.Arcade.Sprite
      platformSprite.setDisplaySize(platform.width, platform.height)
      platformSprite.setTint(platform.color || 0x8b5cf6)
      platformSprite.setDepth(100)
      
      // Add platform-specific behavior
      if (platform.type === 'fading') {
        this.addFadingPlatformBehavior(platformSprite, index)
      } else if (platform.type === 'moving') {
        this.addMovingPlatformBehavior(platformSprite, index)
      } else if (platform.type === 'bouncy') {
        this.addBouncyPlatformBehavior(platformSprite)
      }
    })
  }
  
  private createWebPoints() {
    this.currentSceneData.webPoints.forEach((webPoint, index) => {
      const point = this.add.circle(webPoint.x, webPoint.y, webPoint.radius, webPoint.color, 0.8)
      point.setDepth(200)
      
      // Add glow effect
      const glow = this.add.circle(webPoint.x, webPoint.y, webPoint.radius + 10, webPoint.glowColor, 0.3)
      glow.setDepth(199)
      
      // Add pulsing animation
      this.tweens.add({
        targets: [point, glow],
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      // Make interactive
      point.setInteractive()
      point.on('pointerover', () => {
        point.setFillStyle(0xffffff)
        glow.setFillStyle(0xffffff)
      })
      point.on('pointerout', () => {
        point.setFillStyle(webPoint.color)
        glow.setFillStyle(webPoint.glowColor)
      })
      
      this.webPoints.add(point)
    })
  }
  
  private createObstacles() {
    this.currentSceneData.obstacles.forEach((obstacle, index) => {
      const obstacleSprite = this.obstacles.create(obstacle.x, obstacle.y, 'platform-solid') as Phaser.Physics.Arcade.Sprite
      obstacleSprite.setDisplaySize(obstacle.width, obstacle.height)
      obstacleSprite.setTint(obstacle.color)
      obstacleSprite.setDepth(150)
      
      // Add obstacle-specific behavior
      this.addObstacleBehavior(obstacleSprite, obstacle.type)
    })
  }
  
  private createGoal() {
    const goal = this.currentSceneData.goal
    const goalSprite = this.add.circle(goal.x, goal.y, 30, 0x00ff00, 0.8)
    goalSprite.setDepth(300)
    
    // Add goal text
    const goalText = this.add.text(goal.x, goal.y - 50, '🎯 GOAL', {
      fontSize: '16px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    goalText.setDepth(301)
    
    // Add pulsing animation
    this.tweens.add({
      targets: goalSprite,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
  
  private createSpider() {
    // Create spider sprite
    this.spider = this.physics.add.sprite(100, 400, 'spider')
    this.spider.setDisplaySize(40, 40)
    this.spider.setDepth(250)
    
    // Setup spider physics
    this.spiderBody = this.spider.body as Phaser.Physics.Arcade.Body
    this.spiderBody.setCollideWorldBounds(true)
    this.spiderBody.setBounce(0.2)
    this.spiderBody.setDragX(100)
    
    // Collision with platforms
    this.physics.add.collider(this.spider, this.platforms)
    this.physics.add.collider(this.spider, this.obstacles, this.handleObstacleCollision as any, undefined, this)
  }
  
  private createUI() {
    const W = this.scale.width
    
    // Lives display
    this.livesDisplay = this.add.container(20, 20)
    this.updateLivesDisplay()
    
    // Score text
    this.scoreText = this.add.text(W - 20, 20, 'Score: 0', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(1, 0)
    this.scoreText.setDepth(1000)
    
    // Scene title
    this.sceneTitleText = this.add.text(W / 2, 20, this.currentSceneData.name, {
      fontSize: '20px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0)
    this.sceneTitleText.setDepth(1000)
    
    // Feedback text
    this.feedbackText = this.add.text(W / 2, 60, '', {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0)
    this.feedbackText.setDepth(1000)
  }
  
  private setupPhysics() {
    // Set gravity
    this.physics.world.gravity.y = 800
    
    // Collision detection
    this.physics.world.on('worldbounds', this.handleWorldBounds, this)
  }
  
  private setupCamera() {
    // Camera follows spider
    this.cameras.main.startFollow(this.spider, true, 0.1, 0.1)
    this.cameras.main.setBounds(0, 0, this.scale.width, this.scale.height)
  }
  
  private createSpiderTexture() {
    const graphics = this.add.graphics()
    
    // Spider body
    graphics.fillStyle(0x8b5cf6, 1)
    graphics.fillCircle(20, 20, 8)
    
    // Spider legs
    graphics.lineStyle(3, 0x8b5cf6, 1)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4
      const startX = 20 + Math.cos(angle) * 8
      const startY = 20 + Math.sin(angle) * 8
      const endX = 20 + Math.cos(angle) * 15
      const endY = 20 + Math.sin(angle) * 15
      
      graphics.beginPath()
      graphics.moveTo(startX, startY)
      graphics.lineTo(endX, endY)
      graphics.strokePath()
    }
    
    graphics.generateTexture('spider', 40, 40)
    graphics.destroy()
  }
  
  private createPlatformTextures() {
    const types = ['solid', 'moving', 'fading', 'bouncy']
    
    types.forEach(type => {
      const graphics = this.add.graphics()
      
      switch (type) {
        case 'solid':
          graphics.fillStyle(0x8b5cf6, 1)
          graphics.fillRect(0, 0, 100, 20)
          break
        case 'moving':
          graphics.fillStyle(0xf59e0b, 1)
          graphics.fillRect(0, 0, 100, 20)
          break
        case 'fading':
          graphics.fillStyle(0x06b6d4, 1)
          graphics.fillRect(0, 0, 100, 20)
          break
        case 'bouncy':
          graphics.fillStyle(0x10b981, 1)
          graphics.fillRect(0, 0, 100, 20)
          break
      }
      
      graphics.generateTexture(`platform-${type}`, 100, 20)
      graphics.destroy()
    })
  }
  
  private createWebPointTexture() {
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffd700, 1)
    graphics.fillCircle(15, 15, 15)
    graphics.generateTexture('web-point', 30, 30)
    graphics.destroy()
  }
  
  private addFadingPlatformBehavior(platform: Phaser.Physics.Arcade.Sprite, index: number) {
    // Fade in and out
    this.tweens.add({
      targets: platform,
      alpha: 0.3,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      delay: index * 500,
      ease: 'Sine.easeInOut'
    })
  }
  
  private addMovingPlatformBehavior(platform: Phaser.Physics.Arcade.Sprite, index: number) {
    // Move back and forth
    this.tweens.add({
      targets: platform,
      x: platform.x + 100,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      delay: index * 1000,
      ease: 'Sine.easeInOut'
    })
  }
  
  private addBouncyPlatformBehavior(platform: Phaser.Physics.Arcade.Sprite) {
    // Make platform bouncy
    platform.setBounce(0.8)
  }
  
  private addObstacleBehavior(obstacle: Phaser.Physics.Arcade.Sprite, type: string) {
    switch (type) {
      case 'spike':
        // Spikes damage on contact
        break
      case 'fire':
        // Fire damage over time
        this.tweens.add({
          targets: obstacle,
          alpha: 0.5,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
      case 'ice':
        // Ice slows movement
        break
      case 'electric':
        // Electric damage
        this.tweens.add({
          targets: obstacle,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
      case 'void':
        // Void damage
        this.tweens.add({
          targets: obstacle,
          alpha: 0.3,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
        break
    }
  }
  
  private updateLivesDisplay() {
    this.livesDisplay.removeAll(true)
    
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(i * 30, 0, 'spider')
      heart.setDisplaySize(20, 20)
      heart.setTint(i < this.lives ? 0xff0000 : 0x444444)
      this.livesDisplay.add(heart)
    }
  }
  
  private requestQuestion() {
    if (this.waitingForAnswer) return
    
    this.waitingForAnswer = true
    const question = getQuestionByScene(this.currentSceneId)
    
    // Set question in store
    const store = useGameStore.getState()
    store.setCurrentAdventureQuestion(question)
    
    console.log('❓ Question requested:', question.text)
  }
  
  private handleAnswer = (event: Event) => {
    if (!this.waitingForAnswer || this.isAnimating) return
    
    const customEvent = event as CustomEvent
    const { action, correct } = customEvent.detail
    this.waitingForAnswer = false
    this.isAnimating = true
    
    console.log(`🎯 Answer received: ${action}, correct: ${correct}`)
    
    // Execute action based on answer
    if (action === 'jump') {
      this.executeJump(correct)
    } else if (action === 'web') {
      this.executeWebShot(correct)
    }
    
    // Update score
    if (correct) {
      this.score += 100
      this.showFeedback('✅ Correct! +100 points', 0x00ff00)
      this.sound.play('victory-sound', { volume: 0.3 })
    } else {
      this.score -= 50
      this.showFeedback('❌ Wrong! -50 points', 0xff0000)
      this.sound.play('fart-sound', { volume: 0.5 })
    }
    
    this.scoreText.setText(`Score: ${this.score}`)
    
    // Check if goal reached
    setTimeout(() => {
      this.checkGoalReached()
    }, 1000)
  }
  
  private executeJump(correct: boolean) {
    const jumpPower = correct ? 400 : 200
    const jumpAngle = correct ? -90 : -60
    
    // Apply jump force
    this.spiderBody.setVelocityY(jumpPower * Math.sin(jumpAngle * Math.PI / 180))
    this.spiderBody.setVelocityX(correct ? 150 : 75)
    
    // Play jump sound
    this.sound.play('jump-sound', { volume: 0.4 })
    
    // Add jump animation
    this.tweens.add({
      targets: this.spider,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Sine.easeInOut'
    })
  }
  
  private executeWebShot(correct: boolean) {
    // Find closest web point
    const closestPoint = this.findClosestWebPoint()
    
    if (!closestPoint) {
      console.log('No web point found')
      this.isAnimating = false
      return
    }
    
    if (correct) {
      // Successful web shot
      this.attachWeb(closestPoint)
      this.sound.play('web-sound', { volume: 0.3 })
    } else {
      // Failed web shot - shorter range
      const distance = Phaser.Math.Distance.Between(
        this.spider.x, this.spider.y,
        closestPoint.x, closestPoint.y
      )
      
      if (distance < 100) {
        this.attachWeb(closestPoint)
      } else {
        console.log('Web shot missed - too far')
      }
    }
  }
  
  private findClosestWebPoint(): Phaser.GameObjects.Arc | null {
    let closestPoint: Phaser.GameObjects.Arc | null = null
    let closestDistance = Infinity
    
    this.webPoints.children.entries.forEach(point => {
      const pointObj = point as Phaser.GameObjects.Arc
      const distance = Phaser.Math.Distance.Between(
        this.spider.x, this.spider.y,
        pointObj.x, pointObj.y
      )
      
      if (distance < closestDistance) {
        closestDistance = distance
        closestPoint = point as Phaser.GameObjects.Arc
      }
    })
    
    return closestPoint
  }
  
  private attachWeb(point: Phaser.GameObjects.Arc) {
    this.isWebSwinging = true
    this.webSwingPoint = point
    this.webSwingLength = Phaser.Math.Distance.Between(
      this.spider.x, this.spider.y,
      point.x, point.y
    )
    
    // Create web line
    const line = this.add.line(0, 0, 
      this.spider.x, this.spider.y,
      point.x, point.y,
      0xffd700, 0.8
    )
    line.setDepth(180)
    
    // Store web connection
    this.webConnections.push({
      point,
      line,
      isActive: true
    })
    
    // Start pendulum motion
    this.startPendulumMotion()
  }
  
  private startPendulumMotion() {
    if (!this.webSwingPoint) return
    
    // Calculate initial angle
    const dx = this.spider.x - this.webSwingPoint.x
    const dy = this.spider.y - this.webSwingPoint.y
    this.webSwingAngle = Math.atan2(dy, dx)
    
    // Set initial velocity
    this.webSwingVelocity = 0.1
  }
  
  private updatePendulumMotion() {
    if (!this.isWebSwinging || !this.webSwingPoint) return
    
    // Update pendulum physics
    const gravity = 0.5
    const damping = 0.99
    
    this.webSwingVelocity += gravity * Math.sin(this.webSwingAngle)
    this.webSwingAngle += this.webSwingVelocity
    this.webSwingVelocity *= damping
    
    // Update spider position
    const newX = this.webSwingPoint.x + Math.cos(this.webSwingAngle) * this.webSwingLength
    const newY = this.webSwingPoint.y + Math.sin(this.webSwingAngle) * this.webSwingLength
    
    this.spider.setPosition(newX, newY)
    
    // Update web line
    const activeConnection = this.webConnections.find(conn => conn.isActive)
    if (activeConnection) {
      activeConnection.line.setTo(
        this.spider.x, this.spider.y,
        this.webSwingPoint.x, this.webSwingPoint.y
      )
    }
  }
  
  private detachWeb() {
    this.isWebSwinging = false
    this.webSwingPoint = null
    
    // Remove web connections
    this.webConnections.forEach(conn => {
      if (conn.isActive) {
        conn.line.destroy()
        conn.isActive = false
      }
    })
    
    this.webConnections = this.webConnections.filter(conn => !conn.isActive)
  }
  
  private checkGoalReached() {
    const goal = this.currentSceneData.goal
    const distance = Phaser.Math.Distance.Between(
      this.spider.x, this.spider.y,
      goal.x, goal.y
    )
    
    if (distance < 50) {
      this.completeScene()
    } else {
      this.isAnimating = false
      // Request next question after delay
      setTimeout(() => {
        this.requestQuestion()
      }, 2000)
    }
  }
  
  private completeScene() {
    console.log('🎉 Scene completed!')
    
    this.showFeedback('🎉 Scene Complete!', 0x00ff00)
    this.sound.play('victory-sound', { volume: 0.5 })
    
    // Get next scene
    const nextSceneId = getNextScene(this.currentSceneId)
    
    if (nextSceneId) {
      // Load next scene
      setTimeout(() => {
        this.loadScene(nextSceneId)
        this.spider.setPosition(100, 400)
        this.isAnimating = false
        this.requestQuestion()
      }, 3000)
    } else {
      // Game completed!
      this.completeGame()
    }
  }
  
  private completeGame() {
    console.log('🏆 Game completed!')
    
    this.showFeedback('🏆 Calculus Master!', 0xffd700)
    this.sound.play('victory-sound', { volume: 0.7 })
    
    // Reset to first scene after delay
    setTimeout(() => {
      this.loadScene('ch1-s1')
      this.spider.setPosition(100, 400)
      this.isAnimating = false
      this.requestQuestion()
    }, 5000)
  }
  
  private showFeedback(text: string, color: number) {
    this.feedbackText.setText(text)
    this.feedbackText.setTint(color)
    
    // Fade out after delay
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 0,
      duration: 2000,
      delay: 1000,
      ease: 'Power2'
    })
  }
  
  private handleObstacleCollision(spider: Phaser.Physics.Arcade.Sprite, obstacle: Phaser.Physics.Arcade.Sprite) {
    // Find obstacle data
    const obstacleData = this.currentSceneData.obstacles.find(obs => 
      Math.abs(obs.x - obstacle.x) < 10 && Math.abs(obs.y - obstacle.y) < 10
    )
    
    if (obstacleData) {
      this.takeDamage(obstacleData.damage)
    }
  }
  
  private takeDamage(damage: number) {
    this.lives -= damage
    this.updateLivesDisplay()
    
    if (this.lives <= 0) {
      this.gameOver()
    } else {
      this.showFeedback(`💔 -${damage} life`, 0xff0000)
      this.sound.play('punch-sound', { volume: 0.6 })
      
      // Knockback effect
      this.spiderBody.setVelocityY(-200)
      this.spiderBody.setVelocityX(-100)
    }
  }
  
  private gameOver() {
    this.isGameOver = true
    this.showFeedback('💀 Game Over!', 0xff0000)
    this.sound.play('fart-sound', { volume: 0.7 })
    
    // Reset game after delay
    setTimeout(() => {
      this.resetGameState()
      this.loadScene('ch1-s1')
      this.spider.setPosition(100, 400)
      this.requestQuestion()
    }, 3000)
  }
  
  private handleWorldBounds() {
    if (this.spider.y > this.scale.height + 100) {
      this.takeDamage(1)
    }
  }
  
  update() {
    if (this.isGameOver) return
    
    // Update pendulum motion
    this.updatePendulumMotion()
    
    // Detach web if spider is moving too fast
    if (this.isWebSwinging && this.spiderBody.velocity.length() > 300) {
      this.detachWeb()
    }
    
    // Update camera follow
    this.cameraFollowY = this.spider.y
  }
  
  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAnswer as EventListener)
  }
}
