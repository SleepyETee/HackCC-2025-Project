import { useEffect, useMemo } from 'react'
import { useGameStore } from '../state/store'

export function AdventureQuestionPanel() {
  const currentQuestion = useGameStore(s => s.currentAdventureQuestion)
  const setAdventureAction = useGameStore(s => s.setAdventureAction)
  
  // Shuffle options every time a new question is loaded
  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return []
    
    // Create a copy of options with their original index
    const optionsWithIndex = currentQuestion.options.map((opt, idx) => ({ 
      ...opt, 
      originalIndex: idx 
    }))
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...optionsWithIndex]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    return shuffled
  }, [currentQuestion])
  
  if (!currentQuestion) {
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
      
      {/* Answer options (shuffled each question) */}
      <div className="stack" style={{ gap: 8 }}>
        {shuffledOptions.map((option, i) => {
          // Use consistent purple border for all options (don't show correct answer)
          const borderColor = '#8b5cf6'
          
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(option, i)}
              style={{
                background: 'linear-gradient(135deg, #2a2a4a, #1a1a3a)',
                border: `2px solid ${borderColor}`,
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
                e.currentTarget.style.background = `linear-gradient(135deg, ${borderColor}33, ${borderColor}22)`
                e.currentTarget.style.transform = 'translateX(5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2a2a4a, #1a1a3a)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <span style={{ fontSize: 18 }}>⏱️</span>
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
      
      {/* Timing legend */}
      <div style={{ 
        fontSize: 10, 
        marginTop: 10,
        padding: 8,
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 6,
        color: '#999'
      }}>
        <div style={{ marginBottom: 4 }}>
          ⏱️ Your answer affects web release timing!
        </div>
        <div>
          ✅ Correct = Perfect timing (1.5s) + STRONG boost (18) ⬆️
        </div>
        <div>
          ❌ Wrong = Early release (0.8s) + Weak boost (10) ⬆️
        </div>
      </div>
    </div>
  )
}

