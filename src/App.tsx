import { useEffect, useState } from 'react'
import { HUD } from './ui/HUD'
import { EquationPanel } from './ui/EquationPanel'
import { QuestionPanel } from './ui/QuestionPanel'
import { LevelSelector } from './ui/LevelSelector'
import { HalloweenGraphCanvas } from './ui/HalloweenGraphCanvas'
import { Suspense, lazy } from 'react'
const ClassicAdventureCanvas = lazy(() => import('./ui/ClassicAdventureCanvas').then(m => ({ default: m.ClassicAdventureCanvas })))
const StoryAdventureCanvas = lazy(() => import('./ui/StoryAdventureCanvas').then(m => ({ default: m.StoryAdventureCanvas })))
import { AdventureQuestionPanel } from './ui/AdventureQuestionPanel'
import { StoryPanel } from './ui/StoryPanel'
import { useGameStore } from './state/store'
import { audioManager } from './game/AudioManager'

export default function App() {
  const gameMode = useGameStore(s => s.gameMode)
  const setGameMode = useGameStore(s => s.setGameMode)
  const adventureMode = useGameStore(s => s.adventureMode)
  const setAdventureMode = useGameStore(s => s.setAdventureMode)
  const score = useGameStore(s => s.score)
  const [audioEnabled, setAudioEnabled] = useState(audioManager.getAudioEnabled())
  
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

  return (
    <div className="app-root">
      {/* Header with mode switcher */}
      <div className="header">
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
        
        {/* Adventure Mode Selector - Integrated Navbar */}
        {gameMode === 'adventure' && (
          <div className="adventure-navbar" style={{ 
            marginTop: '10px', 
            display: 'flex', 
            gap: '8px', 
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #2d1b4e, #1a0f2e)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '2px solid #ffd700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
          }}>
            <span style={{ color: '#ffd700', fontSize: '14px', fontWeight: 'bold', marginRight: '10px' }}>
              Choose Adventure:
            </span>
            <button
              onClick={() => setAdventureMode('classic')}
              className={`btn ${adventureMode === 'classic' ? 'btn--classic-active' : ''}`}
              style={{ 
                fontSize: '14px', 
                padding: '8px 16px',
                background: adventureMode === 'classic' 
                  ? 'linear-gradient(135deg, #ff6b35, #e55a2b)' 
                  : 'linear-gradient(135deg, #374151, #1f2937)',
                color: '#fff',
                border: adventureMode === 'classic' 
                  ? '2px solid #ffd700' 
                  : '2px solid #4b5563',
                fontWeight: adventureMode === 'classic' ? 700 : 500,
                boxShadow: adventureMode === 'classic' 
                  ? '0 0 15px rgba(255, 107, 53, 0.6)' 
                  : 'none'
              }}
            >
              🎃 Classic Adventure
            </button>
            <button
              disabled
              className="btn btn--inactive"
              style={{ 
                fontSize: '14px', 
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #666666, #444444)', // Dimmed gray
                color: '#999999', // Dimmed text
                border: '2px solid #555555', // Dimmed border
                fontWeight: 500,
                boxShadow: 'none',
                cursor: 'not-allowed', // Show disabled cursor
                opacity: 0.6 // Overall dimmed appearance
              }}
            >
              🕷️ Web-Swinging Adventure (Coming Soon)
            </button>
          </div>
        )}
      </div>
      
      {/* Render based on game mode */}
      {gameMode === 'adventure' ? (
        <>
          {/* Story Adventure - Full Screen Physics Puzzle! */}
          {adventureMode === 'story' ? (
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <Suspense fallback={<div style={{color:'#aaa',padding:20}}>Loading story mode…</div>}>
                <StoryAdventureCanvas />
              </Suspense>
              <StoryPanel />
            </div>
          ) : (
            // Classic Adventure - with question panel
            <>
              {/* Story Panel for Classic Adventure - Quest/Mission Box - MOVED ABOVE */}
              <StoryPanel />
              
              <div className="grid-two">
                {/* Game canvas */}
                <div className="canvas-card">
                  <Suspense fallback={<div style={{color:'#aaa',padding:20}}>Loading adventure…</div>}>
                    <ClassicAdventureCanvas />
                  </Suspense>
                </div>
                
                {/* Question panel with score above */}
                <div>
                  {/* Score Display Above Question Box */}
                  <div style={{
                    padding: 12,
                    background: 'rgba(255, 107, 53, 0.2)',
                    borderRadius: 8,
                    border: '2px solid rgba(255, 107, 53, 0.5)',
                    marginBottom: 12,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 12, color: '#ff6b35', fontWeight: 600, marginBottom: 4 }}>
                      SCORE
                    </div>
                    <div style={{ fontSize: 24, color: '#ffd700', fontWeight: 700 }}>
                      {score}
                    </div>
                  </div>
                  
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
