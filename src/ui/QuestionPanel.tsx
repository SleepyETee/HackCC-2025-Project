
import { useEffect } from 'react'
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
      <div style={{ fontWeight:700, marginBottom:8 }}>Q: {currentQuestion.text}</div>
      <div className="stack">
        {currentQuestion.options.map((o,i)=>(
          <button 
            key={i} 
            onClick={()=>setAnswer(i, o.correct)}
            style={{
              background: selectedAnswer === i ? '#2d4a7c' : '#22263b',
              borderColor: selectedAnswer === i ? '#4a7cff' : '#323855'
            }}
          >
            {o.text}
          </button>
        ))}
      </div>
      {currentQuestion.hint && selectedAnswer !== null && (
        <div style={{ fontSize:11, opacity:0.6, marginTop:6, fontStyle:'italic' }}>
          💡 {currentQuestion.hint}
        </div>
      )}
      <div style={{ fontSize:12, opacity:0.7, marginTop:6 }}>
        Concept: {currentQuestion.concept}
      </div>
    </div>
  )
}
