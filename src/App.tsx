import { useEffect, useState } from 'react'
import { HUD } from './ui/HUD'
import { EquationPanel } from './ui/EquationPanel'
import { QuestionPanel } from './ui/QuestionPanel'
import { LevelSelector } from './ui/LevelSelector'
import { HalloweenGraphCanvas } from './ui/HalloweenGraphCanvas'
import { AdventureCanvas } from './ui/AdventureCanvas'
import { AdventureQuestionPanel } from './ui/AdventureQuestionPanel'
import { StoryPanel } from './ui/StoryPanel'
import { useGameStore } from './state/store'
import { audioManager } from './game/AudioManager'

export default function App() {
  const gameMode = useGameStore(s => s.gameMode)
  const setGameMode = useGameStore(s => s.setGameMode)
  const score = useGameStore(s => s.score)
  const [audioEnabled, setAudioEnabled] = useState(audioManager.getAudioEnabled())
  
  // Audio toggle handler
  const handleAudioToggle = () => {
    const newState = audioManager.toggleAudio()
    setAudioEnabled(newState)
  }
  
  // Keyboard accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const store = useGameStore.getState()
      const currentQuestion = store.currentQuestion
      
      // 1-4 keys to select answers
      if (e.key >= '1' && e.key <= '4' && currentQuestion) {
        const idx = parseInt(e.key) - 1
        if (idx < currentQuestion.options.length) {
          const option = currentQuestion.options[idx]
          store.setAnswer(idx, option.correct)
        }
      }
      
      // Space to fire
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('spidercalc-fire'))
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="app-root">
      {/* Header with mode switcher */}
      <div className="header">
        <h1 className="title">
          🕷️ SpiderCalc: {gameMode === 'adventure' ? 'Halloween Adventure' : 'Halloween Calculus'} 🎃
        </h1>
        <p className="subtitle">
          {gameMode === 'adventure' 
            ? 'Climb spooky pumpkins to the moon! Answer to jump higher!'
            : 'Learn Derivatives & Integrals through Spooky Graph Exploration!'}
        </p>
        
        {/* Mode Switcher */}
        <div className="switcher">
          <button
            onClick={() => setGameMode('adventure')}
            className={`btn ${gameMode === 'adventure' ? 'btn--adventure-active' : ''}`}
          >
            🎮 Adventure Mode
          </button>
          <button
            onClick={() => setGameMode('classic')}
            className={`btn ${gameMode === 'classic' ? 'btn--classic-active' : ''}`}
          >
            📊 Classic Mode
          </button>
        </div>
      </div>
      
      {/* Render based on game mode */}
      {gameMode === 'adventure' ? (
        <>
          {/* Adventure Mode Layout */}
          <StoryPanel />
          
          <div className="grid-two">
            {/* Game canvas */}
            <div className="canvas-card">
              <AdventureCanvas />
            </div>
            
            {/* Question panel */}
            <div>
              <AdventureQuestionPanel />
            </div>
          </div>
          
          {/* Adventure instructions */}
          <div className="instructions">
            <div className="instructions-title">🎮 HOW TO PLAY - VERTICAL CLIMBING</div>
            <div className="instructions-body">
              <div className="instructions-item"> 
              </div>
              <div className="instructions-item">
                ⏱️ <strong>Answer questions</strong> to power your jump
              </div>
              <div className="instructions-item">
                ✅ <strong>Correct</strong> = Big jump upward
              </div>
              <div className="instructions-item">
                ❌ <strong>Wrong</strong> = Fall down one pumpkin
              </div>
              <div>
              ❤️ <strong>3 Lives</strong> | 🎯 <strong>Goal: 3000m</strong>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Classic Mode Layout */}
          <LevelSelector />
          
          <div className="classic-wrapper">
            <HalloweenGraphCanvas />
            <div className="classic-overlay">
              <HUD />
              <div className="classic-overlay-right">
                <EquationPanel />
                <QuestionPanel />
              </div>
            </div>
          </div>
          
          <div className="classic-hint">
            ⌨️ Keys: 1-4 to select answers • Space/Enter to Fire • Use buttons below graph for calculus concepts!
          </div>
          
          {/* Teacher Info Panel */}
          <div className="teacher-panel">
            <h3 className="teacher-title">👩‍🏫 Teacher Guide: Halloween Calculus Concepts</h3>
            <div className="teacher-grid">
              <div>
                <h4 className="teacher-subtitle-green">📐 Derivative Mode</h4>
                <p className="teacher-p">
                  Click "Show Derivative" to display the tangent line at any point. 
                  Students see the slope (f'(x)) calculated in real-time!
                </p>
              </div>
              <div>
                <h4 className="teacher-subtitle-purple">📊 Integral Mode</h4>
                <p className="teacher-p">
                  Click "Show Integral" to visualize the area under the curve. 
                  Riemann sums animated as purple rectangles!
                </p>
              </div>
              <div className="teacher-note">
                <h4 className="teacher-subtitle-orange">🎮 Gamification Features</h4>
                <ul className="teacher-list">
                  <li>🎃 <strong>Pumpkins</strong> = Safe landing points (correct answers lead here!)</li>
                  <li>👻 <strong>Ghosts</strong> = Risky points (wrong answers may send spider here)</li>
                  <li>🕷️ <strong>Spider</strong> = Student's position on the coordinate plane</li>
                  <li>🦇 <strong>Flying Bats</strong> = Adds atmosphere and engagement</li>
                  <li>🌙 <strong>Spooky Moon</strong> = Ambient lighting that pulses</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
