
import { useGameStore } from '../state/store'

export function HUD(){
  const score = useGameStore(s=>s.score)
  const combo = useGameStore(s=>s.combo)
  const pullsRemaining = useGameStore(s=>s.pullsRemaining)
  const selectedAnswer = useGameStore(s=>s.selectedAnswer)
  const fire = () => window.dispatchEvent(new CustomEvent('spidercalc-fire'))
  
  // Determine button state
  const canFire = selectedAnswer !== null
  
  return (
    <div style={{ 
      position: 'absolute',
      left: 11,
      bottom: 10,
      pointerEvents: 'auto',
      zIndex: 100
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.95))',
        padding: '10px 12px',
        borderRadius: 10,
        border: '2px solid #8b5cf6',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Score and Pulls Row */}
        <div style={{ 
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          marginBottom: 10
        }}>
          <div style={{ fontSize: 15, color: '#e0e7ff', fontWeight: 600 }}>
            🏆 <span style={{ color: '#ffd700' }}>{score}</span>
          </div>
          
          {combo >= 3 && (
            <div style={{ 
              background: 'linear-gradient(135deg, #ffd700, #ffaa00)', 
              color: '#000', 
              padding: '4px 10px', 
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.6)'
            }}>
              🔥 ×{combo}
            </div>
          )}
          
          <div style={{ 
            color: pullsRemaining <= 2 ? '#ff6b35' : '#10b981',
            fontWeight: 600,
            fontSize: 15
          }}>
            🎯 <strong>{pullsRemaining}</strong>
          </div>
        </div>
        
        {/* Fire Button */}
        <button 
          onClick={fire} 
          disabled={!canFire}
          style={{ 
            fontWeight: 700, 
            fontSize: 16, 
            padding: '10px 20px',
            width: '100%',
            background: canFire 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : 'linear-gradient(135deg, #4a4a5a, #2a2a3a)',
            color: canFire ? '#fff' : '#888',
            border: canFire ? '2px solid #10b981' : '2px solid #444',
            borderRadius: 8,
            cursor: canFire ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            boxShadow: canFire ? '0 0 15px rgba(16, 185, 129, 0.5)' : 'none',
            opacity: canFire ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (canFire) {
              e.currentTarget.style.transform = 'scale(1.03)'
              e.currentTarget.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.8)'
            }
          }}
          onMouseLeave={(e) => {
            if (canFire) {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)'
            }
          }}
        >
          {canFire ? '🚀 FIRE!' : '⏳ Answer...'}
        </button>
      </div>
    </div>
  )
}
