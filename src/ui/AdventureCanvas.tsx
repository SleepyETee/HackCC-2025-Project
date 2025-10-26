import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import MainMenuScene from '../game/MainMenuScene'
import HalloweenClimbScene from '../game/HalloweenClimbScene'

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
      backgroundColor: '#2a3f54',
      scene: [MainMenuScene, HalloweenClimbScene], // Menu first, then game
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      dom: { createContainer: true }
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
      className="adventure-canvas-container"
    />
  )
}

