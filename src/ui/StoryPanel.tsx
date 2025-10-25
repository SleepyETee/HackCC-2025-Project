import { useGameStore } from '../state/store'

export function StoryPanel() {
  const score = useGameStore(s => s.score)
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #2d1b4e, #1a0f2e)', 
      border: '3px solid #ffd700',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative corner */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: 'radial-gradient(circle at top right, rgba(255, 215, 0, 0.2), transparent)',
        pointerEvents: 'none'
      }} />
      
      {/* Title */}
      <h2 style={{ 
        margin: '0 0 12px 0',
        fontSize: 28,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #88ccff, #4466aa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(136, 204, 255, 0.3)'
      }}>
        🌱 Jack & the Beanstalk
      </h2>
      
      {/* Narration */}
      <p style={{ 
        color: '#e0e7ff',
        fontSize: 15,
        lineHeight: 1.6,
        margin: 0,
        fontStyle: 'italic',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        You are a mathematical spider climbing the <strong>Magical Beanstalk</strong>. 
        The legendary <strong>Golden Goose</strong> awaits at the top, 3000 meters in the sky! 
        Jump from leaf to leaf, climbing higher and higher! Answer calculus questions 
        correctly to leap between leaves. Wrong answers make you fall down the beanstalk. 
        Can you reach the clouds and find the golden treasure?
      </p>
      
      {/* Mission box */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(0, 255, 0, 0.1)',
        border: '2px solid #00ff00',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <span style={{ fontSize: 24 }}>🦆</span>
        <div>
          <div style={{ fontSize: 12, color: '#00ff00', fontWeight: 600 }}>
            MISSION
          </div>
          <div style={{ fontSize: 13, color: '#b3ffb3' }}>
            Climb 3000m up the beanstalk to reach the golden goose!
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div style={{
        marginTop: 12,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8
      }}>
        <div style={{
          padding: 8,
          background: 'rgba(255, 107, 53, 0.2)',
          borderRadius: 6,
          border: '1px solid rgba(255, 107, 53, 0.5)'
        }}>
          <div style={{ fontSize: 10, color: '#ff6b35', fontWeight: 600 }}>
            SCORE
          </div>
          <div style={{ fontSize: 18, color: '#ffd700', fontWeight: 700 }}>
            {score}
          </div>
        </div>
        <div style={{
          padding: 8,
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: 6,
          border: '1px solid rgba(139, 92, 246, 0.5)'
        }}>
          <div style={{ fontSize: 10, color: '#8b5cf6', fontWeight: 600 }}>
            MECHANICS
          </div>
          <div style={{ fontSize: 11, color: '#c4b5fd' }}>
            Leaf Jump Physics
          </div>
        </div>
      </div>
    </div>
  )
}

