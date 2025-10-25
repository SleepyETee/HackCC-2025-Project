import { useGameStore } from '../state/store'
import { getScene, ADVENTURE_STORY } from '../game/adventure'

export function StoryPanel() {
  const currentSceneId = useGameStore(s => s.currentSceneId)
  const scene = getScene(currentSceneId)
  
  if (!scene) return null
  
  // Find which chapter we're in
  const chapterMatch = scene.id.match(/^ch(\d+)/)
  const chapterNum = chapterMatch ? parseInt(chapterMatch[1]) : 1
  const chapter = ADVENTURE_STORY.chapters[chapterNum - 1]
  
  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #2d1b4e, #1a0f2e)', 
      border: '3px solid #ffd700',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative corner */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: 'radial-gradient(circle at top right, rgba(255, 215, 0, 0.2), transparent)',
        pointerEvents: 'none'
      }} />
      
      {/* Chapter badge */}
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, #ff6b35, #8b5cf6)',
        padding: '6px 16px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 700,
        marginBottom: 12,
        color: '#ffffff',
        boxShadow: '0 2px 10px rgba(139, 92, 246, 0.5)'
      }}>
        {chapter.name}
      </div>
      
      {/* Scene title */}
      <h2 style={{ 
        margin: '0 0 12px 0',
        fontSize: 24,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
      }}>
        📜 {scene.title}
      </h2>
      
      {/* Narration */}
      <p style={{ 
        color: '#e0e7ff',
        fontSize: 15,
        lineHeight: 1.6,
        margin: 0,
        fontStyle: 'italic',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        {scene.narration}
      </p>
      
      {/* Goal indicator */}
      <div style={{
        marginTop: 16,
        padding: 12,
        background: 'rgba(0, 255, 0, 0.1)',
        border: '2px solid #00ff00',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }}>
        <span style={{ fontSize: 24 }}>🎯</span>
        <div>
          <div style={{ fontSize: 12, color: '#00ff00', fontWeight: 600 }}>
            GOAL
          </div>
          <div style={{ fontSize: 13, color: '#b3ffb3' }}>
            {scene.goal.description}
          </div>
        </div>
      </div>
    </div>
  )
}

