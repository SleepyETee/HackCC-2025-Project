import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getQuestionByHeight, getChapterByHeight } from '../math/calculusAPI'
import type { AdventureQuestion } from './gameTypes'
import { audioManager } from './AudioManager'

/**
 * JACK & THE BEANSTALK CLIMBING SCENE
 * Magical beanstalk setting with leaves, clouds, and sky
 * Spider jumps from leaf to leaf climbing upward
 */

type LeafPlatform = {
  x: number
  y: number
  container: Phaser.GameObjects.Container
  heightMeters: number
}

export default class HalloweenClimbScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HalloweenClimbScene' })
  }
  
  preload() {
    // Load explosion gif for game over
    this.load.image('explosion', '/explosion.gif')
  }
  
  // Spider
  spider!: Phaser.GameObjects.Container
  
  // Leaves
  leaves: LeafPlatform[] = []
  currentLeaf: LeafPlatform | null = null
  
  // Game state
  currentHeightMeters = 0
  targetHeight = 3000
  lives = 3
  score = 0
  waitingForAnswer = false
  isAnimating = false
  isGameOver = false
  
  // Environment
  sun!: Phaser.GameObjects.Arc
  clouds: Phaser.GameObjects.Container[] = []
  beanstalk: Phaser.GameObjects.Graphics[] = []
  magicalParticles: Phaser.GameObjects.Container[] = []
  
  // Audio button
  audioButton!: Phaser.GameObjects.Container
  audioEnabled = true
  
  // Camera
  cameraFollowY = 0
  
  // UI
  livesDisplay!: Phaser.GameObjects.Container
  heightText!: Phaser.GameObjects.Text
  feedbackText!: Phaser.GameObjects.Text
  
  create() {
    console.log('🌱 Jack & Beanstalk Scene - Magical climbing adventure!')
    
    const W = this.scale.width
    const H = this.scale.height
    
    // Create white particle texture for effects
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(2, 2, 2)
    graphics.generateTexture('white', 4, 4)
    graphics.destroy()
    
    // Reset score
    const store = useGameStore.getState()
    store.addScore(-store.score)
    
    // Create magical beanstalk environment
    this.createBeanstalkBackground()
    this.createSun()
    this.createClouds()
    this.createBeanstalk()
    this.createMagicalParticles()
    
    // Create leaf platforms going upward
    this.generateLeafPlatforms()
    
    // Create spider on first leaf
    this.createSpider()
    
    // Create lives display (hearts with spiders)
    this.createLivesDisplay()
    
    // Create audio button
    this.createAudioButton()
    
    // Create UI
    this.createUI()
    
    // Setup camera to follow spider vertically
    this.cameras.main.startFollow(this.spider, false, 0, 0.1)
    
    // Load first question
    this.requestQuestion()
    
    // Listen for answers
    window.addEventListener('spidercalc-action', this.handleAnswer)
    
    console.log('✅ Halloween scene ready!')
  }
  
  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAnswer)
  }
  
  update() {
    // Animate clouds
    this.clouds.forEach((cloud, idx) => {
      // Clouds drift slowly
      cloud.x += Math.sin(this.time.now * 0.0005 + idx) * 0.3
      cloud.y += Math.cos(this.time.now * 0.001 + idx) * 0.2
      
      // Keep clouds in bounds
      if (cloud.x < -100) cloud.x = this.scale.width + 100
      if (cloud.x > this.scale.width + 100) cloud.x = -100
    })
    
    // Animate magical particles
    this.magicalParticles.forEach((particle, idx) => {
      particle.x += Math.sin(this.time.now * 0.002 + idx) * 0.2
      particle.y += Math.cos(this.time.now * 0.0015 + idx) * 0.1
      
      // Keep particles in bounds
      if (particle.x < -50) particle.x = this.scale.width + 50
      if (particle.x > this.scale.width + 50) particle.x = -50
      if (particle.y < -50) particle.y = this.scale.height + 50
      if (particle.y > this.scale.height + 50) particle.y = -50
    })
  }
  
  private createHalloweenBackground() {
    const W = this.scale.width
    const H = 5000 // Tall background for climbing
    
    // Create a large single background that covers entire play area
    const bg = this.add.graphics()
    
    // Sky gradient - spooky blue-gray (CONSISTENT throughout)
    bg.fillGradientStyle(0x2a3f54, 0x2a3f54, 0x4a6f7c, 0x4a6f7c, 1)
    bg.fillRect(0, -H, W, H + 1000)
    
    // Ground/grass platforms at regular intervals (CONSISTENT)
    for (let y = 0; y > -H; y -= 400) {
      // Green grass layer
      bg.fillStyle(0x3d5a3d, 0.8)
      bg.fillRect(0, y, W, 60)
      
      // Grass blades (consistent texture)
      bg.lineStyle(2, 0x2d4a2d, 0.6)
      for (let x = 0; x < W; x += 10) {
        const grassH = Phaser.Math.Between(10, 20)
        bg.beginPath()
        bg.moveTo(x, y)
        bg.lineTo(x + 2, y - grassH)
        bg.strokePath()
      }
    }
    
    // Add misty clouds (evenly spaced)
    for (let y = -200; y > -H; y -= 300) {
      this.createCloud(150, y)
      this.createCloud(500, y - 150)
    }
    
    // Set scroll factor so background scrolls with camera
    bg.setScrollFactor(1)
  }
  
  private createCloud(x: number, y: number) {
    const cloud = this.add.graphics()
    cloud.fillStyle(0xe0e0e0, 0.3)
    
    // Fluffy cloud shape
    cloud.fillCircle(x, y, 40)
    cloud.fillCircle(x + 30, y, 35)
    cloud.fillCircle(x + 60, y, 40)
    cloud.fillCircle(x + 30, y - 20, 30)
    
    // Slowly drift
    this.tweens.add({
      targets: cloud,
      x: x + 100,
      duration: Phaser.Math.Between(20000, 30000),
      repeat: -1,
      yoyo: true
    })
  }

  // NEW JACK & BEANSTALK METHODS
  private createBeanstalkBackground() {
    const W = this.scale.width
    const H = 5000 // Tall background for climbing
    
    // Create a beautiful sky gradient
    const bg = this.add.graphics()
    
    // Multi-layer sky gradient for depth
    // Top layer - light blue
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x87CEEB, 0x87CEEB, 1)
    bg.fillRect(0, -H, W, H * 0.3)
    
    // Middle layer - medium blue
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1)
    bg.fillRect(0, -H + H * 0.3, W, H * 0.4)
    
    // Bottom layer - deeper blue
    bg.fillGradientStyle(0x4682B4, 0x4682B4, 0x2E4A6B, 0x2E4A6B, 1)
    bg.fillRect(0, -H + H * 0.7, W, H * 0.3 + 1000)
    
    bg.setScrollFactor(1)
    bg.setDepth(-1000)
  }

  private createSun() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create sun in top right
    this.sun = this.add.circle(W - 100, 100, 60, 0xFFD700, 0.9)
    this.sun.setScrollFactor(0, 0.3) // Parallax effect
    this.sun.setDepth(-500)
    
    // Sun glow
    const glow = this.add.circle(W - 100, 100, 80, 0xFFD700, 0.3)
    glow.setScrollFactor(0, 0.3)
    glow.setDepth(-501)
    
    // Animated sun rays
    const rays = this.add.graphics()
    rays.lineStyle(4, 0xFFD700, 0.8)
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6
      const x1 = W - 100 + Math.cos(angle) * 70
      const y1 = 100 + Math.sin(angle) * 70
      const x2 = W - 100 + Math.cos(angle) * 100
      const y2 = 100 + Math.sin(angle) * 100
      rays.lineBetween(x1, y1, x2, y2)
    }
    rays.setScrollFactor(0, 0.3)
    rays.setDepth(-500)
    
    // Pulsing sun animation
    this.tweens.add({
      targets: this.sun,
      scale: 1.1,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.tweens.add({
      targets: glow,
      alpha: 0.5,
      scale: 1.2,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private createClouds() {
    const W = this.scale.width
    const H = 5000
    
    // Create beautiful floating clouds
    for (let i = 0; i < 20; i++) {
      const cloud = this.add.container(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(-H, 0)
      )
      
      // Main cloud body
      const cloudBody = this.add.ellipse(0, 0, 100, 50, 0xFFFFFF, 0.9)
      const cloudLeft = this.add.ellipse(-40, -15, 60, 35, 0xFFFFFF, 0.9)
      const cloudRight = this.add.ellipse(40, -15, 60, 35, 0xFFFFFF, 0.9)
      const cloudTop = this.add.ellipse(0, -25, 70, 30, 0xFFFFFF, 0.9)
      
      // Cloud shadows for depth
      const shadow = this.add.ellipse(5, 5, 100, 50, 0x000000, 0.1)
      shadow.setDepth(-1)
      
      cloud.add([shadow, cloudBody, cloudLeft, cloudRight, cloudTop])
      cloud.setScrollFactor(0, 0.3) // Parallax effect
      cloud.setDepth(-400)
      
      // Gentle floating animation
      this.tweens.add({
        targets: cloud,
        y: cloud.y + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      this.clouds.push(cloud)
    }
  }

  private createBeanstalk() {
    const W = this.scale.width
    const H = 5000
    
    // Create the main beanstalk trunk with 3D effect
    const beanstalk = this.add.graphics()
    
    // Main trunk with gradient
    beanstalk.fillGradientStyle(0x32CD32, 0x32CD32, 0x228B22, 0x228B22, 1)
    beanstalk.fillRect(W / 2 - 25, -H, 50, H + 1000)
    
    // Left shadow for 3D effect
    beanstalk.fillStyle(0x1a5f1a, 0.8)
    beanstalk.fillRect(W / 2 - 25, -H, 15, H + 1000)
    
    // Right highlight for 3D effect
    beanstalk.fillStyle(0x90EE90, 0.6)
    beanstalk.fillRect(W / 2 + 10, -H, 15, H + 1000)
    
    // Texture lines
    beanstalk.lineStyle(3, 0x006400, 0.8)
    for (let y = -H; y < 1000; y += 80) {
      beanstalk.lineBetween(W / 2 - 20, y, W / 2 + 20, y)
    }
    
    // Vertical texture lines
    beanstalk.lineStyle(2, 0x006400, 0.6)
    for (let x = W / 2 - 20; x <= W / 2 + 20; x += 10) {
      beanstalk.lineBetween(x, -H, x, 1000)
    }
    
    beanstalk.setScrollFactor(1)
    beanstalk.setDepth(-300)
    
    this.beanstalk.push(beanstalk)
  }

  private createMagicalParticles() {
    const W = this.scale.width
    const H = 5000
    
    // Create magical sparkles
    for (let i = 0; i < 30; i++) {
      const particle = this.add.container(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(-H, 0)
      )
      
      // Magical sparkle
      const sparkle = this.add.graphics()
      sparkle.fillStyle(0xFFD700, 0.8)
      sparkle.fillCircle(0, 0, 3)
      sparkle.fillStyle(0xFFFFFF, 0.9)
      sparkle.fillCircle(0, 0, 1)
      
      particle.add(sparkle)
      particle.setScrollFactor(0, 0.5)
      particle.setDepth(-200)
      
      // Twinkling animation
      this.tweens.add({
        targets: particle,
        alpha: 0.3,
        scale: 1.5,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      this.magicalParticles.push(particle)
    }
  }
  
  private createMoon() {
    // Removed - using sun instead for Jack & Beanstalk theme
  }
  
  private createTrees() {
    // Removed - using beanstalk instead for Jack & Beanstalk theme
  }
  
  private createTree(x: number, baseY: number): Phaser.GameObjects.Graphics {
    const tree = this.add.graphics()
    
    // Tree trunk (brown)
    tree.fillStyle(0x4a3020, 1)
    tree.fillRect(x - 15, baseY - 150, 30, 150)
    
    // Spooky branches
    tree.lineStyle(8, 0x4a3020, 1)
    const numBranches = 5
    for (let i = 0; i < numBranches; i++) {
      const branchY = baseY - 150 + i * 25
      const branchLength = 40 - i * 5
      const side = i % 2 === 0 ? 1 : -1
      
      tree.beginPath()
      tree.moveTo(x, branchY)
      tree.lineTo(x + side * branchLength, branchY - 20)
      tree.strokePath()
      
      // Sub-branches
      tree.lineStyle(4, 0x4a3020, 1)
      tree.beginPath()
      tree.moveTo(x + side * branchLength, branchY - 20)
      tree.lineTo(x + side * (branchLength + 15), branchY - 35)
      tree.strokePath()
    }
    
    return tree
  }
  
  private createBats() {
    // Removed - using magical particles instead for Jack & Beanstalk theme
  }
  
  private createBat(x: number, y: number): Phaser.GameObjects.Container {
    const bat = this.add.container(x, y)
    
    const batGraphic = this.add.graphics()
    batGraphic.fillStyle(0x000000, 1)
    
    // Body
    batGraphic.fillEllipse(0, 0, 12, 8)
    
    // Wings
    batGraphic.fillTriangle(-6, 0, -20, -8, -12, 4)
    batGraphic.fillTriangle(6, 0, 20, -8, 12, 4)
    
    bat.add(batGraphic)
    
    // Flapping animation
    this.tweens.add({
      targets: batGraphic,
      scaleX: 1.2,
      duration: 300,
      yoyo: true,
      repeat: -1
    })
    
    return bat
  }
  
  private generateLeafPlatforms() {
    const W = this.scale.width
    
    // Generate leaves going upward
    let currentY = this.scale.height - 100
    const totalLeaves = 30
    
    for (let i = 0; i < totalLeaves; i++) {
      const x = Phaser.Math.Between(150, W - 150)
      currentY -= Phaser.Math.Between(120, 180)
      
      const heightMeters = i * 100
      const leaf = this.createLeaf(x, currentY, heightMeters)
      
      this.leaves.push({
        x, y: currentY, container: leaf, heightMeters
      })
    }
  }

  private generatePumpkinPlatforms() {
    const W = this.scale.width
    
    // Generate pumpkins going upward
    let currentY = this.scale.height - 100
    const totalPumpkins = 30
    
    for (let i = 0; i < totalPumpkins; i++) {
      const x = Phaser.Math.Between(150, W - 150)
      currentY -= Phaser.Math.Between(120, 180)
      
      const heightMeters = i * 100
      const pumpkin = this.createPumpkin(x, currentY, heightMeters)
      
      this.leaves.push({
        x, y: currentY, container: pumpkin, heightMeters
      })
    }
  }
  
  private createPumpkin(x: number, y: number, heightMeters: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y)
    
    // ========== 3D SHADOW (depth effect) ==========
    const shadow = this.add.ellipse(5, 45, 85, 25, 0x000000, 0.4)
    shadow.setDepth(-1)
    container.add(shadow)
    
    const pumpkin = this.add.graphics()
    
    // ========== 3D PUMPKIN BODY ==========
    // Base color
    pumpkin.fillStyle(0xff9933, 1)
    pumpkin.fillEllipse(0, 0, 80, 70)
    
    // Dark shadow on right side (3D shading)
    pumpkin.fillStyle(0xcc6622, 0.5)
    pumpkin.fillEllipse(20, 10, 35, 50)
    
    // Bright highlight on left (3D lighting)
    pumpkin.fillStyle(0xffcc66, 0.8)
    pumpkin.fillEllipse(-18, -12, 30, 25)
    
    // Top highlight (light from above)
    pumpkin.fillStyle(0xffbb55, 0.6)
    pumpkin.fillEllipse(0, -20, 40, 15)
    
    // Ridges with depth
    pumpkin.lineStyle(3, 0xdd7722, 1)
    for (let i = -2; i <= 2; i++) {
      pumpkin.beginPath()
      pumpkin.moveTo(i * 15, -35)
      pumpkin.lineTo(i * 13, 35)
      pumpkin.strokePath()
      
      // Shadow on ridge
      pumpkin.lineStyle(2, 0xaa5522, 0.5)
      pumpkin.beginPath()
      pumpkin.moveTo(i * 15 + 2, -35)
      pumpkin.lineTo(i * 13 + 2, 35)
      pumpkin.strokePath()
      pumpkin.lineStyle(3, 0xdd7722, 1)
    }
    
    // ========== 3D STEM ==========
    // Stem shadow
    pumpkin.fillStyle(0x4a5020, 1)
    pumpkin.fillRect(-4, -44, 12, 15)
    
    // Stem main body
    pumpkin.fillStyle(0x6b7423, 1)
    pumpkin.fillRect(-6, -45, 12, 15)
    
    // Stem highlight (3D)
    pumpkin.fillStyle(0x8b9443, 0.9)
    pumpkin.fillRect(-6, -45, 5, 8)
    
    // ========== CARVED FACE WITH DEPTH ==========
    // Inner glow (candle light inside)
    pumpkin.fillStyle(0xffaa00, 0.3)
    pumpkin.fillCircle(0, 0, 35)
    
    // Eyes with depth
    pumpkin.fillStyle(0xffaa00, 0.8) // Inner glow
    pumpkin.fillTriangle(-20, -8, -16, -3, -24, -3)
    pumpkin.fillTriangle(20, -8, 16, -3, 24, -3)
    
    pumpkin.fillStyle(0x000000, 1) // Dark cutout
    pumpkin.fillTriangle(-19, -7, -17, -4, -23, -4)
    pumpkin.fillTriangle(19, -7, 17, -4, 23, -4)
    
    // Nose with glow
    pumpkin.fillStyle(0xffaa00, 0.8)
    pumpkin.fillTriangle(0, 3, -4, 12, 4, 12)
    pumpkin.fillStyle(0x000000, 1)
    pumpkin.fillTriangle(0, 4, -3, 11, 3, 11)
    
    // Smile with depth
    pumpkin.fillStyle(0xffaa00, 0.8)
    pumpkin.beginPath()
    pumpkin.arc(0, 10, 16, 0.3, Math.PI - 0.3)
    pumpkin.fillPath()
    
    pumpkin.fillStyle(0x000000, 1)
    pumpkin.beginPath()
    pumpkin.arc(0, 10, 15, 0.3, Math.PI - 0.3)
    pumpkin.fillPath()
    
    container.add(pumpkin)
    
    // ========== 3D GLOW EFFECT (candle inside) ==========
    const glow = this.add.circle(0, 0, 45, 0xffaa00, 0.15)
    glow.setBlendMode(Phaser.BlendModes.ADD)
    container.add(glow)
    
    // Pulsing glow
    this.tweens.add({
      targets: glow,
      alpha: 0.25,
      scale: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Height label (meters)
    if (heightMeters % 500 === 0 && heightMeters > 0) {
      const label = this.add.text(0, -60, `${heightMeters}m`, {
        fontSize: '16px',
        color: '#ffd700',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      })
      label.setOrigin(0.5)
      container.add(label)
    }
    
    // Gentle bob animation
    this.tweens.add({
      targets: container,
      y: y + 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Make interactive
    container.setSize(80, 70)
    container.setInteractive(new Phaser.Geom.Circle(0, 0, 40), Phaser.Geom.Circle.Contains)
    
    container.on('pointerover', () => {
      if (!this.isAnimating && this.waitingForAnswer) {
        container.setScale(1.1)
      }
    })
    
    container.on('pointerout', () => {
      container.setScale(1.0)
    })
    
    container.on('pointerdown', () => {
      if (!this.isAnimating && this.waitingForAnswer) {
        // Highlight selection
        container.setScale(1.15)
        this.showMessage('📝 Now answer the question!', 0xffd700, this.scale.height / 2 - 100)
      }
    })
    
    return container
  }

  private createLeaf(x: number, y: number, heightMeters: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y)
    
    // ========== 3D SHADOW (depth effect) ==========
    const shadow = this.add.ellipse(3, 25, 60, 15, 0x000000, 0.3)
    shadow.setDepth(-1)
    container.add(shadow)
    
    const leaf = this.add.graphics()
    
    // ========== 3D LEAF BODY ==========
    // Base green color
    leaf.fillStyle(0x228B22, 1)
    leaf.fillEllipse(0, 0, 60, 40)
    
    // Dark shadow on right side (3D shading)
    leaf.fillStyle(0x1a5f1a, 0.6)
    leaf.fillEllipse(15, 5, 25, 30)
    
    // Bright highlight on left (3D lighting)
    leaf.fillStyle(0x32cd32, 0.8)
    leaf.fillEllipse(-15, -8, 20, 20)
    
    // Top highlight (light from above)
    leaf.fillStyle(0x90ee90, 0.7)
    leaf.fillEllipse(0, -15, 30, 12)
    
    // ========== LEAF VEINS ==========
    leaf.lineStyle(2, 0x006400, 0.8)
    // Main vein
    leaf.beginPath()
    leaf.moveTo(0, -20)
    leaf.lineTo(0, 20)
    leaf.strokePath()
    
    // Side veins
    for (let i = -1; i <= 1; i += 2) {
      leaf.beginPath()
      leaf.moveTo(0, -10)
      leaf.lineTo(i * 20, 0)
      leaf.strokePath()
      
      leaf.beginPath()
      leaf.moveTo(0, 0)
      leaf.lineTo(i * 25, 10)
      leaf.strokePath()
    }
    
    // ========== LEAF EDGE TEXTURE ==========
    leaf.lineStyle(1, 0x006400, 0.6)
    leaf.beginPath()
    leaf.arc(0, 0, 30, 0, Math.PI * 2)
    leaf.strokePath()
    
    container.add(leaf)
    
    // ========== 3D GLOW EFFECT ==========
    const glow = this.add.circle(0, 0, 35, 0x32cd32, 0.1)
    glow.setBlendMode(Phaser.BlendModes.ADD)
    container.add(glow)
    
    // Gentle swaying animation
    this.tweens.add({
      targets: container,
      rotation: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Height label (meters)
    if (heightMeters % 500 === 0 && heightMeters > 0) {
      const label = this.add.text(0, -50, `${heightMeters}m`, {
        fontSize: '16px',
        color: '#ffd700',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      })
      label.setOrigin(0.5)
      container.add(label)
    }
    
    // Make clickable
    container.setInteractive(new Phaser.Geom.Ellipse(0, 0, 60, 40), Phaser.Geom.Ellipse.Contains)
    container.on('pointerdown', () => {
      if (!this.waitingForAnswer || this.isAnimating || this.isGameOver) return
      
      // Check if this is a valid target
      const distance = Phaser.Math.Distance.Between(
        this.spider.x, this.spider.y, 
        container.x, container.y
      )
      
      if (distance < 200) {
        this.currentLeaf = this.leaves.find(l => l.container === container) || null
        container.setScale(1.15)
        this.showMessage('📝 Now answer the question!', 0xffd700, this.scale.height / 2 - 100)
      }
    })
    
    return container
  }
  
  private createSpider() {
    // Start on first leaf
    const firstLeaf = this.leaves[0]
    this.currentLeaf = firstLeaf
    
    this.spider = this.add.container(firstLeaf.x, firstLeaf.y - 50)
    
    // ========== 3D SPIDER SHADOW ==========
    const spiderShadow = this.add.ellipse(3, 25, 55, 15, 0x000000, 0.5)
    spiderShadow.setDepth(-2)
    this.spider.add(spiderShadow)
    
    // ========== 3D SPIDER BODY ==========
    // Main body
    const body = this.add.ellipse(0, 0, 50, 35, 0x000000)
    this.spider.add(body)
    
    // Shading on body (3D sphere effect)
    const bodyHighlight = this.add.ellipse(-8, -6, 20, 15, 0x333333, 0.6)
    this.spider.add(bodyHighlight)
    
    // ========== BIG CARTOON EYES ==========
    const eyeWhiteL = this.add.circle(-10, -3, 12, 0xffffff)
    const eyeWhiteR = this.add.circle(10, -3, 12, 0xffffff)
    
    // Eye shading (3D)
    const eyeShineL = this.add.circle(-12, -5, 4, 0xffffff, 0.8)
    const eyeShineR = this.add.circle(8, -5, 4, 0xffffff, 0.8)
    
    const eyePupilL = this.add.circle(-8, -1, 6, 0x000000)
    const eyePupilR = this.add.circle(12, -1, 6, 0x000000)
    
    // Pupil highlights (3D gloss)
    const pupilShineL = this.add.circle(-10, -3, 2, 0xffffff, 0.9)
    const pupilShineR = this.add.circle(10, -3, 2, 0xffffff, 0.9)
    
    this.spider.add([eyeWhiteL, eyeWhiteR, eyeShineL, eyeShineR, eyePupilL, eyePupilR, pupilShineL, pupilShineR])
    
    // ========== 8 LEGS WITH DEPTH ==========
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1
      const index = i % 4
      
      const leg = this.add.graphics()
      
      // Leg shadow (3D depth)
      leg.lineStyle(4, 0x666666, 0.4)
      leg.beginPath()
      leg.moveTo(side * 20 + 2, -5 + index * 4 + 2)
      leg.lineTo(side * 30 + 2, -8 + index * 4 + 2)
      leg.lineTo(side * 40 + 2, 5 + index * 3 + 2)
      leg.strokePath()
      
      // Leg main
      leg.lineStyle(3, 0x000000, 1)
      leg.beginPath()
      leg.moveTo(side * 20, -5 + index * 4)
      leg.lineTo(side * 30, -8 + index * 4)
      leg.lineTo(side * 40, 5 + index * 3)
      leg.strokePath()
      
      this.spider.add(leg)
    }
    
    // ========== IDLE ANIMATION ==========
    this.tweens.add({
      targets: this.spider,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.waitingForAnswer = true
  }
  
  private createLivesDisplay() {
    this.livesDisplay = this.add.container(20, 20)
    this.livesDisplay.setScrollFactor(0)
    
    this.updateLivesDisplay()
  }
  
  private updateLivesDisplay() {
    this.livesDisplay.removeAll(true)
    
    // Create hearts with spider icons
    for (let i = 0; i < this.lives; i++) {
      const heartContainer = this.add.container(i * 60, 0)
      
      // Heart shape
      const heart = this.add.graphics()
      heart.fillStyle(0xdd3333, 1)
      
      // Draw heart using curves
      heart.beginPath()
      heart.arc(-10, -5, 10, Math.PI, 0, true)
      heart.arc(10, -5, 10, Math.PI, 0, true)
      heart.lineTo(0, 15)
      heart.closePath()
      heart.fillPath()
      
      // Stroke
      heart.lineStyle(2, 0x991111, 1)
      heart.strokePath()
      
      // Mini spider on heart
      const miniSpider = this.add.circle(0, 0, 8, 0x000000)
      const miniEyeL = this.add.circle(-3, -2, 3, 0xffffff)
      const miniEyeR = this.add.circle(3, -2, 3, 0xffffff)
      const miniPupilL = this.add.circle(-2, -1, 1.5, 0x000000)
      const miniPupilR = this.add.circle(4, -1, 1.5, 0x000000)
      
      heartContainer.add([heart, miniSpider, miniEyeL, miniEyeR, miniPupilL, miniPupilR])
      this.livesDisplay.add(heartContainer)
    }
  }
  
  private createAudioButton() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Audio button container
    this.audioButton = this.add.container(W - 80, 20)
    
    // Button background
    const buttonBg = this.add.rectangle(0, 0, 60, 40, 0x000000, 0.7)
    buttonBg.setStrokeStyle(2, this.audioEnabled ? 0x00ff00 : 0xff0000)
    buttonBg.setScrollFactor(0)
    
    // Button text
    const buttonText = this.add.text(0, 0, this.audioEnabled ? '🔊' : '🔇', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    })
    buttonText.setOrigin(0.5)
    buttonText.setScrollFactor(0)
    
    // Make interactive
    buttonBg.setInteractive()
    buttonBg.on('pointerdown', () => {
      this.toggleAudio()
    })
    
    // Add to container
    this.audioButton.add([buttonBg, buttonText])
    this.audioButton.setScrollFactor(0)
    this.audioButton.setDepth(1000)
  }

  private toggleAudio() {
    this.audioEnabled = audioManager.toggleAudio()
    
    // Update button appearance
    const buttonBg = this.audioButton.list[0] as Phaser.GameObjects.Rectangle
    const buttonText = this.audioButton.list[1] as Phaser.GameObjects.Text
    
    buttonBg.setStrokeStyle(2, this.audioEnabled ? 0x00ff00 : 0xff0000)
    buttonText.setText(this.audioEnabled ? '🔊' : '🔇')
  }

  private createUI() {
    const W = this.scale.width
    
    this.heightText = this.add.text(W / 2, 20, '', {
      fontSize: '24px',
      fontFamily: 'Arial Black',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0)
    
    this.feedbackText = this.add.text(W / 2, this.scale.height / 2 - 100, '', {
      fontSize: '64px',
      fontFamily: 'Arial Black',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5).setAlpha(0).setScrollFactor(0)
    
    this.updateUI()
  }
  
  private updateUI() {
    this.heightText.setText(`📏 ${Math.floor(this.currentHeightMeters)}m / ${this.targetHeight}m`)
  }
  
  private requestQuestion() {
    try {
      const calculusQ = getQuestionByHeight(this.currentHeightMeters)
      const chapter = getChapterByHeight(this.currentHeightMeters)
      
      // Validate question has required fields
      if (!calculusQ || !calculusQ.question || !calculusQ.options || calculusQ.options.length === 0) {
        console.error('Invalid question received:', calculusQ)
        this.requestQuestion() // Retry
        return
      }
      
      const adventureQ: AdventureQuestion = {
        id: calculusQ.id,
        text: calculusQ.question,
        options: calculusQ.options.map(opt => ({
          text: opt.text,
          correct: opt.correct,
          action: 'web' as const
        })),
        hint: calculusQ.hint,
        concept: calculusQ.concept,
        storyContext: `${chapter.description} | ${Math.floor(this.currentHeightMeters)}m`
      }
      
      const store = useGameStore.getState()
      store.setCurrentAdventureQuestion(adventureQ)
      
      this.waitingForAnswer = true
      console.log(`📝 Question loaded: ${calculusQ.topic} (${calculusQ.difficulty}) at ${Math.floor(this.currentHeightMeters)}m`)
    } catch (error) {
      console.error('Error loading question:', error)
      // Fallback to a simple question
      const fallbackQ: AdventureQuestion = {
        id: 'fallback',
        text: 'What is 2 + 2?',
        options: [
          { text: 'A) 4', correct: true, action: 'web' },
          { text: 'B) 3', correct: false, action: 'web' },
          { text: 'C) 5', correct: false, action: 'web' },
          { text: 'D) 6', correct: false, action: 'web' }
        ],
        hint: 'Basic arithmetic',
        concept: 'Addition',
        storyContext: 'Fallback question'
      }
      
      const store = useGameStore.getState()
      store.setCurrentAdventureQuestion(fallbackQ)
      this.waitingForAnswer = true
    }
  }
  
  private handleAnswer = (e: Event) => {
    // Don't accept answers if game is over
    if (!this.waitingForAnswer || this.isAnimating || this.isGameOver) return
    
    try {
      const event = e as CustomEvent
      const { correct } = event.detail
      
      // Validate answer data
      if (typeof correct !== 'boolean') {
        console.error('Invalid answer data:', event.detail)
        return
      }
      
      this.waitingForAnswer = false
      
      console.log(`Answer: ${correct ? 'CORRECT ✅' : 'WRONG ❌'}`)
      
      if (correct) {
        this.onCorrectAnswer()
      } else {
        this.onWrongAnswer()
      }
    } catch (error) {
      console.error('Error handling answer:', error)
      // Reset state on error
      this.waitingForAnswer = false
    }
  }
  
  private onCorrectAnswer() {
    this.isAnimating = true
    const store = useGameStore.getState()
    store.addScore(100)
    
    // Play correct sound
    audioManager.playSoundEffect('correct')
    
    // Show CORRECT feedback
    this.showFeedback('CORRECT!', 0x00ff00)
    
    // Find next leaf above
    const nextLeaf = this.findNextLeafAbove()
    
    if (nextLeaf) {
      // JUMP TO LEAF!
      this.jumpToLeaf(nextLeaf)
    } else {
      // Reached the end!
      this.onVictory()
    }
  }
  
  private onWrongAnswer() {
    this.isAnimating = true
    const store = useGameStore.getState()
    store.addScore(-50)
    this.lives--
    this.updateLivesDisplay()
    
    // Play wrong sound
    audioManager.playSoundEffect('wrong')
    
    // Show WRONG feedback
    this.showFeedback('WRONG!', 0xff0000)
    
    // Check if game over IMMEDIATELY
    if (this.lives <= 0) {
      console.log('💀 No lives left - GAME OVER!')
      this.time.delayedCall(1500, () => {
        this.onGameOver()
      })
      return // Stop here, don't continue
    }
    
    // Still have lives - fall to previous leaf
    const previousLeaf = this.findPreviousLeaf()
    
    if (previousLeaf) {
      this.fallToLeaf(previousLeaf)
    } else {
      // At first pumpkin, just stay there
      this.time.delayedCall(1500, () => {
        this.continueGame()
      })
    }
  }
  
  private jumpToLeaf(targetLeaf: LeafPlatform) {
    console.log('🦘 JUMPING to leaf!')
    
    // Play jump sound
    audioManager.playSoundEffect('jump')
    
    // Spider prepares to jump
    this.tweens.add({
      targets: this.spider,
      scaleY: 0.8,
      scaleX: 1.1,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        // JUMP! - Parabolic arc
        const jumpDuration = 1000
        const peakY = (this.spider.y + targetLeaf.y - 50) / 2 - 80
        
        // ========== 3D MOTION BLUR EFFECT ==========
        // Create motion trail particles
        const motionTrail = this.add.particles(this.spider.x, this.spider.y, 'white', {
          speed: 0,
          lifespan: 400,
          scale: { start: 1.2, end: 0 },
          alpha: { start: 0.6, end: 0 },
          tint: 0x000000,
          frequency: 30,
          follow: this.spider,
          blendMode: Phaser.BlendModes.MULTIPLY
        })
        
        // Arc to peak
        this.tweens.add({
          targets: this.spider,
          y: peakY,
          x: (this.spider.x + targetLeaf.x) / 2,
          duration: jumpDuration / 2,
          ease: 'Quad.easeOut'
        })
        
        // Arc to target
        this.tweens.add({
          targets: this.spider,
          y: targetLeaf.y - 50,
          x: targetLeaf.x,
          duration: jumpDuration / 2,
          delay: jumpDuration / 2,
          ease: 'Quad.easeIn',
          onStart: () => {
            // Rotate during jump
            this.tweens.add({
              targets: this.spider,
              rotation: Math.PI * 2,
              duration: jumpDuration
            })
          },
          onComplete: () => {
            this.spider.rotation = 0
            
            // Stop motion trail
            motionTrail.stop()
            this.time.delayedCall(500, () => motionTrail.destroy())
            
            // Land effect
            this.landEffect(targetLeaf)
            
            // Update state
            this.currentLeaf = targetLeaf
            this.currentHeightMeters = targetLeaf.heightMeters
            this.updateUI()
            
            // Check victory
            if (this.currentHeightMeters >= this.targetHeight) {
              this.onVictory()
            } else {
              this.continueGame()
            }
          }
        })
      }
    })
  }
  
  private fallToLeaf(targetLeaf: LeafPlatform) {
    console.log('💔 FALLING down!')
    
    // Play fall sound
    audioManager.playSoundEffect('fall')
    
    // Fall animation
    this.tweens.add({
      targets: this.spider,
      y: targetLeaf.y - 50,
      x: targetLeaf.x,
      rotation: -Math.PI,
      duration: 800,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.spider.rotation = 0
        
        // Land effect
        this.landEffect(targetLeaf)
        
        // Update state
        this.currentLeaf = targetLeaf
        this.currentHeightMeters = targetLeaf.heightMeters
        this.updateUI()
        
        this.showMessage(`Lives remaining: ${this.lives}`, 0xff0000, this.scale.height / 2)
        
        this.continueGame()
      }
    })
  }
  
  private landEffect(leaf: LeafPlatform) {
    // Play land sound
    audioManager.playSoundEffect('land')
    
    // ========== 3D LEAF SQUASH ==========
    this.tweens.add({
      targets: leaf.container,
      scaleY: 0.85,
      scaleX: 1.1,
      duration: 100,
      yoyo: true
    })
    
    // ========== 3D DUST EXPLOSION (particles with depth) ==========
    const dustEmitter = this.add.particles(leaf.x, leaf.y + 30, 'white', {
      speed: { min: 50, max: 150 },
      angle: { min: -110, max: -70 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 800,
      tint: [0xccaa88, 0xaa8866, 0x997755],
      quantity: 15,
      blendMode: Phaser.BlendModes.NORMAL,
      gravityY: 100
    })
    
    dustEmitter.explode(15)
    
    this.time.delayedCall(1000, () => dustEmitter.destroy())
    
    // ========== SCREEN SHAKE (impact effect) ==========
    this.cameras.main.shake(150, 0.003)
    
    // ========== IMPACT RING (3D shockwave) ==========
    const impactRing = this.add.circle(leaf.x, leaf.y + 30, 10, 0xffffff, 0.6)
    this.tweens.add({
      targets: impactRing,
      scale: 4,
      alpha: 0,
      duration: 400,
      onComplete: () => impactRing.destroy()
    })
  }
  
  private showFeedback(text: string, color: number) {
    this.feedbackText.setText(text)
    this.feedbackText.setColor(`#${color.toString(16).padStart(6, '0')}`)
    this.feedbackText.setAlpha(0)
    
    this.tweens.add({
      targets: this.feedbackText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      yoyo: true,
      onComplete: () => {
        this.tweens.add({
          targets: this.feedbackText,
          alpha: 0,
          duration: 800
        })
      }
    })
  }
  
  private showMessage(text: string, color: number, y: number) {
    const msg = this.add.text(this.scale.width / 2, y, text, {
      fontSize: '20px',
      fontFamily: 'Arial Black',
      color: `#${color.toString(16).padStart(6, '0')}`,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0)
    
    this.tweens.add({
      targets: msg,
      alpha: 0,
      y: y - 40,
      duration: 1500,
      onComplete: () => msg.destroy()
    })
  }
  
  private findNextLeafAbove(): LeafPlatform | null {
    if (!this.currentLeaf) return this.leaves[0]
    
    // Find closest leaf above current one
    const leavesAbove = this.leaves.filter(p => 
      p.heightMeters > this.currentLeaf!.heightMeters
    )
    
    if (leavesAbove.length === 0) return null
    
    // Get closest one
    leavesAbove.sort((a, b) => a.heightMeters - b.heightMeters)
    return leavesAbove[0]
  }
  
  private findPreviousLeaf(): LeafPlatform | null {
    if (!this.currentLeaf) return null
    
    // Find closest leaf below current one
    const leavesBelow = this.leaves.filter(p => 
      p.heightMeters < this.currentLeaf!.heightMeters
    )
    
    if (leavesBelow.length === 0) return null
    
    // Get closest one (highest of the below ones)
    leavesBelow.sort((a, b) => b.heightMeters - a.heightMeters)
    return leavesBelow[0]
  }
  
  private continueGame() {
    this.time.delayedCall(500, () => {
      this.isAnimating = false
      this.requestQuestion()
    })
  }
  
  private onVictory() {
    // Set game over flag
    this.isGameOver = true
    this.waitingForAnswer = false
    this.isAnimating = false
    
    console.log('👑 VICTORY! Reached 3000m!')
    
    const W = this.scale.width / 2
    const H = this.cameras.main.scrollY + this.scale.height / 2
    
    const store = useGameStore.getState()
    
    const victory = this.add.text(W, H - 60, '👑 CROWN RECOVERED! 👑\nYou mastered Calculus!', {
      fontSize: '40px',
      fontFamily: 'Arial Black',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0)
    
    this.tweens.add({
      targets: victory,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    })
    
    const scoreText = this.add.text(W, H + 40, `Final Score: ${store.score}`, {
      fontSize: '28px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0)
    
    const menuButton = this.add.text(W, H + 100, '🏠 BACK TO MENU', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#8b5a3c',
      padding: { x: 20, y: 12 }
    }).setOrigin(0.5).setScrollFactor(0).setInteractive()
    
    menuButton.on('pointerover', () => menuButton.setScale(1.1))
    menuButton.on('pointerout', () => menuButton.setScale(1))
    menuButton.on('pointerdown', () => {
      this.scene.stop('HalloweenClimbScene')
      this.scene.start('MainMenuScene')
    })
  }
  
  private onGameOver() {
    // Set game over flag to prevent any further actions
    this.isGameOver = true
    this.waitingForAnswer = false
    this.isAnimating = false
    
    console.log('💀 GAME OVER triggered - Lives: 0')
    
    const W = this.scale.width / 2
    const H = this.cameras.main.scrollY + this.scale.height / 2
    
    const store = useGameStore.getState()
    
    // Game Over screen
    const gameOver = this.add.text(W, H - 60, '💀 GAME OVER 💀\nOut of lives!', {
      fontSize: '40px',
      fontFamily: 'Arial Black',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0)
    
    const scoreText = this.add.text(W, H + 20, `Final Score: ${store.score}\nMax Height: ${Math.floor(this.currentHeightMeters)}m`, {
      fontSize: '22px',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setScrollFactor(0)
    
    const retryButton = this.add.text(W - 90, H + 100, '🔄 RETRY', {
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#00aa00',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setInteractive()
    
    retryButton.on('pointerover', () => retryButton.setScale(1.1))
    retryButton.on('pointerout', () => retryButton.setScale(1))
    retryButton.on('pointerdown', () => {
      console.log('Restarting game...')
      this.scene.restart()
    })
    
    const menuButton = this.add.text(W + 90, H + 100, '🏠 MENU', {
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#8b5a3c',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setInteractive()
    
    menuButton.on('pointerover', () => menuButton.setScale(1.1))
    menuButton.on('pointerout', () => menuButton.setScale(1))
    menuButton.on('pointerdown', () => {
      console.log('Returning to menu...')
      this.scene.stop('HalloweenClimbScene')
      this.scene.start('MainMenuScene')
    })
  }
}

