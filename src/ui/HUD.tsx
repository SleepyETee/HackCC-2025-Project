
import { useGameStore } from '../state/store'

export function HUD(){
  const score = useGameStore(s=>s.score)
  const combo = useGameStore(s=>s.combo)
  const pullsRemaining = useGameStore(s=>s.pullsRemaining)
  const fire = () => window.dispatchEvent(new CustomEvent('spidercalc-fire'))
  
  return (
    <div className="hud" style={{ pointerEvents:'auto' }}>
      <div className="score">Score: {score}</div>
      {combo >= 3 && (
        <div className="combo" style={{ 
          background: '#ffd700', 
          color: '#000', 
          padding: '4px 8px', 
          borderRadius: 6,
          fontWeight: 700,
          fontSize: 12
        }}>
          COMBO ×{combo}!
        </div>
      )}
      <div style={{ color: '#cdd3ff' }}>Pulls: {pullsRemaining}</div>
      <button onClick={fire} style={{ fontWeight: 700, fontSize: 16, padding: '10px 20px' }}>
        🎯 Fire
      </button>
    </div>
  )
}
