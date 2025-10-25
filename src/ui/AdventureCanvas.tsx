import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import AdventureScene from '../game/AdventureScene'

export function AdventureCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  
  useEffect(() => {
    if (!containerRef.current || gameRef.current) return
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#0a0a0f',
      scene: [AdventureScene],
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
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
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden'
      }}
    />
  )
}

