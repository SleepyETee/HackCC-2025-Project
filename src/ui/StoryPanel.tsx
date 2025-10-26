import { useGameStore } from '../state/store'
import { getSceneById, getChapterById } from '../game/adventure'

export function StoryPanel() {
  const score = useGameStore(s => s.score)
  const currentSceneId = useGameStore(s => s.currentSceneId)
  const adventureMode = useGameStore(s => s.adventureMode)
  const setAdventureMode = useGameStore(s => s.setAdventureMode)
  
  // Debug log
  console.log('StoryPanel rendering:', { adventureMode, score, currentSceneId })
  
  // Show for both classic and story adventure modes
  
  // Get current scene and chapter data
  const currentScene = getSceneById(currentSceneId)
  const currentChapter = currentScene ? getChapterById(currentScene.chapter) : null
  
  // Fallback to default story if no scene data
  const sceneData = currentScene || {
    name: "The Calculus Chronicles",
    storyContext: "You are a brave spider mathematician navigating through the Haunted Mansion of Functions to recover the legendary Derivative Crown, solving calculus puzzles to jump gaps and shoot webs across treacherous halls.",
    chapter: 1
  }
  
  const chapterData = currentChapter || {
    name: "The Entrance Hall",
    description: "Master basic derivatives and enter the mansion",
    color: "#8b5cf6"
  }
  
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
      
      
      {/* Chapter Badge - Only show for Story Adventure */}
      {adventureMode === 'story' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${chapterData.color}, ${chapterData.color}80)`,
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Chapter {sceneData.chapter}
          </div>
          <div style={{
            background: 'rgba(255, 215, 0, 0.2)',
            color: '#ffd700',
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: 10,
            fontWeight: 600
          }}>
            {chapterData.name}
          </div>
        </div>
      )}
      
      {/* Scene Title */}
      <h2 style={{ 
        margin: '0 0 12px 0',
        fontSize: 28,
        fontWeight: 800,
        background: 'linear-gradient(135deg, #88ccff, #4466aa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 20px rgba(136, 204, 255, 0.3)'
      }}>
        {adventureMode === 'story' ? `🕷️ ${sceneData.name}` : '🦇Quest for the Golden BUG!'}
      </h2>
      
      {/* Story Context */}
      <p style={{ 
        color: '#e0e7ff',
        fontSize: 15,
        lineHeight: 1.6,
        margin: 0,
        fontStyle: 'italic',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
      }}>
        {adventureMode === 'story' 
          ? sceneData.storyContext
          : <>You are a clever spider who must pick the right math answers to jump from pumpkin to pumpkin — all to find the legendary <strong style={{ color: 'gold', textShadow: '0 0 6px #ffd700' }}> Golden Bug</strong>!</>
        }
      </p>
      
      {/* Chapter Description - Only show for Story Adventure */}
      {adventureMode === 'story' && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: 'rgba(139, 92, 246, 0.1)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <span style={{ fontSize: 24 }}>📚</span>
          <div>
            <div style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 600 }}>
              CHAPTER OBJECTIVE
            </div>
            <div style={{ fontSize: 13, color: '#c4b5fd' }}>
              {chapterData.description}
            </div>
          </div>
        </div>
      )}
      
      {/* Mission Box */}
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
        <img
          src="/images/goldenbug.png"
          alt="golden bug"
          style={{
            width: '2em',
            height: '2em',
            verticalAlign: 'middle',
          }}
        />
        <div>
          <div style={{ fontSize: 12, color: '#00ff00', fontWeight: 600 }}>
            MISSION
          </div>
          <div style={{ fontSize: 13, color: '#b3ffb3' }}>
            Climb 3000m up the beanstalk to reach the Golden BUG!
          </div>
        </div>
      </div>
      
    </div>
  )
}

