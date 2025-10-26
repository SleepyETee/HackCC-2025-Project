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
      { text: '7', correct: true, explanation: 'Direct substitution: 3(2) + 1 = 7' },
      { text: '6', correct: false },
      { text: '5', correct: false },
      { text: '3', correct: false }
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
      { text: 'Yes', correct: true, explanation: 'Polynomials are continuous everywhere' },
      { text: 'No', correct: false },
      { text: 'Cannot be determined', correct: false },
      { text: 'Only from the left', correct: false }
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
      { text: '1', correct: true, explanation: 'Fundamental trigonometric limit' },
      { text: '0', correct: false },
      { text: '∞', correct: false },
      { text: 'Does not exist', correct: false }
    ],
    hint: 'This is one of the fundamental limits in calculus',
    solution: 'lim(x→0) [sin(x)/x] = 1 (fundamental trigonometric limit)',
    concept: 'Fundamental trigonometric limits'
  },
  
  // Additional questions for 0-500m range (10 per 100m range)
  
  // 0-100m range (need 9 more)
  {
    id: 'found-4',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 10,
    question: 'What is lim(x→1) [x² + 2x - 3]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 1² + 2(1) - 3 = 1 + 2 - 3 = 0' },
      { text: '1', correct: false },
      { text: '2', correct: false },
      { text: '3', correct: false }
    ],
    hint: 'Substitute x = 1 directly into the polynomial',
    solution: 'lim(x→1) [x² + 2x - 3] = 1² + 2(1) - 3 = 1 + 2 - 3 = 0',
    concept: 'Direct substitution for polynomial limits'
  },
  
  {
    id: 'found-5',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 20,
    question: 'What is lim(x→2) [3x - 1]?',
    options: [
      { text: '5', correct: true, explanation: 'Direct substitution: 3(2) - 1 = 6 - 1 = 5' },
      { text: '4', correct: false },
      { text: '6', correct: false },
      { text: '7', correct: false }
    ],
    hint: 'Substitute x = 2 directly',
    solution: 'lim(x→2) [3x - 1] = 3(2) - 1 = 6 - 1 = 5',
    concept: 'Direct substitution for linear functions'
  },
  
  {
    id: 'found-6',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 30,
    question: 'What is lim(x→0) [x + 5]?',
    options: [
      { text: '5', correct: true, explanation: 'Direct substitution: 0 + 5 = 5' },
      { text: '0', correct: false },
      { text: '1', correct: false },
      { text: '4', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x + 5] = 0 + 5 = 5',
    concept: 'Direct substitution for linear functions'
  },
  
  {
    id: 'found-7',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 40,
    question: 'What is lim(x→1) [x²]?',
    options: [
      { text: '1', correct: true, explanation: 'Direct substitution: 1² = 1' },
      { text: '0', correct: false },
      { text: '2', correct: false },
      { text: '4', correct: false }
    ],
    hint: 'Substitute x = 1 directly',
    solution: 'lim(x→1) [x²] = 1² = 1',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'found-8',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 50,
    question: 'What is lim(x→3) [2x + 1]?',
    options: [
      { text: '7', correct: true, explanation: 'Direct substitution: 2(3) + 1 = 6 + 1 = 7' },
      { text: '6', correct: false },
      { text: '8', correct: false },
      { text: '5', correct: false }
    ],
    hint: 'Substitute x = 3 directly',
    solution: 'lim(x→3) [2x + 1] = 2(3) + 1 = 6 + 1 = 7',
    concept: 'Direct substitution for linear functions'
  },
  
  {
    id: 'found-9',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 60,
    question: 'What is lim(x→0) [x³]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 0³ = 0' },
      { text: '1', correct: false },
      { text: '∞', correct: false },
      { text: 'Does not exist', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x³] = 0³ = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'found-10',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 70,
    question: 'What is lim(x→2) [x² + 1]?',
    options: [
      { text: '5', correct: true, explanation: 'Direct substitution: 2² + 1 = 4 + 1 = 5' },
      { text: '4', correct: false },
      { text: '6', correct: false },
      { text: '3', correct: false }
    ],
    hint: 'Substitute x = 2 directly',
    solution: 'lim(x→2) [x² + 1] = 2² + 1 = 4 + 1 = 5',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'found-11',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 80,
    question: 'What is lim(x→1) [x + 2]?',
    options: [
      { text: '3', correct: true, explanation: 'Direct substitution: 1 + 2 = 3' },
      { text: '2', correct: false },
      { text: '4', correct: false },
      { text: '1', correct: false }
    ],
    hint: 'Substitute x = 1 directly',
    solution: 'lim(x→1) [x + 2] = 1 + 2 = 3',
    concept: 'Direct substitution for linear functions'
  },
  
  {
    id: 'found-12',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 90,
    question: 'What is lim(x→0) [x² + 3x]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 0² + 3(0) = 0 + 0 = 0' },
      { text: '1', correct: false },
      { text: '3', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x² + 3x] = 0² + 3(0) = 0 + 0 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  // 100-200m range (need 7 more)
  {
    id: 'found-13',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 110,
    question: 'What is lim(x→0) [x³ - 2x² + x]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 0³ - 2(0)² + 0 = 0' },
      { text: '1', correct: false },
      { text: '-1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x³ - 2x² + x] = 0³ - 2(0)² + 0 = 0',
    concept: 'Direct substitution for polynomial limits',
  },
  
  {
    id: 'range-100-120',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 120,
    question: 'What is lim(x→2) [x² - 4x + 4]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 2² - 4(2) + 4 = 4 - 8 + 4 = 0' },
      { text: '1', correct: false },
      { text: '4', correct: false },
      { text: '8', correct: false }
    ],
    hint: 'Substitute x = 2 directly',
    solution: 'lim(x→2) [x² - 4x + 4] = 2² - 4(2) + 4 = 4 - 8 + 4 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-130',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 130,
    question: 'What is lim(x→1) [x³ + x² - x - 1]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 1³ + 1² - 1 - 1 = 1 + 1 - 1 - 1 = 0' },
      { text: '1', correct: false },
      { text: '2', correct: false },
      { text: '-1', correct: false }
    ],
    hint: 'Substitute x = 1 directly',
    solution: 'lim(x→1) [x³ + x² - x - 1] = 1³ + 1² - 1 - 1 = 1 + 1 - 1 - 1 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-140',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 140,
    question: 'What is lim(x→3) [2x² - 5x + 1]?',
    options: [
      { text: '4', correct: true, explanation: 'Direct substitution: 2(3)² - 5(3) + 1 = 18 - 15 + 1 = 4' },
      { text: '3', correct: false },
      { text: '5', correct: false },
      { text: '6', correct: false }
    ],
    hint: 'Substitute x = 3 directly',
    solution: 'lim(x→3) [2x² - 5x + 1] = 2(3)² - 5(3) + 1 = 18 - 15 + 1 = 4',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-150',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 150,
    question: 'What is lim(x→0) [x⁴ - 2x²]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 0⁴ - 2(0)² = 0 - 0 = 0' },
      { text: '1', correct: false },
      { text: '2', correct: false },
      { text: '-1', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x⁴ - 2x²] = 0⁴ - 2(0)² = 0 - 0 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-160',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 160,
    question: 'What is lim(x→2) [x³ - 8]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 2³ - 8 = 8 - 8 = 0' },
      { text: '8', correct: false },
      { text: '16', correct: false },
      { text: '1', correct: false }
    ],
    hint: 'Substitute x = 2 directly',
    solution: 'lim(x→2) [x³ - 8] = 2³ - 8 = 8 - 8 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-170',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 170,
    question: 'What is lim(x→1) [3x² - 2x + 1]?',
    options: [
      { text: '2', correct: true, explanation: 'Direct substitution: 3(1)² - 2(1) + 1 = 3 - 2 + 1 = 2' },
      { text: '1', correct: false },
      { text: '3', correct: false },
      { text: '0', correct: false }
    ],
    hint: 'Substitute x = 1 directly',
    solution: 'lim(x→1) [3x² - 2x + 1] = 3(1)² - 2(1) + 1 = 3 - 2 + 1 = 2',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'range-100-190',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 190,
    question: 'What is lim(x→0) [x⁵ + x³ - x]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 0⁵ + 0³ - 0 = 0 + 0 - 0 = 0' },
      { text: '1', correct: false },
      { text: '-1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Substitute x = 0 directly',
    solution: 'lim(x→0) [x⁵ + x³ - x] = 0⁵ + 0³ - 0 = 0 + 0 - 0 = 0',
    concept: 'Direct substitution for polynomial functions'
  },
  
  {
    id: 'found-6-original',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 250,
    question: 'What is lim(x→4) [√x]?',
    options: [
      { text: '2', correct: true, explanation: '√4 = 2' },
      { text: '4', correct: false },
      { text: '16', correct: false },
      { text: '±2', correct: false }
    ],
    hint: 'Square root of 4 is 2',
    solution: 'lim(x→4) [√x] = √4 = 2',
    concept: 'Limits of radical functions',
  },
  
  {
    id: 'range-200-210',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 210,
    question: 'What is lim(x→9) [√x]?',
    options: [
      { text: '3', correct: true, explanation: '√9 = 3' },
      { text: '9', correct: false },
      { text: '81', correct: false },
      { text: '±3', correct: false }
    ],
    hint: 'Square root of 9 is 3',
    solution: 'lim(x→9) [√x] = √9 = 3',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-220',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 220,
    question: 'What is lim(x→16) [√x]?',
    options: [
      { text: '4', correct: true, explanation: '√16 = 4' },
      { text: '16', correct: false },
      { text: '256', correct: false },
      { text: '±4', correct: false }
    ],
    hint: 'Square root of 16 is 4',
    solution: 'lim(x→16) [√x] = √16 = 4',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-230',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 230,
    question: 'What is lim(x→25) [√x]?',
    options: [
      { text: '5', correct: true, explanation: '√25 = 5' },
      { text: '25', correct: false },
      { text: '625', correct: false },
      { text: '±5', correct: false }
    ],
    hint: 'Square root of 25 is 5',
    solution: 'lim(x→25) [√x] = √25 = 5',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-240',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 240,
    question: 'What is lim(x→36) [√x]?',
    options: [
      { text: '6', correct: true, explanation: '√36 = 6' },
      { text: '36', correct: false },
      { text: '1296', correct: false },
      { text: '±6', correct: false }
    ],
    hint: 'Square root of 36 is 6',
    solution: 'lim(x→36) [√x] = √36 = 6',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-260',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 260,
    question: 'What is lim(x→49) [√x]?',
    options: [
      { text: '7', correct: true, explanation: '√49 = 7' },
      { text: '49', correct: false },
      { text: '2401', correct: false },
      { text: '±7', correct: false }
    ],
    hint: 'Square root of 49 is 7',
    solution: 'lim(x→49) [√x] = √49 = 7',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-270',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 270,
    question: 'What is lim(x→64) [√x]?',
    options: [
      { text: '8', correct: true, explanation: '√64 = 8' },
      { text: '64', correct: false },
      { text: '4096', correct: false },
      { text: '±8', correct: false }
    ],
    hint: 'Square root of 64 is 8',
    solution: 'lim(x→64) [√x] = √64 = 8',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-280',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 280,
    question: 'What is lim(x→81) [√x]?',
    options: [
      { text: '9', correct: true, explanation: '√81 = 9' },
      { text: '81', correct: false },
      { text: '6561', correct: false },
      { text: '±9', correct: false }
    ],
    hint: 'Square root of 81 is 9',
    solution: 'lim(x→81) [√x] = √81 = 9',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'range-200-290',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 290,
    question: 'What is lim(x→100) [√x]?',
    options: [
      { text: '10', correct: true, explanation: '√100 = 10' },
      { text: '100', correct: false },
      { text: '10000', correct: false },
      { text: '±10', correct: false }
    ],
    hint: 'Square root of 100 is 10',
    solution: 'lim(x→100) [√x] = √100 = 10',
    concept: 'Limits of radical functions'
  },
  
  {
    id: 'found-7-original',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 300,
    question: 'What is lim(x→2) [(x² - 4)/(x - 2)]?',
    options: [
      { text: '4', correct: true, explanation: 'Factor: (x+2)(x-2)/(x-2) = x+2, then substitute x=2' },
      { text: '2', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x² - 4 as (x+2)(x-2)',
    solution: 'lim(x→2) [(x² - 4)/(x - 2)] = lim(x→2) [(x+2)(x-2)/(x-2)] = lim(x→2) [x+2] = 4',
    concept: 'Limits by factoring',
  },
  
  {
    id: 'range-300-310',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 310,
    question: 'What is lim(x→3) [(x² - 9)/(x - 3)]?',
    options: [
      { text: '6', correct: true, explanation: 'Factor: (x+3)(x-3)/(x-3) = x+3, then substitute x=3' },
      { text: '3', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x² - 9 as (x+3)(x-3)',
    solution: 'lim(x→3) [(x² - 9)/(x - 3)] = lim(x→3) [(x+3)(x-3)/(x-3)] = lim(x→3) [x+3] = 6',
    concept: 'Limits by factoring'
  },
  
  {
    id: 'range-300-330',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 330,
    question: 'What is lim(x→1) [(x² - 1)/(x - 1)]?',
    options: [
      { text: '2', correct: true, explanation: 'Factor: (x+1)(x-1)/(x-1) = x+1, then substitute x=1' },
      { text: '1', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x² - 1 as (x+1)(x-1)',
    solution: 'lim(x→1) [(x² - 1)/(x - 1)] = lim(x→1) [(x+1)(x-1)/(x-1)] = lim(x→1) [x+1] = 2',
    concept: 'Limits by factoring'
  },
  
  {
    id: 'range-300-340',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 340,
    question: 'What is lim(x→4) [(x² - 16)/(x - 4)]?',
    options: [
      { text: '8', correct: true, explanation: 'Factor: (x+4)(x-4)/(x-4) = x+4, then substitute x=4' },
      { text: '4', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x² - 16 as (x+4)(x-4)',
    solution: 'lim(x→4) [(x² - 16)/(x - 4)] = lim(x→4) [(x+4)(x-4)/(x-4)] = lim(x→4) [x+4] = 8',
    concept: 'Limits by factoring'
  },
  
  {
    id: 'range-300-360',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 360,
    question: 'What is lim(x→5) [(x² - 25)/(x - 5)]?',
    options: [
      { text: '10', correct: true, explanation: 'Factor: (x+5)(x-5)/(x-5) = x+5, then substitute x=5' },
      { text: '5', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x² - 25 as (x+5)(x-5)',
    solution: 'lim(x→5) [(x² - 25)/(x - 5)] = lim(x→5) [(x+5)(x-5)/(x-5)] = lim(x→5) [x+5] = 10',
    concept: 'Limits by factoring'
  },
  
  {
    id: 'range-300-370',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 370,
    question: 'What is lim(x→2) [(x³ - 8)/(x - 2)]?',
    options: [
      { text: '12', correct: true, explanation: 'Factor: (x-2)(x²+2x+4)/(x-2) = x²+2x+4, then substitute x=2' },
      { text: '8', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x³ - 8 using difference of cubes: (x-2)(x²+2x+4)',
    solution: 'lim(x→2) [(x³ - 8)/(x - 2)] = lim(x→2) [(x-2)(x²+2x+4)/(x-2)] = lim(x→2) [x²+2x+4] = 4+4+4 = 12',
    concept: 'Limits by factoring (difference of cubes)'
  },
  
  {
    id: 'range-300-380',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 380,
    question: 'What is lim(x→1) [(x³ - 1)/(x - 1)]?',
    options: [
      { text: '3', correct: true, explanation: 'Factor: (x-1)(x²+x+1)/(x-1) = x²+x+1, then substitute x=1' },
      { text: '1', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x³ - 1 using difference of cubes: (x-1)(x²+x+1)',
    solution: 'lim(x→1) [(x³ - 1)/(x - 1)] = lim(x→1) [(x-1)(x²+x+1)/(x-1)] = lim(x→1) [x²+x+1] = 1+1+1 = 3',
    concept: 'Limits by factoring (difference of cubes)'
  },
  
  {
    id: 'range-300-390',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 390,
    question: 'What is lim(x→3) [(x³ - 27)/(x - 3)]?',
    options: [
      { text: '27', correct: true, explanation: 'Factor: (x-3)(x²+3x+9)/(x-3) = x²+3x+9, then substitute x=3' },
      { text: '9', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor x³ - 27 using difference of cubes: (x-3)(x²+3x+9)',
    solution: 'lim(x→3) [(x³ - 27)/(x - 3)] = lim(x→3) [(x-3)(x²+3x+9)/(x-3)] = lim(x→3) [x²+3x+9] = 9+9+9 = 27',
    concept: 'Limits by factoring (difference of cubes)'
  },
  
  {
    id: 'range-300-400',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 400,
    question: 'What is lim(x→0) [(1 - cos(x))/x]?',
    options: [
      { text: '0', correct: true, explanation: 'This is a standard limit result' },
      { text: '1', correct: false },
      { text: '∞', correct: false },
      { text: 'Does not exist', correct: false }
    ],
    hint: 'This is a fundamental trigonometric limit',
    solution: 'lim(x→0) [(1 - cos(x))/x] = 0 (fundamental trigonometric limit)',
    concept: 'Fundamental trigonometric limits'
  },
  
  {
    id: 'found-8-original',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 350,
    question: 'What is lim(x→0) [cos(x)]?',
    options: [
      { text: '1', correct: true, explanation: 'cos(0) = 1' },
      { text: '0', correct: false },
      { text: '-1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'What is cos(0)?',
    solution: 'lim(x→0) [cos(x)] = cos(0) = 1',
    concept: 'Limits of trigonometric functions',
  },
  
  {
    id: 'range-400-410',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 410,
    question: 'What is lim(x→0) [sin(x)/x]?',
    options: [
      { text: '1', correct: true, explanation: 'Fundamental trigonometric limit' },
      { text: '0', correct: false },
      { text: '∞', correct: false },
      { text: 'Does not exist', correct: false }
    ],
    hint: 'This is one of the fundamental limits in calculus',
    solution: 'lim(x→0) [sin(x)/x] = 1 (fundamental trigonometric limit)',
    concept: 'Fundamental trigonometric limits'
  },
  
  {
    id: 'range-400-430',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 430,
    question: 'What is lim(x→2) [(x² - 3x + 2)/(x² - 4)]?',
    options: [
      { text: '1/4', correct: true, explanation: 'Factor both: (x-1)(x-2)/(x+2)(x-2) = (x-1)/(x+2), then substitute x=2' },
      { text: '1/2', correct: false },
      { text: '0', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→2) [(x² - 3x + 2)/(x² - 4)] = lim(x→2) [(x-1)(x-2)/(x+2)(x-2)] = lim(x→2) [(x-1)/(x+2)] = (2-1)/(2+2) = 1/4',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-440',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 440,
    question: 'What is lim(x→1) [(x² - 2x + 1)/(x² - 1)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-1)²/(x+1)(x-1) = (x-1)/(x+1), then substitute x=1' },
      { text: '1/2', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→1) [(x² - 2x + 1)/(x² - 1)] = lim(x→1) [(x-1)²/(x+1)(x-1)] = lim(x→1) [(x-1)/(x+1)] = (1-1)/(1+1) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-460',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 460,
    question: 'What is lim(x→3) [(x² - 6x + 9)/(x² - 9)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-3)²/(x+3)(x-3) = (x-3)/(x+3), then substitute x=3' },
      { text: '1/6', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→3) [(x² - 6x + 9)/(x² - 9)] = lim(x→3) [(x-3)²/(x+3)(x-3)] = lim(x→3) [(x-3)/(x+3)] = (3-3)/(3+3) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-470',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 470,
    question: 'What is lim(x→4) [(x² - 8x + 16)/(x² - 16)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-4)²/(x+4)(x-4) = (x-4)/(x+4), then substitute x=4' },
      { text: '1/8', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→4) [(x² - 8x + 16)/(x² - 16)] = lim(x→4) [(x-4)²/(x+4)(x-4)] = lim(x→4) [(x-4)/(x+4)] = (4-4)/(4+4) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-480',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 480,
    question: 'What is lim(x→5) [(x² - 10x + 25)/(x² - 25)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-5)²/(x+5)(x-5) = (x-5)/(x+5), then substitute x=5' },
      { text: '1/10', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→5) [(x² - 10x + 25)/(x² - 25)] = lim(x→5) [(x-5)²/(x+5)(x-5)] = lim(x→5) [(x-5)/(x+5)] = (5-5)/(5+5) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-490',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 490,
    question: 'What is lim(x→6) [(x² - 12x + 36)/(x² - 36)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-6)²/(x+6)(x-6) = (x-6)/(x+6), then substitute x=6' },
      { text: '1/12', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→6) [(x² - 12x + 36)/(x² - 36)] = lim(x→6) [(x-6)²/(x+6)(x-6)] = lim(x→6) [(x-6)/(x+6)] = (6-6)/(6+6) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'range-400-500',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 500,
    question: 'What is lim(x→7) [(x² - 14x + 49)/(x² - 49)]?',
    options: [
      { text: '0', correct: true, explanation: 'Factor: (x-7)²/(x+7)(x-7) = (x-7)/(x+7), then substitute x=7' },
      { text: '1/14', correct: false },
      { text: '1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→7) [(x² - 14x + 49)/(x² - 49)] = lim(x→7) [(x-7)²/(x+7)(x-7)] = lim(x→7) [(x-7)/(x+7)] = (7-7)/(7+7) = 0',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'found-9-original',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 450,
    question: 'What is lim(x→1) [(x³ - 1)/(x - 1)]?',
    options: [
      { text: '3', correct: true, explanation: 'Factor: (x-1)(x²+x+1)/(x-1) = x²+x+1, then substitute x=1' },
      { text: '1', correct: false },
      { text: '0', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor x³ - 1 using difference of cubes: (x-1)(x²+x+1)',
    solution: 'lim(x→1) [(x³ - 1)/(x - 1)] = lim(x→1) [(x-1)(x²+x+1)/(x-1)] = lim(x→1) [x²+x+1] = 1+1+1 = 3',
    concept: 'Limits by factoring (difference of cubes)'
  },
  
  {
    id: 'found-10-original',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 80,
    question: 'What is lim(x→5) [2x + 3]?',
    options: [
      { text: '13', correct: true, explanation: 'Direct substitution: 2(5) + 3 = 10 + 3 = 13' },
      { text: '10', correct: false },
      { text: '8', correct: false },
      { text: '15', correct: false }
    ],
    hint: 'Substitute x = 5 directly',
    solution: 'lim(x→5) [2x + 3] = 2(5) + 3 = 10 + 3 = 13',
    concept: 'Direct substitution for linear functions'
  },
  
  {
    id: 'found-11-original',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 320,
    question: 'What is lim(x→0) [(1 - cos(x))/x]?',
    options: [
      { text: '0', correct: true, explanation: 'This is a standard limit result' },
      { text: '1', correct: false },
      { text: '∞', correct: false },
      { text: 'Does not exist', correct: false }
    ],
    hint: 'This is a fundamental trigonometric limit',
    solution: 'lim(x→0) [(1 - cos(x))/x] = 0 (fundamental trigonometric limit)',
    concept: 'Fundamental trigonometric limits'
  },
  
  {
    id: 'found-12-original',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 180,
    question: 'What is lim(x→3) [x² - 5x + 6]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 3² - 5(3) + 6 = 9 - 15 + 6 = 0' },
      { text: '6', correct: false },
      { text: '3', correct: false },
      { text: '9', correct: false }
    ],
    hint: 'Substitute x = 3 directly into the quadratic',
    solution: 'lim(x→3) [x² - 5x + 6] = 3² - 5(3) + 6 = 9 - 15 + 6 = 0',
    concept: 'Direct substitution for quadratic functions'
  },
  
  {
    id: 'found-13-original',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 420,
    question: 'What is lim(x→2) [(x² - 3x + 2)/(x² - 4)]?',
    options: [
      { text: '1/4', correct: true, explanation: 'Factor both: (x-1)(x-2)/(x+2)(x-2) = (x-1)/(x+2), then substitute x=2' },
      { text: '1/2', correct: false },
      { text: '0', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Factor both numerator and denominator',
    solution: 'lim(x→2) [(x² - 3x + 2)/(x² - 4)] = lim(x→2) [(x-1)(x-2)/(x+2)(x-2)] = lim(x→2) [(x-1)/(x+2)] = (2-1)/(2+2) = 1/4',
    concept: 'Limits by factoring rational functions'
  },
  
  {
    id: 'lim-2',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 500,
    question: 'What is lim(x→3) [(x² - 9)/(x - 3)]?',
    options: [
      { text: '6', correct: true, explanation: 'Factor and cancel: (x+3)(x-3)/(x-3) = x+3, then substitute' },
      { text: '3', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
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
      { text: '3x²', correct: true, explanation: 'Power rule: d/dx [xⁿ] = n·xⁿ⁻¹' },
      { text: 'x²', correct: false },
      { text: '3x', correct: false },
      { text: 'x³/3', correct: false }
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
      { text: 'cos(x)', correct: true, explanation: 'Standard derivative of sine' },
      { text: '-cos(x)', correct: false },
      { text: 'sin(x)', correct: false },
      { text: '-sin(x)', correct: false }
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
      { text: 'sin(x) + x·cos(x)', correct: true, explanation: 'Product rule: (fg)\' = f\'g + fg\'' },
      { text: 'cos(x)', correct: false },
      { text: 'x·cos(x)', correct: false },
      { text: 'sin(x)', correct: false }
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
      { text: '2cos(2x)', correct: true, explanation: 'Chain rule: outer derivative × inner derivative' },
      { text: 'cos(2x)', correct: false },
      { text: '2sin(2x)', correct: false },
      { text: 'sin(x)', correct: false }
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
      { text: '6x(x² + 1)²', correct: true, explanation: 'Chain rule with power rule' },
      { text: '3(x² + 1)²', correct: false },
      { text: '6x²(x² + 1)²', correct: false },
      { text: '3x²(x² + 1)²', correct: false }
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
      { text: 'x = 2', correct: true, explanation: 'Set f\'(x) = 0: -2x + 4 = 0 → x = 2' },
      { text: 'x = 0', correct: false },
      { text: 'x = 4', correct: false },
      { text: 'x = -2', correct: false }
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
      { text: 'x² + C', correct: true, explanation: 'Power rule for integrals: ∫xⁿdx = xⁿ⁺¹/(n+1) + C' },
      { text: '2x² + C', correct: false },
      { text: 'x²/2 + C', correct: false },
      { text: '2x + C', correct: false }
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
      { text: 'sin(x) + C', correct: true, explanation: 'Antiderivative of cosine is sine' },
      { text: '-sin(x) + C', correct: false },
      { text: 'cos(x) + C', correct: false },
      { text: '-cos(x) + C', correct: false }
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
      { text: '4', correct: true, explanation: 'FTC: [x²]₀² = 4 - 0 = 4' },
      { text: '2', correct: false },
      { text: '8', correct: false },
      { text: '0', correct: false }
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
      { text: 'u = x²', correct: true, explanation: 'Let u = x², then du = 2x dx' },
      { text: 'u = 2x', correct: false },
      { text: 'u = cos(x²)', correct: false },
      { text: 'u = x', correct: false }
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
      { text: 'u = x', correct: true, explanation: 'Choose u as the polynomial (gets simpler when differentiated)' },
      { text: 'u = eˣ', correct: false },
      { text: 'u = x·eˣ', correct: false },
      { text: 'u = 1', correct: false }
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
      { text: 'cot(x)', correct: true, explanation: 'Chain rule twice: (1/sin(x))·cos(x) = cot(x)' },
      { text: 'tan(x)', correct: false },
      { text: '1/sin(x)', correct: false },
      { text: 'cos(x)', correct: false }
    ],
    hint: 'Use chain rule: derivative of ln(u) is 1/u times derivative of u',
    solution: 'd/dx [ln(sin(x))] = (1/sin(x))·cos(x) = cos(x)/sin(x) = cot(x)',
    concept: 'Chain rule with logarithms and trig'
  },

  // ADDITIONAL FOUNDATION QUESTIONS (0-300m)
  {
    id: 'found-3',
    topic: 'limits',
    difficulty: 'easy',
    recommendedHeight: 150,
    question: 'What is lim(x→1) [x² + 2x - 3]?',
    options: [
      { text: '0', correct: true, explanation: 'Direct substitution: 1² + 2(1) - 3 = 0' },
      { text: '1', correct: false },
      { text: '2', correct: false },
      { text: '3', correct: false }
    ],
    hint: 'For polynomial limits, substitute directly',
    solution: 'lim(x→1) [x² + 2x - 3] = 1² + 2(1) - 3 = 1 + 2 - 3 = 0',
    concept: 'Direct substitution for polynomial limits'
  },

  {
    id: 'found-4',
    topic: 'continuity',
    difficulty: 'easy',
    recommendedHeight: 250,
    question: 'What value makes f(x) = (x²-4)/(x-2) continuous at x = 2?',
    options: [
      { text: '4', correct: true, explanation: 'Factor and cancel: (x+2)(x-2)/(x-2) = x+2, so f(2) = 4' },
      { text: '2', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor the numerator and cancel common factors',
    solution: 'f(x) = (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. So f(2) = 2+2 = 4',
    concept: 'Removable discontinuities'
  },

  // ADDITIONAL LIMITS (300-600m)
  {
    id: 'lim-3',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 350,
    question: 'What is lim(x→0) [cos(x)]?',
    options: [
      { text: '1', correct: true, explanation: 'cos(0) = 1' },
      { text: '0', correct: false },
      { text: '-1', correct: false },
      { text: '∞', correct: false }
    ],
    hint: 'Direct substitution works for continuous functions',
    solution: 'lim(x→0) [cos(x)] = cos(0) = 1',
    concept: 'Limits of trigonometric functions'
  },

  {
    id: 'lim-4',
    topic: 'limits',
    difficulty: 'medium',
    recommendedHeight: 550,
    question: 'What is lim(x→2) [(x²-4)/(x-2)]?',
    options: [
      { text: '4', correct: true, explanation: 'Factor: (x+2)(x-2)/(x-2) = x+2, then substitute x=2' },
      { text: '2', correct: false },
      { text: '0', correct: false },
      { text: 'Undefined', correct: false }
    ],
    hint: 'Factor the numerator first',
    solution: 'Factor: (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2. Then lim(x→2) [x+2] = 4',
    concept: 'Limits by factoring'
  },

  // ADDITIONAL DERIVATIVES (600-1200m)
  {
    id: 'deriv-4',
    topic: 'derivatives',
    difficulty: 'easy',
    recommendedHeight: 650,
    question: 'What is d/dx [5x²]?',
    options: [
      { text: '10x', correct: true, explanation: 'Power rule: d/dx[5x²] = 5·2x = 10x' },
      { text: '5x', correct: false },
      { text: '10x²', correct: false },
      { text: '5x²', correct: false }
    ],
    hint: 'Use the power rule: bring down the exponent and multiply by coefficient',
    solution: 'd/dx [5x²] = 5·2x¹ = 10x',
    concept: 'Power rule with coefficients'
  },

  {
    id: 'deriv-5',
    topic: 'derivatives',
    difficulty: 'medium',
    recommendedHeight: 900,
    question: 'What is d/dx [cos(x)]?',
    options: [
      { text: '-sin(x)', correct: true, explanation: 'Standard derivative of cosine' },
      { text: 'sin(x)', correct: false },
      { text: '-cos(x)', correct: false },
      { text: 'cos(x)', correct: false }
    ],
    hint: 'This is one of the basic trigonometric derivatives',
    solution: 'd/dx [cos(x)] = -sin(x)',
    concept: 'Derivatives of trigonometric functions'
  },

  {
    id: 'deriv-6',
    topic: 'derivatives',
    difficulty: 'medium',
    recommendedHeight: 1100,
    question: 'Using the quotient rule, what is d/dx [x/(x+1)]?',
    options: [
      { text: '1/(x+1)²', correct: true, explanation: 'Quotient rule: (low·d(high) - high·d(low))/low²' },
      { text: '1/(x+1)', correct: false },
      { text: 'x/(x+1)²', correct: false },
      { text: '1', correct: false }
    ],
    hint: 'Quotient rule: (low·d(high) - high·d(low))/low²',
    solution: 'd/dx [x/(x+1)] = [(x+1)·1 - x·1]/(x+1)² = 1/(x+1)²',
    concept: 'Quotient rule'
  },

  // ADDITIONAL CHAIN RULE (1200-1800m)
  {
    id: 'chain-3',
    topic: 'chain-rule',
    difficulty: 'medium',
    recommendedHeight: 1400,
    question: 'What is d/dx [cos(3x)]?',
    options: [
      { text: '-3sin(3x)', correct: true, explanation: 'Chain rule: outer derivative × inner derivative' },
      { text: '-sin(3x)', correct: false },
      { text: '3sin(3x)', correct: false },
      { text: 'sin(3x)', correct: false }
    ],
    hint: 'Use chain rule: derivative of outer function times derivative of inner',
    solution: 'd/dx [cos(3x)] = -sin(3x)·d/dx[3x] = -sin(3x)·3 = -3sin(3x)',
    concept: 'Chain rule with trig functions'
  },

  {
    id: 'chain-4',
    topic: 'chain-rule',
    difficulty: 'hard',
    recommendedHeight: 1600,
    question: 'What is d/dx [e^(2x)]?',
    options: [
      { text: '2e^(2x)', correct: true, explanation: 'Chain rule: e^(2x) × derivative of 2x' },
      { text: 'e^(2x)', correct: false },
      { text: '2e^x', correct: false },
      { text: 'e^(2x)/2', correct: false }
    ],
    hint: 'Chain rule: derivative of e^u is e^u times derivative of u',
    solution: 'd/dx [e^(2x)] = e^(2x)·d/dx[2x] = e^(2x)·2 = 2e^(2x)',
    concept: 'Chain rule with exponential functions'
  },

  // ADDITIONAL INTEGRATION (1800-2400m)
  {
    id: 'int-3',
    topic: 'integrals',
    difficulty: 'medium',
    recommendedHeight: 1950,
    question: 'What is ∫ 3x² dx?',
    options: [
      { text: 'x³ + C', correct: true, explanation: 'Power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C' },
      { text: '3x³ + C', correct: false },
      { text: 'x³/3 + C', correct: false },
      { text: '6x + C', correct: false }
    ],
    hint: 'Use the power rule for integration, don\'t forget the constant!',
    solution: '∫ 3x² dx = 3·∫ x² dx = 3·(x³/3) + C = x³ + C',
    concept: 'Power rule for integration with coefficients'
  },

  {
    id: 'int-4',
    topic: 'integrals',
    difficulty: 'medium',
    recommendedHeight: 2100,
    question: 'What is ∫ sin(x) dx?',
    options: [
      { text: '-cos(x) + C', correct: true, explanation: 'Antiderivative of sine is negative cosine' },
      { text: 'cos(x) + C', correct: false },
      { text: 'sin(x) + C', correct: false },
      { text: '-sin(x) + C', correct: false }
    ],
    hint: 'What function has derivative equal to sin(x)?',
    solution: '∫ sin(x) dx = -cos(x) + C',
    concept: 'Integrals of trigonometric functions'
  },

  // ADDITIONAL ADVANCED (2400-3000m)
  {
    id: 'sub-2',
    topic: 'substitution',
    difficulty: 'hard',
    recommendedHeight: 2600,
    question: 'For ∫ x·e^(x²) dx, what substitution should you use?',
    options: [
      { text: 'u = x²', correct: true, explanation: 'Let u = x², then du = 2x dx, so x dx = du/2' },
      { text: 'u = x', correct: false },
      { text: 'u = e^x', correct: false },
      { text: 'u = e^(x²)', correct: false }
    ],
    hint: 'Look for a function whose derivative appears in the integral',
    solution: 'Let u = x², then du = 2x dx. The integral becomes ∫ (1/2)e^u du = (1/2)e^u + C = (1/2)e^(x²) + C',
    concept: 'U-substitution with exponential functions'
  },

  {
    id: 'parts-2',
    topic: 'integration-by-parts',
    difficulty: 'expert',
    recommendedHeight: 2800,
    question: 'For ∫ x·sin(x) dx using integration by parts, what should u and dv be?',
    options: [
      { text: 'u = x, dv = sin(x) dx', correct: true, explanation: 'Choose u as the polynomial (gets simpler when differentiated)' },
      { text: 'u = sin(x), dv = x dx', correct: false },
      { text: 'u = x·sin(x), dv = dx', correct: false },
      { text: 'u = 1, dv = x·sin(x) dx', correct: false }
    ],
    hint: 'Use LIATE: Logarithmic, Inverse trig, Algebraic, Trig, Exponential',
    solution: 'Let u = x (algebraic), dv = sin(x) dx. Then ∫ x·sin(x) dx = x·(-cos(x)) - ∫ (-cos(x)) dx = -x·cos(x) + sin(x) + C',
    concept: 'Integration by parts with trigonometric functions'
  }
]

/**
 * Get appropriate question based on current height
 */
export function getQuestionByHeight(height: number): CalculusQuestion {
  // Get chapter for this height
  const chapter = getChapterByHeight(height)
  
  // Filter questions by chapter range first
  let appropriateQuestions = CALCULUS_QUESTION_BANK.filter(q => {
    // Check if question is in the right chapter range
    for (const [name, chapterInfo] of Object.entries(CALCULUS_CHAPTERS)) {
      if (name === chapter.name) {
        const [min, max] = chapterInfo.range
        return q.recommendedHeight >= min && q.recommendedHeight < max
      }
    }
    return false
  })
  
  // If no questions in current chapter, expand search to nearby chapters
  if (appropriateQuestions.length === 0) {
    appropriateQuestions = CALCULUS_QUESTION_BANK.filter(q => {
      const diff = Math.abs(q.recommendedHeight - height)
      return diff <= 600 // Questions within 600m of current height
    })
  }
  
  // If still no questions, use any question
  if (appropriateQuestions.length === 0) {
    appropriateQuestions = CALCULUS_QUESTION_BANK
  }
  
  // Add more randomization by shuffling the array first
  const shuffledQuestions = [...appropriateQuestions].sort(() => Math.random() - 0.5)
  
  // Weight questions by difficulty - prefer easier questions at lower heights
  const weightedQuestions = shuffledQuestions.map(q => {
    let weight = 1
    
    // Prefer questions closer to current height
    const heightDiff = Math.abs(q.recommendedHeight - height)
    weight *= Math.max(0.1, 1 - heightDiff / 1000)
    
    // Prefer easier questions at lower heights
    if (height < 1000) {
      if (q.difficulty === 'easy') weight *= 3
      else if (q.difficulty === 'medium') weight *= 1.5
      else if (q.difficulty === 'hard') weight *= 0.5
    } else if (height < 2000) {
      if (q.difficulty === 'easy') weight *= 1.5
      else if (q.difficulty === 'medium') weight *= 2
      else if (q.difficulty === 'hard') weight *= 1.5
    } else {
      if (q.difficulty === 'easy') weight *= 0.5
      else if (q.difficulty === 'medium') weight *= 1.5
      else if (q.difficulty === 'hard') weight *= 2
      else if (q.difficulty === 'expert') weight *= 2
    }
    
    return { question: q, weight }
  })
  
  // Select weighted random question with better randomization
  const totalWeight = weightedQuestions.reduce((sum, item) => sum + item.weight, 0)
  let random = (Math.random() + Date.now() % 1000 / 1000) * totalWeight
  
  for (const item of weightedQuestions) {
    random -= item.weight
    if (random <= 0) {
      return item.question
    }
  }
  
  // Fallback with additional randomization
  return shuffledQuestions[Math.floor((Math.random() + Date.now() % 1000 / 1000) * shuffledQuestions.length)]
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

