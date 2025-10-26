/**
 * Enhanced Animation Configuration
 * Easy customization options for all animation libraries
 */

export const ENHANCED_CONFIG = {
  // GSAP Animation Settings
  gsap: {
    // Spider jump animation
    spiderJump: {
      duration: 1.0,
      ease: "power2.out",
      scaleY: 0.8,
      scaleX: 1.2
    },
    
    // Leaf swaying animation
    leafSway: {
      rotation: 0.1,
      duration: 3,
      ease: "sine.inOut"
    },
    
    // Cloud floating animation
    cloudFloat: {
      yOffset: 15,
      xOffset: 20,
      duration: 6000,
      ease: "sine.inOut"
    },
    
    // Sun pulsing animation
    sunPulse: {
      scale: 1.1,
      duration: 4,
      ease: "sine.inOut"
    },
    
    // Magical particles
    particles: {
      alpha: 0.3,
      scale: 1.5,
      duration: 2000,
      ease: "sine.inOut"
    }
  },

  // Three.js 3D Settings
  threejs: {
    // Camera settings
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
      position: { x: 0, y: 0, z: 5 }
    },
    
    // Lighting settings
    lighting: {
      ambient: {
        color: 0x404040,
        intensity: 0.6
      },
      directional: {
        color: 0xffffff,
        intensity: 0.8,
        position: { x: 10, y: 10, z: 5 }
      }
    },
    
    // Beanstalk settings
    beanstalk: {
      radiusTop: 0.5,
      radiusBottom: 1.0,
      height: 50,
      segments: 8,
      color: 0x228B22
    },
    
    // Leaf settings
    leaf: {
      radius: 0.3,
      segments: 8,
      color: 0x228B22,
      opacity: 0.8
    },
    
    // Spider settings
    spider: {
      radius: 0.2,
      segments: 8,
      color: 0x8B4513
    }
  },

  // Matter.js Physics Settings
  physics: {
    // World gravity
    gravity: {
      x: 0,
      y: 0.8
    },
    
    // Spider physics
    spider: {
      radius: 15,
      friction: 0.8,
      restitution: 0.3
    },
    
    // Leaf physics
    leaf: {
      radius: 30,
      friction: 0.8,
      restitution: 0.3,
      isStatic: true
    }
  },

  // Visual Effects Settings
  effects: {
    // Particle count
    particles: {
      magical: 30,
      dust: 15
    },
    
    // Shadow settings
    shadows: {
      enabled: true,
      type: "PCFSoftShadowMap",
      mapSize: 2048
    },
    
    // Screen effects
    screen: {
      shakeIntensity: 0.003,
      shakeDuration: 150
    }
  },

  // Performance Settings
  performance: {
    // Render settings
    render: {
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    },
    
    // Animation settings
    animation: {
      targetFPS: 60,
      maxDeltaTime: 16.67
    },
    
    // Memory management
    memory: {
      autoCleanup: true,
      cleanupInterval: 5000
    }
  }
}

// Helper functions for easy customization
export const createGSAPConfig = (overrides: Partial<typeof ENHANCED_CONFIG.gsap> = {}) => ({
  ...ENHANCED_CONFIG.gsap,
  ...overrides
})

export const createThreeJSConfig = (overrides: Partial<typeof ENHANCED_CONFIG.threejs> = {}) => ({
  ...ENHANCED_CONFIG.threejs,
  ...overrides
})

export const createPhysicsConfig = (overrides: Partial<typeof ENHANCED_CONFIG.physics> = {}) => ({
  ...ENHANCED_CONFIG.physics,
  ...overrides
})

// Color presets for easy theming
export const COLOR_PRESETS = {
  jackBeanstalk: {
    beanstalk: 0x228B22,
    leaf: 0x32CD32,
    spider: 0x8B4513,
    sky: 0x87CEEB,
    sun: 0xFFD700
  },
  
  halloween: {
    beanstalk: 0x8B4513,
    leaf: 0xFF6347,
    spider: 0x2F4F4F,
    sky: 0x2F4F4F,
    sun: 0xFFD700
  },
  
  fantasy: {
    beanstalk: 0x9370DB,
    leaf: 0x98FB98,
    spider: 0x4B0082,
    sky: 0x87CEEB,
    sun: 0xFF69B4
  }
}

// Animation presets for different moods
export const ANIMATION_PRESETS = {
  smooth: {
    ease: "sine.inOut",
    duration: 1.0
  },
  
  bouncy: {
    ease: "back.out(1.7)",
    duration: 0.8
  },
  
  snappy: {
    ease: "power2.out",
    duration: 0.5
  },
  
  slow: {
    ease: "sine.inOut",
    duration: 2.0
  }
}
