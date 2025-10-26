// Question bank organized by level with progressive difficulty
// Based on comprehensive calculus concepts from Calculus Volume 1

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
  // ========== LEVEL 0: INTRODUCTION TO LIMITS ==========
  {
    id: 0,
    name: 'Round 1: Introduction to Limits',
    description: 'Understanding the foundation of calculus',
    requiredCurveMode: 'line',
    targetPulls: 5,
    questions: [
      {
        id: 'lim-1',
        text: 'What is lim(x→2) of (x + 3)?',
        options: [
          { text: 'A) 5', correct: true },
          { text: 'B) 2', correct: false },
          { text: 'C) 3', correct: false },
          { text: 'D) undefined', correct: false },
        ],
        hint: 'For continuous functions, substitute x = 2 directly',
        concept: 'Basic Limits'
      },
      {
        id: 'lim-2',
        text: 'What is lim(x→0) of (sin x)/x?',
        options: [
          { text: 'A) 1', correct: true },
          { text: 'B) 0', correct: false },
          { text: 'C) ∞', correct: false },
          { text: 'D) undefined', correct: false },
        ],
        hint: 'This is a famous limit: lim(x→0) sin(x)/x = 1',
        concept: 'Trigonometric Limits'
      },
      {
        id: 'lim-3',
        text: 'What is lim(x→∞) of 1/x?',
        options: [
          { text: 'A) 0', correct: true },
          { text: 'B) 1', correct: false },
          { text: 'C) ∞', correct: false },
          { text: 'D) -∞', correct: false },
        ],
        hint: 'As x gets larger, 1/x gets smaller',
        concept: 'Limits at Infinity'
      },
      {
        id: 'lim-4',
        text: 'A function is continuous at x=a if:',
        options: [
          { text: 'A) lim(x→a) f(x) = f(a)', correct: true },
          { text: 'B) f(a) exists', correct: false },
          { text: 'C) lim(x→a) f(x) exists', correct: false },
          { text: 'D) f(x) is defined everywhere', correct: false },
        ],
        hint: 'Continuity requires limit equals function value',
        concept: 'Continuity Definition'
      },
      {
        id: 'lim-5',
        text: 'What is lim(x→3) of (x² - 9)/(x - 3)?',
        options: [
          { text: 'A) 6', correct: true },
          { text: 'B) 3', correct: false },
          { text: 'C) 0', correct: false },
          { text: 'D) undefined', correct: false },
        ],
        hint: 'Factor: (x-3)(x+3)/(x-3) = x+3, then substitute x=3',
        concept: 'Indeterminate Forms'
      }
    ]
  },

  // ========== LEVEL 1: BASIC DERIVATIVES ==========
  {
    id: 1,
    name: 'Round 2: Basic Derivatives',
    description: 'Power rule and simple derivative rules',
    requiredCurveMode: 'quadratic',
    targetPulls: 4,
    questions: [
      {
        id: 'der-1',
        text: 'What is d/dx(x³)?',
        options: [
          { text: 'A) 3x²', correct: true },
          { text: 'B) x²', correct: false },
          { text: 'C) 3x', correct: false },
          { text: 'D) x³/3', correct: false },
        ],
        hint: 'Power rule: d/dx(xⁿ) = n·xⁿ⁻¹',
        concept: 'Power Rule'
      },
      {
        id: 'der-2',
        text: 'What is d/dx(5x² + 3x - 7)?',
        options: [
          { text: 'A) 10x + 3', correct: true },
          { text: 'B) 10x', correct: false },
          { text: 'C) 5x + 3', correct: false },
          { text: 'D) 10x² + 3x', correct: false },
        ],
        hint: 'Differentiate each term separately',
        concept: 'Sum Rule'
      },
      {
        id: 'der-3',
        text: 'What is d/dx(7)?',
        options: [
          { text: 'A) 0', correct: true },
          { text: 'B) 7', correct: false },
          { text: 'C) 7x', correct: false },
          { text: 'D) 1', correct: false },
        ],
        hint: 'The derivative of a constant is zero',
        concept: 'Constant Rule'
      },
      {
        id: 'der-4',
        text: 'If f(x) = x², what is f\'(2)?',
        options: [
          { text: 'A) 4', correct: true },
          { text: 'B) 2', correct: false },
          { text: 'C) 8', correct: false },
          { text: 'D) 1', correct: false },
        ],
        hint: 'f\'(x) = 2x, so f\'(2) = 2(2) = 4',
        concept: 'Evaluating Derivatives'
      },
      {
        id: 'der-5',
        text: 'What is d/dx(√x)?',
        options: [
          { text: 'A) 1/(2√x)', correct: true },
          { text: 'B) √x/2', correct: false },
          { text: 'C) 2√x', correct: false },
          { text: 'D) 1/√x', correct: false },
        ],
        hint: 'Rewrite as x^(1/2), then use power rule',
        concept: 'Power Rule with Fractions'
      },
      {
        id: 'der-6',
        text: 'What is d/dx(1/x²)?',
        options: [
          { text: 'A) -2/x³', correct: true },
          { text: 'B) 2/x³', correct: false },
          { text: 'C) -1/x³', correct: false },
          { text: 'D) 1/x³', correct: false },
        ],
        hint: 'Rewrite as x⁻², then use power rule',
        concept: 'Negative Exponents'
      }
    ]
  },

  // ========== LEVEL 2: PRODUCT & QUOTIENT RULES ==========
  {
    id: 2,
    name: 'Round 3: Product & Quotient Rules',
    description: 'More complex derivative operations',
    requiredCurveMode: 'sin',
    targetPulls: 4,
    questions: [
      {
        id: 'prod-1',
        text: 'What is d/dx[x² · sin(x)]?',
        options: [
          { text: 'A) 2x·sin(x) + x²·cos(x)', correct: true },
          { text: 'B) 2x·cos(x)', correct: false },
          { text: 'C) x²·cos(x)', correct: false },
          { text: 'D) 2x·sin(x)', correct: false },
        ],
        hint: 'Product rule: (uv)\' = u\'v + uv\'',
        concept: 'Product Rule'
      },
      {
        id: 'prod-2',
        text: 'What is d/dx[(x³)(e^x)]?',
        options: [
          { text: 'A) e^x(x³ + 3x²)', correct: true },
          { text: 'B) 3x²·e^x', correct: false },
          { text: 'C) x³·e^x', correct: false },
          { text: 'D) 3x²·e^x + x³', correct: false },
        ],
        hint: 'Product rule: d/dx(uv) = u\'v + uv\'',
        concept: 'Product Rule with Exponentials'
      },
      {
        id: 'quot-1',
        text: 'What is d/dx[x/sin(x)]?',
        options: [
          { text: 'A) [sin(x) - x·cos(x)]/sin²(x)', correct: true },
          { text: 'B) 1/cos(x)', correct: false },
          { text: 'C) cos(x)/sin(x)', correct: false },
          { text: 'D) x·cos(x)/sin²(x)', correct: false },
        ],
        hint: 'Quotient rule: (u/v)\' = (u\'v - uv\')/v²',
        concept: 'Quotient Rule'
      },
      {
        id: 'quot-2',
        text: 'What is d/dx[(x² + 1)/(x - 1)]?',
        options: [
          { text: 'A) (x² - 2x - 1)/(x - 1)²', correct: true },
          { text: 'B) 2x/(x - 1)', correct: false },
          { text: 'C) (x² - 1)/(x - 1)²', correct: false },
          { text: 'D) 2x', correct: false },
        ],
        hint: 'Use quotient rule: (u\'v - uv\')/v²',
        concept: 'Quotient Rule Practice'
      },
      {
        id: 'trig-1',
        text: 'What is d/dx[cos(x)]?',
        options: [
          { text: 'A) -sin(x)', correct: true },
          { text: 'B) sin(x)', correct: false },
          { text: 'C) -cos(x)', correct: false },
          { text: 'D) cos(x)', correct: false },
        ],
        hint: 'Memorize: derivative of cos is -sin',
        concept: 'Trigonometric Derivatives'
      },
      {
        id: 'trig-2',
        text: 'What is d/dx[tan(x)]?',
        options: [
          { text: 'A) sec²(x)', correct: true },
          { text: 'B) cos²(x)', correct: false },
          { text: 'C) sin²(x)', correct: false },
          { text: 'D) csc²(x)', correct: false },
        ],
        hint: 'tan(x) = sin(x)/cos(x), use quotient rule or memorize',
        concept: 'Tangent Derivative'
      }
    ]
  },

  // ========== LEVEL 3: CHAIN RULE ==========
  {
    id: 3,
    name: 'Round 4: Chain Rule Mastery',
    description: 'Composite functions and the chain rule',
    requiredCurveMode: 'exp',
    targetPulls: 4,
    questions: [
      {
        id: 'chain-1',
        text: 'What is d/dx[sin(2x)]?',
        options: [
          { text: 'A) 2cos(2x)', correct: true },
          { text: 'B) cos(2x)', correct: false },
          { text: 'C) 2sin(2x)', correct: false },
          { text: 'D) -2cos(2x)', correct: false },
        ],
        hint: 'Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)',
        concept: 'Chain Rule'
      },
      {
        id: 'chain-2',
        text: 'What is d/dx[(x² + 1)⁵]?',
        options: [
          { text: 'A) 10x(x² + 1)⁴', correct: true },
          { text: 'B) 5(x² + 1)⁴', correct: false },
          { text: 'C) 10x(x² + 1)', correct: false },
          { text: 'D) 5x²(x² + 1)⁴', correct: false },
        ],
        hint: 'Outer derivative times inner derivative',
        concept: 'Chain Rule with Power'
      },
      {
        id: 'chain-3',
        text: 'What is d/dx[e^(3x)]?',
        options: [
          { text: 'A) 3e^(3x)', correct: true },
          { text: 'B) e^(3x)', correct: false },
          { text: 'C) 3x·e^(3x)', correct: false },
          { text: 'D) e^(3x)/3', correct: false },
        ],
        hint: 'Chain rule: derivative of e^u is e^u · u\'',
        concept: 'Chain Rule with Exponentials'
      },
      {
        id: 'chain-4',
        text: 'What is d/dx[ln(x²)]?',
        options: [
          { text: 'A) 2/x', correct: true },
          { text: 'B) 1/x²', correct: false },
          { text: 'C) 2x', correct: false },
          { text: 'D) 1/(2x)', correct: false },
        ],
        hint: 'Chain rule: d/dx[ln(u)] = (1/u)·u\'',
        concept: 'Logarithmic Derivatives'
      },
      {
        id: 'chain-5',
        text: 'What is d/dx[√(x² + 4)]?',
        options: [
          { text: 'A) x/√(x² + 4)', correct: true },
          { text: 'B) 1/(2√(x² + 4))', correct: false },
          { text: 'C) 2x/√(x² + 4)', correct: false },
          { text: 'D) x/(x² + 4)', correct: false },
        ],
        hint: 'Rewrite as (x² + 4)^(1/2), then chain rule',
        concept: 'Chain Rule with Radicals'
      },
      {
        id: 'chain-6',
        text: 'What is d/dx[cos(x³)]?',
        options: [
          { text: 'A) -3x²·sin(x³)', correct: true },
          { text: 'B) -sin(x³)', correct: false },
          { text: 'C) 3x²·sin(x³)', correct: false },
          { text: 'D) -x²·sin(x³)', correct: false },
        ],
        hint: 'Outer: -sin(u), Inner: 3x²',
        concept: 'Chain Rule with Trig'
      }
    ]
  },

  // ========== LEVEL 4: IMPLICIT DIFFERENTIATION ==========
  {
    id: 4,
    name: 'Round 5: Implicit Differentiation',
    description: 'Finding derivatives of implicit equations',
    requiredCurveMode: 'line',
    targetPulls: 3,
    questions: [
      {
        id: 'impl-1',
        text: 'For x² + y² = 25, what is dy/dx?',
        options: [
          { text: 'A) -x/y', correct: true },
          { text: 'B) x/y', correct: false },
          { text: 'C) -y/x', correct: false },
          { text: 'D) y/x', correct: false },
        ],
        hint: 'Differentiate both sides: 2x + 2y(dy/dx) = 0',
        concept: 'Implicit Differentiation'
      },
      {
        id: 'impl-2',
        text: 'For xy = 6, what is dy/dx?',
        options: [
          { text: 'A) -y/x', correct: true },
          { text: 'B) y/x', correct: false },
          { text: 'C) -6/x²', correct: false },
          { text: 'D) 6/x²', correct: false },
        ],
        hint: 'Use product rule on left side',
        concept: 'Implicit with Products'
      },
      {
        id: 'impl-3',
        text: 'For x² + xy + y² = 7, what is dy/dx?',
        options: [
          { text: 'A) -(2x + y)/(x + 2y)', correct: true },
          { text: 'B) (2x + y)/(x + 2y)', correct: false },
          { text: 'C) -2x/2y', correct: false },
          { text: 'D) -(x + y)/(2x + y)', correct: false },
        ],
        hint: 'Differentiate each term, collect dy/dx terms',
        concept: 'Complex Implicit Differentiation'
      },
      {
        id: 'impl-4',
        text: 'For sin(x + y) = y², what is dy/dx at (0, 0)?',
        options: [
          { text: 'A) 1', correct: true },
          { text: 'B) 0', correct: false },
          { text: 'C) -1', correct: false },
          { text: 'D) undefined', correct: false },
        ],
        hint: 'Differentiate: cos(x+y)·(1 + dy/dx) = 2y·dy/dx',
        concept: 'Implicit with Trig'
      }
    ]
  },

  // ========== LEVEL 5: RELATED RATES ==========
  {
    id: 5,
    name: 'Round 6: Related Rates',
    description: 'Applying derivatives to real-world problems',
    requiredCurveMode: 'quadratic',
    targetPulls: 3,
    questions: [
      {
        id: 'rate-1',
        text: 'A circle\'s radius grows at 2 cm/s. How fast is area growing when r = 5?',
        options: [
          { text: 'A) 20π cm²/s', correct: true },
          { text: 'B) 10π cm²/s', correct: false },
          { text: 'C) 4π cm²/s', correct: false },
          { text: 'D) 25π cm²/s', correct: false },
        ],
        hint: 'A = πr², so dA/dt = 2πr·dr/dt',
        concept: 'Related Rates - Area'
      },
      {
        id: 'rate-2',
        text: 'A ladder 10m long slides down a wall at 1 m/s. How fast does bottom move when top is 6m high?',
        options: [
          { text: 'A) 0.75 m/s', correct: true },
          { text: 'B) 1 m/s', correct: false },
          { text: 'C) 1.33 m/s', correct: false },
          { text: 'D) 0.6 m/s', correct: false },
        ],
        hint: 'x² + y² = 100, differentiate both sides',
        concept: 'Related Rates - Pythagorean'
      },
      {
        id: 'rate-3',
        text: 'A spherical balloon inflates at 100 cm³/s. How fast is radius growing when r = 5 cm?',
        options: [
          { text: 'A) 1/(π) cm/s', correct: true },
          { text: 'B) 4/(π) cm/s', correct: false },
          { text: 'C) 100/(π) cm/s', correct: false },
          { text: 'D) 1/(4π) cm/s', correct: false },
        ],
        hint: 'V = (4/3)πr³, solve for dr/dt',
        concept: 'Related Rates - Volume'
      }
    ]
  },

  // ========== LEVEL 6: OPTIMIZATION ==========
  {
    id: 6,
    name: 'Round 7: Optimization Problems',
    description: 'Finding maximum and minimum values',
    requiredCurveMode: 'sin',
    targetPulls: 3,
    questions: [
      {
        id: 'opt-1',
        text: 'What is the critical point of f(x) = x² - 4x + 3?',
        options: [
          { text: 'A) x = 2', correct: true },
          { text: 'B) x = 4', correct: false },
          { text: 'C) x = 0', correct: false },
          { text: 'D) x = 3', correct: false },
        ],
        hint: 'Set f\'(x) = 0 and solve',
        concept: 'Finding Critical Points'
      },
      {
        id: 'opt-2',
        text: 'For f(x) = x³ - 3x² + 2, the critical points are at:',
        options: [
          { text: 'A) x = 0 and x = 2', correct: true },
          { text: 'B) x = 1 and x = 2', correct: false },
          { text: 'C) x = -2 and x = 0', correct: false },
          { text: 'D) x = 3 only', correct: false },
        ],
        hint: 'f\'(x) = 3x² - 6x = 3x(x - 2) = 0',
        concept: 'Multiple Critical Points'
      },
      {
        id: 'opt-3',
        text: 'What rectangle with perimeter 100 has maximum area?',
        options: [
          { text: 'A) 25 × 25 square', correct: true },
          { text: 'B) 30 × 20', correct: false },
          { text: 'C) 40 × 10', correct: false },
          { text: 'D) 35 × 15', correct: false },
        ],
        hint: 'For fixed perimeter, square maximizes area',
        concept: 'Optimization - Geometry'
      },
      {
        id: 'opt-4',
        text: 'To maximize f(x) = -x² + 8x - 5, the optimal x is:',
        options: [
          { text: 'A) x = 4', correct: true },
          { text: 'B) x = 8', correct: false },
          { text: 'C) x = 2', correct: false },
          { text: 'D) x = 5', correct: false },
        ],
        hint: 'f\'(x) = -2x + 8 = 0',
        concept: 'Parabola Optimization'
      }
    ]
  },

  // ========== LEVEL 7: BASIC INTEGRATION ==========
  {
    id: 7,
    name: 'Round 8: Introduction to Integration',
    description: 'Anti-derivatives and basic integrals',
    requiredCurveMode: 'exp',
    targetPulls: 3,
    questions: [
      {
        id: 'int-1',
        text: 'What is ∫x² dx?',
        options: [
          { text: 'A) x³/3 + C', correct: true },
          { text: 'B) 2x + C', correct: false },
          { text: 'C) x³ + C', correct: false },
          { text: 'D) 3x² + C', correct: false },
        ],
        hint: 'Power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C',
        concept: 'Power Rule Integration'
      },
      {
        id: 'int-2',
        text: 'What is ∫(3x² + 2x - 5) dx?',
        options: [
          { text: 'A) x³ + x² - 5x + C', correct: true },
          { text: 'B) 6x + 2 + C', correct: false },
          { text: 'C) x³ + x² + C', correct: false },
          { text: 'D) 3x³ + 2x² - 5x + C', correct: false },
        ],
        hint: 'Integrate each term separately',
        concept: 'Sum Rule Integration'
      },
      {
        id: 'int-3',
        text: 'What is ∫e^x dx?',
        options: [
          { text: 'A) e^x + C', correct: true },
          { text: 'B) xe^x + C', correct: false },
          { text: 'C) e^(x+1) + C', correct: false },
          { text: 'D) e^x/x + C', correct: false },
        ],
        hint: 'e^x is its own antiderivative',
        concept: 'Exponential Integration'
      },
      {
        id: 'int-4',
        text: 'What is ∫sin(x) dx?',
        options: [
          { text: 'A) -cos(x) + C', correct: true },
          { text: 'B) cos(x) + C', correct: false },
          { text: 'C) -sin(x) + C', correct: false },
          { text: 'D) tan(x) + C', correct: false },
        ],
        hint: 'Antiderivative of sin is -cos',
        concept: 'Trig Integration'
      },
      {
        id: 'int-5',
        text: 'What is ∫1/x dx?',
        options: [
          { text: 'A) ln|x| + C', correct: true },
          { text: 'B) x² + C', correct: false },
          { text: 'C) 1/x² + C', correct: false },
          { text: 'D) log(x) + C', correct: false },
        ],
        hint: 'The antiderivative of 1/x is natural log',
        concept: 'Logarithmic Integration'
      }
    ]
  },

  // ========== LEVEL 8: DEFINITE INTEGRALS ==========
  {
    id: 8,
    name: 'Round 9: Definite Integrals',
    description: 'Calculating area under curves',
    requiredCurveMode: 'quadratic',
    targetPulls: 3,
    questions: [
      {
        id: 'def-1',
        text: 'What is ∫[0 to 2] x dx?',
        options: [
          { text: 'A) 2', correct: true },
          { text: 'B) 4', correct: false },
          { text: 'C) 1', correct: false },
          { text: 'D) 8', correct: false },
        ],
        hint: '[x²/2] from 0 to 2 = 4/2 - 0 = 2',
        concept: 'Definite Integral Evaluation'
      },
      {
        id: 'def-2',
        text: 'What is ∫[1 to 3] 2x dx?',
        options: [
          { text: 'A) 8', correct: true },
          { text: 'B) 6', correct: false },
          { text: 'C) 4', correct: false },
          { text: 'D) 10', correct: false },
        ],
        hint: '[x²] from 1 to 3 = 9 - 1 = 8',
        concept: 'Definite Integrals'
      },
      {
        id: 'def-3',
        text: 'What is ∫[0 to π] sin(x) dx?',
        options: [
          { text: 'A) 2', correct: true },
          { text: 'B) 0', correct: false },
          { text: 'C) π', correct: false },
          { text: 'D) 1', correct: false },
        ],
        hint: '[-cos(x)] from 0 to π = -(-1) - (-1) = 2',
        concept: 'Trig Definite Integrals'
      },
      {
        id: 'def-4',
        text: 'The area under y = x² from x = 0 to x = 2 is:',
        options: [
          { text: 'A) 8/3', correct: true },
          { text: 'B) 4', correct: false },
          { text: 'C) 2', correct: false },
          { text: 'D) 8', correct: false },
        ],
        hint: '∫x² dx = [x³/3] from 0 to 2',
        concept: 'Area Under Curve'
      }
    ]
  },

  // ========== LEVEL 9: ADVANCED TECHNIQUES ==========
  {
    id: 9,
    name: 'Round 10: Advanced Integration',
    description: 'Substitution and integration by parts',
    requiredCurveMode: 'sin',
    targetPulls: 3,
    questions: [
      {
        id: 'adv-1',
        text: 'What is ∫2x·e^(x²) dx using u-substitution?',
        options: [
          { text: 'A) e^(x²) + C', correct: true },
          { text: 'B) 2xe^(x²) + C', correct: false },
          { text: 'C) x²e^(x²) + C', correct: false },
          { text: 'D) e^(x²)/2 + C', correct: false },
        ],
        hint: 'Let u = x², then du = 2x dx',
        concept: 'U-Substitution'
      },
      {
        id: 'adv-2',
        text: 'What is ∫x·e^x dx using integration by parts?',
        options: [
          { text: 'A) e^x(x - 1) + C', correct: true },
          { text: 'B) xe^x + C', correct: false },
          { text: 'C) e^x + C', correct: false },
          { text: 'D) x²e^x + C', correct: false },
        ],
        hint: 'Let u = x, dv = e^x dx',
        concept: 'Integration by Parts'
      },
      {
        id: 'adv-3',
        text: 'What is ∫sin(3x) dx?',
        options: [
          { text: 'A) -cos(3x)/3 + C', correct: true },
          { text: 'B) -cos(3x) + C', correct: false },
          { text: 'C) cos(3x)/3 + C', correct: false },
          { text: 'D) -3cos(3x) + C', correct: false },
        ],
        hint: 'Use u-substitution with u = 3x',
        concept: 'Trig Substitution'
      },
      {
        id: 'adv-4',
        text: 'What is ∫1/(x² + 1) dx?',
        options: [
          { text: 'A) arctan(x) + C', correct: true },
          { text: 'B) ln(x² + 1) + C', correct: false },
          { text: 'C) -1/(x² + 1) + C', correct: false },
          { text: 'D) arcsin(x) + C', correct: false },
        ],
        hint: 'This is the derivative of arctan',
        concept: 'Inverse Trig Integration'
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
