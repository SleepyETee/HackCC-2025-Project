import { useGameStore } from '../state/store'
import { LEVELS, getLevel } from '../game/questions'

export function LevelSelector() {
  const currentLevel = useGameStore(s => s.currentLevel)
  const setLevel = useGameStore(s => s.setLevel)
  const resetPulls = useGameStore(s => s.resetPulls)
  const resetUsedQuestions = useGameStore(s => s.resetUsedQuestions)
  const setCurrentQuestion = useGameStore(s => s.setCurrentQuestion)
  const setCurveMode = useGameStore(s => s.setCurveMode)
  const addScore = useGameStore(s => s.addScore)
  const score = useGameStore(s => s.score)
  
  const handleLevelSelect = (levelId: number) => {
    const level = getLevel(levelId)
    if (!level) return
    
    // Reset game state for new level
    setLevel(levelId)
    resetPulls(level.targetPulls)
    resetUsedQuestions()
    setCurrentQuestion(null)
    setCurveMode(level.requiredCurveMode)
    
    // Reset score at level start
    addScore(-score)
  }
  
  const currentLevelData = getLevel(currentLevel)
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ 
        textAlign: 'center',
        marginBottom: 10,
        color: '#ff6b35',
        fontWeight: 700,
        fontSize: 18
      }}>
        🎯 Select Your Round
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 10, 
        marginBottom: 12
      }}>
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => handleLevelSelect(level.id)}
            style={{
              background: currentLevel === level.id 
                ? 'linear-gradient(135deg, #8b5cf6, #7c4dff)' 
                : 'linear-gradient(135deg, #22263b, #15182b)',
              color: '#fff',
              border: currentLevel === level.id 
                ? '3px solid #ffd700' 
                : '2px solid #323855',
              padding: '12px 16px',
              borderRadius: 10,
              fontWeight: currentLevel === level.id ? 700 : 500,
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: currentLevel === level.id 
                ? '0 0 20px rgba(139, 92, 246, 0.6)' 
                : 'none',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentLevel !== level.id) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2d3a4a, #1a2535)'
                e.currentTarget.style.borderColor = '#5a8cff'
              }
            }}
            onMouseLeave={(e) => {
              if (currentLevel !== level.id) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22263b, #15182b)'
                e.currentTarget.style.borderColor = '#323855'
              }
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              {level.name}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>
              🎯 {level.targetPulls} pulls
            </div>
          </button>
        ))}
      </div>
      
      {currentLevelData && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
          padding: 14,
          borderRadius: 10,
          textAlign: 'center',
          border: '2px solid #8b5cf6',
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            📚 {currentLevelData.name}
          </div>
          <div style={{ color: '#e0e7ff', fontSize: 13, marginTop: 6 }}>
            {currentLevelData.description}
          </div>
          <div style={{ 
            color: '#8b5cf6', 
            fontSize: 12, 
            marginTop: 8,
            padding: 6,
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: 6,
            display: 'inline-block'
          }}>
            🎯 Target: <strong>{currentLevelData.targetPulls} pulls</strong> • 
            📊 Mode: <strong>{currentLevelData.requiredCurveMode}</strong>
          </div>
        </div>
      )}
    </div>
  )
}

