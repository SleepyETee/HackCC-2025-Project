/**
 * Calculus API - Based on Calculus Volume 1 Textbook
 * Provides question generation and validation for calculus concepts
 */

export type CalculusTopic = 
  | 'limits'
  | 'continuity'
  | 'derivatives'
  | 'chain-rule'
  | 'implicit-differentiation'
  | 'related-rates'
  | 'optimization'
  | 'integrals'
  | 'fundamental-theorem'
  | 'substitution'
  | 'integration-by-parts'

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert'

export interface CalculusQuestion {
  id: string
  topic: CalculusTopic
  difficulty: DifficultyLevel
  question: string
  options: Array<{
    text: string
    correct: boolean
    explanation?: string
  }>
  hint: string
  solution: string
  concept: string
  // Height-based difficulty (0-3000m maps to difficulty)
  recommendedHeight: number
}

/**
 * Calculus Volume 1 - Chapter Structure
 * Based on standard calculus textbook organization
 */
export const CALCULUS_CHAPTERS = {
  // Chapter 1: Functions and Graphs (0-300m)
  foundations: {
    range: [0, 300],
    topics: ['functions', 'graphs', 'transformations'],
    description: 'Functions, Graphs, and Basic Concepts'
  },
  
  // Chapter 2: Limits (300-600m)
  limits: {
    range: [300, 600],
    topics: ['limits', 'continuity', 'asymptotes'],
    description: 'Limits and Continuity'
  },
  
  // Chapter 3: Derivatives (600-1200m)
  derivatives: {
    range: [600, 1200],
    topics: ['derivatives', 'power-rule', 'product-rule', 'quotient-rule'],
    description: 'The Derivative'
  },
  
  // Chapter 4: Applications of Derivatives (1200-1800m)
  derivativeApplications: {
    range: [1200, 1800],
    topics: ['chain-rule', 'implicit-differentiation', 'related-rates', 'optimization'],
    description: 'Applications of Derivatives'
  },
  
  // Chapter 5: Integration (1800-2400m)
  integration: {
    range: [1800, 2400],
    topics: ['integrals', 'fundamental-theorem', 'substitution'],
    description: 'Integration'
  },
  
  // Chapter 6: Advanced Integration (2400-3000m)
  advancedIntegration: {
    range: [2400, 3000],
    topics: ['integration-by-parts', 'partial-fractions', 'improper-integrals'],
    description: 'Techniques of Integration'
  }
}

/**
 * Question Bank - Progressive Difficulty Based on Height
 */
export const CALCULUS_QUESTION_BANK: CalculusQuestion[] = [
  // FOUNDATIONS (0-300m)
  {
    id: 'found-1',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 100,
    question: 'What is lim(x→2) [3x + 1]?',
    options: [
      { text: 'A) 7', correct: true, explanation: 'Direct substitution: 3(2) + 1 = 7' },
      { text: 'B) 6', correct: false },
      { text: 'C) 5', correct: false },
      { text: 'D) 3', correct: false }
    ],
    hint: 'For polynomial limits, you can substitute directly',
    solution: 'lim(x→2) [3x + 1] = 3(2) + 1 = 6 + 1 = 7',
    concept: 'Direct substitution for limits'
  },
  
  {
    id: 'found-2',
    topic: 'continuity',
    difficulty: 'easy',
    recommendedHeight: 200,
    question: 'Is f(x) = x² continuous at x = 3?',
    options: [
      { text: 'A) Yes', correct: true, explanation: 'Polynomials are continuous everywhere' },
      { text: 'B) No', correct: false },
      { text: 'C) Cannot be determined', correct: false },
      { text: 'D) Only from the left', correct: false }
    ],
    hint: 'Polynomial functions are continuous at all points',
    solution: 'All polynomial functions are continuous everywhere, so f(x) = x² is continuous at x = 3',
    concept: 'Continuity of polynomial functions'
  },
  
  // LIMITS (300-600m)
  {
    id: 'lim-1',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 400,
    question: 'What is lim(x→0) [sin(x)/x]?',
    options: [
      { text: 'A) 1', correct: true, explanation: 'Fundamental trigonometric limit' },
      { text: 'B) 0', correct: false },
      { text: 'C) ∞', correct: false },
      { text: 'D) Does not exist', correct: false }
    ],
    hint: 'This is one of the fundamental limits in calculus',
    solution: 'lim(x→0) [sin(x)/x] = 1 (fundamental trigonometric limit)',
    concept: 'Fundamental trigonometric limits'
  },
  
  {
    id: 'lim-2',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 500,
    question: 'What is lim(x→3) [(x² - 9)/(x - 3)]?',
    options: [
      { text: 'A) 6', correct: true, explanation: 'Factor and cancel: (x+3)(x-3)/(x-3) = x+3, then substitute' },
      { text: 'B) 3', correct: false },
      { text: 'C) 0', correct: false },
      { text: 'D) Undefined', correct: false }
    ],
    hint: 'Factor the numerator first: x² - 9 = (x+3)(x-3)',
    solution: 'Factor: (x² - 9)/(x - 3) = (x+3)(x-3)/(x-3) = x+3. Then lim(x→3) [x+3] = 6',
    concept: 'Limits by factoring'
  },
  
  // DERIVATIVES (600-1200m)
  {
    id: 'deriv-1',
    topic: 'derivatives',
    difficulty: 'easy',
    recommendedHeight: 700,
    question: 'What is d/dx [x³]?',
    options: [
      { text: 'A) 3x²', correct: true, explanation: 'Power rule: d/dx [xⁿ] = n·xⁿ⁻¹' },
      { text: 'B) x²', correct: false },
      { text: 'C) 3x', correct: false },
      { text: 'D) x³/3', correct: false }
    ],
    hint: 'Use the power rule: bring down the exponent and subtract 1',
    solution: 'd/dx [x³] = 3x³⁻¹ = 3x²',
    concept: 'Power rule for derivatives'
  },
  
  {
    id: 'deriv-2',
    topic: 'derivatives',
    difficulty: 'medium',
    recommendedHeight: 850,
    question: 'What is d/dx [sin(x)]?',
    options: [
      { text: 'A) cos(x)', correct: true, explanation: 'Standard derivative of sine' },
      { text: 'B) -cos(x)', correct: false },
      { text: 'C) sin(x)', correct: false },
      { text: 'D) -sin(x)', correct: false }
    ],
    hint: 'This is one of the basic trigonometric derivatives',
    solution: 'd/dx [sin(x)] = cos(x)',
    concept: 'Derivatives of trigonometric functions'
  },
  
  {
    id: 'deriv-3',
    topic: 'derivatives',
    difficulty: 'medium',
    recommendedHeight: 1000,
    question: 'Using the product rule, what is d/dx [x·sin(x)]?',
    options: [
      { text: 'A) sin(x) + x·cos(x)', correct: true, explanation: 'Product rule: (fg)\' = f\'g + fg\'' },
      { text: 'B) cos(x)', correct: false },
      { text: 'C) x·cos(x)', correct: false },
      { text: 'D) sin(x)', correct: false }
    ],
    hint: 'Product rule: (uv)\' = u\'v + uv\'',
    solution: 'd/dx [x·sin(x)] = (1)·sin(x) + x·cos(x) = sin(x) + x·cos(x)',
    concept: 'Product rule'
  },
  
  // CHAIN RULE & APPLICATIONS (1200-1800m)
  {
    id: 'chain-1',
    topic: 'chain-rule',
    difficulty: 'medium',
    recommendedHeight: 1300,
    question: 'What is d/dx [sin(2x)]?',
    options: [
      { text: 'A) 2cos(2x)', correct: true, explanation: 'Chain rule: outer derivative × inner derivative' },
      { text: 'B) cos(2x)', correct: false },
      { text: 'C) 2sin(2x)', correct: false },
      { text: 'D) sin(x)', correct: false }
    ],
    hint: 'Use chain rule: derivative of outer function times derivative of inner',
    solution: 'd/dx [sin(2x)] = cos(2x)·d/dx[2x] = cos(2x)·2 = 2cos(2x)',
    concept: 'Chain rule'
  },
  
  {
    id: 'chain-2',
    topic: 'chain-rule',
    difficulty: 'hard',
    recommendedHeight: 1500,
    question: 'What is d/dx [(x² + 1)³]?',
    options: [
      { text: 'A) 6x(x² + 1)²', correct: true, explanation: 'Chain rule with power rule' },
      { text: 'B) 3(x² + 1)²', correct: false },
      { text: 'C) 6x²(x² + 1)²', correct: false },
      { text: 'D) 3x²(x² + 1)²', correct: false }
    ],
    hint: 'Chain rule: bring down the 3, reduce power, multiply by derivative of inside',
    solution: 'd/dx [(x² + 1)³] = 3(x² + 1)²·d/dx[x² + 1] = 3(x² + 1)²·2x = 6x(x² + 1)²',
    concept: 'Chain rule with power rule'
  },
  
  {
    id: 'opt-1',
    topic: 'optimization',
    difficulty: 'hard',
    recommendedHeight: 1700,
    question: 'To maximize f(x) = -x² + 4x, find the critical point:',
    options: [
      { text: 'A) x = 2', correct: true, explanation: 'Set f\'(x) = 0: -2x + 4 = 0 → x = 2' },
      { text: 'B) x = 0', correct: false },
      { text: 'C) x = 4', correct: false },
      { text: 'D) x = -2', correct: false }
    ],
    hint: 'Find where the derivative equals zero',
    solution: 'f\'(x) = -2x + 4. Set equal to zero: -2x + 4 = 0 → x = 2',
    concept: 'Finding critical points for optimization'
  },
  
  // INTEGRATION (1800-2400m)
  {
    id: 'int-1',
    topic: 'integrals',
    difficulty: 'medium',
    recommendedHeight: 1900,
    question: 'What is ∫ 2x dx?',
    options: [
      { text: 'A) x² + C', correct: true, explanation: 'Power rule for integrals: ∫xⁿdx = xⁿ⁺¹/(n+1) + C' },
      { text: 'B) 2x² + C', correct: false },
      { text: 'C) x²/2 + C', correct: false },
      { text: 'D) 2x + C', correct: false }
    ],
    hint: 'Use the power rule for integration, don\'t forget the constant!',
    solution: '∫ 2x dx = 2·∫ x dx = 2·(x²/2) + C = x² + C',
    concept: 'Power rule for integration'
  },
  
  {
    id: 'int-2',
    topic: 'integrals',
    difficulty: 'medium',
    recommendedHeight: 2000,
    question: 'What is ∫ cos(x) dx?',
    options: [
      { text: 'A) sin(x) + C', correct: true, explanation: 'Antiderivative of cosine is sine' },
      { text: 'B) -sin(x) + C', correct: false },
      { text: 'C) cos(x) + C', correct: false },
      { text: 'D) -cos(x) + C', correct: false }
    ],
    hint: 'What function has derivative equal to cos(x)?',
    solution: '∫ cos(x) dx = sin(x) + C',
    concept: 'Integrals of trigonometric functions'
  },
  
  {
    id: 'ftc-1',
    topic: 'fundamental-theorem',
    difficulty: 'hard',
    recommendedHeight: 2200,
    question: 'What is ∫₀² 2x dx?',
    options: [
      { text: 'A) 4', correct: true, explanation: 'FTC: [x²]₀² = 4 - 0 = 4' },
      { text: 'B) 2', correct: false },
      { text: 'C) 8', correct: false },
      { text: 'D) 0', correct: false }
    ],
    hint: 'Find the antiderivative, then evaluate at bounds',
    solution: '∫₀² 2x dx = [x²]₀² = (2)² - (0)² = 4',
    concept: 'Fundamental Theorem of Calculus'
  },
  
  // ADVANCED INTEGRATION (2400-3000m)
  {
    id: 'sub-1',
    topic: 'substitution',
    difficulty: 'hard',
    recommendedHeight: 2500,
    question: 'Using u-substitution, ∫ 2x·cos(x²) dx requires u = ?',
    options: [
      { text: 'A) u = x²', correct: true, explanation: 'Let u = x², then du = 2x dx' },
      { text: 'B) u = 2x', correct: false },
      { text: 'C) u = cos(x²)', correct: false },
      { text: 'D) u = x', correct: false }
    ],
    hint: 'Look for a function whose derivative appears in the integral',
    solution: 'Let u = x², then du = 2x dx. The integral becomes ∫ cos(u) du = sin(u) + C = sin(x²) + C',
    concept: 'U-substitution method'
  },
  
  {
    id: 'parts-1',
    topic: 'integration-by-parts',
    difficulty: 'expert',
    recommendedHeight: 2700,
    question: 'For ∫ x·eˣ dx using integration by parts, choose u = ?',
    options: [
      { text: 'A) u = x', correct: true, explanation: 'Choose u as the polynomial (gets simpler when differentiated)' },
      { text: 'B) u = eˣ', correct: false },
      { text: 'C) u = x·eˣ', correct: false },
      { text: 'D) u = 1', correct: false }
    ],
    hint: 'Use LIATE: Logarithmic, Inverse trig, Algebraic, Trig, Exponential',
    solution: 'Let u = x (algebraic), dv = eˣ dx. Then ∫ x·eˣ dx = x·eˣ - ∫ eˣ dx = x·eˣ - eˣ + C',
    concept: 'Integration by parts'
  },
  
  {
    id: 'expert-1',
    topic: 'chain-rule',
    difficulty: 'expert',
    recommendedHeight: 2900,
    question: 'What is d/dx [ln(sin(x))]?',
    options: [
      { text: 'A) cot(x)', correct: true, explanation: 'Chain rule twice: (1/sin(x))·cos(x) = cot(x)' },
      { text: 'B) tan(x)', correct: false },
      { text: 'C) 1/sin(x)', correct: false },
      { text: 'D) cos(x)', correct: false }
    ],
    hint: 'Use chain rule: derivative of ln(u) is 1/u times derivative of u',
    solution: 'd/dx [ln(sin(x))] = (1/sin(x))·cos(x) = cos(x)/sin(x) = cot(x)',
    concept: 'Chain rule with logarithms and trig'
  }
]

/**
 * Get appropriate question based on current height
 */
export function getQuestionByHeight(height: number): CalculusQuestion {
  // Filter questions appropriate for this height range
  const appropriateQuestions = CALCULUS_QUESTION_BANK.filter(q => {
    const diff = Math.abs(q.recommendedHeight - height)
    return diff <= 400 // Questions within 400m of current height
  })
  
  if (appropriateQuestions.length === 0) {
    // Fallback to any question
    return CALCULUS_QUESTION_BANK[Math.floor(Math.random() * CALCULUS_QUESTION_BANK.length)]
  }
  
  // Return random from appropriate set
  return appropriateQuestions[Math.floor(Math.random() * appropriateQuestions.length)]
}

/**
 * Get chapter info based on height
 */
export function getChapterByHeight(height: number): { name: string; description: string } {
  for (const [name, chapter] of Object.entries(CALCULUS_CHAPTERS)) {
    const [min, max] = chapter.range
    if (height >= min && height < max) {
      return { name, description: chapter.description }
    }
  }
  return { name: 'advanced', description: 'Advanced Topics' }
}

/**
 * Calculate difficulty multiplier based on height
 */
export function getDifficultyMultiplier(height: number): number {
  // 0m = 1x, 3000m = 3x multiplier
  return 1 + (height / 3000) * 2
}

