import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getQuestionByHeight, getChapterByHeight } from '../math/calculusAPI'
import type { AdventureQuestion } from './gameTypes'
import { audioManager } from './AudioManager'

/**
 * HALLOWEEN OUTDOOR CLIMBING SCENE
 * Beautiful outdoor Halloween setting with pumpkins, trees, moon, bats
 * Spider jumps from pumpkin to pumpkin going upward
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
    this.load.image('explosion', '/explosion.gif')
  }
  
  // Spider
  spider!: Phaser.GameObjects.Container
  
  // Pumpkins
  pumpkins: PumpkinPlatform[] = []
  currentPumpkin: PumpkinPlatform | null = null
  
  // Game state
  currentHeightMeters = 0
  targetHeight = 3000
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
  
  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAnswer)
  }
  
  update() {
    // Animate bats
    this.bats.forEach((bat, idx) => {
      // Bats fly in sine wave pattern
      bat.x += Math.sin(this.time.now * 0.001 + idx) * 0.5
      bat.y += Math.cos(this.time.now * 0.0008 + idx) * 0.3
      
      // Keep bats in bounds
      if (bat.x < -50) bat.x = this.scale.width + 50
      if (bat.x > this.scale.width + 50) bat.x = -50
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
  
  private createMoon() {
    const W = this.scale.width
    
    this.moon = this.add.circle(W - 100, 80, 50, 0xffffee, 0.9)
    this.moon.setScrollFactor(0.3) // Parallax effect
    
    // Pulsing glow
    this.tweens.add({
      targets: this.moon,
      alpha: 0.7,
      scale: 1.05,
      duration: 3000,
      yoyo: true,
      repeat: -1
    })
    
    // Moon glow
    const glow = this.add.circle(W - 100, 80, 70, 0xffffcc, 0.2)
    glow.setScrollFactor(0.3)
    
    this.tweens.add({
      targets: glow,
      alpha: 0.1,
      duration: 3000,
      yoyo: true,
      repeat: -1
    })
  }
  
  private createTrees() {
    const positions = [
      { x: 50, baseY: 0 },
      { x: 150, baseY: -400 },
      { x: 700, baseY: -200 },
      { x: 80, baseY: -800 },
      { x: 650, baseY: -1200 },
      { x: 120, baseY: -1600 },
      { x: 720, baseY: -2000 },
      { x: 100, baseY: -2400 },
      { x: 680, baseY: -2800 }
    ]
    
    positions.forEach(pos => {
      const tree = this.createTree(pos.x, pos.baseY)
      this.trees.push(tree)
    })
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
    for (let i = 0; i < 8; i++) {
      const bat = this.createBat(
        Phaser.Math.Between(100, 700),
        Phaser.Math.Between(-2000, 200)
      )
      this.bats.push(bat)
    }
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
  
  private createSpider() {
    // Start on first pumpkin
    const firstPumpkin = this.pumpkins[0]
    this.currentPumpkin = firstPumpkin
    
    this.spider = this.add.container(firstPumpkin.x, firstPumpkin.y - 50)
    
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
        const peakY = (this.spider.y + targetPumpkin.y - 50) / 2 - 80
        
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
          x: (this.spider.x + targetPumpkin.x) / 2,
          duration: jumpDuration / 2,
          ease: 'Quad.easeOut'
        })
        
        // Arc to target
        this.tweens.add({
          targets: this.spider,
          y: targetPumpkin.y - 50,
          x: targetPumpkin.x,
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
    audioManager.playSoundEffect('fall')
    
    // Fall animation
    this.tweens.add({
      targets: this.spider,
      y: targetPumpkin.y - 50,
      x: targetPumpkin.x,
      rotation: -Math.PI,
      duration: 800,
      ease: 'Quad.easeIn',
      onComplete: () => {
        this.spider.rotation = 0
        
        // Land effect
        this.landEffect(targetPumpkin)
        
        // Update state
        this.currentPumpkin = targetPumpkin
        this.currentHeightMeters = targetPumpkin.heightMeters
        this.updateUI()
        
        this.showMessage(`Lives remaining: ${this.lives}`, 0xff0000, this.scale.height / 2)
        
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

