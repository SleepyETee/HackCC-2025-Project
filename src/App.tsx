
import { useEffect, useState } from 'react'
import { HUD } from './ui/HUD'
import { EquationPanel } from './ui/EquationPanel'
import { QuestionPanel } from './ui/QuestionPanel'
import { LevelSelector } from './ui/LevelSelector'
import { HalloweenGraphCanvas } from './ui/HalloweenGraphCanvas'
import { AdventureCanvas } from './ui/AdventureCanvas'
import { EnhancedAdventureCanvas } from './ui/EnhancedAdventureCanvas'
import { AdventureQuestionPanel } from './ui/AdventureQuestionPanel'
import { StoryPanel } from './ui/StoryPanel'
import { EnhancedDemo } from './ui/EnhancedDemo' // Demo component
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
    <div style={{ width:'100%', maxWidth:1200, margin:'0 auto', padding:24, background:'#0a0a0f', minHeight:'100vh' }}>
      {/* Header with mode switcher */}
      <div style={{ textAlign:'center', marginBottom:16 }}>
        <h1 style={{ fontSize:36, fontWeight:800, background:'linear-gradient(135deg, #ff6b35, #8b5cf6, #10b981)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0, textShadow:'0 0 30px rgba(139, 92, 246, 0.5)' }}>
          🕷️ SpiderCalc: {gameMode === 'adventure' ? 'Jack & the Beanstalk' : 'Halloween Calculus'} 🌱
        </h1>
        <p style={{ color:'#ff6b35', fontSize:16, margin:'8px 0 0', fontWeight:'bold' }}>
          {gameMode === 'adventure' 
            ? 'Climb the magical beanstalk to reach the sky! Answer calculus questions to jump between leaves!' 
            : 'Learn Derivatives & Integrals through Spooky Graph Exploration!'}
        </p>
        
        {/* Mode Switcher */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setGameMode('adventure')}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: '2px solid',
              borderColor: gameMode === 'adventure' ? '#ffd700' : '#444',
              background: gameMode === 'adventure' ? 'linear-gradient(135deg, #ffd700, #ffaa00)' : '#1a1a2e',
              color: gameMode === 'adventure' ? '#000' : '#888',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: gameMode === 'adventure' ? '0 0 20px rgba(255, 215, 0, 0.5)' : 'none'
            }}
          >
            🎮 Adventure Mode
          </button>
          <button
            onClick={() => setGameMode('classic')}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: '2px solid',
              borderColor: gameMode === 'classic' ? '#8b5cf6' : '#444',
              background: gameMode === 'classic' ? 'linear-gradient(135deg, #8b5cf6, #7c4dff)' : '#1a1a2e',
              color: gameMode === 'classic' ? '#fff' : '#888',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: gameMode === 'classic' ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none'
            }}
          >
            📊 Classic Mode
          </button>
        </div>
        
        {/* Score display */}
        <div style={{ 
          marginTop: 12,
          padding: '8px 20px',
          background: 'linear-gradient(135deg, #2d1b4e, #1a0f2e)',
          border: '2px solid #ff6b35',
          borderRadius: 20,
          display: 'inline-block',
          fontWeight: 700,
          fontSize: 18,
          color: '#ffd700'
        }}>
          💰 Score: {score}
        </div>
      </div>
      
      {/* Render based on game mode */}
      {gameMode === 'adventure' ? (
        <>
          {/* Adventure Mode Layout */}
          <StoryPanel />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 350px', 
            gap: 16,
            marginBottom: 16
          }}>
            {/* Game canvas */}
            <div style={{ 
              border: '3px solid #ffd700', 
              borderRadius: 12, 
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(255, 215, 0, 0.4)',
              background: '#000'
            }}>
              <EnhancedAdventureCanvas />
            </div>
            
            {/* Question panel */}
            <div>
              <AdventureQuestionPanel />
            </div>
          </div>
          
          {/* Adventure instructions */}
          <div style={{ 
            textAlign: 'center', 
            color: '#ff6b35', 
            fontSize: 14, 
            marginTop: 12, 
            fontWeight: 'bold',
            padding: 16,
            background: 'rgba(255, 107, 53, 0.1)',
            borderRadius: 12,
            border: '2px solid rgba(255, 107, 53, 0.3)'
          }}>
            <div style={{ fontSize: 16, marginBottom: 8, color: '#ffd700' }}>
              🎮 HOW TO PLAY - VERTICAL CLIMBING
            </div>
            <div style={{ color: '#e0e7ff', fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 4 }}>
                🎯 <strong>Hover & Click</strong> golden anchor points above to shoot web
              </div>
              <div style={{ marginBottom: 4 }}>
                ⏱️ <strong>Answer questions</strong> while swinging to control release timing
              </div>
              <div style={{ marginBottom: 4 }}>
                ✅ <strong>Correct</strong> = Perfect release (1.5s) + Strong boost upward!
              </div>
              <div style={{ marginBottom: 4 }}>
                ❌ <strong>Wrong</strong> = Early release (0.8s) + Weak boost
              </div>
              <div style={{ marginBottom: 4 }}>
                ⚠️ <strong>Avoid hazards</strong> (saws, cutters) that break your web
              </div>
              <div>
                💾 <strong>Checkpoints</strong> every 500m | ❤️ <strong>3 Lives</strong> | 🎯 <strong>Goal: 3000m</strong>
              </div>
            </div>
          </div>
          
          {/* Enhanced Demo Component */}
          <EnhancedDemo />
        </>
      ) : (
        <>
          {/* Classic Mode Layout */}
          <LevelSelector />
          
          <div style={{ position:'relative', width:960, height:540, margin:'16px auto', border:'3px solid #8b5cf6', borderRadius:12, overflow:'hidden', boxShadow:'0 0 40px rgba(139, 92, 246, 0.4)' }}>
            <HalloweenGraphCanvas />
            <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              <HUD />
              <div style={{ position:'absolute', right:12, top:12, width:260, display:'flex', flexDirection:'column', gap:8, pointerEvents:'auto' }}>
                <EquationPanel />
                <QuestionPanel />
              </div>
            </div>
          </div>
          
          <div style={{ textAlign:'center', color:'#ff6b35', fontSize:14, marginTop:12, fontWeight:'bold' }}>
            ⌨️ Keys: 1-4 to select answers • Space/Enter to Fire • Use buttons below graph for calculus concepts!
          </div>
          
          {/* Teacher Info Panel */}
          <div style={{ 
            background:'linear-gradient(135deg, #1a1a2e, #0a0a0f)', 
            border:'2px solid #8b5cf6', 
            borderRadius:12, 
            padding:20, 
            marginTop:20,
            boxShadow:'0 0 20px rgba(139, 92, 246, 0.3)'
          }}>
            <h3 style={{ color:'#ff6b35', margin:'0 0 12px 0', fontSize:20 }}>
              👩‍🏫 Teacher Guide: Halloween Calculus Concepts
            </h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, color:'#e0e7ff' }}>
              <div>
                <h4 style={{ color:'#10b981', marginTop:0 }}>📐 Derivative Mode</h4>
                <p style={{ fontSize:13, margin:0 }}>
                  Click "Show Derivative" to display the tangent line at any point. 
                  Students see the slope (f'(x)) calculated in real-time!
                </p>
              </div>
              <div>
                <h4 style={{ color:'#8b5cf6', marginTop:0 }}>📊 Integral Mode</h4>
                <p style={{ fontSize:13, margin:0 }}>
                  Click "Show Integral" to visualize the area under the curve. 
                  Riemann sums animated as purple rectangles!
                </p>
              </div>
              <div style={{ gridColumn:'1 / -1', background:'rgba(139, 92, 246, 0.1)', padding:12, borderRadius:8, border:'1px solid #8b5cf6' }}>
                <h4 style={{ color:'#ff6b35', marginTop:0 }}>🎮 Gamification Features</h4>
                <ul style={{ margin:0, paddingLeft:20, fontSize:13 }}>
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
