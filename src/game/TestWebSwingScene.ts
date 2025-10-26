/**
 * TEST WEB SWING SCENE
 * Simple test scene to verify web swinging works
 * Minimal dependencies, easy to debug
 */

import Phaser from 'phaser'
import { PhysicsWebModule } from './modules/PhysicsWebModule'

export default class TestWebSwingScene extends Phaser.Scene {
  private spider!: Phaser.Physics.Arcade.Sprite
  private webModule!: PhysicsWebModule
  
  constructor() {
    super({ key: 'TestWebSwingScene' })
    console.log('🧪 TestWebSwingScene constructor')
  }
  
  preload() {
    console.log('📦 TestWebSwingScene preload')
    
    // Create simple textures
    this.createSimpleTextures()
  }
  
  create() {
    console.log('🎮 TestWebSwingScene create')
    
    const W = this.scale.width
    const H = this.scale.height
    
    // Background
    this.add.rectangle(W/2, H/2, W, H, 0x2a3f54)
    
    // Title
    this.add.text(W/2, 30, '🕷️ WEB SWINGING TEST', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5)
    
    // Instructions
    this.add.text(W/2, 60, 'Left Click + Drag = Shoot Web | Right Click = Cut Web', {
      fontSize: '14px',
      color: '#aaaaaa'
    }).setOrigin(0.5)
    
    // Create spider
    this.spider = this.physics.add.sprite(100, 500, 'spider')
    this.spider.setScale(1.5)
    this.spider.setTint(0xff0000)
    
    // Create platforms
    const platforms = this.physics.add.staticGroup()
    platforms.create(100, 550, 'platform').setDisplaySize(200, 20).setTint(0x8b5cf6)
    platforms.create(400, 450, 'platform').setDisplaySize(200, 20).setTint(0x8b5cf6)
    platforms.create(700, 350, 'platform').setDisplaySize(200, 20).setTint(0x8b5cf6)
    
    // Spider collides with platforms
    this.physics.add.collider(this.spider, platforms)
    
    // Initialize web swinging module (NEW: Uses Matter.js for physics!)
    this.webModule = new PhysicsWebModule(this, this.spider, {
      stiffness: 0.9,
      damping: 0.1,
      correctGravity: 600,
      wrongGravity: 1000
    })
    
    // Add web anchor points (the yellow circles spider can swing from)
    this.webModule.addAnchor(300, 200, 'anchor1')
    this.webModule.addAnchor(500, 150, 'anchor2')
    this.webModule.addAnchor(700, 100, 'anchor3')
    
    // Enable web swinging input
    this.webModule.enableInput()
    
    // Add test buttons for calculus effects
    this.createTestButtons()
    
    console.log('✅ TestWebSwingScene ready!')
  }
  
  update(time: number, delta: number) {
    // Update web swinging module (pass delta time for physics)
    this.webModule.update(delta)
  }
  
  private createSimpleTextures() {
    // Spider texture
    const spider = this.add.graphics()
    spider.fillStyle(0xff0000, 1)
    spider.fillCircle(10, 10, 10)
    spider.generateTexture('spider', 20, 20)
    spider.destroy()
    
    // Platform texture
    const platform = this.add.graphics()
    platform.fillStyle(0x8b5cf6, 1)
    platform.fillRect(0, 0, 20, 20)
    platform.generateTexture('platform', 20, 20)
    platform.destroy()
    
    // Web point texture
    const webPoint = this.add.graphics()
    webPoint.fillStyle(0xffd700, 1)
    webPoint.fillCircle(10, 10, 10)
    webPoint.generateTexture('web-point', 20, 20)
    webPoint.destroy()
    
    console.log('✅ Textures created')
  }
  
  private createTestButtons() {
    const W = this.scale.width
    
    // Correct answer button (easier physics)
    const correctBtn = this.add.text(W - 200, 30, '✅ Correct Answer', {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#004400',
      padding: { x: 10, y: 5 }
    })
    correctBtn.setInteractive({ useHandCursor: true })
    correctBtn.on('pointerdown', () => {
      this.webModule.applyCalculusEffect(true)
      console.log('✅ Easier physics applied!')
    })
    
    // Wrong answer button (harder physics)
    const wrongBtn = this.add.text(W - 200, 60, '❌ Wrong Answer', {
      fontSize: '14px',
      color: '#ff0000',
      backgroundColor: '#440000',
      padding: { x: 10, y: 5 }
    })
    wrongBtn.setInteractive({ useHandCursor: true })
    wrongBtn.on('pointerdown', () => {
      this.webModule.applyCalculusEffect(false)
      console.log('❌ Harder physics applied!')
    })
    
    // Info text
    this.add.text(W - 200, 100, 'Test buttons to see\nhow answers affect\nphysics!', {
      fontSize: '12px',
      color: '#aaaaaa'
    })
  }
  
  shutdown() {
    if (this.webModule) {
      this.webModule.destroy()
    }
  }
}

