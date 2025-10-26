
import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '../state/store'
import { getRandomQuestion } from '../game/questions'

export function QuestionPanel(){
  const currentQuestion = useGameStore(s=>s.currentQuestion)
  const selectedAnswer = useGameStore(s=>s.selectedAnswer)
  const currentLevel = useGameStore(s=>s.currentLevel)
  const usedQuestionIds = useGameStore(s=>s.usedQuestionIds)
  const setAnswer = useGameStore(s=>s.setAnswer)
  const setCurrentQuestion = useGameStore(s=>s.setCurrentQuestion)
  const addUsedQuestionId = useGameStore(s=>s.addUsedQuestionId)
  
  // Track clicks per question
  const [clickCount, setClickCount] = useState(0)
  const [clickedOptions, setClickedOptions] = useState<number[]>([])
  
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
  
  // Reset click tracking when new question loads
  useEffect(() => {
    setClickCount(0)
    setClickedOptions([])
  }, [currentQuestion])

  // Listen for keyboard events from App.tsx
  useEffect(() => {
    const handleKeyboardAnswerClick = (event: CustomEvent) => {
      const { index, isCorrect } = event.detail
      handleAnswerClick(index, isCorrect)
    }

    const handleSpaceKey = (event: KeyboardEvent) => {
      if (event.key === ' ' && clickCount === 1 && selectedAnswer === null) {
        event.preventDefault()
        // Space key fires immediately with the first clicked answer
        const firstClickedIndex = clickedOptions[0]
        if (firstClickedIndex !== undefined) {
          const firstOption = shuffledOptions[firstClickedIndex]
          setAnswer(firstClickedIndex, firstOption.correct)
          // Hide probability beams after submission
          window.dispatchEvent(new CustomEvent('spidercalc-hide-probabilities'))
          // Fire immediately
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('spidercalc-fire'))
          }, 100)
        }
      }
    }

    window.addEventListener('spidercalc-answer-click', handleKeyboardAnswerClick as EventListener)
    window.addEventListener('keydown', handleSpaceKey)
    
    return () => {
      window.removeEventListener('spidercalc-answer-click', handleKeyboardAnswerClick as EventListener)
      window.removeEventListener('keydown', handleSpaceKey)
    }
  }, [clickCount, clickedOptions, shuffledOptions, selectedAnswer])
  
  // Handle answer selection with click limit and probability display
  const handleAnswerClick = (index: number, isCorrect: boolean) => {
    if (clickCount >= 2) return // Prevent more than 2 clicks
    
    const newClickCount = clickCount + 1
    const newClickedOptions = [...clickedOptions, index]
    
    setClickCount(newClickCount)
    setClickedOptions(newClickedOptions)
    
    // If this is the first click, show probabilities but don't submit yet
    if (newClickCount === 1) {
      // Trigger probability beam display in the graph
      window.dispatchEvent(new CustomEvent('spidercalc-show-probabilities', {
        detail: { correct: isCorrect }
      }))
    }
    
    // If this is the second click, automatically submit and lock the answer
    if (newClickCount === 2) {
      setAnswer(index, isCorrect)
      // Hide probability beams after submission
      window.dispatchEvent(new CustomEvent('spidercalc-hide-probabilities'))
    }
  }
  
  // Load a question when component mounts or when we need a new one
  useEffect(() => {
    if (!currentQuestion) {
      const q = getRandomQuestion(currentLevel, usedQuestionIds)
      if (q) {
        setCurrentQuestion(q)
        addUsedQuestionId(q.id)
      }
    }
  }, [currentQuestion, currentLevel, usedQuestionIds, setCurrentQuestion, addUsedQuestionId])
  
  if (!currentQuestion) {
    return (
      <div className="panel">
        <div style={{ fontWeight:700, marginBottom:8 }}>Loading question...</div>
      </div>
    )
  }
  
  return (
    <div className="panel">
      <div style={{ fontWeight:700, marginBottom:8, color: '#ff6b35' }}>
        📝 Question:
      </div>
      <div style={{ marginBottom:12, color: '#e0e7ff', fontSize: 14 }}>
        {currentQuestion.text}
      </div>
      
      {/* Click Counter */}
      {selectedAnswer === null && (
        <div style={{
          textAlign: 'center',
          marginBottom: 12,
          padding: '6px 12px',
          background: clickCount >= 2 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                     clickCount === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                     'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          borderRadius: 6,
          border: `2px solid ${clickCount >= 2 ? '#fca5a5' : 
                            clickCount === 1 ? '#fbbf24' : '#a78bfa'}`,
          boxShadow: clickCount >= 2 ? '0 0 15px rgba(239, 68, 68, 0.6)' : 
                    clickCount === 1 ? '0 0 15px rgba(245, 158, 11, 0.6)' :
                    '0 0 15px rgba(139, 92, 246, 0.6)'
        }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: '#fff',
            textShadow: '0 0 5px rgba(0,0,0,0.5)'
          }}>
            {clickCount >= 2 ? '✅ Answer Locked!' : 
             clickCount === 1 ? '🔍 Probabilities Shown - Click Again to Lock or Press SPACE to Fire!' : 
             '🖱️ Click to See Probabilities'}
          </div>
        </div>
      )}
      
      <div className="stack">
        {shuffledOptions.map((o, i)=>(
          <button 
            key={i} 
            onClick={()=>handleAnswerClick(i, o.correct)}
            disabled={clickCount >= 2 && !clickedOptions.includes(i)}
            style={{
              background: clickedOptions.includes(i)
                ? clickCount === 1 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' // Orange for first click (probabilities shown)
                  : 'linear-gradient(135deg, #2d4a7c, #1a2d4a)' // Blue for second click (locked)
                : clickCount >= 2 && !clickedOptions.includes(i)
                ? 'linear-gradient(135deg, #374151, #1f2937)'
                : 'linear-gradient(135deg, #22263b, #15182b)',
              borderColor: clickedOptions.includes(i) 
                ? clickCount === 1 ? '#fbbf24' : '#4a7cff'
                : clickCount >= 2 && !clickedOptions.includes(i)
                ? '#6b7280'
                : '#323855',
              borderWidth: 2,
              borderStyle: 'solid',
              color: clickCount >= 2 && !clickedOptions.includes(i) ? '#6b7280' : '#ffffff',
              padding: '10px 12px',
              borderRadius: 8,
              cursor: clickCount >= 2 && !clickedOptions.includes(i) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'left',
              opacity: clickedOptions.includes(i) && clickCount === 1 && clickedOptions.length > 1
                ? 0.6  // Dim the first clicked button when second button is clicked
                : clickCount >= 2 && !clickedOptions.includes(i) ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (clickCount < 2 && !clickedOptions.includes(i)) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2d3a4a, #1a2535)'
                e.currentTarget.style.borderColor = '#5a8cff'
              }
            }}
            onMouseLeave={(e) => {
              if (clickCount < 2 && !clickedOptions.includes(i)) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22263b, #15182b)'
                e.currentTarget.style.borderColor = '#323855'
              }
            }}
          >
            {clickedOptions.includes(i) && (
              clickCount === 1 ? '🔍 ' : '✓ '
            )}{o.text}
          </button>
        ))}
      </div>
      {currentQuestion.hint && selectedAnswer !== null && (
        <div style={{ 
          fontSize:11, 
          opacity:0.8, 
          marginTop:10, 
          fontStyle:'italic',
          padding: 8,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 6,
          color: '#c4b5fd'
        }}>
          💡 {currentQuestion.hint}
        </div>
      )}
      <div style={{ 
        fontSize:11, 
        opacity:0.8, 
        marginTop:8,
        padding: 6,
        background: 'rgba(255, 107, 53, 0.2)',
        borderRadius: 6,
        color: '#ff6b35',
        textAlign: 'center',
        fontWeight: 600
      }}>
        📚 Concept: {currentQuestion.concept}
      </div>
    </div>
  )
}
