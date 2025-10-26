import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { getQuestionByHeight, getChapterByHeight } from '../math/calculusAPI'
import type { AdventureQuestion } from './gameTypes'
import { audioManager } from './AudioManager'
import * as THREE from 'three'
import { gsap } from 'gsap'
import Matter from 'matter-js'

/**
 * ENHANCED JACK & BEANSTALK CLIMBING SCENE
 * Featuring GSAP animations, Three.js 3D graphics, and realistic physics
 * Spider climbs 3D beanstalk with realistic leaf platforms
 */

type LeafPlatform = {
  x: number
  y: number
  container: Phaser.GameObjects.Container
  heightMeters: number
  threeObject?: THREE.Mesh
  matterBody?: Matter.Body
}

export default class EnhancedClimbScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EnhancedClimbScene' })
  }
  
  // Spider
  spider!: Phaser.GameObjects.Container
  spiderThreeObject?: THREE.Mesh
  
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
  
  // Three.js Scene
  threeScene!: THREE.Scene
  threeCamera!: THREE.PerspectiveCamera
  threeRenderer!: THREE.WebGLRenderer
  threeCanvas!: HTMLCanvasElement
  
  // Physics
  matterWorld!: Matter.World
  matterEngine!: Matter.Engine
  
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
    // Load any additional assets needed for enhanced graphics
    this.load.image('particle', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
  }

  create() {
    console.log('🌟 Creating Enhanced Jack & Beanstalk Scene!')
    
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
    
    // Initialize Three.js
    this.initThreeJS()
    
    // Initialize Physics
    this.initPhysics()
    
    // Create enhanced environment
    this.createEnhancedBackground()
    this.createEnhancedSun()
    this.createEnhancedClouds()
    this.createEnhancedBeanstalk()
    this.createMagicalParticles()
    
    // Create leaf platforms going upward
    this.generateEnhancedLeafPlatforms()
    
    // Create spider on first leaf
    this.createEnhancedSpider()
    
    // Create lives display
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
    window.addEventListener('spidercalc-action', this.handleAnswer as EventListener)
    
    console.log('✅ Enhanced scene ready!')
  }

  private initThreeJS() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create Three.js scene
    this.threeScene = new THREE.Scene()
    this.threeScene.background = new THREE.Color(0x87CEEB)
    
    // Create camera
    this.threeCamera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
    this.threeCamera.position.set(0, 0, 5)
    
    // Create renderer
    this.threeCanvas = document.createElement('canvas')
    this.threeRenderer = new THREE.WebGLRenderer({ 
      canvas: this.threeCanvas,
      alpha: true,
      antialias: true
    })
    this.threeRenderer.setSize(W, H)
    this.threeRenderer.shadowMap.enabled = true
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.threeScene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.threeScene.add(directionalLight)
    
    // Add to Phaser scene
    const threeTexture = this.textures.addCanvas('threejs', this.threeCanvas)
    const threeSprite = this.add.image(0, 0, 'threejs')
    threeSprite.setScrollFactor(0)
    threeSprite.setDepth(-2000)
  }

  private initPhysics() {
    // Create Matter.js world
    this.matterEngine = Matter.Engine.create()
    this.matterWorld = this.matterEngine.world
    this.matterWorld.gravity.y = 0.8
    
    // Add to Phaser (commented out due to type conflict)
    // this.matter.world = this.matterWorld
  }

  private createEnhancedBackground() {
    const W = this.scale.width
    const H = 5000
    
    // Create beautiful sky gradient with GSAP animation
    const bg = this.add.graphics()
    
    // Multi-layer sky gradient for depth
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x87CEEB, 0x87CEEB, 1)
    bg.fillRect(0, -H, W, H * 0.3)
    
    bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1)
    bg.fillRect(0, -H + H * 0.3, W, H * 0.4)
    
    bg.fillGradientStyle(0x4682B4, 0x4682B4, 0x2E4A6B, 0x2E4A6B, 1)
    bg.fillRect(0, -H + H * 0.7, W, H * 0.3 + 1000)
    
    bg.setScrollFactor(1)
    bg.setDepth(-1000)
    
    // Animate background with GSAP
    gsap.to(bg, {
      alpha: 0.95,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    })
  }

  private createEnhancedSun() {
    const W = this.scale.width
    const H = this.scale.height
    
    // Create sun in top right
    this.sun = this.add.circle(W - 100, 100, 60, 0xFFD700, 0.9)
    this.sun.setScrollFactor(0, 0.3)
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
    
    // Enhanced GSAP animations
    gsap.timeline({ repeat: -1 })
      .to(this.sun, {
        scale: 1.1,
        duration: 4,
        ease: "sine.inOut"
      })
      .to(glow, {
        alpha: 0.5,
        scale: 1.2,
        duration: 3,
        ease: "sine.inOut"
      }, 0)
      .to(rays, {
        rotation: Math.PI * 2,
        duration: 20,
        ease: "none"
      }, 0)
  }

  private createEnhancedClouds() {
    const W = this.scale.width
    const H = 5000
    
    // Create beautiful floating clouds with GSAP
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
      cloud.setScrollFactor(0, 0.3)
      cloud.setDepth(-400)
      
      // Enhanced GSAP floating animation
      gsap.to(cloud, {
        y: cloud.y + Phaser.Math.Between(-15, 15),
        x: cloud.x + Phaser.Math.Between(-20, 20),
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      })
      
      this.clouds.push(cloud)
    }
  }

  private createEnhancedBeanstalk() {
    const W = this.scale.width
    const H = 5000
    
    // Create 3D beanstalk with Three.js
    const beanstalkGeometry = new THREE.CylinderGeometry(0.5, 1, 50, 8)
    const beanstalkMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x228B22,
      transparent: true,
      opacity: 0.9
    })
    const beanstalk = new THREE.Mesh(beanstalkGeometry, beanstalkMaterial)
    beanstalk.position.set(0, 0, 0)
    beanstalk.castShadow = true
    beanstalk.receiveShadow = true
    this.threeScene.add(beanstalk)
    
    // Animate beanstalk with GSAP
    gsap.to(beanstalk.rotation, {
      z: Math.PI * 2,
      duration: 30,
      repeat: -1,
      ease: "none"
    })
    
    // Create Phaser beanstalk for interaction
    const phaserBeanstalk = this.add.graphics()
    phaserBeanstalk.fillGradientStyle(0x32CD32, 0x32CD32, 0x228B22, 0x228B22, 1)
    phaserBeanstalk.fillRect(W / 2 - 25, -H, 50, H + 1000)
    phaserBeanstalk.setScrollFactor(1)
    phaserBeanstalk.setDepth(-300)
    
    this.beanstalk.push(phaserBeanstalk)
  }

  private createMagicalParticles() {
    const W = this.scale.width
    const H = 5000
    
    // Create magical sparkles with enhanced GSAP animations
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
      
      // Enhanced twinkling animation with GSAP
      gsap.timeline({ repeat: -1 })
        .to(particle, {
          alpha: 0.3,
          scale: 1.5,
          duration: Phaser.Math.Between(1000, 3000),
          ease: "sine.inOut"
        })
        .to(particle, {
          x: particle.x + Phaser.Math.Between(-50, 50),
          y: particle.y + Phaser.Math.Between(-30, 30),
          duration: Phaser.Math.Between(2000, 4000),
          ease: "sine.inOut"
        }, 0)
      
      this.magicalParticles.push(particle)
    }
  }

  private generateEnhancedLeafPlatforms() {
    const W = this.scale.width
    
    // Generate leaves going upward
    let currentY = this.scale.height - 100
    const totalLeaves = 30
    
    for (let i = 0; i < totalLeaves; i++) {
      const x = Phaser.Math.Between(150, W - 150)
      currentY -= Phaser.Math.Between(120, 180)
      
      const heightMeters = i * 100
      const leaf = this.createEnhancedLeaf(x, currentY, heightMeters)
      
      this.leaves.push({
        x, y: currentY, container: leaf, heightMeters
      })
    }
  }

  private createEnhancedLeaf(x: number, y: number, heightMeters: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y)
    
    // Create 3D leaf with Three.js
    const leafGeometry = new THREE.SphereGeometry(0.3, 8, 6)
    const leafMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x228B22,
      transparent: true,
      opacity: 0.8
    })
    const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial)
    leafMesh.position.set(x / 100, y / 100, 0)
    leafMesh.castShadow = true
    leafMesh.receiveShadow = true
    this.threeScene.add(leafMesh)
    
    // Create physics body
    const leafBody = Matter.Bodies.circle(x, y, 30, {
      isStatic: true,
      friction: 0.8,
      restitution: 0.3
    })
    Matter.World.add(this.matterWorld, leafBody)
    
    // ========== 3D SHADOW (depth effect) ==========
    const shadow = this.add.ellipse(3, 25, 60, 15, 0x000000, 0.3)
    shadow.setDepth(-1)
    container.add(shadow)
    
    const leaf = this.add.graphics()
    
    // ========== 3D LEAF BODY ==========
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
    
    container.add(leaf)
    
    // ========== 3D GLOW EFFECT ==========
    const glow = this.add.circle(0, 0, 35, 0x32cd32, 0.1)
    glow.setBlendMode(Phaser.BlendModes.ADD)
    container.add(glow)
    
    // Enhanced swaying animation with GSAP
    gsap.to(container, {
      rotation: 0.1,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    })
    
    // Height label
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

  private createEnhancedSpider() {
    // Start on first leaf
    const firstLeaf = this.leaves[0]
    this.currentLeaf = firstLeaf
    
    this.spider = this.add.container(firstLeaf.x, firstLeaf.y - 50)
    
    // Create 3D spider with Three.js
    const spiderGeometry = new THREE.SphereGeometry(0.2, 8, 6)
    const spiderMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 })
    this.spiderThreeObject = new THREE.Mesh(spiderGeometry, spiderMaterial)
    this.spiderThreeObject.position.set(firstLeaf.x / 100, firstLeaf.y / 100, 0)
    this.spiderThreeObject.castShadow = true
    this.threeScene.add(this.spiderThreeObject)
    
    // Create physics body for spider
    const spiderBody = Matter.Bodies.circle(firstLeaf.x, firstLeaf.y - 50, 15, {
      friction: 0.8,
      restitution: 0.3
    })
    Matter.World.add(this.matterWorld, spiderBody)
    
    // ========== 3D SPIDER SHADOW ==========
    const spiderShadow = this.add.ellipse(3, 25, 55, 15, 0x000000, 0.5)
    spiderShadow.setDepth(-2)
    this.spider.add(spiderShadow)
    
    // ========== 3D SPIDER BODY ==========
    const spiderBodyGraphic = this.add.graphics()
    
    // Main body with 3D shading
    spiderBodyGraphic.fillStyle(0x8B4513, 1)
    spiderBodyGraphic.fillEllipse(0, 0, 30, 20)
    
    // Dark shadow on right side
    spiderBodyGraphic.fillStyle(0x654321, 0.6)
    spiderBodyGraphic.fillEllipse(8, 2, 12, 15)
    
    // Bright highlight on left
    spiderBodyGraphic.fillStyle(0xA0522D, 0.8)
    spiderBodyGraphic.fillEllipse(-8, -3, 12, 10)
    
    // Top highlight
    spiderBodyGraphic.fillStyle(0xCD853F, 0.7)
    spiderBodyGraphic.fillEllipse(0, -8, 15, 8)
    
    this.spider.add(spiderBodyGraphic)
    
    // ========== 3D EYES ==========
    const leftEye = this.add.circle(-8, -5, 4, 0xFFFFFF, 1)
    const rightEye = this.add.circle(8, -5, 4, 0xFFFFFF, 1)
    const leftPupil = this.add.circle(-8, -5, 2, 0x000000, 1)
    const rightPupil = this.add.circle(8, -5, 2, 0x000000, 1)
    
    this.spider.add([leftEye, rightEye, leftPupil, rightPupil])
    
    // ========== 3D LEGS ==========
    const legs = this.add.graphics()
    legs.lineStyle(3, 0x654321, 1)
    
    // Left legs
    for (let i = 0; i < 4; i++) {
      const angle = -Math.PI/4 + (i * Math.PI/12)
      const startX = -15 + i * 2
      const startY = 5
      const endX = startX + Math.cos(angle) * 20
      const endY = startY + Math.sin(angle) * 20
      
      legs.beginPath()
      legs.moveTo(startX, startY)
      legs.lineTo(endX, endY)
      legs.strokePath()
    }
    
    // Right legs
    for (let i = 0; i < 4; i++) {
      const angle = -3*Math.PI/4 - (i * Math.PI/12)
      const startX = 15 - i * 2
      const startY = 5
      const endX = startX + Math.cos(angle) * 20
      const endY = startY + Math.sin(angle) * 20
      
      legs.beginPath()
      legs.moveTo(startX, startY)
      legs.lineTo(endX, endY)
      legs.strokePath()
    }
    
    this.spider.add(legs)
    
    // ========== 3D GLOW EFFECT ==========
    const glow = this.add.circle(0, 0, 25, 0x8B4513, 0.1)
    glow.setBlendMode(Phaser.BlendModes.ADD)
    this.spider.add(glow)
    
    // Enhanced breathing animation with GSAP
    gsap.to(this.spider, {
      scaleY: 1.05,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    })
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
    
    // Update button appearance with GSAP animation
    const buttonBg = this.audioButton.list[0] as Phaser.GameObjects.Rectangle
    const buttonText = this.audioButton.list[1] as Phaser.GameObjects.Text
    
    gsap.to(buttonBg, {
      scale: 1.1,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    })
    
    buttonBg.setStrokeStyle(2, this.audioEnabled ? 0x00ff00 : 0xff0000)
    buttonText.setText(this.audioEnabled ? '🔊' : '🔇')
  }

  private createLivesDisplay() {
    this.livesDisplay = this.add.container(20, 20)
    
    for (let i = 0; i < 3; i++) {
      const heartContainer = this.add.container(i * 40, 0)
      
      // Heart shape
      const heart = this.add.graphics()
      heart.fillStyle(0xff0000, 1)
      heart.beginPath()
      heart.moveTo(0, 0)
      // Simple heart shape using lines
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
      
      // Mini spider in heart
      const miniSpider = this.add.circle(0, 0, 3, 0x8B4513, 1)
      const miniEyeL = this.add.circle(-1, -1, 1, 0x000000, 1)
      const miniEyeR = this.add.circle(1, -1, 1, 0x000000, 1)
      const miniPupilL = this.add.circle(-1, -1, 0.5, 0xFFFFFF, 1)
      const miniPupilR = this.add.circle(1, -1, 0.5, 0xFFFFFF, 1)
      
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

  shutdown() {
    window.removeEventListener('spidercalc-action', this.handleAnswer as EventListener)
    
    // Clean up Three.js
    if (this.threeRenderer) {
      this.threeRenderer.dispose()
    }
    
    // Clean up Matter.js
    if (this.matterEngine) {
      Matter.Engine.clear(this.matterEngine)
    }
  }

  update() {
    // Update Three.js scene
    if (this.threeRenderer && this.threeScene && this.threeCamera) {
      this.threeRenderer.render(this.threeScene, this.threeCamera)
    }
    
    // Update physics
    if (this.matterEngine) {
      Matter.Engine.update(this.matterEngine, 16.67)
    }
    
    // Animate clouds
    this.clouds.forEach((cloud, idx) => {
      cloud.x += Math.sin(this.time.now * 0.0005 + idx) * 0.3
      cloud.y += Math.cos(this.time.now * 0.001 + idx) * 0.2
      
      if (cloud.x < -100) cloud.x = this.scale.width + 100
      if (cloud.x > this.scale.width + 100) cloud.x = -100
    })
    
    // Animate magical particles
    this.magicalParticles.forEach((particle, idx) => {
      particle.x += Math.sin(this.time.now * 0.002 + idx) * 0.2
      particle.y += Math.cos(this.time.now * 0.0015 + idx) * 0.1
      
      if (particle.x < -50) particle.x = this.scale.width + 50
      if (particle.x > this.scale.width + 50) particle.x = -50
      if (particle.y < -50) particle.y = this.scale.height + 50
      if (particle.y > this.scale.height + 50) particle.y = -50
    })
  }

  private handleAnswer = (event: Event) => {
    const customEvent = event as CustomEvent
    if (this.isAnimating || this.isGameOver) return
    
    const { action, correct } = customEvent.detail
    
    this.waitingForAnswer = false
    
    if (correct) {
      this.onCorrectAnswer()
    } else {
      this.onWrongAnswer()
    }
  }

  private onCorrectAnswer() {
    console.log('✅ CORRECT!')
    
    // Play correct sound
    audioManager.playSoundEffect('correct')
    
    // Show CORRECT feedback with GSAP animation
    this.showFeedback('CORRECT!', 0x00ff00)
    
    // Find next leaf above
    const nextLeaf = this.findNextLeafAbove()
    
    if (nextLeaf) {
      // JUMP TO LEAF with enhanced GSAP animation!
      this.jumpToLeaf(nextLeaf)
    } else {
      // Reached the end!
      this.onVictory()
    }
  }

  private onWrongAnswer() {
    console.log('❌ WRONG!')
    
    // Play wrong sound
    audioManager.playSoundEffect('wrong')
    
    // Show WRONG feedback
    this.showFeedback('WRONG!', 0xff0000)
    
    // Lose a life
    this.lives--
    
    // Update lives display
    this.updateLivesDisplay()
    
    if (this.lives <= 0) {
      // Game over with enhanced GSAP animation
      gsap.delayedCall(1, () => {
        this.onGameOver()
      })
      return
    }
    
    // Still have lives - fall to previous leaf
    const previousLeaf = this.findPreviousLeaf()
    
    if (previousLeaf) {
      this.fallToLeaf(previousLeaf)
    } else {
      this.time.delayedCall(1500, () => {
        this.continueGame()
      })
    }
  }

  private jumpToLeaf(targetLeaf: LeafPlatform) {
    console.log('🦘 JUMPING to leaf!')
    
    // Play jump sound
    audioManager.playSoundEffect('jump')
    
    // Enhanced GSAP jump animation
    gsap.timeline()
      .to(this.spider, {
        scaleY: 0.8,
        scaleX: 1.2,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(this.spider, {
        x: targetLeaf.x,
        y: targetLeaf.y - 50,
        scaleY: 1,
        scaleX: 1,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          this.landEffect(targetLeaf)
          this.currentLeaf = targetLeaf
          this.currentHeightMeters = targetLeaf.heightMeters
          this.updateUI()
          
          if (this.currentHeightMeters >= this.targetHeight) {
            this.onVictory()
          } else {
            this.continueGame()
          }
        }
      })
  }

  private fallToLeaf(targetLeaf: LeafPlatform) {
    console.log('💔 FALLING down!')
    
    // Play fall sound
    audioManager.playSoundEffect('fall')
    
    // Enhanced GSAP fall animation
    gsap.timeline()
      .to(this.spider, {
        rotation: -Math.PI,
        duration: 0.8,
        ease: "power2.in"
      })
      .to(this.spider, {
        x: targetLeaf.x,
        y: targetLeaf.y - 50,
        rotation: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          this.landEffect(targetLeaf)
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
    
    // Enhanced GSAP land effect
    gsap.timeline()
      .to(leaf.container, {
        scaleY: 0.85,
        scaleX: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      })
      .to(this.cameras.main, {
        shake: { intensity: 0.003, duration: 150 },
        duration: 0.15
      }, 0)
  }

  private showFeedback(text: string, color: number) {
    this.feedbackText.setText(text)
    this.feedbackText.setTint(color)
    this.feedbackText.setAlpha(1)
    
    // Enhanced GSAP feedback animation
    gsap.timeline()
      .to(this.feedbackText, {
        scale: 1.2,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
      .to(this.feedbackText, {
        alpha: 0,
        scale: 0.8,
        duration: 0.5,
        delay: 0.5,
        ease: "power2.out"
      })
  }

  private showMessage(text: string, color: number, y: number) {
    const msg = this.add.text(this.scale.width / 2, y, text, {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: `#${color.toString(16)}`,
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0)
    
    // Enhanced GSAP message animation
    gsap.timeline()
      .to(msg, {
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
      .to(msg, {
        alpha: 0,
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
        onComplete: () => msg.destroy()
      })
  }

  private findNextLeafAbove(): LeafPlatform | null {
    if (!this.currentLeaf) return this.leaves[0]
    
    const leavesAbove = this.leaves.filter(p => 
      p.heightMeters > this.currentLeaf!.heightMeters
    )
    
    if (leavesAbove.length === 0) return null
    
    leavesAbove.sort((a, b) => a.heightMeters - b.heightMeters)
    return leavesAbove[0]
  }

  private findPreviousLeaf(): LeafPlatform | null {
    if (!this.currentLeaf) return null
    
    const leavesBelow = this.leaves.filter(p => 
      p.heightMeters < this.currentLeaf!.heightMeters
    )
    
    if (leavesBelow.length === 0) return null
    
    leavesBelow.sort((a, b) => b.heightMeters - a.heightMeters)
    return leavesBelow[0]
  }

  private continueGame() {
    gsap.delayedCall(0.5, () => {
      this.isAnimating = false
      this.requestQuestion()
    })
  }

  private requestQuestion() {
    if (this.isGameOver) return
    
    try {
      const question = getQuestionByHeight(this.currentHeightMeters)
      const store = useGameStore.getState()
      
      // Convert CalculusQuestion to AdventureQuestion
      const adventureQuestion: AdventureQuestion = {
        id: question.id,
        text: question.question,
        options: question.options.map((opt, index) => ({
          text: typeof opt === 'string' ? opt : opt.text,
          correct: index === 0, // Assume first option is correct for now
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
      console.error('Error loading question:', error)
      this.continueGame()
    }
  }

  private updateLivesDisplay() {
    this.livesDisplay.list.forEach((heartContainer, index) => {
      if (index >= this.lives) {
        gsap.to(heartContainer, {
          alpha: 0.3,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.out"
        })
      }
    })
  }

  private onVictory() {
    console.log('🎉 VICTORY!')
    this.isGameOver = true
    
    // Enhanced victory animation with GSAP
    gsap.timeline()
      .to(this.spider, {
        scale: 1.5,
        duration: 1,
        ease: "back.out(1.7)"
      })
      .to(this.cameras.main, {
        shake: { intensity: 0.01, duration: 1000 },
        duration: 1
      }, 0)
      .call(() => {
        this.showMessage('🎉 VICTORY! You reached the sky!', 0x00ff00, this.scale.height / 2)
      })
  }

  private onGameOver() {
    console.log('💀 GAME OVER!')
    this.isGameOver = true
    
    // Enhanced game over animation with GSAP
    gsap.timeline()
      .to(this.spider, {
        rotation: Math.PI,
        scale: 0.5,
        alpha: 0.5,
        duration: 1,
        ease: "power2.in"
      })
      .to(this.cameras.main, {
        shake: { intensity: 0.02, duration: 2000 },
        duration: 2
      }, 0)
      .call(() => {
        this.showMessage('💀 GAME OVER! Try again!', 0xff0000, this.scale.height / 2)
      })
  }
}
