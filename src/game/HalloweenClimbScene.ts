import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { audioManager } from './AudioManager'
import { getQuestionByHeight, getChapterByHeight } from '../math/calculusAPI'
import type { AdventureQuestion } from './gameTypes'

/**
 * HALLOWEEN PUMPKIN CLIMBING SCENE
 * Spooky Halloween outdoor setting with pumpkins as platforms
 * Spider climbs from pumpkin to pumpkin
 */

type PumpkinPlatform = {
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
    this.load.image('explosion', '/images/explosion.gif')
    
    // Load golden bug image for victory
    this.load.image('goldenbug', '/images/goldenbug.png')
    
    // Load sound effects
    this.load.audio('punch-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('fart-sound', '/sounds/dry-fart.mp3')
    this.load.audio('jump-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('fall-sound', '/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3')
    this.load.audio('lose-sound', '/sounds/dry-fart.mp3')
    this.load.audio('victory-sound', '/sounds/winners_W9Cpenj.mp3')
  }
  
  // Spider
  spider!: Phaser.GameObjects.Container
  
  // Pumpkins
  pumpkins: PumpkinPlatform[] = []
  currentPumpkin: PumpkinPlatform | null = null
  
  // Game state
  currentHeightMeters = 0
  targetHeight = 500  // Testing limit (Original: 3000m - uncomment for production)
  // targetHeight = 3000  // Production target - Find the Golden Bug at the peak!
  lives = 3
  score = 0
  waitingForAnswer = false
  isAnimating = false
  isGameOver = false
  
  // Environment
  moon!: Phaser.GameObjects.Arc
  bats: Phaser.GameObjects.Container[] = []
  trees: Phaser.GameObjects.Graphics[] = []
  
  // Camera
  cameraFollowY = 0
  
  // UI
  livesDisplay!: Phaser.GameObjects.Container
  heightText!: Phaser.GameObjects.Text
  feedbackText!: Phaser.GameObjects.Text
  
  create() {
    console.log('🎃 HalloweenClimbScene - Beautiful outdoor Halloween!')
    
    // ========== RESET ALL GAME STATE ==========
    this.resetGameState()
    
    const W = this.scale.width
    const H = this.scale.height
    
    // Create white particle texture for effects
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(2, 2, 2)
    graphics.generateTexture('white', 4, 4)
    graphics.destroy()
    
    // Create beautiful Halloween environment
    this.createHalloweenBackground()
    this.createMoon()
    this.createTrees()
    this.createBats()
    
    // Create pumpkin platforms going upward
    this.generatePumpkinPlatforms()
    
    // Create spider on first pumpkin
    this.createSpider()
    
    // Create lives display (hearts with spiders)
    this.createLivesDisplay()
    
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
  
  private resetGameState() {
    // Reset all game state variables to initial values
    this.currentHeightMeters = 0
    this.lives = 3
    this.score = 0
    this.waitingForAnswer = false
    this.isAnimating = false
    this.isGameOver = false
    this.currentPumpkin = null
    this.pumpkins = []
    this.bats = []
    this.trees = []
    
    // Reset store score and clear question
    const store = useGameStore.getState()
    store.addScore(-store.score)
    store.setCurrentAdventureQuestion(null)
    
    console.log('🔄 Game state reset: Lives=3, Score=0, Height=0m')
  }
  
  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAnswer)
  }
  
  update() {
    // Animate bats
    this.bats.forEach((bat, idx) => {
      bat.x += Math.sin(this.time.now * 0.0005 + idx) * 0.3
      bat.y += Math.cos(this.time.now * 0.001 + idx) * 0.2
      
      // Keep bats in bounds
      if (bat.x < -100) bat.x = this.scale.width + 100
      if (bat.x > this.scale.width + 100) bat.x = -100
    })
  }
  
  private createHalloweenBackground() {
    const W = this.scale.width
    const H = 5000 // Tall background for climbing
    
    // Create a large single background that covers entire play area
    const bg = this.add.graphics()
    
    // Halloween sky gradient - spooky orange to dark purple
    bg.fillGradientStyle(0x2a1810, 0x2a1810, 0x4a3020, 0x4a3020, 1)
    bg.fillRect(0, -H, W, H + 1000)
    
    // Ground/grass platforms at regular intervals (CONSISTENT)
    for (let y = 0; y > -H; y -= 400) {
      // Dark Halloween grass layer
      bg.fillStyle(0x2d3a2d, 0.8)
      bg.fillRect(0, y, W, 60)
      
      // Spooky grass blades (consistent texture)
      bg.lineStyle(2, 0x1d2a1d, 0.6)
      for (let x = 0; x < W; x += 10) {
        const grassH = Phaser.Math.Between(10, 20)
        bg.beginPath()
        bg.moveTo(x, y)
        bg.lineTo(x + 2, y - grassH)
        bg.strokePath()
      }
    }
    
    // Set scroll factor to 0 to prevent shifting (keep background fixed)
    bg.setScrollFactor(0, 0)
    bg.setDepth(-1000)
  }

  private createMoon() {
    const W = this.scale.width
    
    // Create spooky moon in top right
    this.moon = this.add.circle(W - 100, 100, 50, 0xffffcc, 0.9)
    this.moon.setScrollFactor(0, 0.3) // Parallax effect
    this.moon.setDepth(-500)
    
    // Moon crater details
    const crater1 = this.add.circle(W - 115, 90, 8, 0xccccaa, 0.5)
    const crater2 = this.add.circle(W - 90, 110, 6, 0xccccaa, 0.5)
    const crater3 = this.add.circle(W - 105, 115, 4, 0xccccaa, 0.5)
    
    crater1.setScrollFactor(0, 0.3)
    crater2.setScrollFactor(0, 0.3)
    crater3.setScrollFactor(0, 0.3)
    crater1.setDepth(-499)
    crater2.setDepth(-499)
    crater3.setDepth(-499)
    
    // Moon glow
    const glow = this.add.circle(W - 100, 100, 70, 0xffffcc, 0.2)
    glow.setScrollFactor(0, 0.3)
    glow.setDepth(-501)
    
    // Pulsing moon animation
    this.tweens.add({
      targets: this.moon,
      alpha: 0.7,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.tweens.add({
      targets: glow,
      alpha: 0.4,
      scale: 1.2,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  private createTrees() {
    const W = this.scale.width
    const H = 5000
    
    // Create spooky trees on both sides (parallax effect)
    for (let y = 0; y > -H; y -= 800) {
      // Left side trees
      const leftTree = this.createTree(50, y)
      leftTree.setScrollFactor(0, 0.2) // Slight parallax but mostly fixed
      leftTree.setDepth(-300)
      this.trees.push(leftTree)
      
      // Right side trees
      const rightTree = this.createTree(W - 50, y - 400)
      rightTree.setScrollFactor(0, 0.2) // Slight parallax but mostly fixed
      rightTree.setDepth(-300)
      this.trees.push(rightTree)
    }
  }

  private createTree(x: number, baseY: number): Phaser.GameObjects.Graphics {
    const tree = this.add.graphics()
    
    // Tree trunk (brown) with 3D shading
    tree.fillStyle(0x4a3020, 1)
    tree.fillRect(x - 15, baseY - 150, 30, 150)
    
    // Trunk shadow (left side)
    tree.fillStyle(0x3a2010, 1)
    tree.fillRect(x - 15, baseY - 150, 10, 150)
    
    // Trunk highlight (right side)
    tree.fillStyle(0x6a5040, 0.7)
    tree.fillRect(x + 5, baseY - 150, 10, 150)
    
    // Spooky branches with 3D effect
    tree.lineStyle(8, 0x4a3020, 1)
    const numBranches = 5
    for (let i = 0; i < numBranches; i++) {
      const branchY = baseY - 150 + i * 25
      const branchLength = 40 - i * 5
      const side = i % 2 === 0 ? 1 : -1
      
      // Main branch
      tree.beginPath()
      tree.moveTo(x, branchY)
      tree.lineTo(x + side * branchLength, branchY - 20)
      tree.strokePath()
      
      // Branch shadow
      tree.lineStyle(6, 0x3a2010, 0.6)
      tree.beginPath()
      tree.moveTo(x + 2, branchY + 2)
      tree.lineTo(x + side * branchLength + 2, branchY - 18)
      tree.strokePath()
      
      // Sub-branches
      tree.lineStyle(4, 0x4a3020, 1)
      tree.beginPath()
      tree.moveTo(x + side * branchLength, branchY - 20)
      tree.lineTo(x + side * (branchLength + 15), branchY - 35)
      tree.strokePath()
      
      // Reset main line style
      tree.lineStyle(8, 0x4a3020, 1)
    }
    
    return tree
  }

  private createBats() {
    const W = this.scale.width
    const H = 5000
    
    // Create flying bats
    for (let i = 0; i < 8; i++) {
      const bat = this.createBat(
        Phaser.Math.Between(50, W - 50),
        Phaser.Math.Between(-H + 200, -200)
      )
      bat.setScrollFactor(0, 0.5) // Parallax effect
      bat.setDepth(-400)
      this.bats.push(bat)
    }
  }

  private createBat(x: number, y: number): Phaser.GameObjects.Container {
    const bat = this.add.container(x, y)
    
    const batGraphic = this.add.graphics()
    
    // Bat body with 3D shading
    batGraphic.fillStyle(0x000000, 1)
    batGraphic.fillEllipse(0, 0, 12, 8)
    
    // Body highlight
    batGraphic.fillStyle(0x333333, 0.6)
    batGraphic.fillEllipse(-2, -2, 6, 4)
    
    // Wings with 3D effect
    batGraphic.fillStyle(0x111111, 1)
    batGraphic.fillTriangle(-6, 0, -20, -8, -12, 4)
    batGraphic.fillTriangle(6, 0, 20, -8, 12, 4)
    
    // Wing highlights
    batGraphic.fillStyle(0x333333, 0.4)
    batGraphic.fillTriangle(-8, -2, -18, -6, -14, 2)
    batGraphic.fillTriangle(8, -2, 18, -6, 14, 2)
    
    bat.add(batGraphic)
    
    // Flapping animation
    this.tweens.add({
      targets: batGraphic,
      scaleX: 1.3,
      duration: 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    return bat
  }

  private generatePumpkinPlatforms() {
    const W = this.scale.width
    
    // Generate pumpkins going upward (need 31 pumpkins to reach 3000m)
    let currentY = this.scale.height - 100
    const totalPumpkins = 31 // 0m, 100m, 200m ... 3000m
    
    for (let i = 0; i < totalPumpkins; i++) {
      const x = Phaser.Math.Between(150, 400)
      currentY -= Phaser.Math.Between(120, 180)
      
      const heightMeters = i * 100
      const pumpkin = this.createPumpkin(x, currentY, heightMeters)
      
      this.pumpkins.push({
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
        fontFamily: 'Creepster, cursive, Arial Black, sans-serif',
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

  private createSpider() {
    // Start on first pumpkin
    const firstPumpkin = this.pumpkins[0]
    this.currentPumpkin = firstPumpkin
    
    this.spider = this.add.container(firstPumpkin.x, firstPumpkin.y - 50)
    
    // ========== 3D SPIDER SHADOW ==========
    const spiderShadow = this.add.ellipse(3, 25, 55, 15, 0x000000, 0.5)
    spiderShadow.setDepth(-2)
    this.spider.add(spiderShadow)
    
    // ========== BOLD OUTLINE AROUND SPIDER ==========
    // Create a bold outline around the entire spider body
    const spiderOutline = this.add.graphics()
    spiderOutline.lineStyle(6, 0x000000, 1) // Bold black outline
    spiderOutline.strokeEllipse(0, 0, 55, 40) // Slightly larger than body
    spiderOutline.setDepth(-1) // Behind body but above shadow
    this.spider.add(spiderOutline)
    
    // Add a subtle glow effect
    const spiderGlow = this.add.graphics()
    spiderGlow.lineStyle(8, 0x444444, 0.3) // Subtle glow
    spiderGlow.strokeEllipse(0, 0, 60, 45) // Even larger for glow
    spiderGlow.setDepth(-3) // Behind everything
    this.spider.add(spiderGlow)
    
    // ========== 8 LEGS WITH DEPTH (BEHIND BODY) ==========
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
      
      // Leg outline (bold)
      leg.lineStyle(5, 0x000000, 1)
      leg.beginPath()
      leg.moveTo(side * 20 + 1, -5 + index * 4 + 1)
      leg.lineTo(side * 30 + 1, -8 + index * 4 + 1)
      leg.lineTo(side * 40 + 1, 5 + index * 3 + 1)
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
    
    // ========== 3D SPIDER BODY ==========
    // Main body
    const body = this.add.ellipse(0, 0, 50, 35, 0x000000)
    this.spider.add(body)
    
    // Shading on body (3D sphere effect)
    const bodyHighlight = this.add.ellipse(-8, -6, 20, 15, 0x333333, 0.6)
    this.spider.add(bodyHighlight)
    
    // ========== BIG CARTOON EYES ==========
    // Eye outlines (bold)
    const eyeOutlineL = this.add.graphics()
    eyeOutlineL.lineStyle(4, 0x000000, 1)
    eyeOutlineL.strokeCircle(-10, -3, 14) // Slightly larger than eye
    this.spider.add(eyeOutlineL)
    
    const eyeOutlineR = this.add.graphics()
    eyeOutlineR.lineStyle(4, 0x000000, 1)
    eyeOutlineR.strokeCircle(10, -3, 14) // Slightly larger than eye
    this.spider.add(eyeOutlineR)
    
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
    
    // ========== ENSURE SPIDER STARTS WITH NO ROTATION ==========
    this.spider.rotation = 0
    this.spider.angle = 0
    this.spider.scaleX = 1
    this.spider.scaleY = 1
    
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
    this.livesDisplay.setScrollFactor(0, 0) // Lock to screen
    this.livesDisplay.setDepth(1000) // Always on top
    
    this.updateLivesDisplay()
  }
  
  private updateLivesDisplay() {
    this.livesDisplay.removeAll(true)
    
    // Create hearts with spider icons
    for (let i = 0; i < this.lives; i++) {
      const heartContainer = this.add.container(i * 60 + 30, 0)
      
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
  
  private createUI() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Height/Progress text - top center, fixed to screen
    this.heightText = this.add.text(W / 2, 20, '', {
      fontSize: '24px',
      fontFamily: 'Creepster, cursive, Impact, Arial Black, sans-serif',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 5
    })
    this.heightText.setOrigin(0.5)
    this.heightText.setScrollFactor(0, 0) // Lock to screen
    this.heightText.setDepth(1000) // Always on top
    
    // Feedback text - center of screen, fixed
    this.feedbackText = this.add.text(W / 2, H / 2 - 100, '', {
      fontSize: '72px',
      fontFamily: 'Creepster, cursive, Impact, Arial Black, sans-serif',
      color: '#00ff00',
      stroke: '#000000',
      strokeThickness: 8
    })
    this.feedbackText.setOrigin(0.5)
    this.feedbackText.setAlpha(0)
    this.feedbackText.setScrollFactor(0, 0) // Lock to screen
    this.feedbackText.setDepth(2000) // Very high priority
    
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
          { text: '4', correct: true, action: 'web' },
          { text: '3', correct: false, action: 'web' },
          { text: '5', correct: false, action: 'web' },
          { text: '6', correct: false, action: 'web' }
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
    
    // Find next pumpkin above
    const nextPumpkin = this.findNextPumpkinAbove()
    
    if (nextPumpkin) {
      // JUMP TO PUMPKIN!
      this.jumpToPumpkin(nextPumpkin)
    } else {
      // Reached the end!
      this.onVictory()
    }
  }
  
  private onWrongAnswer() {
    this.isAnimating = true
    const store = useGameStore.getState()
    
    // Prevent score from going below 0
    const currentScore = store.score
    const deduction = Math.min(50, currentScore) // Take the smaller of 50 or current score
    store.addScore(-deduction)
    
    this.lives--
    this.updateLivesDisplay()
    
    console.log(`💔 Lives remaining: ${this.lives}`)
    
    // Play wrong sound
    audioManager.playSoundEffect('wrong')
    
    // Show WRONG feedback
    this.showFeedback('WRONG!', 0xff0000)
    
    // Check if game over IMMEDIATELY
    if (this.lives <= 0) {
      console.log('💀 No lives left - GAME OVER!')
      this.time.delayedCall(500, () => {
        this.onGameOver()
      })
      return // Stop here, don't continue
    }
    
    // Still have lives - fall to previous pumpkin
    const previousPumpkin = this.findPreviousPumpkin()
    
    if (previousPumpkin) {
      this.fallToPumpkin(previousPumpkin)
    } else {
      // At first pumpkin, just stay there
      this.time.delayedCall(1500, () => {
        this.continueGame()
      })
    }
  }
  
  private jumpToPumpkin(targetPumpkin: PumpkinPlatform) {
    console.log('🦘 JUMPING to pumpkin!')
    
    // Play jump sound
    audioManager.playSoundEffect('jump')
    
    // ========== ENHANCED JUMP PREPARATION ==========
    // Create anticipation effect
    const prepShadow = this.add.circle(this.spider.x, this.spider.y + 40, 40, 0x000000, 0.3)
    prepShadow.setDepth(this.spider.depth - 1)
    
    this.tweens.add({
      targets: prepShadow,
      scaleX: 0.5,
      scaleY: 0.3,
      alpha: 0,
      duration: 200,
      onComplete: () => prepShadow.destroy()
    })
    
    // Spider crouches and prepares to jump
    this.tweens.add({
      targets: this.spider,
      scaleY: 0.7,
      scaleX: 1.2,
      y: this.spider.y + 10,
      duration: 200,
      ease: 'Back.easeIn',
      onComplete: () => {
        // ========== EXPLOSIVE JUMP! ==========
        const jumpDuration = 1200
        const peakY = (this.spider.y + targetPumpkin.y - 50) / 2 - 100
        
        // Launch burst effect
        const burstParticles = this.add.particles(this.spider.x, this.spider.y + 30, 'white', {
          speed: { min: 50, max: 150 },
          angle: { min: 60, max: 120 },
          scale: { start: 0.8, end: 0 },
          alpha: { start: 0.7, end: 0 },
          lifespan: 600,
          tint: [0xffd700, 0xffaa00, 0xffffff],
          quantity: 15,
          blendMode: Phaser.BlendModes.ADD,
          gravityY: 100
        })
        burstParticles.explode(15)
        this.time.delayedCall(700, () => burstParticles.destroy())
        
        // Motion trail particles during flight
        const motionTrail = this.add.particles(this.spider.x, this.spider.y, 'white', {
          speed: 0,
          lifespan: 500,
          scale: { start: 1.5, end: 0 },
          alpha: { start: 0.7, end: 0 },
          tint: 0x000000,
          frequency: 25,
          follow: this.spider,
          blendMode: Phaser.BlendModes.MULTIPLY
        })
        
        // Ascending arc - smooth ease out
        this.tweens.add({
          targets: this.spider,
          y: peakY,
          x: (this.spider.x + targetPumpkin.x) / 2,
          scaleY: 1.05,
          scaleX: 0.95,
          duration: jumpDuration / 2,
          ease: 'Quad.easeOut'
        })
        
        // Smooth single rotation for entire jump
        this.tweens.add({
          targets: this.spider,
          rotation: Math.PI * 2,
          duration: jumpDuration,
          ease: 'Linear'
        })
        
        // Descending arc - smooth ease in
        this.tweens.add({
          targets: this.spider,
          y: targetPumpkin.y - 50,
          x: targetPumpkin.x,
          scaleY: 1,
          scaleX: 1,
          duration: jumpDuration / 2,
          delay: jumpDuration / 2,
          ease: 'Quad.easeIn',
          onComplete: () => {
            // CRITICAL: Reset all spider transformations
            this.spider.rotation = 0
            this.spider.scaleX = 1
            this.spider.scaleY = 1
            this.spider.angle = 0 // Also reset angle
            
            // Stop motion trail
            motionTrail.stop()
            this.time.delayedCall(500, () => motionTrail.destroy())
            
            // Stop burst particles
            if (burstParticles) {
              burstParticles.stop()
              this.time.delayedCall(300, () => burstParticles.destroy())
            }
            
            // Enhanced land effect
            this.landEffect(targetPumpkin)
            
            // Update state
            this.currentPumpkin = targetPumpkin
            this.currentHeightMeters = targetPumpkin.heightMeters
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
  
  private fallToPumpkin(targetPumpkin: PumpkinPlatform) {
    console.log('💔 FALLING down!')
    
    // Play fall sound
    this.sound.play('fall-sound', { volume: 0.6 })
    
    // ========== DRAMATIC FALL ANIMATION ==========
    // Spider loses control, tumbles down
    this.tweens.add({
      targets: this.spider,
      scaleX: 0.8,
      scaleY: 1.2,
      duration: 100
    })
    
    // Create dizzy stars effect
    const dizzyStars = this.add.particles(this.spider.x, this.spider.y - 30, 'white', {
      speed: { min: 20, max: 50 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      tint: [0xffff00, 0xffffff],
      quantity: 8,
      blendMode: Phaser.BlendModes.ADD,
      angle: { min: -180, max: 0 },
      follow: this.spider
    })
    dizzyStars.explode(8)
    
    // Tumbling fall with rotation
    this.tweens.add({
      targets: this.spider,
      y: targetPumpkin.y - 50,
      x: targetPumpkin.x,
      rotation: -Math.PI * 1.5, // More dramatic spin
      scaleX: 1,
      scaleY: 1,
      duration: 900,
      ease: 'Cubic.easeIn',
      onComplete: () => {
        // CRITICAL: Reset all spider transformations
        this.spider.rotation = 0
        this.spider.angle = 0
        this.spider.scaleX = 1
        this.spider.scaleY = 1
        
        // Stop dizzy effect
        dizzyStars.stop()
        this.time.delayedCall(300, () => dizzyStars.destroy())
        
        // Land effect
        this.landEffect(targetPumpkin)
        
        // Update state
        this.currentPumpkin = targetPumpkin
        this.currentHeightMeters = targetPumpkin.heightMeters
        this.updateUI()
        
        // Show lives remaining with animation
        this.showMessage(
          `Lives: ${this.lives} ❤️`, 
          0xff0000, 
          this.scale.height / 2
        )
        
        this.continueGame()
      }
    })
  }
  
  private landEffect(pumpkin: PumpkinPlatform) {
    // Play land sound
    audioManager.playSoundEffect('land')
    
    // ========== 3D PUMPKIN SQUASH ==========
    this.tweens.add({
      targets: pumpkin.container,
      scaleY: 0.85,
      scaleX: 1.1,
      duration: 100,
      yoyo: true
    })
    
    // ========== 3D DUST EXPLOSION (particles with depth) ==========
    const dustEmitter = this.add.particles(pumpkin.x, pumpkin.y + 30, 'white', {
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
    const impactRing = this.add.circle(pumpkin.x, pumpkin.y + 30, 10, 0xffffff, 0.6)
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
      fontFamily: 'Creepster, cursive, Arial Black, sans-serif',
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
  
  private findNextPumpkinAbove(): PumpkinPlatform | null {
    if (!this.currentPumpkin) return this.pumpkins[0]
    
    // Find closest pumpkin above current one
    const pumpkinsAbove = this.pumpkins.filter(p => 
      p.heightMeters > this.currentPumpkin!.heightMeters
    )
    
    if (pumpkinsAbove.length === 0) return null
    
    // Get closest one
    pumpkinsAbove.sort((a, b) => a.heightMeters - b.heightMeters)
    return pumpkinsAbove[0]
  }
  
  private findPreviousPumpkin(): PumpkinPlatform | null {
    if (!this.currentPumpkin) return null
    
    // Find closest pumpkin below current one
    const pumpkinsBelow = this.pumpkins.filter(p => 
      p.heightMeters < this.currentPumpkin!.heightMeters
    )
    
    if (pumpkinsBelow.length === 0) return null
    
    // Get closest one (highest of the below ones)
    pumpkinsBelow.sort((a, b) => b.heightMeters - a.heightMeters)
    return pumpkinsBelow[0]
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
    
    console.log('👑 VICTORY! Reached target height!')
    
    // Play victory sound
    audioManager.playVictorySound()
    
    // FIXED: Use actual screen center coordinates
    const centerX = this.scale.width / 2
    const centerY = this.scale.height / 2
    
    const store = useGameStore.getState()
    
    // ========== CREATE VICTORY SCENE OVERLAY ==========
    const overlay = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0)
    overlay.setScrollFactor(0, 0)
    overlay.setDepth(998)
    
    // Fade in dark overlay - SLOWER
    this.tweens.add({
      targets: overlay,
      alpha: 0.85,
      duration: 1500,
      ease: 'Power2'
    })

    // ========== CONFETTI GIF OVERLAY (DOM) - DELAYED ==========
    const confetti = this.add.dom(centerX, centerY).createFromHTML(
      `<img src="/images/confetti.gif" style="width:${this.scale.width}px;height:${this.scale.height}px;object-fit:cover;opacity:0.7;pointer-events:none;" />`
    )
    confetti.setScrollFactor(0, 0)
    confetti.setDepth(1001)
    confetti.setAlpha(0)
    this.tweens.add({
      targets: confetti,
      alpha: 1,
      duration: 1500,
      delay: 800,
      ease: 'Sine.easeInOut'
    })

    // ========== GOLDEN BUG IMAGE (Using goldenbug.png) ==========
    const goldenBug = this.add.image(centerX, centerY - 120, 'goldenbug')
    goldenBug.setScrollFactor(0, 0)
    goldenBug.setDepth(1005)
    goldenBug.setAlpha(0)
    goldenBug.setScale(0.3) // Scale down the image to appropriate size
    
    // Glow effect around the golden bug
    const glow = this.add.circle(centerX, centerY - 120, 80, 0xffd700, 0.3)
    glow.setBlendMode(Phaser.BlendModes.ADD)
    glow.setScrollFactor(0, 0)
    glow.setDepth(1004)
    
    // Animate golden bug entrance - SLOWER AND MORE DELAYED
    this.tweens.add({
      targets: goldenBug,
      alpha: 1,
      scale: 0.4,
      duration: 1500,
      ease: 'Back.easeOut',
      delay: 1600
    })
    
    // Floating animation
    this.tweens.add({
      targets: goldenBug,
      y: centerY - 130,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      delay: 1600
    })
    
    // Rotating glow
    this.tweens.add({
      targets: glow,
      scale: 1.5,
      alpha: 0.5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Gentle rotation animation for the golden bug
    this.tweens.add({
      targets: goldenBug,
      angle: 360,
      duration: 8000,
      repeat: -1,
      ease: 'Linear'
    })
    
    // ========== TROPHY GIF (secondary decoration) - SLOWER ==========
    const trophy = this.add.dom(centerX + 180, centerY - 60).createFromHTML(
      '<img src="/images/trophy.gif" style="width:120px;height:120px;filter: drop-shadow(0 5px 10px rgba(0,0,0,0.4));" />'
    )
    trophy.setScrollFactor(0, 0)
    trophy.setDepth(1003)
    trophy.setAlpha(0)
    trophy.setScale(0.6)
    this.tweens.add({
      targets: trophy,
      alpha: 1,
      scale: 0.8,
      duration: 1000,
      ease: 'Back.easeOut',
      delay: 2200
    })
    
    // ========== FIREWORKS PARTICLES - SLOWER & CENTERED ==========
    for (let i = 0; i < 8; i++) {
      this.time.delayedCall(1800 + i * 600, () => {
        const fireworkX = Phaser.Math.Between(centerX - 250, centerX + 250)
        const fireworkY = Phaser.Math.Between(centerY - 200, centerY - 50)
        
        const firework = this.add.particles(fireworkX, fireworkY, 'white', {
          speed: { min: 100, max: 300 },
          scale: { start: 1, end: 0 },
          alpha: { start: 1, end: 0 },
          lifespan: 1500,
          tint: [0xffd700, 0xff6b35, 0x8b5cf6, 0x00ff00, 0xff1493],
          quantity: 50,
          blendMode: Phaser.BlendModes.ADD,
          gravityY: 200
        })
        firework.setScrollFactor(0, 0)
        firework.setDepth(1002)
        firework.explode()
        
        this.time.delayedCall(2000, () => firework.destroy())
      })
    }
    
    // ========== VICTORY TEXT - CENTERED & SLOWER ==========
    const victoryText = this.add.text(centerX, centerY + 60, '🎃 VICTORY! 🎃', {
      fontSize: '56px',
      fontFamily: 'Impact, Arial Black',
      color: '#ffd700',
      stroke: '#000000',
      strokeThickness: 8
    })
    victoryText.setOrigin(0.5)
    victoryText.setScrollFactor(0, 0)
    victoryText.setDepth(1006)
    victoryText.setAlpha(0)
    
    this.tweens.add({
      targets: victoryText,
      alpha: 1,
      scale: 1.1,
      duration: 800,
      ease: 'Back.easeOut',
      delay: 2800,
      yoyo: true,
      repeat: -1
    })
    
    // Subtitle
    const subtitle = this.add.text(centerX, centerY + 115, 'You found the Golden Bug!', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffed4e',
      stroke: '#000000',
      strokeThickness: 3
    })
    subtitle.setOrigin(0.5)
    subtitle.setScrollFactor(0, 0)
    subtitle.setDepth(1006)
    subtitle.setAlpha(0)
    
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      delay: 3400
    })
    
    // ========== SCORE DISPLAY ==========
    const scoreText = this.add.text(centerX, centerY + 155, `Final Score: ${store.score} 🏆`, {
      fontSize: '26px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Arial Black'
    })
    scoreText.setOrigin(0.5)
    scoreText.setScrollFactor(0, 0)
    scoreText.setDepth(1006)
    scoreText.setAlpha(0)
    
    this.tweens.add({
      targets: scoreText,
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      delay: 3800
    })
    
    // ========== BUTTONS - CENTERED & SLOWER ==========
    const retryButton = this.add.text(centerX - 90, centerY + 210, '🔄 PLAY AGAIN', {
      fontSize: '20px',
      color: '#000000',
      backgroundColor: '#ffd700',
      padding: { x: 18, y: 10 },
      fontFamily: 'Arial Black'
    })
    retryButton.setOrigin(0.5)
    retryButton.setScrollFactor(0, 0)
    retryButton.setDepth(1006)
    retryButton.setAlpha(0)
    retryButton.setInteractive()
    
    const menuButton = this.add.text(centerX + 90, centerY + 210, '🏠 MENU', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#8b5a3c',
      padding: { x: 18, y: 10 },
      fontFamily: 'Arial Black'
    })
    menuButton.setOrigin(0.5)
    menuButton.setScrollFactor(0, 0)
    menuButton.setDepth(1006)
    menuButton.setAlpha(0)
    menuButton.setInteractive()
    
    // Fade in buttons - SLOWER
    this.tweens.add({
      targets: [retryButton, menuButton],
      alpha: 1,
      duration: 800,
      ease: 'Power2',
      delay: 4200
    })
    
    // Button interactions
    retryButton.on('pointerover', () => retryButton.setScale(1.1))
    retryButton.on('pointerout', () => retryButton.setScale(1))
    retryButton.on('pointerdown', () => {
      console.log('Restarting game...')
      this.scene.restart()
    })
    
    menuButton.on('pointerover', () => menuButton.setScale(1.1))
    menuButton.on('pointerout', () => menuButton.setScale(1))
    menuButton.on('pointerdown', () => {
      console.log('Returning to menu...')
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
    console.log('💀 Game over state set - isGameOver:', this.isGameOver)
    
    // Play lose sound
    this.sound.play('lose-sound', { volume: 0.7 })
    
    const W = this.scale.width / 2
    const H = this.scale.height / 2
    
    const store = useGameStore.getState()
    
    // ========== EXPLOSION EFFECT + OVERLAY ==========
    const explosion = this.add.image(W, H, 'explosion')
    explosion.setOrigin(0.5)
    explosion.setScrollFactor(0)
    explosion.setScale(0)
    explosion.setDepth(1000)
    
    const overlay = this.add.rectangle(W, H, this.scale.width * 2, this.scale.height * 2, 0x000000, 0)
    overlay.setScrollFactor(0)
    overlay.setDepth(999)
    
    // Screen shake + explosion animation
    this.cameras.main.shake(800, 0.02)
    
    this.tweens.add({
      targets: explosion,
      scale: 2,
      duration: 600,
      ease: 'Power2'
    })
    
    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 800
    })
    
    // After flash, show game over UI
    this.time.delayedCall(900, () => {
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
      
      const retryButton = this.add.text(this.scale.width / 2 - 90, H + 100, '🔄 RETRY', {
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
      
      const menuButton = this.add.text(this.scale.width / 2 + 90, H + 100, '🏠 MENU', {
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
      
      // Fade out explosion
      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: explosion,
          alpha: 0,
          duration: 1000,
          onComplete: () => explosion.destroy()
        })
      })
    })
  }
}

