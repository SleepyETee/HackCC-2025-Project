// Question bank organized by level

export type Question = {
  id: string
  text: string
  options: { text: string; correct: boolean }[]
  hint?: string
  concept: string
}

export type Level = {
  id: number
  name: string
  description: string
  requiredCurveMode: 'line' | 'quadratic' | 'sin' | 'exp'
  targetPulls: number
  questions: Question[]
}

export const LEVELS: Level[] = [
  {
    id: 0,
    name: 'Tutorial: Linear Basics',
    description: 'Learn about lines, slopes, and inequalities',
    requiredCurveMode: 'line',
    targetPulls: 5,
    questions: [
      {
        id: 'tut-1',
        text: 'What is the slope between points (0,0) and (2,4)?',
        options: [
          { text: 'A) 2', correct: true },
          { text: 'B) 4', correct: false },
          { text: 'C) 1', correct: false },
          { text: 'D) 0.5', correct: false },
        ],
        hint: 'Slope = (y₂-y₁)/(x₂-x₁) = (4-0)/(2-0) = 2',
        concept: 'slope calculation'
      },
      {
        id: 'tut-2',
        text: 'For y = 2x + 3, what is the y-intercept?',
        options: [
          { text: 'A) 2', correct: false },
          { text: 'B) 3', correct: true },
          { text: 'C) 5', correct: false },
          { text: 'D) 0', correct: false },
        ],
        hint: 'The y-intercept is the constant term b in y=mx+b',
        concept: 'intercept'
      },
      {
        id: 'tut-3',
        text: 'Which point satisfies y ≤ x + 1?',
        options: [
          { text: 'A) (2,4)', correct: false },
          { text: 'B) (1,2)', correct: true },
          { text: 'C) (0,5)', correct: false },
          { text: 'D) (3,5)', correct: false },
        ],
        hint: 'Test each point: for (1,2), 2 ≤ 1+1 = 2 ✓',
        concept: 'linear inequality'
      },
      {
        id: 'tut-4',
        text: 'A steeper line has a _____ absolute slope value.',
        options: [
          { text: 'A) larger', correct: true },
          { text: 'B) smaller', correct: false },
          { text: 'C) negative', correct: false },
          { text: 'D) zero', correct: false },
        ],
        concept: 'slope interpretation'
      },
      {
        id: 'tut-5',
        text: 'What happens to y = mx + b when m is negative?',
        options: [
          { text: 'A) Line slopes down', correct: true },
          { text: 'B) Line slopes up', correct: false },
          { text: 'C) Line is horizontal', correct: false },
          { text: 'D) Line is vertical', correct: false },
        ],
        concept: 'slope sign'
      }
    ]
  },
  {
    id: 1,
    name: 'Level 1: Linear Launch',
    description: 'Master lines and probability basics',
    requiredCurveMode: 'line',
    targetPulls: 4,
    questions: [
      {
        id: 'l1-1',
        text: 'Which line passes through (0,1) and (2,5)?',
        options: [
          { text: 'A) y = 2x + 1', correct: true },
          { text: 'B) y = x + 1', correct: false },
          { text: 'C) y = 3x', correct: false },
          { text: 'D) y = 2x', correct: false },
        ],
        concept: 'line from two points'
      },
      {
        id: 'l1-2',
        text: 'Setting the line to y = 0.5x + 2 makes anchors _____ the line more likely.',
        options: [
          { text: 'A) under', correct: true },
          { text: 'B) above', correct: false },
          { text: 'C) on', correct: false },
          { text: 'D) far from', correct: false },
        ],
        concept: 'inequality gating'
      },
      {
        id: 'l1-3',
        text: 'If you answer correctly, which anchors get boosted probability?',
        options: [
          { text: 'A) Safe ones under the line', correct: true },
          { text: 'B) All anchors equally', correct: false },
          { text: 'C) Hazards only', correct: false },
          { text: 'D) Random selection', correct: false },
        ],
        concept: 'probability mechanics'
      },
      {
        id: 'l1-4',
        text: 'For y = -x + 3, at x = 2, what is y?',
        options: [
          { text: 'A) 1', correct: true },
          { text: 'B) 5', correct: false },
          { text: 'C) -1', correct: false },
          { text: 'D) 3', correct: false },
        ],
        concept: 'function evaluation'
      }
    ]
  },
  {
    id: 2,
    name: 'Level 2: Curve Fit',
    description: 'Explore quadratic and sinusoidal functions',
    requiredCurveMode: 'quadratic',
    targetPulls: 4,
    questions: [
      {
        id: 'l2-1',
        text: 'For f(x) = x², what is f(3)?',
        options: [
          { text: 'A) 9', correct: true },
          { text: 'B) 6', correct: false },
          { text: 'C) 3', correct: false },
          { text: 'D) 12', correct: false },
        ],
        concept: 'quadratic evaluation'
      },
      {
        id: 'l2-2',
        text: "What is the derivative f'(x) of f(x) = x² at x = 1?",
        options: [
          { text: 'A) 2', correct: true },
          { text: 'B) 1', correct: false },
          { text: 'C) 0', correct: false },
          { text: 'D) 4', correct: false },
        ],
        hint: "f'(x) = 2x, so f'(1) = 2(1) = 2",
        concept: 'derivative'
      },
      {
        id: 'l2-3',
        text: 'Which function best fits a parabolic pattern?',
        options: [
          { text: 'A) Quadratic (x²)', correct: true },
          { text: 'B) Linear (mx+b)', correct: false },
          { text: 'C) Exponential (eˣ)', correct: false },
          { text: 'D) Constant', correct: false },
        ],
        concept: 'function recognition'
      },
      {
        id: 'l2-4',
        text: 'For f(x) = sin(x), what is the period?',
        options: [
          { text: 'A) 2π', correct: true },
          { text: 'B) π', correct: false },
          { text: 'C) 1', correct: false },
          { text: 'D) 360', correct: false },
        ],
        concept: 'trigonometric properties'
      }
    ]
  },
  {
    id: 3,
    name: 'Level 3: Risk & Reward',
    description: 'Master probability, entropy, and strategic thinking',
    requiredCurveMode: 'line',
    targetPulls: 3,
    questions: [
      {
        id: 'l3-1',
        text: 'Higher entropy in a probability distribution means:',
        options: [
          { text: 'A) More uncertainty', correct: true },
          { text: 'B) More certainty', correct: false },
          { text: 'C) Better score', correct: false },
          { text: 'D) Fewer options', correct: false },
        ],
        concept: 'entropy/uncertainty'
      },
      {
        id: 'l3-2',
        text: 'Which gives higher expected progress?',
        options: [
          { text: 'A) Favoring far forward anchors', correct: true },
          { text: 'B) Equal probability to all', correct: false },
          { text: 'C) Favoring nearby safe anchors', correct: false },
          { text: 'D) Random grappling', correct: false },
        ],
        concept: 'expected value'
      },
      {
        id: 'l3-3',
        text: 'Getting 3 correct answers in a row gives you a:',
        options: [
          { text: 'A) Combo multiplier', correct: true },
          { text: 'B) Extra pull', correct: false },
          { text: 'C) Shield', correct: false },
          { text: 'D) Nothing special', correct: false },
        ],
        concept: 'game mechanics'
      }
    ]
  }
]

// Get a random question from the current level's pool
export function getRandomQuestion(levelId: number, excludeIds: string[] = []): Question | null {
  const level = LEVELS.find(l => l.id === levelId)
  if (!level) return null
  
  const available = level.questions.filter(q => !excludeIds.includes(q.id))
  if (available.length === 0) return null
  
  return available[Math.floor(Math.random() * available.length)]
}

// Get level info
export function getLevel(levelId: number): Level | null {
  return LEVELS.find(l => l.id === levelId) || null
}

