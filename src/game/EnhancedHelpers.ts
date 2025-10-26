/**
 * Enhanced Animation Helpers
 * Utility functions to make working with all animation libraries easier
 */

import { gsap } from 'gsap'
import * as THREE from 'three'
import Matter from 'matter-js'

// GSAP Helper Functions
export class GSAPHelper {
  /**
   * Create a smooth jump animation
   */
  static createJumpAnimation(target: any, toX: number, toY: number, duration: number = 1) {
    const tl = gsap.timeline()
    
    // Prepare for jump
    tl.to(target, {
      scaleY: 0.8,
      scaleX: 1.2,
      duration: 0.2,
      ease: "power2.out"
    })
    
    // Jump arc
    tl.to(target, {
      x: toX,
      y: toY,
      scaleY: 1,
      scaleX: 1,
      duration: duration,
      ease: "power2.out"
    })
    
    return tl
  }

  /**
   * Create a floating animation
   */
  static createFloatAnimation(target: any, options: {
    yOffset?: number
    xOffset?: number
    duration?: number
    ease?: string
  } = {}) {
    const { yOffset = 10, xOffset = 5, duration = 3, ease = "sine.inOut" } = options
    
    return gsap.to(target, {
      y: target.y + yOffset,
      x: target.x + xOffset,
      duration: duration,
      ease: ease,
      yoyo: true,
      repeat: -1
    })
  }

  /**
   * Create a pulsing animation
   */
  static createPulseAnimation(target: any, options: {
    scale?: number
    duration?: number
    ease?: string
  } = {}) {
    const { scale = 1.1, duration = 2, ease = "sine.inOut" } = options
    
    return gsap.to(target, {
      scale: scale,
      duration: duration,
      ease: ease,
      yoyo: true,
      repeat: -1
    })
  }

  /**
   * Create a screen shake effect
   */
  static createScreenShake(camera: any, options: {
    intensity?: number
    duration?: number
  } = {}) {
    const { intensity = 0.01, duration = 0.5 } = options
    
    return gsap.to(camera, {
      shake: { intensity, duration },
      duration: duration
    })
  }
}

// Three.js Helper Functions
export class ThreeJSHelper {
  /**
   * Create a 3D beanstalk
   */
  static createBeanstalk(options: {
    radiusTop?: number
    radiusBottom?: number
    height?: number
    segments?: number
    color?: number
  } = {}) {
    const {
      radiusTop = 0.5,
      radiusBottom = 1.0,
      height = 50,
      segments = 8,
      color = 0x228B22
    } = options

    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments)
    const material = new THREE.MeshLambertMaterial({ 
      color,
      transparent: true,
      opacity: 0.9
    })
    
    const beanstalk = new THREE.Mesh(geometry, material)
    beanstalk.castShadow = true
    beanstalk.receiveShadow = true
    
    return beanstalk
  }

  /**
   * Create a 3D leaf
   */
  static createLeaf(options: {
    radius?: number
    segments?: number
    color?: number
    opacity?: number
  } = {}) {
    const {
      radius = 0.3,
      segments = 8,
      color = 0x228B22,
      opacity = 0.8
    } = options

    const geometry = new THREE.SphereGeometry(radius, segments, 6)
    const material = new THREE.MeshLambertMaterial({ 
      color,
      transparent: true,
      opacity
    })
    
    const leaf = new THREE.Mesh(geometry, material)
    leaf.castShadow = true
    leaf.receiveShadow = true
    
    return leaf
  }

  /**
   * Create a 3D spider
   */
  static createSpider(options: {
    radius?: number
    segments?: number
    color?: number
  } = {}) {
    const {
      radius = 0.2,
      segments = 8,
      color = 0x8B4513
    } = options

    const geometry = new THREE.SphereGeometry(radius, segments, 6)
    const material = new THREE.MeshLambertMaterial({ color })
    
    const spider = new THREE.Mesh(geometry, material)
    spider.castShadow = true
    spider.receiveShadow = true
    
    return spider
  }

  /**
   * Create lighting setup
   */
  static createLighting(scene: THREE.Scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)
    
    return { ambientLight, directionalLight }
  }

  /**
   * Create particle system
   */
  static createParticleSystem(count: number = 30, options: {
    color?: number
    size?: number
    opacity?: number
  } = {}) {
    const { color = 0xFFD700, size = 0.1, opacity = 0.8 } = options
    
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      
      colors[i * 3] = 1.0
      colors[i * 3 + 1] = 0.84
      colors[i * 3 + 2] = 0.0
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const material = new THREE.PointsMaterial({
      size: size,
      vertexColors: true,
      transparent: true,
      opacity: opacity
    })
    
    return new THREE.Points(geometry, material)
  }
}

// Matter.js Helper Functions
export class PhysicsHelper {
  /**
   * Create a physics world
   */
  static createWorld(options: {
    gravityX?: number
    gravityY?: number
  } = {}) {
    const { gravityX = 0, gravityY = 0.8 } = options
    
    const engine = Matter.Engine.create()
    engine.world.gravity.x = gravityX
    engine.world.gravity.y = gravityY
    
    return engine
  }

  /**
   * Create a physics body for spider
   */
  static createSpiderBody(x: number, y: number, options: {
    radius?: number
    friction?: number
    restitution?: number
  } = {}) {
    const { radius = 15, friction = 0.8, restitution = 0.3 } = options
    
    return Matter.Bodies.circle(x, y, radius, {
      friction,
      restitution
    })
  }

  /**
   * Create a physics body for leaf platform
   */
  static createLeafBody(x: number, y: number, options: {
    radius?: number
    friction?: number
    restitution?: number
  } = {}) {
    const { radius = 30, friction = 0.8, restitution = 0.3 } = options
    
    return Matter.Bodies.circle(x, y, radius, {
      friction,
      restitution,
      isStatic: true
    })
  }

  /**
   * Create a constraint (web line)
   */
  static createWebConstraint(bodyA: Matter.Body, bodyB: Matter.Body, options: {
    length?: number
    stiffness?: number
  } = {}) {
    const { length = 200, stiffness = 0.1 } = options
    
    return Matter.Constraint.create({
      bodyA,
      bodyB,
      length,
      stiffness
    })
  }
}

// Combined Animation Helper
export class AnimationHelper {
  /**
   * Create a complete jump sequence with all libraries
   */
  static createCompleteJump(
    spider: any,
    targetLeaf: any,
    threeSpider: THREE.Mesh,
    threeLeaf: THREE.Mesh,
    options: {
      duration?: number
      height?: number
    } = {}
  ) {
    const { duration = 1, height = 50 } = options
    
    // GSAP animation for 2D sprite
    const gsapTl = GSAPHelper.createJumpAnimation(
      spider,
      targetLeaf.x,
      targetLeaf.y - 50,
      duration
    )
    
    // Three.js animation for 3D model
    const threeTl = gsap.timeline()
    threeTl.to(threeSpider.position, {
      x: threeLeaf.position.x,
      y: threeLeaf.position.y,
      z: threeLeaf.position.z + height,
      duration: duration,
      ease: "power2.out"
    })
    
    // Combine timelines
    return gsap.timeline()
      .add(gsapTl, 0)
      .add(threeTl, 0)
  }

  /**
   * Create a complete particle effect
   */
  static createParticleExplosion(
    x: number,
    y: number,
    particleSystem: THREE.Points,
    options: {
      count?: number
      speed?: number
      duration?: number
    } = {}
  ) {
    const { count = 15, speed = 50, duration = 1 } = options
    
    // Animate particles outward
    const positions = particleSystem.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      const index = i * 3
      const angle = (i / count) * Math.PI * 2
      const distance = speed * duration
      
      positions[index] = x + Math.cos(angle) * distance
      positions[index + 1] = y + Math.sin(angle) * distance
      positions[index + 2] = 0
    }
    
    particleSystem.geometry.attributes.position.needsUpdate = true
    
    // Fade out
    gsap.to(particleSystem.material, {
      opacity: 0,
      duration: duration,
      ease: "power2.out"
    })
  }
}

// All helpers are already exported above
