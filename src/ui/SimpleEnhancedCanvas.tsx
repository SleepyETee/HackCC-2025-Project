import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import SimpleEnhancedScene from '../game/SimpleEnhancedScene'

export function SimpleEnhancedCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'simple-enhanced-canvas',
      backgroundColor: '#87CEEB',
      physics: {
        default: 'matter',
        matter: {
          gravity: { x: 0, y: 0.8 },
          debug: false
        }
      },
      scene: [SimpleEnhancedScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])

  return (
    <div 
      id="simple-enhanced-canvas" 
      style={{ 
        width: '100%', 
        height: '600px',
        background: 'linear-gradient(135deg, #87CEEB, #4682B4)',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  )
}
