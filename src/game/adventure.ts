/**
 * Adventure Mode - Story-driven platformer with calculus puzzles
 * "The Calculus Chronicles: Spider's Quest"
 */

import type { AdventureQuestion } from './gameTypes'

export type AdventureScene = {
  id: string
  name: string
  chapter: number
  description: string
  storyContext: string
  background: string
  platforms: Platform[]
  webPoints: WebPoint[]
  obstacles: Obstacle[]
  goal: { x: number; y: number }
  music?: string
  ambientSounds?: string[]
}

export type Platform = {
  x: number
  y: number
  width: number
  height: number
  type: 'solid' | 'moving' | 'fading' | 'bouncy'
  color?: number
  texture?: string
}

export type WebPoint = {
  x: number
  y: number
  radius: number
  color: number
  glowColor: number
}

export type Obstacle = {
  x: number
  y: number
  width: number
  height: number
  type: 'spike' | 'fire' | 'ice' | 'electric' | 'void'
  damage: number
  color: number
}

export type Chapter = {
  id: number
  name: string
  description: string
  theme: string
  color: string
  scenes: string[]
}

/**
 * The Calculus Chronicles - Story Structure
 */
export const ADVENTURE_CHAPTERS: Chapter[] = [
  {
    id: 1,
    name: "The Entrance Hall",
    description: "Master basic derivatives and enter the mansion",
    theme: "haunted-mansion",
    color: "#8b5cf6",
    scenes: ["ch1-s1", "ch1-s2", "ch1-s3"]
  },
  {
    id: 2,
    name: "The Integral Library",
    description: "Unlock integration secrets in ancient texts",
    theme: "mystical-library",
    color: "#f59e0b",
    scenes: ["ch2-s1", "ch2-s2"]
  },
  {
    id: 3,
    name: "The Chamber of Limits",
    description: "Navigate precise limit calculations",
    theme: "crystal-chamber",
    color: "#06b6d4",
    scenes: ["ch3-s1"]
  },
  {
    id: 4,
    name: "The Throne Room",
    description: "Face the final calculus challenge",
    theme: "royal-throne",
    color: "#ef4444",
    scenes: ["ch4-s1"]
  }
]

/**
 * Adventure Scenes - 7 Unique Levels
 */
export const ADVENTURE_SCENES: Record<string, AdventureScene> = {
  // CHAPTER 1: THE ENTRANCE HALL
  "ch1-s1": {
    id: "ch1-s1",
    name: "The Great Gap",
    chapter: 1,
    description: "First jump across mansion entrance",
    storyContext: "You stand before the imposing Haunted Mansion of Functions. A massive chasm blocks your path to the entrance. Ancient calculus runes glow on the stone pillars, hinting at the mathematical secrets within. To cross this gap, you must master the art of derivatives - the foundation of all calculus magic.",
    background: "haunted-mansion-entrance",
    platforms: [
      { x: 50, y: 500, width: 120, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 200, y: 450, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 350, y: 400, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 500, y: 350, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 650, y: 300, width: 120, height: 20, type: 'solid', color: 0x8b5cf6 }
    ],
    webPoints: [
      { x: 300, y: 200, radius: 15, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 450, y: 150, radius: 15, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 150, y: 480, width: 20, height: 20, type: 'spike', damage: 1, color: 0xff0000 },
      { x: 300, y: 430, width: 20, height: 20, type: 'spike', damage: 1, color: 0xff0000 }
    ],
    goal: { x: 700, y: 280 },
    music: "haunted-mansion-theme",
    ambientSounds: ["wind", "creaking"]
  },

  "ch1-s2": {
    id: "ch1-s2",
    name: "The Chandelier Crossing",
    chapter: 1,
    description: "Web swing across grand hall",
    storyContext: "Inside the mansion's grand hall, massive crystal chandeliers hang from impossibly high ceilings. Their mathematical patterns shift and change, creating a web-swinging challenge that tests your understanding of trigonometric functions. Each chandelier represents a different angle calculation - master them to reach the library beyond.",
    background: "grand-hall-chandeliers",
    platforms: [
      { x: 100, y: 500, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 300, y: 400, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 500, y: 300, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 700, y: 200, width: 80, height: 20, type: 'solid', color: 0xf59e0b }
    ],
    webPoints: [
      { x: 200, y: 100, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 400, y: 80, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 600, y: 60, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 750, y: 40, radius: 20, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 250, y: 380, width: 30, height: 20, type: 'fire', damage: 1, color: 0xff4500 },
      { x: 450, y: 280, width: 30, height: 20, type: 'fire', damage: 1, color: 0xff4500 }
    ],
    goal: { x: 750, y: 180 },
    music: "grand-hall-music",
    ambientSounds: ["crystal-chimes", "echoing-steps"]
  },

  "ch1-s3": {
    id: "ch1-s3",
    name: "The Locked Door",
    chapter: 1,
    description: "Derivative puzzle gate",
    storyContext: "A massive door blocks your path to the library, covered in glowing mathematical symbols. The ancient lock requires you to solve derivative puzzles to unlock each mechanism. The door's guardians - ethereal calculus spirits - watch as you work through the chain rule and product rule challenges that will grant you passage.",
    background: "mystical-door-chamber",
    platforms: [
      { x: 150, y: 500, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 300, y: 450, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 450, y: 400, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 },
      { x: 600, y: 350, width: 100, height: 20, type: 'solid', color: 0x8b5cf6 }
    ],
    webPoints: [
      { x: 250, y: 200, radius: 18, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 400, y: 150, radius: 18, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 550, y: 100, radius: 18, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 200, y: 480, width: 25, height: 20, type: 'electric', damage: 1, color: 0x00ffff },
      { x: 350, y: 430, width: 25, height: 20, type: 'electric', damage: 1, color: 0x00ffff },
      { x: 500, y: 380, width: 25, height: 20, type: 'electric', damage: 1, color: 0x00ffff }
    ],
    goal: { x: 650, y: 330 },
    music: "mystical-chamber",
    ambientSounds: ["magical-humming", "door-creaking"]
  },

  // CHAPTER 2: THE INTEGRAL LIBRARY
  "ch2-s1": {
    id: "ch2-s1",
    name: "The Towering Shelves",
    chapter: 2,
    description: "Climb book stacks with jumps",
    storyContext: "The Integral Library stretches infinitely upward, its shelves filled with ancient calculus tomes that float and rearrange themselves. Each book contains integration secrets, and the shelves themselves are mathematical constructs that respond to your understanding of area under curves. Leap between floating platforms as you climb toward the Ancient Scroll.",
    background: "floating-library",
    platforms: [
      { x: 100, y: 500, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 200, y: 400, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 300, y: 300, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 400, y: 200, width: 80, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 500, y: 100, width: 80, height: 20, type: 'solid', color: 0xf59e0b }
    ],
    webPoints: [
      { x: 150, y: 50, radius: 16, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 250, y: 30, radius: 16, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 350, y: 10, radius: 16, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 180, y: 380, width: 20, height: 20, type: 'ice', damage: 1, color: 0x87ceeb },
      { x: 280, y: 280, width: 20, height: 20, type: 'ice', damage: 1, color: 0x87ceeb },
      { x: 380, y: 180, width: 20, height: 20, type: 'ice', damage: 1, color: 0x87ceeb }
    ],
    goal: { x: 540, y: 80 },
    music: "library-ambience",
    ambientSounds: ["page-turning", "floating-books"]
  },

  "ch2-s2": {
    id: "ch2-s2",
    name: "The Ancient Scroll",
    chapter: 2,
    description: "Integration web puzzle",
    storyContext: "At the heart of the library lies the Ancient Scroll of Integration, protected by a complex web of mathematical equations. The scroll floats in a chamber where the very air is filled with Riemann sum rectangles that shift and transform. To reach it, you must master the fundamental theorem of calculus and understand how derivatives and integrals are inverse operations.",
    background: "scroll-chamber",
    platforms: [
      { x: 200, y: 500, width: 100, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 400, y: 400, width: 100, height: 20, type: 'solid', color: 0xf59e0b },
      { x: 600, y: 300, width: 100, height: 20, type: 'solid', color: 0xf59e0b }
    ],
    webPoints: [
      { x: 300, y: 250, radius: 22, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 500, y: 150, radius: 22, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 650, y: 50, radius: 22, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 350, y: 380, width: 30, height: 20, type: 'void', damage: 2, color: 0x000000 },
      { x: 550, y: 280, width: 30, height: 20, type: 'void', damage: 2, color: 0x000000 }
    ],
    goal: { x: 650, y: 280 },
    music: "ancient-scroll-theme",
    ambientSounds: ["magical-whispers", "scroll-rustling"]
  },

  // CHAPTER 3: THE CHAMBER OF LIMITS
  "ch3-s1": {
    id: "ch3-s1",
    name: "The Precipice of Limits",
    chapter: 3,
    description: "Fading platforms",
    storyContext: "The Chamber of Limits is a realm where reality itself approaches infinity. Platforms fade in and out of existence, their stability dependent on your understanding of limit calculations. As you approach the boundary between finite and infinite, each step requires precise mathematical reasoning. The very air shimmers with approaching values and epsilon-delta proofs.",
    background: "limit-chamber",
    platforms: [
      { x: 100, y: 500, width: 80, height: 20, type: 'fading', color: 0x06b6d4 },
      { x: 200, y: 400, width: 80, height: 20, type: 'fading', color: 0x06b6d4 },
      { x: 300, y: 300, width: 80, height: 20, type: 'fading', color: 0x06b6d4 },
      { x: 400, y: 200, width: 80, height: 20, type: 'fading', color: 0x06b6d4 },
      { x: 500, y: 100, width: 80, height: 20, type: 'fading', color: 0x06b6d4 },
      { x: 600, y: 50, width: 80, height: 20, type: 'solid', color: 0x06b6d4 }
    ],
    webPoints: [
      { x: 150, y: 50, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 250, y: 30, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 350, y: 10, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 450, y: -10, radius: 20, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 550, y: -30, radius: 20, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 250, y: 380, width: 20, height: 20, type: 'void', damage: 3, color: 0x000000 },
      { x: 350, y: 280, width: 20, height: 20, type: 'void', damage: 3, color: 0x000000 },
      { x: 450, y: 180, width: 20, height: 20, type: 'void', damage: 3, color: 0x000000 }
    ],
    goal: { x: 640, y: 30 },
    music: "limit-chamber-theme",
    ambientSounds: ["reality-distortion", "approaching-infinity"]
  },

  // CHAPTER 4: THE THRONE ROOM
  "ch4-s1": {
    id: "ch4-s1",
    name: "The Throne Room",
    chapter: 4,
    description: "Final challenge for the crown",
    storyContext: "The Throne Room of Calculus awaits - a magnificent chamber where the legendary Derivative Crown rests upon a throne of mathematical symbols. This is the ultimate test of your calculus mastery. The crown itself is protected by the most complex mathematical challenges, requiring synthesis of all concepts: derivatives, integrals, limits, and their applications. Prove yourself worthy to claim the crown and become the Master of Calculus!",
    background: "royal-throne-room",
    platforms: [
      { x: 150, y: 500, width: 100, height: 20, type: 'solid', color: 0xef4444 },
      { x: 300, y: 400, width: 100, height: 20, type: 'solid', color: 0xef4444 },
      { x: 450, y: 300, width: 100, height: 20, type: 'solid', color: 0xef4444 },
      { x: 600, y: 200, width: 100, height: 20, type: 'solid', color: 0xef4444 },
      { x: 700, y: 100, width: 120, height: 20, type: 'solid', color: 0xffd700 }
    ],
    webPoints: [
      { x: 250, y: 150, radius: 25, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 400, y: 100, radius: 25, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 550, y: 50, radius: 25, color: 0xffd700, glowColor: 0xffaa00 },
      { x: 700, y: 0, radius: 30, color: 0xffd700, glowColor: 0xffaa00 }
    ],
    obstacles: [
      { x: 200, y: 480, width: 30, height: 20, type: 'fire', damage: 2, color: 0xff4500 },
      { x: 350, y: 380, width: 30, height: 20, type: 'electric', damage: 2, color: 0x00ffff },
      { x: 500, y: 280, width: 30, height: 20, type: 'ice', damage: 2, color: 0x87ceeb },
      { x: 650, y: 180, width: 30, height: 20, type: 'void', damage: 3, color: 0x000000 }
    ],
    goal: { x: 750, y: 80 },
    music: "throne-room-epic",
    ambientSounds: ["royal-fanfare", "crown-glow"]
  }
}

/**
 * Adventure Questions - Story-integrated calculus problems
 */
export const ADVENTURE_QUESTIONS: AdventureQuestion[] = [
  // CHAPTER 1 QUESTIONS
  {
    id: "ch1-q1",
    text: "To calculate the jump trajectory across the mansion entrance, what is the derivative of position s(t) = 5t²?",
    options: [
      { text: "A) 10t", correct: true, action: "jump" },
      { text: "B) 5t", correct: false, action: "jump" },
      { text: "C) 10t²", correct: false, action: "jump" },
      { text: "D) 5t²", correct: false, action: "jump" }
    ],
    hint: "Use the power rule: d/dt[tⁿ] = n·tⁿ⁻¹",
    concept: "Power Rule for Derivatives",
    storyContext: "The mansion's entrance requires precise jump calculations. Master the power rule to leap across the chasm!"
  },
  {
    id: "ch1-q2",
    text: "To swing between chandeliers, calculate the angle for optimal web trajectory: sin(30°)?",
    options: [
      { text: "A) 0.5", correct: true, action: "web" },
      { text: "B) 0.866", correct: false, action: "web" },
      { text: "C) 1.0", correct: false, action: "web" },
      { text: "D) 0.707", correct: false, action: "web" }
    ],
    hint: "Remember the unit circle: sin(30°) = 1/2 = 0.5",
    concept: "Trigonometric Values",
    storyContext: "The crystal chandeliers require precise angular calculations for web swinging. Know your trig values!"
  },
  {
    id: "ch1-q3",
    text: "To unlock the door, find the derivative of f(x) = x³ + 2x² using the power rule:",
    options: [
      { text: "A) 3x² + 4x", correct: true, action: "jump" },
      { text: "B) 3x² + 2x", correct: false, action: "jump" },
      { text: "C) x² + 4x", correct: false, action: "jump" },
      { text: "D) 3x + 4x", correct: false, action: "jump" }
    ],
    hint: "Apply power rule to each term: d/dx[x³] = 3x², d/dx[2x²] = 4x",
    concept: "Power Rule with Multiple Terms",
    storyContext: "The mystical door's lock responds to derivative calculations. Apply the power rule to each term!"
  },

  // CHAPTER 2 QUESTIONS
  {
    id: "ch2-q1",
    text: "To climb the floating shelves, calculate the area under f(x) = 2x from x=0 to x=3:",
    options: [
      { text: "A) 9", correct: true, action: "jump" },
      { text: "B) 6", correct: false, action: "jump" },
      { text: "C) 12", correct: false, action: "jump" },
      { text: "D) 18", correct: false, action: "jump" }
    ],
    hint: "Use the integral: ∫₀³ 2x dx = [x²]₀³ = 9 - 0 = 9",
    concept: "Definite Integrals",
    storyContext: "The floating library shelves respond to integration calculations. Find the area under the curve!"
  },
  {
    id: "ch2-q2",
    text: "To reach the Ancient Scroll, calculate the antiderivative of f(x) = 3x²:",
    options: [
      { text: "A) x³ + C", correct: true, action: "web" },
      { text: "B) 3x³ + C", correct: false, action: "web" },
      { text: "C) 6x + C", correct: false, action: "web" },
      { text: "D) x² + C", correct: false, action: "web" }
    ],
    hint: "Use the power rule for integration: ∫xⁿdx = xⁿ⁺¹/(n+1) + C",
    concept: "Antiderivatives",
    storyContext: "The Ancient Scroll requires mastery of antiderivatives. Remember the integration power rule!"
  },

  // CHAPTER 3 QUESTIONS
  {
    id: "ch3-q1",
    text: "To navigate the fading platforms, find lim(x→0) [sin(x)/x]:",
    options: [
      { text: "A) 1", correct: true, action: "jump" },
      { text: "B) 0", correct: false, action: "jump" },
      { text: "C) ∞", correct: false, action: "jump" },
      { text: "D) Does not exist", correct: false, action: "jump" }
    ],
    hint: "This is a fundamental trigonometric limit: lim(x→0) [sin(x)/x] = 1",
    concept: "Fundamental Trigonometric Limits",
    storyContext: "The Chamber of Limits tests your understanding of approaching values. Master the fundamental limits!"
  },

  // CHAPTER 4 QUESTIONS
  {
    id: "ch4-q1",
    text: "To claim the Derivative Crown, find d/dx [sin(2x)] using the chain rule:",
    options: [
      { text: "A) 2cos(2x)", correct: true, action: "web" },
      { text: "B) cos(2x)", correct: false, action: "web" },
      { text: "C) 2sin(2x)", correct: false, action: "web" },
      { text: "D) sin(2x)", correct: false, action: "web" }
    ],
    hint: "Chain rule: derivative of outer function × derivative of inner function",
    concept: "Chain Rule",
    storyContext: "The final challenge requires mastery of the chain rule. Prove yourself worthy of the crown!"
  },
  {
    id: "ch4-q2",
    text: "The crown's final test: What is ∫ cos(x) dx?",
    options: [
      { text: "A) sin(x) + C", correct: true, action: "jump" },
      { text: "B) -sin(x) + C", correct: false, action: "jump" },
      { text: "C) cos(x) + C", correct: false, action: "jump" },
      { text: "D) -cos(x) + C", correct: false, action: "jump" }
    ],
    hint: "The antiderivative of cosine is sine",
    concept: "Integrals of Trigonometric Functions",
    storyContext: "The crown's ultimate test combines all calculus knowledge. Master trigonometric integration!"
  }
]

/**
 * Get question by scene ID
 */
export function getQuestionByScene(sceneId: string): AdventureQuestion {
  const sceneQuestions = ADVENTURE_QUESTIONS.filter(q => q.id.startsWith(sceneId.split('-')[0] + '-' + sceneId.split('-')[1]))
  if (sceneQuestions.length === 0) {
    return ADVENTURE_QUESTIONS[Math.floor(Math.random() * ADVENTURE_QUESTIONS.length)]
  }
  return sceneQuestions[Math.floor(Math.random() * sceneQuestions.length)]
}

/**
 * Get scene by ID
 */
export function getSceneById(sceneId: string): AdventureScene | null {
  return ADVENTURE_SCENES[sceneId] || null
}

/**
 * Get chapter by ID
 */
export function getChapterById(chapterId: number): Chapter | null {
  return ADVENTURE_CHAPTERS.find(c => c.id === chapterId) || null
}

/**
 * Get next scene in progression
 */
export function getNextScene(currentSceneId: string): string | null {
  const sceneOrder = [
    "ch1-s1", "ch1-s2", "ch1-s3",
    "ch2-s1", "ch2-s2",
    "ch3-s1",
    "ch4-s1"
  ]
  
  const currentIndex = sceneOrder.indexOf(currentSceneId)
  if (currentIndex === -1 || currentIndex === sceneOrder.length - 1) {
    return null // No next scene
  }
  
  return sceneOrder[currentIndex + 1]
}

/**
 * Check if scene is completed (reached goal)
 */
export function isSceneCompleted(sceneId: string, playerX: number, playerY: number): boolean {
  const scene = getSceneById(sceneId)
  if (!scene) return false
  
  const goal = scene.goal
  const distance = Math.sqrt((playerX - goal.x) ** 2 + (playerY - goal.y) ** 2)
  
  return distance < 50 // Within 50 pixels of goal
}
