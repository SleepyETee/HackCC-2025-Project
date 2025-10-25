import { useEffect } from 'react'
import { useGameStore } from '../state/store'
import { getQuestionsForScene, getScene } from '../game/adventure'

export function AdventureQuestionPanel() {
  const currentSceneId = useGameStore(s => s.currentSceneId)
  const currentQuestion = useGameStore(s => s.currentAdventureQuestion)
  const setCurrentQuestion = useGameStore(s => s.setCurrentAdventureQuestion)
  const setAdventureAction = useGameStore(s => s.setAdventureAction)
  
  const scene = getScene(currentSceneId)
  
  // Load a question when component mounts or when scene changes
  useEffect(() => {
    if (!currentQuestion && scene) {
      const questions = getQuestionsForScene(scene.id)
      if (questions.length > 0) {
        const randomQ = questions[Math.floor(Math.random() * questions.length)]
        setCurrentQuestion(randomQ)
      }
    }
  }, [currentQuestion, scene, setCurrentQuestion])
  
  if (!currentQuestion || !scene) {
    return (
      <div className="panel" style={{ 
        background: 'linear-gradient(135deg, #1a0033, #0a001a)', 
        border: '2px solid #8b5cf6',
        padding: 16,
        borderRadius: 12
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: '#ff6b35' }}>
          Loading adventure...
        </div>
      </div>
    )
  }
  
  const handleAnswer = (option: any, index: number) => {
    setAdventureAction(option.action, option.correct)
    // Add score feedback
    const store = useGameStore.getState()
    if (option.correct) {
      store.addScore(100)
    } else {
      store.addScore(-50)
    }
  }
  
  return (
    <div className="panel" style={{ 
      background: 'linear-gradient(135deg, #1a0033, #0a001a)', 
      border: '2px solid #8b5cf6',
      padding: 16,
      borderRadius: 12,
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
    }}>
      {/* Story context */}
      <div style={{ 
        fontSize: 11, 
        fontStyle: 'italic', 
        color: '#ffd700', 
        marginBottom: 8,
        padding: 8,
        background: 'rgba(255, 215, 0, 0.1)',
        borderRadius: 6,
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        📖 {currentQuestion.storyContext}
      </div>
      
      {/* Question */}
      <div style={{ 
        fontWeight: 700, 
        marginBottom: 12, 
        color: '#ffffff',
        fontSize: 14
      }}>
        {currentQuestion.text}
      </div>
      
      {/* Answer options */}
      <div className="stack" style={{ gap: 8 }}>
        {currentQuestion.options.map((option, i) => {
          const actionIcon = option.action === 'jump' ? '🦘' : '🕸️'
          const actionColor = option.action === 'jump' ? '#00ff00' : '#00e5ff'
          
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(option, i)}
              style={{
                background: 'linear-gradient(135deg, #2a2a4a, #1a1a3a)',
                borderColor: actionColor,
                borderWidth: 2,
                padding: 12,
                borderRadius: 8,
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${actionColor}33, ${actionColor}22)`
                e.currentTarget.style.transform = 'translateX(5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2a2a4a, #1a1a3a)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span style={{ fontSize: 18 }}>{actionIcon}</span>
              <span>{option.text}</span>
            </button>
          )
        })}
      </div>
      
      {/* Hint */}
      {currentQuestion.hint && (
        <div style={{ 
          fontSize: 11, 
          opacity: 0.7, 
          marginTop: 10,
          padding: 8,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 6,
          color: '#c4b5fd'
        }}>
          💡 {currentQuestion.hint}
        </div>
      )}
      
      {/* Concept tag */}
      <div style={{ 
        fontSize: 11, 
        marginTop: 8,
        padding: 6,
        background: 'rgba(255, 107, 53, 0.2)',
        borderRadius: 6,
        color: '#ff6b35',
        textAlign: 'center',
        fontWeight: 600
      }}>
        📚 Concept: {currentQuestion.concept}
      </div>
      
      {/* Action legend */}
      <div style={{ 
        fontSize: 10, 
        marginTop: 10,
        padding: 8,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 6,
        color: '#999'
      }}>
        <div style={{ marginBottom: 4 }}>
          🦘 = JUMP forward • 🕸️ = SHOOT WEB to swing
        </div>
        <div>
          ✅ Correct = Better action • ❌ Wrong = Weaker action
        </div>
      </div>
    </div>
  )
}

