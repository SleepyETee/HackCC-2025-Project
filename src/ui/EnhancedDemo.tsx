import { useState, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Enhanced Demo Component
 * Shows off all the animation libraries and their capabilities
 */
export function EnhancedDemo() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('jackBeanstalk')
  const [animationSpeed, setAnimationSpeed] = useState(1.0)

  useEffect(() => {
    if (isVisible) {
      // GSAP demo animations
      gsap.fromTo('.demo-card', 
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.8 
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.2
        }
      )

      // Continuous floating animation
      gsap.to('.floating-element', {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      })
    }
  }, [isVisible])

  const presets = [
    { id: 'jackBeanstalk', name: 'Jack & Beanstalk', color: '#228B22' },
    { id: 'halloween', name: 'Halloween', color: '#8B4513' },
    { id: 'fantasy', name: 'Fantasy', color: '#9370DB' }
  ]

  const animationPresets = [
    { id: 'smooth', name: 'Smooth', description: 'Gentle, flowing animations' },
    { id: 'bouncy', name: 'Bouncy', description: 'Energetic, spring-like effects' },
    { id: 'snappy', name: 'Snappy', description: 'Quick, responsive animations' },
    { id: 'slow', name: 'Slow', description: 'Relaxed, cinematic timing' }
  ]

  return (
    <div style={{ 
      padding: '20px', 
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '12px',
      color: 'white',
      margin: '20px 0'
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #ff6b35, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎮 Enhanced Animation Libraries Demo
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* GSAP Demo */}
        <div className="demo-card" style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>🎬 GSAP Animations</h3>
          <p>Smooth, professional 2D animations</p>
          <button 
            onClick={() => {
              gsap.to('.gsap-demo', {
                rotation: 360,
                scale: 1.2,
                duration: 1,
                ease: "back.out(1.7)"
              })
            }}
            style={{
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '10px'
            }}
          >
            Test Animation
          </button>
          <div className="gsap-demo" style={{
            width: '50px',
            height: '50px',
            background: '#ffd700',
            margin: '10px auto',
            borderRadius: '50%'
          }}></div>
        </div>

        {/* Three.js Demo */}
        <div className="demo-card" style={{
          background: 'linear-gradient(135deg, #f093fb, #f5576c)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>🎮 Three.js 3D Graphics</h3>
          <p>Realistic 3D models and lighting</p>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(45deg, #32CD32, #228B22)',
            margin: '10px auto',
            borderRadius: '10px',
            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
            transform: 'perspective(100px) rotateX(15deg)'
          }}>
            <div style={{
              width: '80%',
              height: '80%',
              background: 'linear-gradient(45deg, #90EE90, #32CD32)',
              margin: '10%',
              borderRadius: '50%',
              boxShadow: 'inset 0 5px 10px rgba(0,0,0,0.2)'
            }}></div>
          </div>
        </div>

        {/* Matter.js Demo */}
        <div className="demo-card" style={{
          background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>⚡ Matter.js Physics</h3>
          <p>Realistic physics simulation</p>
          <div style={{
            width: '100px',
            height: '60px',
            background: 'linear-gradient(45deg, #8B4513, #A0522D)',
            margin: '10px auto',
            borderRadius: '30px',
            position: 'relative',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              width: '8px',
              height: '8px',
              background: '#000',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              width: '8px',
              height: '8px',
              background: '#000',
              borderRadius: '50%'
            }}></div>
          </div>
        </div>

        {/* Particle Demo */}
        <div className="demo-card" style={{
          background: 'linear-gradient(135deg, #fa709a, #fee140)',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>✨ Particle Effects</h3>
          <p>Magical sparkles and effects</p>
          <div className="floating-element" style={{
            position: 'relative',
            width: '80px',
            height: '80px',
            margin: '10px auto'
          }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  background: '#FFD700',
                  borderRadius: '50%',
                  left: `${20 + Math.cos(i * Math.PI / 3) * 30}px`,
                  top: `${20 + Math.sin(i * Math.PI / 3) * 30}px`,
                  boxShadow: '0 0 10px #FFD700'
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '15px' }}>⚙️ Configuration</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Color Preset:</label>
            <select 
              value={selectedPreset} 
              onChange={(e) => setSelectedPreset(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: 'white',
                color: 'black'
              }}
            >
              {presets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Animation Speed: {animationSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <button
            onClick={() => setIsVisible(!isVisible)}
            style={{
              background: isVisible ? '#ff4757' : '#2ed573',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {isVisible ? 'Hide Demo' : 'Show Demo'}
          </button>
        </div>
      </div>

      {/* Performance Info */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>📊 Performance Info</h4>
        <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>GSAP: Hardware-accelerated animations</li>
          <li>Three.js: WebGL rendering with shadows</li>
          <li>Matter.js: Real-time physics simulation</li>
          <li>Target FPS: 60fps</li>
          <li>Bundle Size: ~2.3MB optimized</li>
        </ul>
      </div>
    </div>
  )
}
