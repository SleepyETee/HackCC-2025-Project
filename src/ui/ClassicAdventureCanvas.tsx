import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import MainMenuScene from '../game/MainMenuScene'
import HalloweenClimbScene from '../game/HalloweenClimbScene'

export function ClassicAdventureCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  
  useEffect(() => {
    console.log('🔄 ClassicAdventureCanvas useEffect triggered')
    if (!containerRef.current || gameRef.current) {
      console.log('⚠️ Skipping game creation - container or game already exists')
      return
    }
    
    console.log('🎮 ClassicAdventureCanvas: Creating Phaser game...')
    
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#2a3f54',
      scene: [MainMenuScene, HalloweenClimbScene], // Classic pumpkin climbing
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      dom: { createContainer: true }
    }
    
    gameRef.current = new Phaser.Game(config)
    console.log('✅ ClassicAdventureCanvas: Phaser game created successfully')
    
    return () => {
      console.log('🧹 ClassicAdventureCanvas cleanup triggered')
      if (gameRef.current) {
        console.log('🧹 ClassicAdventureCanvas: Destroying Phaser game...')
        gameRef.current.destroy(true)
        gameRef.current = null
      }
    }
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className="classic-adventure-canvas-container"
      style={{
        width: '800px',
        height: '600px',
        borderRadius: '8px',
        backgroundColor: '#2a3f54',
        position: 'relative'
      }}
    />
  )
}
