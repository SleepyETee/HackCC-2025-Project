import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { audioManager } from './AudioManager'

export default class MainMenuScene extends Phaser.Scene {
  private playButton!: Phaser.GameObjects.Container
  private spider!: Phaser.GameObjects.Container
  
  constructor() {
    super({ key: 'MainMenuScene' })
  }
  
  create() {
    const W = this.scale.width
    const H = this.scale.height
    
    console.log('🕷️ MainMenuScene created')
    
    // Start background music
    audioManager.playBackgroundMusic()
    
    // Create background
    this.createBackground()
    
    // Add title
    this.createTitle()
    
    // Add spider mascot
    this.createSpiderMascot()
    
    // Add play button
    this.createPlayButton()
    
    // Add web decorations
    this.createWebDecorations()
    
    // Add instructions
    this.createInstructions()
    
    // Reset game state
    const store = useGameStore.getState()
    store.addScore(-store.score) // Reset to 0
  }
  
  private createBackground() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Main background - warm orange/brown gradient
    const bg = this.add.graphics()
    bg.fillGradientStyle(0xd4926f, 0xd4926f, 0xb8734f, 0xb8734f, 1)
    bg.fillRect(0, 0, W, H)
    
    // Add brown stripe in middle
    bg.fillStyle(0x8b5a3c, 1)
    bg.fillRect(0, H * 0.35, W, H * 0.3)
    
    // Add door/window in background
    const doorX = W * 0.3
    const doorY = H * 0.4
    const doorW = W * 0.4
    const doorH = H * 0.35
    
    // Door frame
    bg.fillStyle(0x6b3e2e, 1)
    bg.fillRect(doorX, doorY, doorW, doorH)
    
    // Door panels (yellow/gold)
    bg.fillGradientStyle(0xffd54f, 0xffd54f, 0xffb300, 0xffb300, 1)
    bg.fillRect(doorX + 10, doorY + 10, doorW - 20, doorH * 0.45)
    bg.fillRect(doorX + 10, doorY + doorH * 0.55, doorW - 20, doorH * 0.4)
    
    // Add atmospheric elements
    this.addAtmosphericElements()
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
    
    // Title background box
    const titleBg = this.add.rectangle(W / 2, 100, W - 80, 100, 0x000000, 0.3)
    titleBg.setStrokeStyle(3, 0x000000)
    
    // Main title text
    const title = this.add.text(W / 2, 80, 'SPIDER-CALC', {
      fontSize: '64px',
      fontFamily: 'Arial Black, sans-serif',
      color: '#000000',
      stroke: '#ffffff',
      strokeThickness: 3
    })
    title.setOrigin(0.5)
    
    // Shadow for depth
    const titleShadow = this.add.text(W / 2 + 3, 83, 'SPIDER-CALC', {
      fontSize: '64px',
      fontFamily: 'Arial Black, sans-serif',
      color: '#6b3e2e'
    })
    titleShadow.setOrigin(0.5)
    titleShadow.setAlpha(0.5)
    titleShadow.setDepth(-1)
    
    // Subtitle
    const subtitle = this.add.text(W / 2, 130, 'Climb to 3000m and master calculus!', {
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    })
    subtitle.setOrigin(0.5)
  }
  
  private createSpiderMascot() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create spider container
    this.spider = this.add.container(W / 2 + 150, H / 2 - 50)
    
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
    
    // Play button container
    this.playButton = this.add.container(W / 2, H / 2 + 120)
    
    // Button background (orange rounded rect)
    const buttonBg = this.add.graphics()
    buttonBg.fillStyle(0xff9955, 1)
    buttonBg.fillRoundedRect(-120, -50, 240, 100, 20)
    buttonBg.lineStyle(5, 0x8b5a3c)
    buttonBg.strokeRoundedRect(-120, -50, 240, 100, 20)
    
    this.playButton.add(buttonBg)
    
    // Button text
    const playText = this.add.text(0, 0, 'PLAY', {
      fontSize: '56px',
      fontFamily: 'Arial Black, sans-serif',
      color: '#000000'
    })
    playText.setOrigin(0.5)
    
    this.playButton.add(playText)
    
    // Make button interactive
    const hitArea = new Phaser.Geom.Rectangle(-120, -50, 240, 100)
    this.playButton.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains)
    
    // Hover effects
    this.playButton.on('pointerover', () => {
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 200,
        ease: 'Back.easeOut'
      })
      playText.setColor('#ffffff')
    })
    
    this.playButton.on('pointerout', () => {
      this.tweens.add({
        targets: this.playButton,
        scaleX: 1,
        scaleY: 1,
        duration: 200
      })
      playText.setColor('#000000')
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
    
    const instructions = this.add.text(W / 2, H - 80, 
      '🎯 Click anchor points to shoot web • 📝 Answer questions to climb\n' +
      '✅ Correct = Strong boost • ❌ Wrong = Weak boost • 💾 Checkpoints every 500m',
      {
        fontSize: '14px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
      }
    )
    instructions.setOrigin(0.5)
  }
  
  private startGame() {
    console.log('🎮 Starting game...')
    
    // Stop this scene and start the Halloween climb scene
    this.scene.stop('MainMenuScene')
    this.scene.start('HalloweenClimbScene')
  }
}

