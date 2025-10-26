/**
 * PHYSICS WEB MODULE - Hybrid Phaser + Matter.js
 * 
 * Uses Matter.js for rope physics (built-in constraints)
 * Uses Phaser for rendering (sprites, graphics)
 * 
 * Benefits:
 * - Accurate rope/pendulum physics from Matter.js
 * - Beautiful rendering from Phaser
 * - Easy to debug with Matter debugger
 * - Only ~50 lines of code!
 */

import Phaser from 'phaser'
import Matter from 'matter-js'

export interface PhysicsWebConfig {
  stiffness?: number      // How rigid the rope is (0-1)
  damping?: number        // Energy loss (0-1)
  correctGravity?: number
  wrongGravity?: number
}

export class PhysicsWebModule {
  private scene: Phaser.Scene
  private spider: Phaser.Physics.Arcade.Sprite
  
  // Matter.js physics world
  private engine: Matter.Engine
  private spiderBody: Matter.Body
  private anchorBodies: Map<string, Matter.Body> = new Map()
  private activeConstraint: Matter.Constraint | null = null
  
  // Phaser rendering
  private webLine: Phaser.GameObjects.Line | null = null
  private trajectoryGraphics: Phaser.GameObjects.Graphics
  private isDragging: boolean = false
  
  // Config
  private config: Required<PhysicsWebConfig> = {
    stiffness: 0.9,
    damping: 0.1,
    correctGravity: 600,
    wrongGravity: 1000
  }
  
  constructor(
    scene: Phaser.Scene,
    spider: Phaser.Physics.Arcade.Sprite,
    config?: PhysicsWebConfig
  ) {
    this.scene = scene
    this.spider = spider
    
    if (config) {
      this.config = { ...this.config, ...config }
    }
    
    // Create Matter.js physics engine (separate from Phaser physics)
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 1 } // Will sync with Phaser gravity
    })
    
    // Create Matter body for spider (physics simulation)
    this.spiderBody = Matter.Bodies.circle(spider.x, spider.y, 10, {
      friction: 0.1,
      restitution: 0.3
    })
    Matter.World.add(this.engine.world, this.spiderBody)
    
    // Create trajectory graphics
    this.trajectoryGraphics = scene.add.graphics()
    this.trajectoryGraphics.setDepth(1000)
    
    console.log('✅ Physics Web Module initialized (Matter.js + Phaser)')
  }
  
  /**
   * Add a web anchor point
   */
  addAnchor(x: number, y: number, id: string): void {
    // Create static Matter body for anchor
    const anchorBody = Matter.Bodies.circle(x, y, 10, {
      isStatic: true
    })
    
    Matter.World.add(this.engine.world, anchorBody)
    this.anchorBodies.set(id, anchorBody)
    
    console.log(`🎯 Added physics anchor at (${x}, ${y})`)
  }
  
  /**
   * Enable input handlers
   */
  enableInput(): void {
    this.scene.input.on('pointerdown', this.onPointerDown, this)
    this.scene.input.on('pointermove', this.onPointerMove, this)
    this.scene.input.on('pointerup', this.onPointerUp, this)
    
    if (this.scene.input.mouse) {
      this.scene.input.mouse.disableContextMenu()
    }
    
    console.log('🖱️ Physics web input enabled')
  }
  
  /**
   * Disable input handlers
   */
  disableInput(): void {
    this.scene.input.off('pointerdown', this.onPointerDown, this)
    this.scene.input.off('pointermove', this.onPointerMove, this)
    this.scene.input.off('pointerup', this.onPointerUp, this)
    
    console.log('🖱️ Physics web input disabled')
  }
  
  /**
   * Update - call this in scene's update loop
   */
  update(deltaMs: number): void {
    // Update Matter.js physics
    Matter.Engine.update(this.engine, deltaMs)
    
    // Sync Phaser sprite position with Matter body
    this.spider.setPosition(
      this.spiderBody.position.x,
      this.spiderBody.position.y
    )
    
    // Sync Phaser velocity with Matter velocity
    const body = this.spider.body as Phaser.Physics.Arcade.Body
    if (body) {
      body.setVelocity(
        this.spiderBody.velocity.x * 60, // Convert to Phaser units
        this.spiderBody.velocity.y * 60
      )
    }
    
    // Update web line rendering
    if (this.activeConstraint && this.webLine) {
      const anchor = (this.activeConstraint.bodyA as Matter.Body).position
      this.webLine.setTo(
        this.spiderBody.position.x,
        this.spiderBody.position.y,
        anchor.x,
        anchor.y
      )
    }
    
    // Update trajectory if dragging
    if (this.isDragging) {
      this.drawTrajectory()
    }
  }
  
  /**
   * Apply calculus effects (call when answering questions)
   */
  applyCalculusEffect(isCorrect: boolean): void {
    const newGravity = isCorrect ? this.config.correctGravity : this.config.wrongGravity
    
    // Update Matter.js gravity
    this.engine.gravity.y = newGravity / 600 // Normalize to Matter units
    
    // Update Phaser gravity
    this.scene.physics.world.gravity.y = newGravity
    
    console.log(isCorrect ? '✅ Easier physics' : '❌ Harder physics')
  }
  
  /**
   * Detach web
   */
  detachWeb(): void {
    if (this.activeConstraint) {
      Matter.World.remove(this.engine.world, this.activeConstraint)
      this.activeConstraint = null
    }
    
    if (this.webLine) {
      this.webLine.destroy()
      this.webLine = null
    }
    
    console.log('✂️ Web detached')
  }
  
  // ========== PRIVATE METHODS ==========
  
  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (pointer.leftButtonDown()) {
      this.isDragging = true
      console.log('🎯 Started dragging')
    } else if (pointer.rightButtonDown()) {
      this.detachWeb()
    }
  }
  
  private onPointerMove(): void {
    if (this.isDragging) {
      this.drawTrajectory()
    }
  }
  
  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (this.isDragging) {
      this.isDragging = false
      this.trajectoryGraphics.clear()
      
      // Find closest anchor
      const closest = this.findClosestAnchor(pointer.x, pointer.y)
      if (closest) {
        this.attachToAnchor(closest.id)
      }
      
      console.log('🕸️ Web shot!')
    }
  }
  
  private drawTrajectory(): void {
    this.trajectoryGraphics.clear()
    this.trajectoryGraphics.lineStyle(2, 0xffff00, 0.7)
    
    const pointer = this.scene.input.activePointer
    const angle = Math.atan2(
      pointer.y - this.spider.y,
      pointer.x - this.spider.x
    )
    
    // Simple straight line for now (Matter will handle actual trajectory)
    this.trajectoryGraphics.lineBetween(
      this.spider.x,
      this.spider.y,
      pointer.x,
      pointer.y
    )
  }
  
  private findClosestAnchor(x: number, y: number): { id: string, distance: number } | null {
    let closest: { id: string, distance: number } | null = null
    
    this.anchorBodies.forEach((body, id) => {
      const dist = Math.hypot(
        body.position.x - x,
        body.position.y - y
      )
      
      if (!closest || dist < closest.distance) {
        closest = { id, distance: dist }
      }
    })
    
    return closest
  }
  
  private attachToAnchor(anchorId: string): void {
    const anchorBody = this.anchorBodies.get(anchorId)
    if (!anchorBody) return
    
    // Create Matter.js constraint (rope)
    this.activeConstraint = Matter.Constraint.create({
      bodyA: anchorBody,
      bodyB: this.spiderBody,
      stiffness: this.config.stiffness,
      damping: this.config.damping,
      length: Matter.Vector.magnitude(
        Matter.Vector.sub(anchorBody.position, this.spiderBody.position)
      )
    })
    
    Matter.World.add(this.engine.world, this.activeConstraint)
    
    // Create Phaser line for visual
    this.webLine = this.scene.add.line(
      0, 0,
      this.spiderBody.position.x,
      this.spiderBody.position.y,
      anchorBody.position.x,
      anchorBody.position.y,
      0xffffff,
      0.8
    )
    this.webLine.setOrigin(0, 0)
    this.webLine.setLineWidth(2)
    this.webLine.setDepth(300)
    
    console.log('🕸️ Web attached with Matter.js constraint!')
  }
  
  /**
   * Cleanup
   */
  destroy(): void {
    this.disableInput()
    this.detachWeb()
    this.trajectoryGraphics.destroy()
    Matter.Engine.clear(this.engine)
    console.log('🗑️ Physics Web Module destroyed')
  }
}

