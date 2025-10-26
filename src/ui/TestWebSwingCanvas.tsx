import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import TestWebSwingScene from '../game/TestWebSwingScene'

export function TestWebSwingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    
    console.log('🚀 Initializing test web swing game...')
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#2a3f54',
      scene: [TestWebSwingScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 600 },
          debug: false
        }
      }
    }
    
    try {
      gameRef.current = new Phaser.Game(config)
      console.log('✅ Test game created successfully')
    } catch (error) {
      console.error('❌ Error creating test game:', error)
    }
    
    return () => {
      if (gameRef.current) {
        console.log('🗑️ Destroying test game')
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      style={{
        width: '800px',
        height: '600px',
        margin: '20px auto',
        border: '2px solid #8b5cf6',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  )
}

