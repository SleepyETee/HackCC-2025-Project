import { useEffect, useState } from 'react'
import { HUD } from './ui/HUD'
import { EquationPanel } from './ui/EquationPanel'
import { QuestionPanel } from './ui/QuestionPanel'
import { LevelSelector } from './ui/LevelSelector'
import { HalloweenGraphCanvas } from './ui/HalloweenGraphCanvas'
import { ClassicAdventureCanvas } from './ui/ClassicAdventureCanvas'
import { StoryAdventureCanvas } from './ui/StoryAdventureCanvas'
import { AdventureQuestionPanel } from './ui/AdventureQuestionPanel'
import { StoryPanel } from './ui/StoryPanel'
import { TestWebSwingCanvas } from './ui/TestWebSwingCanvas'
import { useGameStore } from './state/store'
import { audioManager } from './game/AudioManager'

export default function App() {
  const gameMode = useGameStore(s => s.gameMode)
  const setGameMode = useGameStore(s => s.setGameMode)
  const adventureMode = useGameStore(s => s.adventureMode)
  const setAdventureMode = useGameStore(s => s.setAdventureMode)
  const score = useGameStore(s => s.score)
  const [audioEnabled, setAudioEnabled] = useState(audioManager.getAudioEnabled())
  const [showTest, setShowTest] = useState(import.meta.env.DEV ? false : false)
  
  // Audio toggle handler
  const handleAudioToggle = () => {
    const newState = audioManager.toggleAudio()
    setAudioEnabled(newState)
  }
  
  // Keyboard accessibility - ONLY for classic mode
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const store = useGameStore.getState()
      
      // Only handle keyboard in classic mode
      if (store.gameMode !== 'classic') return
      
      const currentQuestion = store.currentQuestion
      
      // 1-4 keys to select answers (now works with click tracking system)
      if (e.key >= '1' && e.key <= '4' && currentQuestion) {
        const idx = parseInt(e.key) - 1
        if (idx < currentQuestion.options.length) {
          const option = currentQuestion.options[idx]
          // Dispatch click event to QuestionPanel to handle click tracking
          window.dispatchEvent(new CustomEvent('spidercalc-answer-click', {
            detail: { index: idx, isCorrect: option.correct }
          }))
        }
      }
      
      // Space or Enter to fire grapple (only if answer is already selected)
      if ((e.key === ' ' || e.key === 'Enter') && store.selectedAnswer !== null) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('spidercalc-fire'))
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameMode])

  // Show test mode if enabled
  if (import.meta.env.DEV && showTest) {
    return (
      <div className="app-root">
        <div className="header">
          <h1 className="title">🧪 Web Swinging Test Mode</h1>
          <button
            onClick={() => setShowTest(false)}
            className="btn"
            style={{ position: 'absolute', right: '20px', top: '20px' }}
          >
            ← Back to Game
          </button>
        </div>
        <TestWebSwingCanvas />
        <div style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
          <p><strong>How to test:</strong></p>
          <p>1. Click and drag to shoot web</p>
          <p>2. Right-click to cut web</p>
          <p>3. Click test buttons to see physics change</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="app-root">
      {/* Header with mode switcher */}
      <div className="header">
        {/* Test Mode Button (DEV only) */}
        {import.meta.env.DEV && (
          <button
            onClick={() => setShowTest(true)}
            className="btn"
            style={{ 
              position: 'absolute', 
              right: '20px', 
              top: '20px',
              fontSize: '12px',
              padding: '8px 12px',
              background: '#8b5cf6',
              zIndex: 1000
            }}
          >
            🧪 Test
          </button>
        )}
        
        <h1 className="title">
          🕷️ SpiderCalc: {gameMode === 'adventure' ? 'Halloween Adventure' : 'Halloween Calculus'} 🎃
        </h1>
        <p className="subtitle">
          {gameMode === 'adventure' 
            ? adventureMode === 'classic' 
              ? 'Climb spooky pumpkins to the moon! Answer to jump higher!'
              : adventureMode === 'story'
              ? 'Swing through the Haunted Mansion! Answer calculus to control physics!'
              : 'Web-swinging physics adventure! Use calculus to navigate!'
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
        
        {/* Adventure Mode Selector */}
        {gameMode === 'adventure' && (
          <div className="switcher" style={{ marginTop: '10px', gap: '8px' }}>
            <button
              onClick={() => setAdventureMode('classic')}
              className={`btn ${adventureMode === 'classic' ? 'btn--classic-active' : ''}`}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              🎃 Classic Adventure
            </button>
            <button
              onClick={() => setAdventureMode('story')}
              className={`btn ${adventureMode === 'story' ? 'btn--adventure-active' : ''}`}
              style={{ fontSize: '14px', padding: '8px 16px' }}
            >
              🕷️ Web-Swinging Adventure (Spider-Man Physics!)
            </button>
          </div>
        )}
      </div>
      
      {/* Render based on game mode */}
      {gameMode === 'adventure' ? (
        <>
          {/* Story Adventure - Full Screen Physics Puzzle! */}
          {adventureMode === 'story' ? (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <StoryAdventureCanvas />
            </div>
          ) : (
            // Classic Adventure - with question panel
            <>
              <div className="grid-two">
                {/* Game canvas */}
                <div className="canvas-card">
                  <ClassicAdventureCanvas />
                </div>
                
                {/* Question panel */}
                <div>
                  <AdventureQuestionPanel />
                </div>
              </div>
            </>
          )}
          
          {/* Adventure instructions */}
          <div className="instructions">
            {adventureMode === 'classic' ? (
              <>
                <div className="instructions-title">🎮 HOW TO PLAY - CLASSIC ADVENTURE</div>
                <div className="instructions-body">
                  <div className="instructions-item">
                    🎯 <strong>Hover & Click</strong> pumpkins above to target your jump
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
                    💾 <strong>Checkpoints</strong> every 500m | ❤️ <strong>3 Lives</strong> | 🎯 <strong>Goal: 3000m</strong>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="instructions-title">🕷️ WEB-SWINGING ADVENTURE - Spider-Man Physics!</div>
                <div className="instructions-body">
                  <div className="instructions-item">
                    🖱️ <strong>Left Click & Drag</strong> = Aim web trajectory
                  </div>
                  <div className="instructions-item">
                    🚀 <strong>Release</strong> = Shoot web to anchor points
                  </div>
                  <div className="instructions-item">
                    🕸️ <strong>Golden Anchors</strong> = Attach your web here to swing
                  </div>
                  <div className="instructions-item">
                    ✂️ <strong>Right Click</strong> = Cut rope to release and drop
                  </div>
                  <div className="instructions-item">
                    ❓ <strong>Answer Questions</strong> = Change physics (gravity, rope tension)
                  </div>
                  <div className="instructions-item">
                    🎯 <strong>Reach Goal</strong> = Green circle to complete scene
                  </div>
                  <div style={{ marginTop: '8px', color: '#ffd700' }}>
                    🏆 <strong>5 scenes across 4 chapters - answer calculus to master physics!</strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Classic Mode Layout - Reorganized */}
          <div className="classic-layout">
            {/* Level Selector at top */}
            <div className="level-selector-top">
              <LevelSelector />
            </div>
            
            {/* Main content grid */}
            <div className="classic-main-grid">
              {/* Graph on left */}
              <div className="canvasWrap">
                <HalloweenGraphCanvas />
              </div>
              
              {/* Question + Answer on right */}
              <div className="question-answer-panel">
                <HUD />
                <EquationPanel />
                <QuestionPanel />
              </div>
            </div>
            
            {/* How to Play at bottom */}
            <div className="how-to-play-bottom">
              <div className="small-legend">
                <h4>🎯 How to Play</h4>
                <div className="legend-item">
                  <span className="legend-icon">🎃</span>
                  <span>Pumpkins = Safe (+30 correct, +200 finish)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">👻</span>
                  <span>Ghosts = Dangerous (-50 wrong, -100 finish)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">📐</span>
                  <span>Click graph to set derivative point</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">🔍</span>
                  <span>Mouse wheel to zoom, drag to pan</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon">⌨️</span>
                  <span>Press SPACE to fire immediately after first click</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Teacher Info Panel */}
          <div className="teacher-panel">
            <h3 className="teacher-title">👩‍🏫 Teacher Guide: Classic Mode Calculus Learning</h3>
            <div className="teacher-grid">
              <div>
                <h4 className="teacher-subtitle-green">📐 Derivative Visualization</h4>
                <p className="teacher-p">
                  Click "Show Derivative (Tangent)" to display the tangent line at any point. 
                  Students see the instantaneous rate of change f'(x) calculated in real-time!
                </p>
              </div>
              <div>
                <h4 className="teacher-subtitle-purple">📊 Integral Visualization</h4>
                <p className="teacher-p">
                  Click "Show Integral (Area)" to visualize the area under the curve. 
                  Riemann sums shown as purple rectangles with numerical approximation!
                </p>
              </div>
              <div className="teacher-note">
                <h4 className="teacher-subtitle-orange">🎮 Game Mechanics & Learning</h4>
                <ul className="teacher-list">
                  <li>🎃 <strong>Pumpkins</strong> = Safe anchor points (correct answers increase probability)</li>
                  <li>👻 <strong>Ghosts</strong> = Hazardous points (wrong answers increase probability)</li>
                  <li>🕷️ <strong>Spider</strong> = Student's position on coordinate plane</li>
                  <li>📏 <strong>Equation Curve</strong> = Controls which points are "under the line" (strategic thinking!)</li>
                  <li>📊 <strong>Probability Beams</strong> = Visual representation of softmax distribution</li>
                  <li>🏁 <strong>Finish Line</strong> = Reach x = 14 to complete the level</li>
                  <li>🎯 <strong>Limited Pulls</strong> = Strategic resource management (3-5 pulls per round)</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
