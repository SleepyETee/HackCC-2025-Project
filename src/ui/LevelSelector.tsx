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
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {LEVELS.map(level => (
          <button
            key={level.id}
            onClick={() => handleLevelSelect(level.id)}
            style={{
              background: currentLevel === level.id ? 'linear-gradient(135deg, #00e5ff, #7c4dff)' : '#22263b',
              color: currentLevel === level.id ? '#000' : '#fff',
              border: currentLevel === level.id ? 'none' : '1px solid #323855',
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: currentLevel === level.id ? 700 : 400,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {level.name}
          </button>
        ))}
      </div>
      
      {currentLevelData && (
        <div style={{
          background: '#15151f',
          padding: 12,
          borderRadius: 8,
          marginTop: 8,
          textAlign: 'center',
          border: '1px solid #323855'
        }}>
          <div style={{ color: '#00e5ff', fontWeight: 600, fontSize: 14 }}>
            {currentLevelData.name}
          </div>
          <div style={{ color: '#cdd3ff', fontSize: 12, marginTop: 4 }}>
            {currentLevelData.description}
          </div>
          <div style={{ color: '#8892b0', fontSize: 11, marginTop: 4 }}>
            Target: {currentLevelData.targetPulls} pulls • Mode: {currentLevelData.requiredCurveMode}
          </div>
        </div>
      )}
    </div>
  )
}

