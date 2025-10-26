import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { audioManager } from './AudioManager'

export default class MainMenuScene extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Container
  private spider!: Phaser.GameObjects.Container
  private spiderCursor!: Phaser.GameObjects.Container
  
  constructor() {
    super({ key: 'MainMenuScene' })
  }
  
  create() {
    const W = this.scale.width
    const H = this.scale.height
    
    console.log('🕷️ MainMenuScene created')
    
    // CRITICAL: Disable camera scrolling completely
    this.cameras.main.setScroll(0, 0)
    this.cameras.main.scrollX = 0
    this.cameras.main.scrollY = 0
    
    // Start background music
    audioManager.playBackgroundMusic()
    
    // Hide default cursor and create spider cursor
    this.input.setDefaultCursor('none')
    
    // Create background
    this.createBackground()
    
    // Add title
    this.createTitle()
    
    // Add spider mascot (decorative)
    this.createSpiderMascot()
    
    // Add play button
    this.createPlayButton()
    
    // Add web decorations
    this.createWebDecorations()
    
    // Add instructions
    this.createInstructions()
    
    // Create custom spider cursor (must be last so it's on top)
    this.createSpiderCursor()
    
    // Reset game state
    const store = useGameStore.getState()
    store.addScore(-store.score) // Reset to 0
  }
  
  update() {
    // Update spider cursor position to follow mouse
    const pointer = this.input.activePointer
    if (this.spiderCursor) {
      this.spiderCursor.x = pointer.x
      this.spiderCursor.y = pointer.y
    }
  }
  
  private createBackground() {
    const W = this.scale.width
    const H = this.scale.height
    
    // SCARY Halloween night - deep darkness with blood red accents
    const bg = this.add.graphics()
    
    // Very dark gradient with deep purple and nearly black
    bg.fillGradientStyle(0x0a0015, 0x0a0015, 0x1a0a1a, 0x2a1020, 1)
    bg.fillRect(0, 0, W, H)
    
    // Lock background (CRITICAL)
    bg.setScrollFactor(0, 0)
    bg.setDepth(-1000)
    
    // Add eerie fog layers
    const fog1 = this.add.graphics()
    fog1.fillStyle(0x3a2a3a, 0.15)
    fog1.fillEllipse(W * 0.2, H * 0.6, W * 0.6, 100)
    fog1.setScrollFactor(0, 0)
    fog1.setDepth(-950)
    fog1.setBlendMode(Phaser.BlendModes.ADD)
    
    const fog2 = this.add.graphics()
    fog2.fillStyle(0x2a1a2a, 0.2)
    fog2.fillEllipse(W * 0.7, H * 0.7, W * 0.5, 80)
    fog2.setScrollFactor(0, 0)
    fog2.setDepth(-945)
    fog2.setBlendMode(Phaser.BlendModes.ADD)
    
    // Fog animation
    this.tweens.add({
      targets: fog1,
      x: W * 0.25,
      alpha: 0.1,
      duration: 4000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.tweens.add({
      targets: fog2,
      x: W * 0.65,
      alpha: 0.15,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Blood moon with eerie red glow
    const moon = this.add.circle(W - 120, 100, 50, 0xffccaa, 0.95)
    moon.setScrollFactor(0, 0)
    moon.setDepth(-900)
    
    // Blood red moon glow
    const moonGlow = this.add.circle(W - 120, 100, 80, 0xff3333, 0.15)
    moonGlow.setScrollFactor(0, 0)
    moonGlow.setDepth(-901)
    moonGlow.setBlendMode(Phaser.BlendModes.ADD)
    
    // Sinister pulsing moon animation
    this.tweens.add({
      targets: moon,
      alpha: 0.8,
      scale: 0.95,
      duration: 3500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    this.tweens.add({
      targets: moonGlow,
      alpha: 0.25,
      scale: 1.2,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Dark, dead ground
    const ground = this.add.graphics()
    ground.fillStyle(0x0a0a0f, 1)
    ground.fillRect(0, H - 120, W, 120)
    
    // Blood-stained ground texture
    ground.fillStyle(0x2a0a0a, 0.3)
    for (let i = 0; i < 5; i++) {
      const splatterX = Phaser.Math.Between(50, W - 50)
      const splatterY = H - Phaser.Math.Between(20, 80)
      ground.fillEllipse(splatterX, splatterY, 40, 25)
    }
    
    ground.setScrollFactor(0, 0)
    ground.setDepth(-800)
    
    // Dead grass
    ground.lineStyle(2, 0x1a1a1f, 0.8)
    for (let x = 0; x < W; x += 12) {
      const grassH = Phaser.Math.Between(8, 20)
      ground.beginPath()
      ground.moveTo(x, H - 120)
      ground.lineTo(x + 2, H - 120 - grassH)
      ground.strokePath()
    }
    
    // Add decorative elements
    this.addDecorativePumpkins()
    this.addFlyingBats()
    this.addAtmosphericElements()
  }
  
  private addDecorativePumpkins() {
    const W = this.scale.width
    const H = this.scale.height
    const groundY = H - 120
    
    // Create sinister pumpkins with evil faces
    const pumpkinPositions = [
      { x: W * 0.12, y: groundY + 40 },
      { x: W * 0.88, y: groundY + 50 },
      { x: W * 0.04, y: groundY + 55 }
    ]
    
    pumpkinPositions.forEach((pos, idx) => {
      const pumpkin = this.add.graphics()
      
      // Dark, rotting pumpkin body
      pumpkin.fillStyle(0xcc5500, 1)
      pumpkin.fillEllipse(pos.x, pos.y, 60, 50)
      
      // Rot/decay spots
      pumpkin.fillStyle(0x8b3a00, 0.6)
      pumpkin.fillEllipse(pos.x + 15, pos.y + 8, 25, 30)
      pumpkin.fillEllipse(pos.x - 10, pos.y - 5, 15, 12)
      
      // Minimal highlight (less cheerful)
      pumpkin.fillStyle(0xff7733, 0.4)
      pumpkin.fillEllipse(pos.x - 12, pos.y - 10, 15, 12)
      
      // Dead stem
      pumpkin.fillStyle(0x3a2a1a, 1)
      pumpkin.fillRect(pos.x - 4, pos.y - 30, 8, 12)
      
      // SCARY FACE - sinister triangular eyes
      pumpkin.fillStyle(0xff4400, 1) // Bright glow
      pumpkin.fillTriangle(pos.x - 18, pos.y - 8, pos.x - 12, pos.y - 2, pos.x - 22, pos.y - 2)
      pumpkin.fillTriangle(pos.x + 18, pos.y - 8, pos.x + 12, pos.y - 2, pos.x + 22, pos.y - 2)
      
      pumpkin.fillStyle(0x000000, 1) // Black cutouts
      pumpkin.fillTriangle(pos.x - 17, pos.y - 7, pos.x - 13, pos.y - 3, pos.x - 21, pos.y - 3)
      pumpkin.fillTriangle(pos.x + 17, pos.y - 7, pos.x + 13, pos.y - 3, pos.x + 21, pos.y - 3)
      
      // Evil nose
      pumpkin.fillStyle(0xff4400, 1)
      pumpkin.fillTriangle(pos.x, pos.y + 2, pos.x - 5, pos.y + 10, pos.x + 5, pos.y + 10)
      pumpkin.fillStyle(0x000000, 1)
      pumpkin.fillTriangle(pos.x, pos.y + 3, pos.x - 4, pos.y + 9, pos.x + 4, pos.y + 9)
      
      // Wicked grin - jagged teeth
      pumpkin.fillStyle(0xff4400, 1)
      pumpkin.fillRect(pos.x - 20, pos.y + 15, 40, 12)
      pumpkin.fillStyle(0x000000, 1)
      pumpkin.fillRect(pos.x - 18, pos.y + 16, 36, 10)
      
      // Teeth
      pumpkin.fillStyle(0xff4400, 1)
      for (let i = 0; i < 5; i++) {
        pumpkin.fillRect(pos.x - 15 + i * 8, pos.y + 16, 4, 8)
      }
      
      // Inner glow
      const glow = this.add.circle(pos.x, pos.y, 50, 0xff3300, 0.15)
      glow.setBlendMode(Phaser.BlendModes.ADD)
      glow.setScrollFactor(0, 0)
      glow.setDepth(-699)
      
      pumpkin.setScrollFactor(0, 0)
      pumpkin.setDepth(-700)
      
      // Sinister bob animation
      this.tweens.add({
        targets: pumpkin,
        y: pos.y + 4,
        duration: 1800 + idx * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
      
      // Flickering glow
      this.tweens.add({
        targets: glow,
        alpha: 0.25,
        scale: 1.1,
        duration: 1500 + idx * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    })
  }
  
  private addFlyingBats() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create more bats for scarier atmosphere
    for (let i = 0; i < 12; i++) {
      const bat = this.add.container(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(80, H - 200)
      )
      
      const batGraphic = this.add.graphics()
      
      // Darker, scarier bat
      batGraphic.fillStyle(0x000000, 1)
      batGraphic.fillEllipse(0, 0, 18, 10)
      
      // Sharp wings
      batGraphic.fillTriangle(-9, 0, -28, -12, -15, 5)
      batGraphic.fillTriangle(9, 0, 28, -12, 15, 5)
      
      // Red eyes
      batGraphic.fillStyle(0xff0000, 0.9)
      batGraphic.fillCircle(-4, -2, 2)
      batGraphic.fillCircle(4, -2, 2)
      
      bat.add(batGraphic)
      bat.setScrollFactor(0, 0)
      bat.setDepth(-600)
      
      // Erratic flight pattern
      this.tweens.add({
        targets: bat,
        x: Phaser.Math.Between(-50, W + 50),
        y: bat.y + Phaser.Math.Between(-80, 80),
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      })
      
      // Wing flapping
      this.tweens.add({
        targets: batGraphic,
        scaleX: 1.3,
        duration: 150,
        yoyo: true,
        repeat: -1,
        ease: 'Linear'
      })
    }
  }
  
  private addAtmosphericElements() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Floating dust particles
    for (let i = 0; i < 20; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.1, 0.3)
      )
      particle.setScrollFactor(0, 0) // Keep fixed
      
      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(50, 150),
        x: particle.x + Phaser.Math.FloatBetween(-20, 20),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      })
    }
  }
  
  private createTitle() {
    const W = this.scale.width
    
    // Dark, ominous background panel with blood red border
    const titlePanel = this.add.graphics()
    titlePanel.fillStyle(0x000000, 0.75)
    titlePanel.fillRoundedRect(W / 2 - 380, 45, 760, 120, 12)
    titlePanel.lineStyle(4, 0x8B0000, 1) // Blood red border
    titlePanel.strokeRoundedRect(W / 2 - 380, 45, 760, 120, 12)
    
    // Inner dark red glow
    titlePanel.lineStyle(2, 0xff3300, 0.5)
    titlePanel.strokeRoundedRect(W / 2 - 375, 50, 750, 110, 10)
    
    titlePanel.setScrollFactor(0, 0)
    titlePanel.setDepth(10)
    
    // Spider webs in corners (more detailed)
    const webLeft = this.add.graphics()
    webLeft.lineStyle(2, 0xaaaaaa, 0.4)
    for (let i = 0; i < 8; i++) {
      webLeft.beginPath()
      webLeft.moveTo(W / 2 - 380, 45)
      webLeft.lineTo(W / 2 - 380 + i * 12, 45 + 40)
      webLeft.strokePath()
    }
    webLeft.setScrollFactor(0, 0)
    webLeft.setDepth(11)
    
    const webRight = this.add.graphics()
    webRight.lineStyle(2, 0xaaaaaa, 0.4)
    for (let i = 0; i < 8; i++) {
      webRight.beginPath()
      webRight.moveTo(W / 2 + 380, 45)
      webRight.lineTo(W / 2 + 380 - i * 12, 45 + 40)
      webRight.strokePath()
    }
    webRight.setScrollFactor(0, 0)
    webRight.setDepth(11)
    
    // Blood drip effect under title
    const bloodDrip = this.add.graphics()
    bloodDrip.fillStyle(0x8B0000, 0.8)
    // Multiple drips
    for (let i = 0; i < 5; i++) {
      const x = W / 2 - 200 + i * 100
      bloodDrip.fillRect(x, 160, 8, 25)
      bloodDrip.fillEllipse(x + 4, 185, 12, 10)
    }
    bloodDrip.setScrollFactor(0, 0)
    bloodDrip.setDepth(11)
    
    // Large shadow for depth (blood red tint)
    const titleShadow = this.add.text(W / 2 + 5, 92, '🕷️ SPIDER-CALC 🎃', {
      fontSize: '64px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#330000'
    })
    titleShadow.setOrigin(0.5)
    titleShadow.setAlpha(0.7)
    titleShadow.setScrollFactor(0, 0)
    titleShadow.setDepth(11)
    
    // Main title text with blood red to orange gradient effect
    const title = this.add.text(W / 2, 87, '🕷️ SPIDER-CALC 🎃', {
      fontSize: '64px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#ff4400',
      stroke: '#000000',
      strokeThickness: 6
    })
    title.setOrigin(0.5)
    title.setScrollFactor(0, 0)
    title.setDepth(12)
    
    // Eerie pulsing title animation
    this.tweens.add({
      targets: title,
      scale: 1.04,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Subtitle with sinister styling
    const subtitle = this.add.text(W / 2, 138, '⚠️ Climb 3000m... If You Dare! ☠️', {
      fontSize: '18px',
      fontFamily: 'Georgia, serif',
      color: '#ff6600',
      stroke: '#000000',
      strokeThickness: 4,
      fontStyle: 'italic'
    })
    subtitle.setOrigin(0.5)
    subtitle.setScrollFactor(0, 0)
    subtitle.setDepth(12)
    
    // Flickering glow animation (like a dying flame)
    this.tweens.add({
      targets: subtitle,
      alpha: 0.7,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Add red glow behind title
    const titleGlow = this.add.circle(W / 2, 87, 200, 0xff0000, 0.08)
    titleGlow.setBlendMode(Phaser.BlendModes.ADD)
    titleGlow.setScrollFactor(0, 0)
    titleGlow.setDepth(9)
    
    this.tweens.add({
      targets: titleGlow,
      alpha: 0.15,
      scale: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
  
  private createSpiderMascot() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create spider container (properly centered with slight offset for visual balance)
    this.spider = this.add.container(W * 0.7, H * 0.45)
    this.spider.setScrollFactor(0, 0) // Keep fixed
    
    // Spider body (larger for mascot)
    const body = this.add.ellipse(0, 0, 80, 60, 0x000000)
    this.spider.add(body)
    
    // Eyes (big cartoon eyes)
    const eyeWhiteL = this.add.circle(-15, -5, 18, 0xffffff)
    const eyeWhiteR = this.add.circle(15, -5, 18, 0xffffff)
    const eyePupilL = this.add.circle(-12, -3, 10, 0x000000)
    const eyePupilR = this.add.circle(18, -3, 10, 0x000000)
    
    this.spider.add([eyeWhiteL, eyeWhiteR, eyePupilL, eyePupilR])
    
    // Legs (8 legs, cartoon style)
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1
      const index = i % 4
      const angle = (Math.PI / 5) * index - Math.PI / 3
      
      const leg = this.add.graphics()
      leg.lineStyle(4, 0x000000, 1)
      
      // Draw curved leg using arc
      const startX = side * 30
      const startY = -10 + index * 8
      const endX = side * 70
      const endY = 10 + index * 5
      
      leg.beginPath()
      leg.moveTo(startX, startY)
      leg.lineTo(side * 50, startY - 5)
      leg.lineTo(endX, endY)
      leg.strokePath()
      
      this.spider.add(leg)
    }
    
    // Bounce animation
    this.tweens.add({
      targets: this.spider,
      y: this.spider.y + 15,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Eye blink animation
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.tweens.add({
          targets: [eyeWhiteL, eyeWhiteR],
          scaleY: 0.1,
          duration: 100,
          yoyo: true
        })
      },
      loop: true
    })
  }
  
  private createPlayButton() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Play button container (centered vertically)
    this.playButton = this.add.container(W / 2, H * 0.53)
    this.playButton.setScrollFactor(0, 0)
    this.playButton.setDepth(100)
    
    // Deep shadow for ominous 3D effect
    const buttonShadow = this.add.graphics()
    buttonShadow.fillStyle(0x000000, 0.6)
    buttonShadow.fillRoundedRect(-155, -58, 310, 116, 28)
    this.playButton.add(buttonShadow)
    
    // Default button - clean white/light gray
    const buttonBg = this.add.graphics()
    
    // Main button body (white/light gray)
    buttonBg.fillStyle(0xdddddd, 1)
    buttonBg.fillRoundedRect(-150, -60, 300, 110, 25)
    
    // Lighter top section (white gradient effect)
    buttonBg.fillStyle(0xffffff, 1)
    buttonBg.fillRoundedRect(-145, -55, 290, 45, 23)
    
    // Dark gray border
    buttonBg.lineStyle(5, 0x888888, 1)
    buttonBg.strokeRoundedRect(-150, -60, 300, 110, 25)
    
    // Inner subtle glow
    buttonBg.lineStyle(3, 0xcccccc, 0.6)
    buttonBg.strokeRoundedRect(-145, -55, 290, 100, 23)
    
    this.playButton.add(buttonBg)
    
    // Claw marks on button
    const clawMarks = this.add.graphics()
    clawMarks.lineStyle(4, 0x000000, 0.3)
    for (let i = 0; i < 3; i++) {
      clawMarks.beginPath()
      clawMarks.moveTo(-80 + i * 15, -40)
      clawMarks.lineTo(-75 + i * 15, 30)
      clawMarks.strokePath()
    }
    this.playButton.add(clawMarks)
    
    // Button text with impact font - black on white button
    const playText = this.add.text(0, -5, '▶ ENTER ◀', {
      fontSize: '58px',
      fontFamily: 'Impact, Arial Black, sans-serif',
      color: '#000000',
      stroke: '#ffffff',
      strokeThickness: 3
    })
    playText.setOrigin(0.5)
    
    this.playButton.add(playText)
    
    // Warning subtext - dark gray
    const warningText = this.add.text(0, 38, 'IF YOU DARE', {
      fontSize: '14px',
      fontFamily: 'Georgia, serif',
      color: '#333333',
      stroke: '#ffffff',
      strokeThickness: 2,
      fontStyle: 'italic'
    })
    warningText.setOrigin(0.5)
    this.playButton.add(warningText)
    
    // Make button interactive
    const hitArea = new Phaser.Geom.Rectangle(-120, -50, 240, 100)
    this.playButton.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    
    // Hover effects - white default, bloody red on hover
    this.playButton.on('pointerover', () => {
      // Scale up button
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1.08,
        scaleY: 1.08,
        duration: 200,
        ease: 'Back.easeOut'
      })
      
      // Change to blood red
      buttonBg.clear()
      buttonBg.fillStyle(0xcc0000, 1) // Bright blood red
      buttonBg.fillRoundedRect(-150, -60, 300, 110, 25)
      buttonBg.fillStyle(0xff3333, 1)
      buttonBg.fillRoundedRect(-145, -55, 290, 45, 23)
      buttonBg.lineStyle(5, 0x660000, 1)
      buttonBg.strokeRoundedRect(-150, -60, 300, 110, 25)
      buttonBg.lineStyle(3, 0xff6666, 0.8)
      buttonBg.strokeRoundedRect(-145, -55, 290, 100, 23)
      
      playText.setColor('#ffff00') // Yellow text on hover
      warningText.setColor('#ffff00')
    })
    
    this.playButton.on('pointerout', () => {
      // Scale back
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      })
      
      // Back to white/light gray
      buttonBg.clear()
      buttonBg.fillStyle(0xdddddd, 1) // Light gray/white
      buttonBg.fillRoundedRect(-150, -60, 300, 110, 25)
      buttonBg.fillStyle(0xffffff, 1) // White top
      buttonBg.fillRoundedRect(-145, -55, 290, 45, 23)
      buttonBg.lineStyle(5, 0x888888, 1) // Dark gray border
      buttonBg.strokeRoundedRect(-150, -60, 300, 110, 25)
      buttonBg.lineStyle(3, 0xcccccc, 0.6)
      buttonBg.strokeRoundedRect(-145, -55, 290, 100, 23)
      
      playText.setColor('#000000') // Black text
      warningText.setColor('#333333')
    })
    
    // Click to start game
    this.playButton.on('pointerdown', () => {
      // Flash effect
      const flash = this.add.rectangle(W / 2, H / 2, W, H, 0xffffff, 0.5)
      this.tweens.add({
        targets: flash,
        alpha: 0,
        duration: 300,
        onComplete: () => {
          flash.destroy()
          this.startGame()
        }
      })
    })
    
    // Pulsing animation
    this.tweens.add({
      targets: this.playButton,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
  
  private createWebDecorations() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Top-left web
    this.drawWebCorner(80, 80, 1)
    
    // Top-right web
    this.drawWebCorner(W - 80, 80, -1)
    
    // Bottom-left web
    this.drawWebCorner(80, H - 80, 1)
    
    // Bottom-right web
    this.drawWebCorner(W - 80, H - 80, -1)
  }
  
  private drawWebCorner(x: number, y: number, direction: number) {
    const web = this.add.graphics()
    web.lineStyle(2, 0x000000, 0.6)
    web.setScrollFactor(0, 0) // Keep fixed
    
    // Draw web lines radiating from corner
    const numLines = 8
    const radius = 100
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI / 2 * direction
      web.beginPath()
      web.moveTo(x, y)
      web.lineTo(
        x + Math.cos(angle) * radius,
        y + Math.sin(angle) * radius
      )
      web.strokePath()
    }
    
    // Draw concentric arcs
    for (let r = 20; r <= radius; r += 20) {
      web.beginPath()
      web.arc(x, y, r, 0, Math.PI / 2 * direction)
      web.strokePath()
    }
  }
  
  private createInstructions() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Dark, ominous instructions panel with blood red accent
    const instructionsBg = this.add.graphics()
    instructionsBg.fillStyle(0x000000, 0.8)
    instructionsBg.fillRoundedRect(W / 2 - 385, H - 112, 770, 105, 12)
    instructionsBg.lineStyle(3, 0x8B0000, 1) // Blood red
    instructionsBg.strokeRoundedRect(W / 2 - 385, H - 112, 770, 105, 12)
    
    // Inner warning glow
    instructionsBg.lineStyle(2, 0xff3300, 0.4)
    instructionsBg.strokeRoundedRect(W / 2 - 380, H - 107, 760, 95, 10)
    
    instructionsBg.setScrollFactor(0, 0)
    instructionsBg.setDepth(50)
    
    // Warning skull icons in corners
    const skullLeft = this.add.text(W / 2 - 360, H - 90, '☠️', {
      fontSize: '28px'
    })
    skullLeft.setOrigin(0.5)
    skullLeft.setScrollFactor(0, 0)
    skullLeft.setDepth(51)
    
    const skullRight = this.add.text(W / 2 + 360, H - 90, '☠️', {
      fontSize: '28px'
    })
    skullRight.setOrigin(0.5)
    skullRight.setScrollFactor(0, 0)
    skullRight.setDepth(51)
    
    // Main instructions with scary emphasis
    const instructions = this.add.text(W / 2, H - 77, 
      '⚠️ Answer Calculus to Climb... Or Perish! ⚠️',
      {
        fontSize: '20px',
        fontFamily: 'Impact, Arial Black, sans-serif',
        color: '#ff4400',
        stroke: '#000000',
        strokeThickness: 5,
        align: 'center'
      }
    )
    instructions.setOrigin(0.5)
    instructions.setScrollFactor(0, 0)
    instructions.setDepth(51)
    
    // Game rules with danger emphasis
    const rules = this.add.text(W / 2, H - 50, 
      '✅ Correct = Survive & Climb  •  ❌ Wrong = Fall to Doom  •  💀 3 Lives  •  ⛰️ Summit: 3000m',
      {
        fontSize: '13px',
        fontFamily: 'Courier New, monospace',
        color: '#ffccaa',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
      }
    )
    rules.setOrigin(0.5)
    rules.setScrollFactor(0, 0)
    rules.setDepth(51)
    
    // Golden bug teaser with ominous tone
    const teaser = this.add.text(W / 2, H - 24, 
      '🐛 Legend Speaks of a Golden Bug at the Peak... Will You Find It? ✨',
      {
        fontSize: '12px',
        fontFamily: 'Georgia, serif',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        fontStyle: 'italic'
      }
    )
    teaser.setOrigin(0.5)
    teaser.setScrollFactor(0, 0)
    teaser.setDepth(51)
    
    // Eerie flickering animation
    this.tweens.add({
      targets: teaser,
      alpha: 0.6,
      scale: 0.97,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Pulsing skulls
    this.tweens.add({
      targets: [skullLeft, skullRight],
      scale: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
  
  private createSpiderCursor() {
    // Create custom spider cursor that follows mouse
    this.spiderCursor = this.add.container(0, 0)
    this.spiderCursor.setDepth(10000) // Always on top
    
    // Spider body (smaller for cursor)
    const body = this.add.ellipse(0, 0, 30, 22, 0x000000)
    const bodyHighlight = this.add.ellipse(-4, -3, 10, 8, 0x333333, 0.7)
    this.spiderCursor.add([body, bodyHighlight])
    
    // Eyes (big and cute)
    const eyeWhiteL = this.add.circle(-6, -2, 6, 0xffffff)
    const eyeWhiteR = this.add.circle(6, -2, 6, 0xffffff)
    const eyePupilL = this.add.circle(-5, -1, 3, 0xff0000) // Red pupils for spooky effect
    const eyePupilR = this.add.circle(7, -1, 3, 0xff0000)
    const eyeShineL = this.add.circle(-6, -3, 1.5, 0xffffff, 0.9)
    const eyeShineR = this.add.circle(6, -3, 1.5, 0xffffff, 0.9)
    
    this.spiderCursor.add([eyeWhiteL, eyeWhiteR, eyePupilL, eyePupilR, eyeShineL, eyeShineR])
    
    // 8 legs (4 on each side)
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1
      const index = i % 4
      
      const leg = this.add.graphics()
      leg.lineStyle(2, 0x000000, 1)
      
      // Draw curved leg
      const startX = side * 12
      const startY = -3 + index * 3
      const midX = side * 18
      const midY = -4 + index * 2
      const endX = side * 24
      const endY = 2 + index * 2
      
      leg.beginPath()
      leg.moveTo(startX, startY)
      leg.lineTo(midX, midY)
      leg.lineTo(endX, endY)
      leg.strokePath()
      
      this.spiderCursor.add(leg)
    }
    
    // Shadow under spider
    const shadow = this.add.ellipse(1, 12, 28, 8, 0x000000, 0.3)
    shadow.setDepth(-1)
    this.spiderCursor.add(shadow)
    
    // Subtle bounce animation for cursor
    this.tweens.add({
      targets: this.spiderCursor,
      scaleY: 1.05,
      scaleX: 0.98,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Pulsing eyes
    this.tweens.add({
      targets: [eyePupilL, eyePupilR],
      scale: 1.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }
  
  private startGame() {
    console.log('🎮 Starting game...')
    
    // Restore default cursor before leaving
    this.input.setDefaultCursor('default')
    
    // Stop this scene and start the Halloween climb scene
    this.scene.stop('MainMenuScene')
    this.scene.start('HalloweenClimbScene')
  }
  
  shutdown() {
    // Restore default cursor when scene is shut down
    this.input.setDefaultCursor('default')
  }
}

