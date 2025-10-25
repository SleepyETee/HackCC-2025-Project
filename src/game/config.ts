
import Phaser from 'phaser'
import MainScene from './MainScene'

export default function makeConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent,
    backgroundColor: '#0b0b14',
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
    scene: [MainScene],
  }
}
