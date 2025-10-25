
import Phaser from 'phaser'
import { useGameStore } from '../state/store'
import { buildProbabilities, sampleCategorical, calculateConfidenceBonus } from '../math/probability'
import { getLevel } from './questions'
import type { Anchor } from './types'

export default class MainScene extends Phaser.Scene {
  spider!: Phaser.GameObjects.Container
  spiderBody!: Phaser.GameObjects.Arc
  rope!: Phaser.GameObjects.Graphics
  linePreview!: Phaser.GameObjects.Graphics
  anchors: Anchor[] = []
  anchorVisuals: Phaser.GameObjects.Arc[] = []
  beams: Phaser.GameObjects.Graphics[] = []
  particles!: Phaser.GameObjects.Particles.ParticleEmitter
  trailEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
  backgroundStars: Phaser.GameObjects.Arc[] = []
  webBackground!: Phaser.GameObjects.Graphics
  coordinateDisplay!: Phaser.GameObjects.Text

  create() {
    console.log('🕷️ MainScene.create() called - Game is initializing!')
    console.log('Canvas size:', this.scale.width, 'x', this.scale.height)
    
    // Create a white pixel texture for particles (must be in create, not preload)
    const graphics = this.add.graphics()
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(2, 2, 2)
    graphics.generateTexture('white', 4, 4)
    graphics.destroy()
    console.log('✓ Particle texture created')
    
    // Create animated background
    this.createBackgroundEffects()
    console.log('✓ Background effects created')
    
    this.rope = this.add.graphics()
    this.linePreview = this.add.graphics()
    
    // Create spider container for rotation and movement
    this.spider = this.add.container(120, this.scale.height/2)
    
    // Spider body (main circle)
    this.spiderBody = this.add.circle(0, 0, 8, 0xffffff)
    this.spider.add(this.spiderBody)
    
    // Add spider legs (8 lines radiating out)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4)
      const leg = this.add.line(0, 0, 0, 0, 
        Math.cos(angle) * 12, Math.sin(angle) * 12, 
        0xffffff, 0.8)
      leg.setLineWidth(2)
      this.spider.add(leg)
    }
    
    // Pulsing animation
    this.tweens.add({
      targets: this.spider,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
    
    // Create trail effect for spider movement
    this.trailEmitter = this.add.particles(0, 0, 'white', {
      follow: this.spider,
      speed: 0,
      lifespan: 400,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.4, end: 0 },
      tint: 0x00e5ff,
      frequency: 30,
      blendMode: 'ADD'
    })
    
    // Add coordinate display for spider position
    this.coordinateDisplay = this.add.text(this.spider.x, this.spider.y - 25, '', {
      fontSize: '11px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5)
    this.updateCoordinateDisplay()

    // anchors with visual effects
    this.anchors = this.generateAnchors()
    useGameStore.getState().setAnchors(this.anchors)
    this.drawAnchors()

    window.addEventListener('spidercalc-fire', this.onFire)
    window.addEventListener('spidercalc-update-preview', this.updateLinePreview)
    this.updateLinePreview()
    
    console.log('✅ MainScene fully initialized!')
    console.log('Spider position:', this.spider.x, this.spider.y)
    console.log('Anchors created:', this.anchors.length)
  }
  
  private drawAnchors() {
    this.anchorVisuals = this.anchors.map(a => {
      const color = a.hazard ? 0xff4d4d : 0x55ffd7
      const circle = this.add.circle(a.x, a.y, 6, color, 0.9)
      
      // Add pulse animation for hazards
      if (a.hazard) {
        this.tweens.add({
          targets: circle,
          scaleX: 1.3,
          scaleY: 1.3,
          alpha: 0.6,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      } else {
        // Gentle glow for safe anchors
        this.tweens.add({
          targets: circle,
          alpha: 0.7,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      }
      
      return circle
    })
  }

  shutdown() { 
    window.removeEventListener('spidercalc-fire', this.onFire)
    window.removeEventListener('spidercalc-update-preview', this.updateLinePreview)
  }

  private createBackgroundEffects() {
    // Create coordinate system / graph background
    this.webBackground = this.add.graphics()
    const W = this.scale.width
    const H = this.scale.height
    
    // Draw grid lines
    this.webBackground.lineStyle(1, 0x00e5ff, 0.08)
    
    // Vertical grid lines
    for (let x = 0; x <= W; x += 60) {
      this.webBackground.beginPath()
      this.webBackground.moveTo(x, 0)
      this.webBackground.lineTo(x, H)
      this.webBackground.strokePath()
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= H; y += 60) {
      this.webBackground.beginPath()
      this.webBackground.moveTo(0, y)
      this.webBackground.lineTo(W, y)
      this.webBackground.strokePath()
    }
    
    // Draw main axes (thicker)
    this.webBackground.lineStyle(2, 0x00e5ff, 0.3)
    
    // X-axis (horizontal center)
    this.webBackground.beginPath()
    this.webBackground.moveTo(0, H/2)
    this.webBackground.lineTo(W, H/2)
    this.webBackground.strokePath()
    
    // Y-axis (vertical, offset left to show more of the graph)
    const yAxisX = 80
    this.webBackground.beginPath()
    this.webBackground.moveTo(yAxisX, 0)
    this.webBackground.lineTo(yAxisX, H)
    this.webBackground.strokePath()
    
    // Add axis labels
    const labelStyle = { fontSize: '10px', color: '#00e5ff', alpha: 0.6 }
    
    // X-axis labels (every 120 pixels = ~2 units)
    for (let x = yAxisX; x <= W; x += 120) {
      const mathX = Math.round((x - yAxisX) / 60)
      if (mathX !== 0) {
        this.add.text(x, H/2 + 5, mathX.toString(), labelStyle).setOrigin(0.5, 0)
        // Tick mark
        this.webBackground.beginPath()
        this.webBackground.moveTo(x, H/2 - 5)
        this.webBackground.lineTo(x, H/2 + 5)
        this.webBackground.strokePath()
      }
    }
    
    // Y-axis labels (every 60 pixels = 1 unit)
    for (let y = 0; y <= H; y += 60) {
      const mathY = Math.round((H/2 - y) / 60)
      if (mathY !== 0 && y !== H/2) {
        this.add.text(yAxisX - 8, y, mathY.toString(), labelStyle).setOrigin(1, 0.5)
        // Tick mark
        this.webBackground.beginPath()
        this.webBackground.moveTo(yAxisX - 5, y)
        this.webBackground.lineTo(yAxisX + 5, y)
        this.webBackground.strokePath()
      }
    }
    
    // Origin label
    this.add.text(yAxisX - 8, H/2 + 15, '0', labelStyle).setOrigin(1, 0)
    
    // Axis titles
    this.add.text(W - 20, H/2 - 15, 'x', { fontSize: '14px', color: '#00e5ff', fontStyle: 'italic' })
    this.add.text(yAxisX + 15, 15, 'y', { fontSize: '14px', color: '#00e5ff', fontStyle: 'italic' })
    
    // Animate background stars/particles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, W)
      const y = Phaser.Math.Between(0, H)
      const star = this.add.circle(x, y, 1, 0x00e5ff, 0.3)
      this.backgroundStars.push(star)
      
      // Twinkling animation
      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.6),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }
  }

  private onFire = () => {
    const store = useGameStore.getState()
    const { line, answerCorrect, curveFunc, combo, pullsRemaining } = store
    
    if (pullsRemaining <= 0) {
      console.log('No pulls remaining!')
      return
    }
    
    const probs = buildProbabilities({
      anchors: this.anchors,
      answerCorrect: !!answerCorrect,
      line,
      f: curveFunc || undefined
    })
    this.drawBeams(probs)

    const idx = sampleCategorical(probs)
    const target = this.anchors[idx]
    
    this.grappleTo(target, () => {
      // Calculate score
      let score = 0
      
      // Base: +100 safe, -100 hazard
      score += target.hazard ? -100 : 100
      
      // Progress bonus based on forward distance
      const progressBonus = Math.ceil(80 * target.structuralScore)
      score += progressBonus
      
      // Correctness bonus
      if (answerCorrect) {
        score += 150
        store.incrementCombo()
        
        // Show combo celebration if reached 3+
        if (store.combo >= 3) {
          this.showComboEffect(store.combo)
        }
      } else {
        store.resetCombo()
      }
      
      // Confidence bonus (entropy-based)
      const confidenceBonus = calculateConfidenceBonus(probs)
      score += confidenceBonus
      
      // Apply combo multiplier
      const currentCombo = store.combo
      const multiplier = currentCombo >= 3 ? 1.5 : 1.0
      score = Math.floor(score * multiplier)
      
      store.addScore(score)
      store.decrementPulls()
      
      // Load next question
      store.setCurrentQuestion(null)
      
      // Check win condition
      if (store.pullsRemaining <= 0) {
        this.handleLevelComplete()
      } else {
        // Respawn anchors ahead
        this.respawnAnchors()
      }
    })
  }
  
  private showComboEffect(combo: number) {
    const W = this.scale.width
    const H = this.scale.height
    
    // Burst of particles from center
    const burstEmitter = this.add.particles(W/2, H/2, 'white', {
      speed: { min: 200, max: 400 },
      lifespan: 1000,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: [0xffd700, 0xff8c00, 0xffffff],
      quantity: 30 * combo,
      blendMode: 'ADD',
      emitting: false
    })
    burstEmitter.explode(30 * combo)
    
    // Create combo text
    const comboText = this.add.text(W/2, H/2, `${combo}x COMBO!`, {
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#ffd700',
      stroke: '#ff8c00',
      strokeThickness: 4
    }).setOrigin(0.5)
    
    // Animate combo text
    this.tweens.add({
      targets: comboText,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      y: H/2 - 100,
      duration: 1500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        comboText.destroy()
        burstEmitter.destroy()
      }
    })
    
    // Screen flash
    const flash = this.add.rectangle(0, 0, W, H, 0xffd700, 0.3)
    flash.setOrigin(0, 0)
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy()
    })
    
    // Camera pulse
    this.cameras.main.flash(400, 255, 215, 0, false, (cam: any, progress: number) => {
      if (progress === 1) {
        // Slight zoom out effect
        this.cameras.main.zoom = 1
      }
    })
  }

  private handleLevelComplete() {
    const store = useGameStore.getState()
    const level = getLevel(store.currentLevel)
    
    if (level) {
      console.log(`Level ${level.name} complete! Score: ${store.score}`)
      
      // Epic completion effect
      const W = this.scale.width
      const H = this.scale.height
      
      // Fireworks!
      for (let i = 0; i < 5; i++) {
        this.time.delayedCall(i * 400, () => {
          const x = Phaser.Math.Between(W * 0.2, W * 0.8)
          const y = Phaser.Math.Between(H * 0.2, H * 0.6)
          const firework = this.add.particles(x, y, 'white', {
            speed: { min: 100, max: 300 },
            lifespan: 1200,
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: [0x00e5ff, 0x7c4dff, 0xff4dff, 0xffd700],
            quantity: 40,
            blendMode: 'ADD',
            emitting: false
          })
          firework.explode(40)
          this.time.delayedCall(1500, () => firework.destroy())
        })
      }
      
      // Victory text
      const victoryText = this.add.text(W/2, H/2, '🎉 LEVEL COMPLETE! 🎉', {
        fontSize: '42px',
        fontStyle: 'bold',
        color: '#00e5ff',
        stroke: '#7c4dff',
        strokeThickness: 6
      }).setOrigin(0.5).setAlpha(0)
      
      this.tweens.add({
        targets: victoryText,
        alpha: 1,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 800,
        ease: 'Elastic.easeOut'
      })
    }
  }
  
  private respawnAnchors() {
    // Clear old anchor visuals with fade out
    this.anchorVisuals.forEach(visual => {
      this.tweens.add({
        targets: visual,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 200,
        onComplete: () => visual.destroy()
      })
    })
    
    // Generate new anchors
    this.anchors = this.generateAnchors()
    useGameStore.getState().setAnchors(this.anchors)
    
    // Draw new anchors with fade in
    this.time.delayedCall(250, () => {
      this.drawAnchors()
      this.anchorVisuals.forEach(visual => {
        visual.setAlpha(0)
        visual.setScale(0)
        this.tweens.add({
          targets: visual,
          alpha: 0.9,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Back.easeOut'
        })
      })
    })
  }

  private drawBeams(p: number[]) {
    this.beams.forEach(b => b.destroy())
    
    // Find highest probability anchor for targeting reticle
    const maxIdx = p.indexOf(Math.max(...p))
    
    this.beams = this.anchors.map((a, i) => {
      const g = this.add.graphics()
      const alpha = Phaser.Math.Clamp(p[i]*2, 0.05, 0.9)
      const thickness = 2 + p[i]*10
      
      // Draw beam
      g.lineStyle(thickness, a.hazard ? 0xff4d4d : 0x00e5ff, alpha)
      g.beginPath()
      g.moveTo(this.spider.x, this.spider.y)
      g.lineTo(a.x, a.y)
      g.strokePath()
      
      // Add glow for high probability beams
      if (p[i] > 0.15) {
        g.lineStyle(thickness + 4, a.hazard ? 0xff4d4d : 0x00e5ff, alpha * 0.3)
        g.beginPath()
        g.moveTo(this.spider.x, this.spider.y)
        g.lineTo(a.x, a.y)
        g.strokePath()
      }
      
      // Draw targeting reticle on most likely target
      if (i === maxIdx && p[i] > 0.2) {
        g.lineStyle(2, 0xffd700, 0.8)
        g.strokeCircle(a.x, a.y, 15)
        g.strokeCircle(a.x, a.y, 20)
        
        // Animated crosshair
        const crosshairSize = 25
        g.beginPath()
        g.moveTo(a.x - crosshairSize, a.y)
        g.lineTo(a.x - 10, a.y)
        g.moveTo(a.x + 10, a.y)
        g.lineTo(a.x + crosshairSize, a.y)
        g.moveTo(a.x, a.y - crosshairSize)
        g.lineTo(a.x, a.y - 10)
        g.moveTo(a.x, a.y + 10)
        g.lineTo(a.x, a.y + crosshairSize)
        g.strokePath()
      }
      
      return g
    })
  }

  private grappleTo(target: Anchor, onComplete: ()=>void) {
    // Calculate angle to target for spider rotation
    const angle = Phaser.Math.Angle.Between(this.spider.x, this.spider.y, target.x, target.y)
    
    // Rotate spider to face target
    this.tweens.add({
      targets: this.spider,
      rotation: angle,
      duration: 200,
      ease: 'Quad.easeOut'
    })
    
    // Flash effect on target
    const targetVisual = this.anchorVisuals[this.anchors.indexOf(target)]
    if (targetVisual) {
      this.tweens.add({
        targets: targetVisual,
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 1,
        duration: 200,
        yoyo: true
      })
    }
    
    // Create web strand particles
    const webStrand = this.add.particles(this.spider.x, this.spider.y, 'white', {
      speed: { min: 100, max: 200 },
      lifespan: 400,
      alpha: { start: 0.6, end: 0 },
      scale: { start: 0.3, end: 0 },
      tint: 0x00e5ff,
      frequency: 20,
      emitting: false
    })
    webStrand.explode(15, this.spider.x, this.spider.y)
    
    // Main grapple animation
    this.tweens.add({
      targets: this.spider,
      x: target.x, 
      y: target.y,
      duration: 600,
      ease: 'Sine.easeInOut',
      onStart: () => {
        // Play "shooting" sound effect (visual feedback)
        const muzzleFlash = this.add.circle(this.spider.x, this.spider.y, 12, 0x00e5ff, 0.8)
        this.tweens.add({
          targets: muzzleFlash,
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          duration: 200,
          onComplete: () => muzzleFlash.destroy()
        })
      },
      onUpdate: () => {
        // Draw rope with glow effect
        this.rope.clear()
          .lineStyle(4, 0xffffff, 0.9)
          .beginPath()
          .moveTo(this.spider.x, this.spider.y)
          .lineTo(target.x, target.y)
          .strokePath()
        
        // Add outer glow
        this.rope.lineStyle(8, 0x00e5ff, 0.3)
          .beginPath()
          .moveTo(this.spider.x, this.spider.y)
          .lineTo(target.x, target.y)
          .strokePath()
        
        // Inner bright line
        this.rope.lineStyle(2, 0x00e5ff, 0.7)
          .beginPath()
          .moveTo(this.spider.x, this.spider.y)
          .lineTo(target.x, target.y)
          .strokePath()
      },
      onComplete: () => {
        this.rope.clear()
        webStrand.destroy()
        
        // Update coordinate display
        this.updateCoordinateDisplay()
        
        // Enhanced impact effect with multiple rings
        for (let i = 0; i < 3; i++) {
          const impact = this.add.circle(target.x, target.y, 10 + i * 5, 
            target.hazard ? 0xff4d4d : 0x00e5ff, 0.6 - i * 0.2)
          this.tweens.add({
            targets: impact,
            scaleX: 2.5 + i * 0.5,
            scaleY: 2.5 + i * 0.5,
            alpha: 0,
            duration: 400 + i * 100,
            delay: i * 50,
            onComplete: () => impact.destroy()
          })
        }
        
        // Landing particles
        const landingParticles = this.add.particles(target.x, target.y, 'white', {
          speed: { min: 50, max: 150 },
          lifespan: 500,
          alpha: { start: 0.8, end: 0 },
          scale: { start: 0.4, end: 0 },
          tint: target.hazard ? 0xff4d4d : 0x00e5ff,
          quantity: 20,
          emitting: false
        })
        landingParticles.explode(20)
        this.time.delayedCall(600, () => landingParticles.destroy())
        
        // Screen shake on landing
        this.cameras.main.shake(150, target.hazard ? 0.008 : 0.003)
        
        onComplete()
      }
    })
  }

  private updateCoordinateDisplay() {
    const yAxisX = 80
    const mathX = ((this.spider.x - yAxisX) / 60).toFixed(1)
    const mathY = ((this.scale.height/2 - this.spider.y) / 60).toFixed(1)
    this.coordinateDisplay.setText(`(${mathX}, ${mathY})`)
    this.coordinateDisplay.setPosition(this.spider.x, this.spider.y - 25)
  }

  private updateLinePreview = () => {
    const { line, curveFunc } = useGameStore.getState()
    this.linePreview.clear()
    
    const W = this.scale.width
    const H = this.scale.height
    const yAxisX = 80  // Match the Y-axis position
    
    this.linePreview.lineStyle(3, 0xff8c00, 0.6)  // Orange for visibility
    this.linePreview.beginPath()
    
    if (curveFunc) {
      // Draw curve with proper coordinate mapping
      let firstPoint = true
      for (let px = yAxisX; px <= W; px += 2) {
        const mathX = (px - yAxisX) / 60  // Convert screen X to math X
        const mathY = curveFunc(mathX)
        const py = H/2 - mathY * 60  // Convert math Y to screen Y
        
        if (py >= 0 && py <= H) {
          if (firstPoint) {
            this.linePreview.moveTo(px, py)
            firstPoint = false
          } else {
            this.linePreview.lineTo(px, py)
          }
        }
      }
    } else {
      // Draw line: y = mx + b with proper coordinate mapping
      // Draw from left to right of visible area
      const x1 = 0
      const x2 = (W - yAxisX) / 60  // Math coordinates
      
      const y1 = line.m * x1 + line.b
      const y2 = line.m * x2 + line.b
      
      // Convert to screen coordinates
      const px1 = yAxisX + x1 * 60
      const px2 = yAxisX + x2 * 60
      const py1 = H/2 - y1 * 60
      const py2 = H/2 - y2 * 60
      
      this.linePreview.moveTo(px1, py1)
      this.linePreview.lineTo(px2, py2)
    }
    
    this.linePreview.strokePath()
  }

  private generateAnchors(): Anchor[] {
    const arr: Anchor[] = []
    const W = this.scale.width, H = this.scale.height
    for (let i=0;i<18;i++){
      const x = Phaser.Math.Between((W*0.35)|0, (W*0.95)|0)
      const y = Phaser.Math.Between((H*0.15)|0, (H*0.85)|0)
      arr.push({
        id: i, x, y,
        hazard: Math.random() < 0.2,
        structuralScore: (x / W)
      })
    }
    return arr
  }
}
