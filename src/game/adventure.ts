// Adventure Story Structure for SpiderCalc

export type StoryScene = {
  id: string
  title: string
  narration: string
  backgroundDescription: string
  spiderPosition: { x: number; y: number }
  obstacles: Obstacle[]
  goal: { x: number; y: number; description: string }
  questionType: 'jump' | 'web' // Determines spider action
}

export type Obstacle = {
  id: string
  type: 'gap' | 'wall' | 'enemy' | 'platform' | 'web-point'
  x: number
  y: number
  width?: number
  height?: number
  description: string
}

export type AdventureQuestion = {
  id: string
  text: string
  options: { text: string; correct: boolean; action: 'jump' | 'web' }[]
  hint?: string
  concept: string
  storyContext: string // How this question relates to the story
}

// The main adventure storyline
export const ADVENTURE_STORY = {
  title: "🕷️ The Calculus Chronicles: Spider's Quest",
  synopsis: "A brave spider mathematician must navigate through the Haunted Mansion of Functions to recover the legendary Derivative Crown, solving calculus puzzles to jump gaps and shoot webs across the treacherous halls.",
  
  chapters: [
    {
      id: 'ch1',
      name: 'Chapter 1: The Entrance Hall',
      description: 'Your journey begins at the mansion entrance. To proceed, you must master basic derivatives.'
    },
    {
      id: 'ch2',
      name: 'Chapter 2: The Integral Library',
      description: 'Ancient books hold the secrets of integration. Use your knowledge to climb to the upper floors.'
    },
    {
      id: 'ch3',
      name: 'Chapter 3: The Chamber of Limits',
      description: 'The path narrows. Only precise understanding of limits will see you through.'
    },
    {
      id: 'ch4',
      name: 'Chapter 4: The Throne Room',
      description: 'The Derivative Crown awaits! Face the final challenge.'
    }
  ]
}

// Story Scenes - Each scene represents a stage in the adventure
export const STORY_SCENES: StoryScene[] = [
  // Chapter 1, Scene 1: The Great Gap
  {
    id: 'ch1-s1',
    title: 'The Great Gap',
    narration: 'You stand at the entrance of the Haunted Mansion. A wide gap separates you from the grand doorway. To cross it, you must calculate the perfect jump trajectory...',
    backgroundDescription: 'dark-entrance',
    spiderPosition: { x: 100, y: 400 },
    obstacles: [
      { id: 'gap1', type: 'gap', x: 250, y: 0, width: 200, height: 600, description: 'A deep chasm' },
      { id: 'platform1', type: 'platform', x: 450, y: 380, width: 150, height: 20, description: 'Landing platform' }
    ],
    goal: { x: 500, y: 350, description: 'The mansion entrance' },
    questionType: 'jump'
  },
  
  // Chapter 1, Scene 2: The Web Bridge
  {
    id: 'ch1-s2',
    title: 'The Chandelier Crossing',
    narration: 'Inside the entrance hall, a magnificent chandelier hangs from the ceiling. You need to shoot a web to swing across to the marble staircase.',
    backgroundDescription: 'chandelier-hall',
    spiderPosition: { x: 100, y: 300 },
    obstacles: [
      { id: 'chandelier', type: 'web-point', x: 400, y: 100, description: 'Crystal chandelier' },
      { id: 'gap2', type: 'gap', x: 200, y: 0, width: 300, height: 600, description: 'Open hall' },
      { id: 'stairs', type: 'platform', x: 550, y: 350, width: 200, height: 100, description: 'Marble staircase' }
    ],
    goal: { x: 600, y: 320, description: 'The staircase to the library' },
    questionType: 'web'
  },
  
  // Chapter 1, Scene 3: The Derivative Door
  {
    id: 'ch1-s3',
    title: 'The Locked Door',
    narration: 'A mysterious door blocks your path. An ancient inscription reads: "Only those who understand the rate of change may pass..." You must solve the derivative riddle to proceed.',
    backgroundDescription: 'locked-door',
    spiderPosition: { x: 100, y: 400 },
    obstacles: [
      { id: 'door', type: 'wall', x: 400, y: 0, width: 50, height: 500, description: 'Locked mathematical door' },
      { id: 'platform2', type: 'platform', x: 500, y: 380, width: 200, height: 20, description: 'Beyond the door' }
    ],
    goal: { x: 550, y: 350, description: 'Library entrance' },
    questionType: 'jump'
  },
  
  // Chapter 2, Scene 1: The Book Towers
  {
    id: 'ch2-s1',
    title: 'The Towering Shelves',
    narration: 'The library stretches upward endlessly. Ancient calculus texts are stacked in towers. You must calculate the area under the curve to find the right path upward.',
    backgroundDescription: 'library-shelves',
    spiderPosition: { x: 100, y: 500 },
    obstacles: [
      { id: 'shelf1', type: 'platform', x: 200, y: 450, width: 100, height: 15, description: 'Book stack' },
      { id: 'shelf2', type: 'platform', x: 350, y: 380, width: 100, height: 15, description: 'Book stack' },
      { id: 'shelf3', type: 'platform', x: 500, y: 300, width: 120, height: 15, description: 'Top shelf' }
    ],
    goal: { x: 550, y: 270, description: 'The upper balcony' },
    questionType: 'jump'
  },
  
  // Chapter 2, Scene 2: The Integral Inscription
  {
    id: 'ch2-s2',
    title: 'The Ancient Scroll',
    narration: 'On the balcony, you find a scroll with an integration problem. Solving it will reveal where to shoot your web to reach the secret passage.',
    backgroundDescription: 'scroll-room',
    spiderPosition: { x: 100, y: 300 },
    obstacles: [
      { id: 'anchor1', type: 'web-point', x: 350, y: 150, description: 'Ceiling beam' },
      { id: 'anchor2', type: 'web-point', x: 550, y: 100, description: 'Iron hook' },
      { id: 'passage', type: 'platform', x: 650, y: 280, width: 100, height: 20, description: 'Secret passage' }
    ],
    goal: { x: 680, y: 260, description: 'The hidden corridor' },
    questionType: 'web'
  },
  
  // Chapter 3, Scene 1: The Narrow Ledge
  {
    id: 'ch3-s1',
    title: 'The Precipice of Limits',
    narration: 'You emerge onto a narrow ledge high above a bottomless pit. Small platforms appear and disappear... approaching a limit. Calculate carefully to jump at the precise moment!',
    backgroundDescription: 'narrow-ledge',
    spiderPosition: { x: 80, y: 350 },
    obstacles: [
      { id: 'ledge1', type: 'platform', x: 220, y: 340, width: 70, height: 12, description: 'Fading platform' },
      { id: 'ledge2', type: 'platform', x: 370, y: 360, width: 70, height: 12, description: 'Fading platform' },
      { id: 'ledge3', type: 'platform', x: 520, y: 330, width: 90, height: 12, description: 'Stable ledge' }
    ],
    goal: { x: 560, y: 310, description: 'Safe ground' },
    questionType: 'jump'
  },
  
  // Chapter 4: The Final Challenge
  {
    id: 'ch4-s1',
    title: 'The Throne Room',
    narration: 'The Derivative Crown sits upon a pedestal in the center of the throne room. But to reach it, you must demonstrate mastery of all calculus concepts. The path requires both perfect jumps and precise web shots.',
    backgroundDescription: 'throne-room',
    spiderPosition: { x: 100, y: 450 },
    obstacles: [
      { id: 'pillar1', type: 'platform', x: 250, y: 400, width: 60, height: 15, description: 'Stone pillar' },
      { id: 'web-pillar', type: 'web-point', x: 400, y: 250, description: 'Hanging torch' },
      { id: 'pillar2', type: 'platform', x: 500, y: 380, width: 80, height: 15, description: 'Stone pillar' },
      { id: 'pedestal', type: 'platform', x: 650, y: 350, width: 100, height: 40, description: 'Crown pedestal' }
    ],
    goal: { x: 700, y: 320, description: 'THE DERIVATIVE CROWN!' },
    questionType: 'jump'
  }
]

// Adventure Questions - Questions that fit the story context
export const ADVENTURE_QUESTIONS: AdventureQuestion[] = [
  // Jump-based questions (motion, derivatives of position)
  {
    id: 'jump-1',
    text: 'To calculate the jump trajectory, what is the derivative of position with respect to time?',
    options: [
      { text: 'A) Velocity', correct: true, action: 'jump' },
      { text: 'B) Acceleration', correct: false, action: 'jump' },
      { text: 'C) Distance', correct: false, action: 'jump' },
      { text: 'D) Force', correct: false, action: 'jump' }
    ],
    hint: 'Position → Velocity → Acceleration (each derivative)',
    concept: 'derivatives of motion',
    storyContext: 'Understanding velocity helps calculate the perfect jump arc!'
  },
  
  {
    id: 'jump-2',
    text: 'If your position is s(t) = 5t², what is your velocity at t = 2 seconds?',
    options: [
      { text: 'A) 20', correct: true, action: 'jump' },
      { text: 'B) 10', correct: false, action: 'jump' },
      { text: 'C) 5', correct: false, action: 'jump' },
      { text: 'D) 40', correct: false, action: 'jump' }
    ],
    hint: 'v(t) = s\'(t) = 10t, so v(2) = 20',
    concept: 'derivative calculation',
    storyContext: 'This determines your jumping speed!'
  },
  
  {
    id: 'jump-3',
    text: 'A parabolic jump follows f(x) = -x² + 4x. What is the maximum height reached?',
    options: [
      { text: 'A) 4', correct: true, action: 'jump' },
      { text: 'B) 2', correct: false, action: 'jump' },
      { text: 'C) 8', correct: false, action: 'jump' },
      { text: 'D) 0', correct: false, action: 'jump' }
    ],
    hint: 'Find where f\'(x) = 0: -2x + 4 = 0 → x = 2, then f(2) = 4',
    concept: 'finding maxima',
    storyContext: 'Know your peak height to clear the obstacle!'
  },
  
  {
    id: 'jump-4',
    text: 'What is the slope of y = 3x + 1 at any point?',
    options: [
      { text: 'A) 3', correct: true, action: 'jump' },
      { text: 'B) 1', correct: false, action: 'jump' },
      { text: 'C) 4', correct: false, action: 'jump' },
      { text: 'D) 0', correct: false, action: 'jump' }
    ],
    hint: 'The derivative of a linear function is its slope (constant)',
    concept: 'slope as derivative',
    storyContext: 'A constant slope means a steady jump angle!'
  },
  
  // Web-shooting questions (angles, trigonometry, vectors)
  {
    id: 'web-1',
    text: 'To shoot your web at the correct angle, calculate: what is sin(30°)?',
    options: [
      { text: 'A) 0.5', correct: true, action: 'web' },
      { text: 'B) 0.866', correct: false, action: 'web' },
      { text: 'C) 1', correct: false, action: 'web' },
      { text: 'D) 0.707', correct: false, action: 'web' }
    ],
    hint: 'sin(30°) = 1/2 = 0.5',
    concept: 'trigonometric values',
    storyContext: 'The web angle determines where you swing!'
  },
  
  {
    id: 'web-2',
    text: 'Your web follows the curve y = cos(x). What is its derivative at x = 0?',
    options: [
      { text: 'A) 0', correct: true, action: 'web' },
      { text: 'B) 1', correct: false, action: 'web' },
      { text: 'C) -1', correct: false, action: 'web' },
      { text: 'D) cos(0)', correct: false, action: 'web' }
    ],
    hint: 'd/dx[cos(x)] = -sin(x), and sin(0) = 0',
    concept: 'trigonometric derivatives',
    storyContext: 'The web tension at the attachment point!'
  },
  
  {
    id: 'web-3',
    text: 'To calculate web length to point (3, 4) from origin, use:',
    options: [
      { text: 'A) √(3² + 4²) = 5', correct: true, action: 'web' },
      { text: 'B) 3 + 4 = 7', correct: false, action: 'web' },
      { text: 'C) 3 × 4 = 12', correct: false, action: 'web' },
      { text: 'D) 4 - 3 = 1', correct: false, action: 'web' }
    ],
    hint: 'Distance formula: √(Δx² + Δy²)',
    concept: 'distance formula',
    storyContext: 'Do you have enough web to reach?'
  },
  
  {
    id: 'web-4',
    text: 'The web\'s tension follows T(x) = x² + 2x. At x = 3, how fast is tension changing?',
    options: [
      { text: 'A) 8', correct: true, action: 'web' },
      { text: 'B) 15', correct: false, action: 'web' },
      { text: 'C) 6', correct: false, action: 'web' },
      { text: 'D) 2', correct: false, action: 'web' }
    ],
    hint: 'T\'(x) = 2x + 2, so T\'(3) = 8',
    concept: 'rate of change',
    storyContext: 'Will the web hold under increasing tension?'
  },
  
  // Mixed advanced questions
  {
    id: 'adv-1',
    text: 'The integral ∫₀² 2x dx equals:',
    options: [
      { text: 'A) 4', correct: true, action: 'jump' },
      { text: 'B) 2', correct: false, action: 'jump' },
      { text: 'C) 8', correct: false, action: 'jump' },
      { text: 'D) 0', correct: false, action: 'jump' }
    ],
    hint: '∫2x dx = x² |₀² = 4 - 0 = 4',
    concept: 'definite integral',
    storyContext: 'Calculate the area under the curve to find safe landing zones!'
  },
  
  {
    id: 'adv-2',
    text: 'What is the limit: lim(x→0) [sin(x)/x]?',
    options: [
      { text: 'A) 1', correct: true, action: 'web' },
      { text: 'B) 0', correct: false, action: 'web' },
      { text: 'C) ∞', correct: false, action: 'web' },
      { text: 'D) undefined', correct: false, action: 'web' }
    ],
    hint: 'This is a fundamental limit in calculus',
    concept: 'limits',
    storyContext: 'As platforms fade, approach the limit carefully!'
  },
  
  {
    id: 'adv-3',
    text: 'Using the chain rule, d/dx[sin(2x)] equals:',
    options: [
      { text: 'A) 2cos(2x)', correct: true, action: 'web' },
      { text: 'B) cos(2x)', correct: false, action: 'web' },
      { text: 'C) 2sin(2x)', correct: false, action: 'web' },
      { text: 'D) -2cos(2x)', correct: false, action: 'web' }
    ],
    hint: 'Chain rule: outer derivative × inner derivative',
    concept: 'chain rule',
    storyContext: 'Complex webs require the chain rule!'
  }
]

// Helper function to get questions for a specific scene
export function getQuestionsForScene(sceneId: string): AdventureQuestion[] {
  const scene = STORY_SCENES.find(s => s.id === sceneId)
  if (!scene) return []
  
  // Filter questions by action type
  return ADVENTURE_QUESTIONS.filter(q => 
    q.options.some(opt => opt.action === scene.questionType)
  )
}

// Helper to get current scene
export function getScene(sceneId: string): StoryScene | null {
  return STORY_SCENES.find(s => s.id === sceneId) || null
}

// Get next scene in progression
export function getNextScene(currentSceneId: string): StoryScene | null {
  const currentIndex = STORY_SCENES.findIndex(s => s.id === currentSceneId)
  if (currentIndex === -1 || currentIndex === STORY_SCENES.length - 1) return null
  return STORY_SCENES[currentIndex + 1]
}

