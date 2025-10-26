import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getQuestionByHeight } from '../math/calculusAPI'
import type { AdventureQuestion } from './gameTypes'
import { audioManager } from './AudioManager'
import { gsap } from 'gsap'

/**
 * SIMPLE ENHANCED SCENE
 * A simplified version with just GSAP animations for reliability
 */

type LeafPlatform = {
  x: number
  y: number
  container: Phaser.GameObjects.Container
  heightMeters: number
}

export default class SimpleEnhancedScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SimpleEnhancedScene' })
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
  magicalParticles: Phaser.GameObjects.Particles.ParticleEmitter[] = []
  
  // Audio button
  audioButton!: Phaser.GameObjects.Container
  audioEnabled = true
  
  // Camera
  cameraFollowY = 0
  
  // UI
  livesDisplay!: Phaser.GameObjects.Container
  heightText!: Phaser.GameObjects.Text
  feedbackText!: Phaser.GameObjects.Text

  preload() {
    // Load explosion GIF
    this.load.image('explosion', '/explosion.gif')
  }

  create() {
    console.log('🌟 Creating Simple Enhanced Jack & Beanstalk Scene!')
    
    const W = this.scale.width
    const H = this.scale.height
    
    // Create background
    this.createBeanstalkBackground()
    
    // Create environment
    this.createSun()
    this.createClouds()
    this.createBeanstalk()
    this.createMagicalParticles()
    
    // Generate leaf platforms
    this.generateLeafPlatforms()
    
    // Create spider on first leaf
    this.createSpider()
    
    // Create UI
    this.createLivesDisplay()
    this.createAudioButton()
    this.createUI()
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, W, 5000)
    this.cameras.main.startFollow(this.spider, false, 0.1, 0.1)
    
    // Start background music
    audioManager.playBackgroundMusic()
    
    // Request first question
    this.requestQuestion()
    
    console.log('✅ Simple Enhanced Scene created successfully!')
  }

  private createBeanstalkBackground() {
    const W = this.scale.width
    const H = 5000
    
    // Sky gradient
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1)
    bg.fillRect(0, 0, W, H)
    
    // Ground
    const ground = this.add.graphics()
    ground.fillStyle(0x228B22, 1)
    ground.fillRect(0, H - 100, W, 100)
  }

  private createSun() {
    const W = this.scale.width
    
    // Sun
    this.sun = this.add.circle(W - 100, 100, 40, 0xFFD700, 1)
    
    // Sun rays
    const rays = this.add.graphics()
    rays.lineStyle(3, 0xFFD700, 0.8)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = W - 100 + Math.cos(angle) * 50
      const y1 = 100 + Math.sin(angle) * 50
      const x2 = W - 100 + Math.cos(angle) * 70
      const y2 = 100 + Math.sin(angle) * 70
      rays.lineBetween(x1, y1, x2, y2)
    }
    
    // Animate sun with GSAP
    gsap.to(this.sun, {
      scale: 1.1,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    })
  }

  private createClouds() {
    const W = this.scale.width
    
    for (let i = 0; i < 5; i++) {
      const cloud = this.add.container(0, 0)
      
      // Cloud body
      const body = this.add.circle(0, 0, 20, 0xFFFFFF, 0.8)
      const left = this.add.circle(-15, 0, 15, 0xFFFFFF, 0.8)
      const right = this.add.circle(15, 0, 15, 0xFFFFFF, 0.8)
      const top = this.add.circle(0, -10, 12, 0xFFFFFF, 0.8)
      
      cloud.add([body, left, right, top])
      cloud.x = Math.random() * W
      cloud.y = 50 + Math.random() * 200
      
      this.clouds.push(cloud)
      
      // Animate cloud with GSAP
      gsap.to(cloud, {
        x: cloud.x + (Math.random() - 0.5) * 100,
        y: cloud.y + (Math.random() - 0.5) * 50,
        duration: 6 + Math.random() * 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      })
    }
  }

  private createBeanstalk() {
    const W = this.scale.width
    const H = 5000
    
    // Main beanstalk
    const stalk = this.add.graphics()
    stalk.fillStyle(0x228B22, 1)
    stalk.fillRect(W/2 - 20, 0, 40, H)
    
    // Beanstalk texture lines
    stalk.lineStyle(2, 0x1F5F1F, 0.6)
    for (let y = 0; y < H; y += 50) {
      stalk.lineBetween(W/2 - 15, y, W/2 + 15, y)
    }
    
    this.beanstalk.push(stalk)
  }

  private createMagicalParticles() {
    const W = this.scale.width
    
    // Magical sparkles
    const particles = this.add.particles(0, 0, 'particle', {
      x: { min: 0, max: W },
      y: { min: 0, max: 5000 },
      speed: { min: 10, max: 30 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 3000,
      quantity: 1,
      frequency: 100
    })
    
    this.magicalParticles.push(particles)
  }

  private generateLeafPlatforms() {
    const W = this.scale.width
    const startY = 400
    const spacing = 150
    
    for (let i = 0; i < 20; i++) {
      const leaf = this.createLeaf(
        W/2 + (Math.random() - 0.5) * 200,
        startY + i * spacing,
        i * 50
      )
      this.leaves.push(leaf)
    }
  }

  private createLeaf(x: number, y: number, heightMeters: number): LeafPlatform {
    const leaf = this.add.container(x, y)
    
    // Leaf body
    const body = this.add.ellipse(0, 0, 60, 40, 0x32CD32, 0.9)
    const stem = this.add.rectangle(0, -20, 4, 20, 0x228B22, 1)
    
    leaf.add([body, stem])
    
    // Add some detail
    const detail = this.add.graphics()
    detail.lineStyle(1, 0x228B22, 0.6)
    detail.lineBetween(-20, 0, 20, 0)
    detail.lineBetween(-15, -10, 15, -10)
    detail.lineBetween(-10, 10, 10, 10)
    leaf.add(detail)
    
    // Create the LeafPlatform object
    const leafPlatform: LeafPlatform = {
      x,
      y,
      container: leaf,
      heightMeters
    }
    
    // Make interactive
    body.setInteractive()
    body.on('pointerdown', () => {
      if (!this.waitingForAnswer && !this.isAnimating && !this.isGameOver) {
        this.selectLeaf(leafPlatform)
      }
    })
    
    // Hover effects
    body.on('pointerover', () => {
      if (!this.waitingForAnswer && !this.isAnimating && !this.isGameOver) {
        gsap.to(leaf, { scale: 1.1, duration: 0.2 })
      }
    })
    
    body.on('pointerout', () => {
      gsap.to(leaf, { scale: 1, duration: 0.2 })
    })
    
    return leafPlatform
  }

  private createSpider() {
    const firstLeaf = this.leaves[0]
    if (!firstLeaf) return
    
    this.spider = this.add.container(firstLeaf.x, firstLeaf.y - 30)
    
    // Spider body
    const body = this.add.ellipse(0, 0, 20, 15, 0x8B4513, 1)
    const head = this.add.ellipse(0, -8, 12, 10, 0x654321, 1)
    
    // Eyes
    const eyeL = this.add.circle(-3, -10, 2, 0x000000, 1)
    const eyeR = this.add.circle(3, -10, 2, 0x000000, 1)
    
    // Legs
    const legs = this.add.graphics()
    legs.lineStyle(2, 0x654321, 1)
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const x1 = Math.cos(angle) * 8
      const y1 = Math.sin(angle) * 8
      const x2 = Math.cos(angle) * 15
      const y2 = Math.sin(angle) * 15
      legs.lineBetween(x1, y1, x2, y2)
    }
    
    this.spider.add([body, head, eyeL, eyeR, legs])
    this.currentLeaf = firstLeaf
  }

  private createLivesDisplay() {
    this.livesDisplay = this.add.container(20, 20)
    
    for (let i = 0; i < 3; i++) {
      const heart = this.add.graphics()
      heart.fillStyle(0xff0000, 1)
      heart.beginPath()
      heart.moveTo(0, 0)
      heart.lineTo(0, -10)
      heart.lineTo(-10, -15)
      heart.lineTo(-20, -5)
      heart.lineTo(-15, 10)
      heart.lineTo(-10, 15)
      heart.lineTo(0, 20)
      heart.lineTo(10, 15)
      heart.lineTo(15, 10)
      heart.lineTo(20, 5)
      heart.lineTo(15, -10)
      heart.lineTo(10, -15)
      heart.lineTo(0, -10)
      heart.lineTo(0, 0)
      heart.fillPath()
      
      heart.x = i * 30
      this.livesDisplay.add(heart)
    }
  }

  private createAudioButton() {
    this.audioButton = this.add.container(this.scale.width - 50, 20)
    
    const button = this.add.circle(0, 0, 20, 0x4a4a4a, 1)
    const icon = this.add.text(0, 0, this.audioEnabled ? '🔊' : '🔇', {
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5)
    
    this.audioButton.add([button, icon])
    this.audioButton.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains)
    this.audioButton.on('pointerdown', this.toggleAudio, this)
  }

  private toggleAudio() {
    this.audioEnabled = !this.audioEnabled
    if (this.audioEnabled) {
      audioManager.playBackgroundMusic()
    } else {
      audioManager.stopBackgroundMusic()
    }
    
    const icon = this.audioButton.list[1] as Phaser.GameObjects.Text
    icon.setText(this.audioEnabled ? '🔊' : '🔇')
  }

  private createUI() {
    this.heightText = this.add.text(this.scale.width / 2, 20, 'Height: 0m', {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    this.feedbackText = this.add.text(this.scale.width / 2, 50, '', {
      fontSize: '16px',
      color: '#ffff00',
      fontStyle: 'bold'
    }).setOrigin(0.5)
  }

  private updateUI() {
    this.heightText.setText(`Height: ${Math.floor(this.currentHeightMeters)}m`)
    this.heightText.y = this.cameraFollowY + 20
    this.feedbackText.y = this.cameraFollowY + 50
  }

  private selectLeaf(leaf: LeafPlatform) {
    if (this.waitingForAnswer || this.isAnimating || this.isGameOver) return
    
    this.currentLeaf = leaf
    this.requestQuestion()
  }

  private requestQuestion() {
    try {
      const question = getQuestionByHeight(this.currentHeightMeters)
      const store = useGameStore.getState()
      
      const adventureQuestion: AdventureQuestion = {
        id: question.id,
        text: question.question,
        options: question.options.map((opt, index) => ({
          text: typeof opt === 'string' ? opt : opt.text,
          correct: index === 0,
          action: 'jump' as const
        })),
        storyContext: `Climbing to ${Math.floor(this.currentHeightMeters)}m - ${question.topic || 'Calculus Challenge'}`,
        concept: question.concept || question.topic || 'Calculus',
        hint: question.hint
      }
      
      store.setCurrentAdventureQuestion(adventureQuestion)
      this.waitingForAnswer = true
      this.isAnimating = false
    } catch (error) {
      console.error('Error requesting question:', error)
      this.continueGame()
    }
  }

  private handleAnswer(event: CustomEvent) {
    if (!this.waitingForAnswer || this.isAnimating || this.isGameOver) return
    
    const { answerIndex, isCorrect } = event.detail
    this.waitingForAnswer = false
    
    if (isCorrect) {
      this.onCorrectAnswer()
    } else {
      this.onWrongAnswer()
    }
  }

  private onCorrectAnswer() {
    this.score += 10
    this.showMessage('Correct! +10 points', 0x00ff00)
    
    // Find next leaf above
    const nextLeaf = this.findNextLeafAbove()
    if (nextLeaf) {
      this.jumpToLeaf(nextLeaf)
    } else {
      this.continueGame()
    }
  }

  private onWrongAnswer() {
    this.lives--
    this.showMessage('Wrong! -1 life', 0xff0000)
    
    if (this.lives <= 0) {
      this.onGameOver()
      return
    }
    
    // Find previous leaf below
    const prevLeaf = this.findPreviousLeaf()
    if (prevLeaf) {
      this.fallToLeaf(prevLeaf)
    } else {
      this.continueGame()
    }
  }

  private onGameOver() {
    this.isGameOver = true
    this.showMessage('Game Over!', 0xff0000)
    
    // Load and show explosion
    this.load.image('explosion', '/explosion.gif')
    this.load.once('complete', () => {
      const explosion = this.add.image(this.spider.x, this.spider.y, 'explosion')
      explosion.setScale(0.1)
      
      gsap.to(explosion, {
        scale: 2,
        alpha: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          explosion.destroy()
        }
      })
    })
    this.load.start()
  }

  private showMessage(text: string, color: number) {
    this.feedbackText.setText(text)
    this.feedbackText.setTint(color)
    
    gsap.to(this.feedbackText, {
      alpha: 0,
      duration: 2,
      ease: "power2.out"
    })
  }

  private findNextLeafAbove(): LeafPlatform | null {
    if (!this.currentLeaf) return null
    
    return this.leaves.find(leaf => 
      leaf.y < this.currentLeaf!.y && 
      Math.abs(leaf.x - this.currentLeaf!.x) < 100
    ) || null
  }

  private findPreviousLeaf(): LeafPlatform | null {
    if (!this.currentLeaf) return null
    
    return this.leaves.find(leaf => 
      leaf.y > this.currentLeaf!.y && 
      Math.abs(leaf.x - this.currentLeaf!.x) < 100
    ) || null
  }

  private jumpToLeaf(leaf: LeafPlatform) {
    this.isAnimating = true
    this.currentLeaf = leaf
    this.currentHeightMeters = leaf.heightMeters
    
    // GSAP jump animation
    gsap.to(this.spider, {
      x: leaf.x,
      y: leaf.y - 30,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        this.landEffect(leaf)
        this.continueGame()
      }
    })
  }

  private fallToLeaf(leaf: LeafPlatform) {
    this.isAnimating = true
    this.currentLeaf = leaf
    this.currentHeightMeters = leaf.heightMeters
    
    // GSAP fall animation
    gsap.to(this.spider, {
      x: leaf.x,
      y: leaf.y - 30,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        this.landEffect(leaf)
        this.continueGame()
      }
    })
  }

  private landEffect(leaf: LeafPlatform) {
    // Dust particles
    const dust = this.add.particles(leaf.x, leaf.y, 'particle', {
      x: { min: -20, max: 20 },
      y: { min: -10, max: 10 },
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 5
    })
    
    gsap.delayedCall(1, () => dust.destroy())
  }

  private continueGame() {
    this.isAnimating = false
    this.waitingForAnswer = false
    
    // Check for victory
    if (this.currentHeightMeters >= this.targetHeight) {
      this.showMessage('Victory! You reached the sky!', 0x00ff00)
    }
  }

  update() {
    if (this.spider) {
      this.cameraFollowY = this.spider.y
      this.updateUI()
    }
  }

  shutdown() {
    // Clean up event listeners
    window.removeEventListener('spidercalc-action', this.handleAnswer as EventListener)
    
    // Clean up GSAP animations
    gsap.killTweensOf(this.spider)
    gsap.killTweensOf(this.sun)
    gsap.killTweensOf(this.clouds)
  }
}
