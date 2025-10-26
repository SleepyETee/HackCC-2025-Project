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
          { text: '5', correct: true },
          { text: '2', correct: false },
          { text: '3', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'For continuous functions, substitute x = 2 directly',
        concept: 'Basic Limits'
      },
      {
        id: 'lim-2',
        text: 'What is lim(x→0) of (sin x)/x?',
        options: [
          { text: '1', correct: true },
          { text: '0', correct: false },
          { text: '∞', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'This is a famous limit: lim(x→0) sin(x)/x = 1',
        concept: 'Trigonometric Limits'
      },
      {
        id: 'lim-3',
        text: 'What is lim(x→∞) of 1/x?',
        options: [
          { text: '0', correct: true },
          { text: '1', correct: false },
          { text: '∞', correct: false },
          { text: '-∞', correct: false },
        ],
        hint: 'As x gets larger, 1/x gets smaller',
        concept: 'Limits at Infinity'
      },
      {
        id: 'lim-4',
        text: 'A function is continuous at x=a if:',
        options: [
          { text: 'lim(x→a) f(x) = f(a)', correct: true },
          { text: 'f(a) exists', correct: false },
          { text: 'lim(x→a) f(x) exists', correct: false },
          { text: 'f(x) is defined everywhere', correct: false },
        ],
        hint: 'Continuity requires limit equals function value',
        concept: 'Continuity Definition'
      },
      {
        id: 'lim-5',
        text: 'What is lim(x→3) of (x² - 9)/(x - 3)?',
        options: [
          { text: '6', correct: true },
          { text: '3', correct: false },
          { text: '0', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'Factor: (x-3)(x+3)/(x-3) = x+3, then substitute x=3',
        concept: 'Indeterminate Forms'
      },
      {
        id: 'lim-6',
        text: 'What is lim(x→0) of (1 - cos x)/x?',
        options: [
          { text: '0', correct: true },
          { text: '1', correct: false },
          { text: '∞', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'Use L\'Hôpital\'s rule or trigonometric identities',
        concept: 'Trigonometric Limits'
      },
      {
        id: 'lim-7',
        text: 'What is lim(x→∞) of (2x + 1)/(3x - 2)?',
        options: [
          { text: '2/3', correct: true },
          { text: '1', correct: false },
          { text: '0', correct: false },
          { text: '∞', correct: false },
        ],
        hint: 'Divide numerator and denominator by highest power of x',
        concept: 'Limits at Infinity'
      },
      {
        id: 'lim-8',
        text: 'What is lim(x→4) of √(x + 5)?',
        options: [
          { text: '3', correct: true },
          { text: '2', correct: false },
          { text: '4', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'Substitute x = 4: √(4 + 5) = √9 = 3',
        concept: 'Basic Limits'
      },
      {
        id: 'lim-9',
        text: 'What is lim(x→0) of (e^x - 1)/x?',
        options: [
          { text: '1', correct: true },
          { text: '0', correct: false },
          { text: 'e', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'This is a fundamental limit: lim(x→0) (e^x - 1)/x = 1',
        concept: 'Exponential Limits'
      },
      {
        id: 'lim-10',
        text: 'What is lim(x→2) of (x³ - 8)/(x - 2)?',
        options: [
          { text: '12', correct: true },
          { text: '8', correct: false },
          { text: '6', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'Factor: (x-2)(x²+2x+4)/(x-2) = x²+2x+4, then substitute x=2',
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
          { text: '3x²', correct: true },
          { text: 'x²', correct: false },
          { text: '3x', correct: false },
          { text: 'x³/3', correct: false },
        ],
        hint: 'Power rule: d/dx(xⁿ) = n·xⁿ⁻¹',
        concept: 'Power Rule'
      },
      {
        id: 'der-2',
        text: 'What is d/dx(5x² + 3x - 7)?',
        options: [
          { text: '10x + 3', correct: true },
          { text: '10x', correct: false },
          { text: '5x + 3', correct: false },
          { text: '10x² + 3x', correct: false },
        ],
        hint: 'Differentiate each term separately',
        concept: 'Sum Rule'
      },
      {
        id: 'der-3',
        text: 'What is d/dx(7)?',
        options: [
          { text: '0', correct: true },
          { text: '7', correct: false },
          { text: '7x', correct: false },
          { text: '1', correct: false },
        ],
        hint: 'The derivative of a constant is zero',
        concept: 'Constant Rule'
      },
      {
        id: 'der-4',
        text: 'If f(x) = x², what is f\'(2)?',
        options: [
          { text: '4', correct: true },
          { text: '2', correct: false },
          { text: '8', correct: false },
          { text: '1', correct: false },
        ],
        hint: 'f\'(x) = 2x, so f\'(2) = 2(2) = 4',
        concept: 'Evaluating Derivatives'
      },
      {
        id: 'der-5',
        text: 'What is d/dx(√x)?',
        options: [
          { text: '1/(2√x)', correct: true },
          { text: '√x/2', correct: false },
          { text: '2√x', correct: false },
          { text: '1/√x', correct: false },
        ],
        hint: 'Rewrite as x^(1/2), then use power rule',
        concept: 'Power Rule with Fractions'
      },
      {
        id: 'der-6',
        text: 'What is d/dx(1/x²)?',
        options: [
          { text: '-2/x³', correct: true },
          { text: '2/x³', correct: false },
          { text: '-1/x³', correct: false },
          { text: '1/x³', correct: false },
        ],
        hint: 'Rewrite as x⁻², then use power rule',
        concept: 'Negative Exponents'
      },
      {
        id: 'der-7',
        text: 'What is d/dx(x⁴ + 3x³ - 2x² + 5x - 1)?',
        options: [
          { text: '4x³ + 9x² - 4x + 5', correct: true },
          { text: '4x³ + 9x² - 4x', correct: false },
          { text: '4x³ + 3x² - 2x + 5', correct: false },
          { text: 'x³ + 9x² - 4x + 5', correct: false },
        ],
        hint: 'Differentiate each term using power rule',
        concept: 'Polynomial Derivatives'
      },
      {
        id: 'der-8',
        text: 'What is d/dx(2x⁵ - 7x³ + 4x)?',
        options: [
          { text: '10x⁴ - 21x² + 4', correct: true },
          { text: '10x⁴ - 21x²', correct: false },
          { text: '10x⁴ - 7x² + 4', correct: false },
          { text: '2x⁴ - 21x² + 4', correct: false },
        ],
        hint: 'Apply power rule to each term',
        concept: 'Polynomial Derivatives'
      },
      {
        id: 'der-9',
        text: 'What is d/dx(∛x)?',
        options: [
          { text: '1/(3x^(2/3))', correct: true },
          { text: '3x^(2/3)', correct: false },
          { text: '1/(3∛x)', correct: false },
          { text: '∛x/3', correct: false },
        ],
        hint: 'Rewrite as x^(1/3), then use power rule',
        concept: 'Power Rule with Fractions'
      },
      {
        id: 'der-10',
        text: 'What is d/dx(x^(-3))?',
        options: [
          { text: '-3x^(-4)', correct: true },
          { text: '3x^(-4)', correct: false },
          { text: '-3x^(-2)', correct: false },
          { text: '3x^(-2)', correct: false },
        ],
        hint: 'Power rule: d/dx(x^n) = n·x^(n-1)',
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
          { text: '2x·sin(x) + x²·cos(x)', correct: true },
          { text: '2x·cos(x)', correct: false },
          { text: 'x²·cos(x)', correct: false },
          { text: '2x·sin(x)', correct: false },
        ],
        hint: 'Product rule: (uv)\' = u\'v + uv\'',
        concept: 'Product Rule'
      },
      {
        id: 'prod-2',
        text: 'What is d/dx[(x³)(e^x)]?',
        options: [
          { text: 'e^x(x³ + 3x²)', correct: true },
          { text: '3x²·e^x', correct: false },
          { text: 'x³·e^x', correct: false },
          { text: '3x²·e^x + x³', correct: false },
        ],
        hint: 'Product rule: d/dx(uv) = u\'v + uv\'',
        concept: 'Product Rule with Exponentials'
      },
      {
        id: 'quot-1',
        text: 'What is d/dx[x/sin(x)]?',
        options: [
          { text: '[sin(x) - x·cos(x)]/sin²(x)', correct: true },
          { text: '1/cos(x)', correct: false },
          { text: 'cos(x)/sin(x)', correct: false },
          { text: 'x·cos(x)/sin²(x)', correct: false },
        ],
        hint: 'Quotient rule: (u/v)\' = (u\'v - uv\')/v²',
        concept: 'Quotient Rule'
      },
      {
        id: 'quot-2',
        text: 'What is d/dx[(x² + 1)/(x - 1)]?',
        options: [
          { text: '(x² - 2x - 1)/(x - 1)²', correct: true },
          { text: '2x/(x - 1)', correct: false },
          { text: '(x² - 1)/(x - 1)²', correct: false },
          { text: '2x', correct: false },
        ],
        hint: 'Use quotient rule: (u\'v - uv\')/v²',
        concept: 'Quotient Rule Practice'
      },
      {
        id: 'trig-1',
        text: 'What is d/dx[cos(x)]?',
        options: [
          { text: '-sin(x)', correct: true },
          { text: 'sin(x)', correct: false },
          { text: '-cos(x)', correct: false },
          { text: 'cos(x)', correct: false },
        ],
        hint: 'Memorize: derivative of cos is -sin',
        concept: 'Trigonometric Derivatives'
      },
      {
        id: 'trig-2',
        text: 'What is d/dx[tan(x)]?',
        options: [
          { text: 'sec²(x)', correct: true },
          { text: 'cos²(x)', correct: false },
          { text: 'sin²(x)', correct: false },
          { text: 'csc²(x)', correct: false },
        ],
        hint: 'tan(x) = sin(x)/cos(x), use quotient rule or memorize',
        concept: 'Tangent Derivative'
      },
      {
        id: 'prod-3',
        text: 'What is d/dx[x³ · ln(x)]?',
        options: [
          { text: '3x²·ln(x) + x²', correct: true },
          { text: '3x²·ln(x)', correct: false },
          { text: 'x²·ln(x) + x²', correct: false },
          { text: '3x² + x²', correct: false },
        ],
        hint: 'Product rule: f\'g + fg\' where f = x³, g = ln(x)',
        concept: 'Product Rule'
      },
      {
        id: 'quot-3',
        text: 'What is d/dx[(x² - 1)/(x + 1)]?',
        options: [
          { text: '1', correct: true },
          { text: 'x', correct: false },
          { text: '2x', correct: false },
          { text: 'x - 1', correct: false },
        ],
        hint: 'Factor numerator: (x-1)(x+1)/(x+1) = x-1, then differentiate',
        concept: 'Quotient Rule Simplification'
      },
      {
        id: 'trig-3',
        text: 'What is d/dx[cos(x)]?',
        options: [
          { text: '-sin(x)', correct: true },
          { text: 'sin(x)', correct: false },
          { text: 'cos(x)', correct: false },
          { text: '-cos(x)', correct: false },
        ],
        hint: 'The derivative of cos(x) is -sin(x)',
        concept: 'Cosine Derivative'
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
          { text: '2cos(2x)', correct: true },
          { text: 'cos(2x)', correct: false },
          { text: '2sin(2x)', correct: false },
          { text: '-2cos(2x)', correct: false },
        ],
        hint: 'Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)',
        concept: 'Chain Rule'
      },
      {
        id: 'chain-2',
        text: 'What is d/dx[(x² + 1)⁵]?',
        options: [
          { text: '10x(x² + 1)⁴', correct: true },
          { text: '5(x² + 1)⁴', correct: false },
          { text: '10x(x² + 1)', correct: false },
          { text: '5x²(x² + 1)⁴', correct: false },
        ],
        hint: 'Outer derivative times inner derivative',
        concept: 'Chain Rule with Power'
      },
      {
        id: 'chain-3',
        text: 'What is d/dx[e^(3x)]?',
        options: [
          { text: '3e^(3x)', correct: true },
          { text: 'e^(3x)', correct: false },
          { text: '3x·e^(3x)', correct: false },
          { text: 'e^(3x)/3', correct: false },
        ],
        hint: 'Chain rule: derivative of e^u is e^u · u\'',
        concept: 'Chain Rule with Exponentials'
      },
      {
        id: 'chain-4',
        text: 'What is d/dx[ln(x²)]?',
        options: [
          { text: '2/x', correct: true },
          { text: '1/x²', correct: false },
          { text: '2x', correct: false },
          { text: '1/(2x)', correct: false },
        ],
        hint: 'Chain rule: d/dx[ln(u)] = (1/u)·u\'',
        concept: 'Logarithmic Derivatives'
      },
      {
        id: 'chain-5',
        text: 'What is d/dx[√(x² + 4)]?',
        options: [
          { text: 'x/√(x² + 4)', correct: true },
          { text: '1/(2√(x² + 4))', correct: false },
          { text: '2x/√(x² + 4)', correct: false },
          { text: 'x/(x² + 4)', correct: false },
        ],
        hint: 'Rewrite as (x² + 4)^(1/2), then chain rule',
        concept: 'Chain Rule with Radicals'
      },
      {
        id: 'chain-6',
        text: 'What is d/dx[cos(x³)]?',
        options: [
          { text: '-3x²·sin(x³)', correct: true },
          { text: '-sin(x³)', correct: false },
          { text: '3x²·sin(x³)', correct: false },
          { text: '-x²·sin(x³)', correct: false },
        ],
        hint: 'Outer: -sin(u), Inner: 3x²',
        concept: 'Chain Rule with Trig'
      },
      {
        id: 'chain-7',
        text: 'What is d/dx[sin(3x + 2)]?',
        options: [
          { text: '3cos(3x + 2)', correct: true },
          { text: 'cos(3x + 2)', correct: false },
          { text: '3sin(3x + 2)', correct: false },
          { text: '-3cos(3x + 2)', correct: false },
        ],
        hint: 'Chain rule: outer derivative times inner derivative',
        concept: 'Chain Rule with Linear Functions'
      },
      {
        id: 'chain-8',
        text: 'What is d/dx[e^(2x + 1)]?',
        options: [
          { text: '2e^(2x + 1)', correct: true },
          { text: 'e^(2x + 1)', correct: false },
          { text: '2e^(2x)', correct: false },
          { text: 'e^(2x)', correct: false },
        ],
        hint: 'd/dx[e^u] = e^u · u\'',
        concept: 'Exponential Chain Rule'
      },
      {
        id: 'chain-9',
        text: 'What is d/dx[(2x - 1)⁴]?',
        options: [
          { text: '8(2x - 1)³', correct: true },
          { text: '4(2x - 1)³', correct: false },
          { text: '8(2x - 1)', correct: false },
          { text: '4(2x - 1)', correct: false },
        ],
        hint: 'Power rule with chain rule: 4(2x-1)³ · 2',
        concept: 'Chain Rule with Power'
      },
      {
        id: 'chain-10',
        text: 'What is d/dx[ln(3x²)]?',
        options: [
          { text: '2/x', correct: true },
          { text: '1/(3x²)', correct: false },
          { text: '6x/(3x²)', correct: false },
          { text: '1/x', correct: false },
        ],
        hint: 'Chain rule: (1/u) · u\' = (1/3x²) · 6x = 2/x',
        concept: 'Logarithmic Chain Rule'
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
          { text: '-x/y', correct: true },
          { text: 'x/y', correct: false },
          { text: '-y/x', correct: false },
          { text: 'y/x', correct: false },
        ],
        hint: 'Differentiate both sides: 2x + 2y(dy/dx) = 0',
        concept: 'Implicit Differentiation'
      },
      {
        id: 'impl-2',
        text: 'For xy = 6, what is dy/dx?',
        options: [
          { text: '-y/x', correct: true },
          { text: 'y/x', correct: false },
          { text: '-6/x²', correct: false },
          { text: '6/x²', correct: false },
        ],
        hint: 'Use product rule on left side',
        concept: 'Implicit with Products'
      },
      {
        id: 'impl-3',
        text: 'For x² + xy + y² = 7, what is dy/dx?',
        options: [
          { text: '-(2x + y)/(x + 2y)', correct: true },
          { text: '(2x + y)/(x + 2y)', correct: false },
          { text: '-2x/2y', correct: false },
          { text: '-(x + y)/(2x + y)', correct: false },
        ],
        hint: 'Differentiate each term, collect dy/dx terms',
        concept: 'Complex Implicit Differentiation'
      },
      {
        id: 'impl-4',
        text: 'For sin(x + y) = y², what is dy/dx at (0, 0)?',
        options: [
          { text: '1', correct: true },
          { text: '0', correct: false },
          { text: '-1', correct: false },
          { text: 'undefined', correct: false },
        ],
        hint: 'Differentiate: cos(x+y)·(1 + dy/dx) = 2y·dy/dx',
        concept: 'Implicit with Trig'
      },
      {
        id: 'impl-5',
        text: 'For x³ + y³ = 8, what is dy/dx?',
        options: [
          { text: '-x²/y²', correct: true },
          { text: 'x²/y²', correct: false },
          { text: '-3x²/3y²', correct: false },
          { text: 'x²/y', correct: false },
        ],
        hint: 'Differentiate: 3x² + 3y²(dy/dx) = 0',
        concept: 'Implicit Differentiation'
      },
      {
        id: 'impl-6',
        text: 'For x²y + xy² = 6, what is dy/dx?',
        options: [
          { text: '-(2xy + y²)/(x² + 2xy)', correct: true },
          { text: '(2xy + y²)/(x² + 2xy)', correct: false },
          { text: '-2xy/(x² + 2xy)', correct: false },
          { text: '-(xy + y²)/(x² + xy)', correct: false },
        ],
        hint: 'Use product rule on both terms',
        concept: 'Implicit with Products'
      },
      {
        id: 'impl-7',
        text: 'For e^(x+y) = x·y, what is dy/dx?',
        options: [
          { text: '(y - e^(x+y))/(e^(x+y) - x)', correct: true },
          { text: '(y + e^(x+y))/(e^(x+y) + x)', correct: false },
          { text: '(e^(x+y) - y)/(x - e^(x+y))', correct: false },
          { text: '(e^(x+y) + y)/(x + e^(x+y))', correct: false },
        ],
        hint: 'Differentiate: e^(x+y)·(1 + dy/dx) = y + x(dy/dx)',
        concept: 'Implicit with Exponentials'
      },
      {
        id: 'impl-8',
        text: 'For √(x² + y²) = 5, what is dy/dx?',
        options: [
          { text: '-x/y', correct: true },
          { text: 'x/y', correct: false },
          { text: '-y/x', correct: false },
          { text: 'y/x', correct: false },
        ],
        hint: 'Differentiate: (1/2)(x² + y²)^(-1/2)·(2x + 2y·dy/dx) = 0',
        concept: 'Implicit with Radicals'
      },
      {
        id: 'impl-9',
        text: 'For ln(x + y) = x·y, what is dy/dx?',
        options: [
          { text: '(y(x + y) - 1)/(1 - x(x + y))', correct: true },
          { text: '(y(x + y) + 1)/(1 + x(x + y))', correct: false },
          { text: '(1 - y(x + y))/(x(x + y) - 1)', correct: false },
          { text: '(1 + y(x + y))/(x(x + y) + 1)', correct: false },
        ],
        hint: 'Differentiate: (1 + dy/dx)/(x + y) = y + x(dy/dx)',
        concept: 'Implicit with Logarithms'
      },
      {
        id: 'impl-10',
        text: 'For x² + 2xy - y² = 1, what is dy/dx?',
        options: [
          { text: '-(x + y)/(x - y)', correct: true },
          { text: '(x + y)/(x - y)', correct: false },
          { text: '-(x - y)/(x + y)', correct: false },
          { text: '(x - y)/(x + y)', correct: false },
        ],
        hint: 'Differentiate: 2x + 2y + 2x(dy/dx) - 2y(dy/dx) = 0',
        concept: 'Complex Implicit Differentiation'
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
          { text: '20π cm²/s', correct: true },
          { text: '10π cm²/s', correct: false },
          { text: '4π cm²/s', correct: false },
          { text: '25π cm²/s', correct: false },
        ],
        hint: 'A = πr², so dA/dt = 2πr·dr/dt',
        concept: 'Related Rates - Area'
      },
      {
        id: 'rate-2',
        text: 'A ladder 10m long slides down a wall at 1 m/s. How fast does bottom move when top is 6m high?',
        options: [
          { text: '0.75 m/s', correct: true },
          { text: '1 m/s', correct: false },
          { text: '1.33 m/s', correct: false },
          { text: '0.6 m/s', correct: false },
        ],
        hint: 'x² + y² = 100, differentiate both sides',
        concept: 'Related Rates - Pythagorean'
      },
      {
        id: 'rate-3',
        text: 'A spherical balloon inflates at 100 cm³/s. How fast is radius growing when r = 5 cm?',
        options: [
          { text: '1/(π) cm/s', correct: true },
          { text: '4/(π) cm/s', correct: false },
          { text: '100/(π) cm/s', correct: false },
          { text: '1/(4π) cm/s', correct: false },
        ],
        hint: 'V = (4/3)πr³, solve for dr/dt',
        concept: 'Related Rates - Volume'
      },
      {
        id: 'rate-4',
        text: 'A cube\'s volume increases at 12 cm³/s. How fast is edge length growing when edge = 2 cm?',
        options: [
          { text: '1 cm/s', correct: true },
          { text: '2 cm/s', correct: false },
          { text: '3 cm/s', correct: false },
          { text: '4 cm/s', correct: false },
        ],
        hint: 'V = s³, so dV/dt = 3s²(ds/dt)',
        concept: 'Related Rates - Volume'
      },
      {
        id: 'rate-5',
        text: 'A cone\'s height decreases at 2 cm/s while radius increases at 1 cm/s. How fast is volume changing when h = 6, r = 3?',
        options: [
          { text: '3π cm³/s', correct: true },
          { text: '6π cm³/s', correct: false },
          { text: '9π cm³/s', correct: false },
          { text: '12π cm³/s', correct: false },
        ],
        hint: 'V = (1/3)πr²h, use product rule',
        concept: 'Related Rates - Multiple Variables'
      },
      {
        id: 'rate-6',
        text: 'A rectangle\'s length increases at 3 cm/s and width decreases at 2 cm/s. How fast is area changing when l = 8, w = 6?',
        options: [
          { text: '12 cm²/s', correct: true },
          { text: '6 cm²/s', correct: false },
          { text: '18 cm²/s', correct: false },
          { text: '24 cm²/s', correct: false },
        ],
        hint: 'A = lw, so dA/dt = w(dl/dt) + l(dw/dt)',
        concept: 'Related Rates - Area'
      },
      {
        id: 'rate-7',
        text: 'A particle moves along x² + y² = 25. When x = 3 and dx/dt = 4, what is dy/dt?',
        options: [
          { text: '-3', correct: true },
          { text: '3', correct: false },
          { text: '-4', correct: false },
          { text: '4', correct: false },
        ],
        hint: 'Differentiate: 2x(dx/dt) + 2y(dy/dt) = 0',
        concept: 'Related Rates - Implicit'
      },
      {
        id: 'rate-8',
        text: 'A street light 15 ft tall casts a shadow. A 6 ft person walks away at 4 ft/s. How fast is shadow length changing when person is 20 ft from light?',
        options: [
          { text: '8/3 ft/s', correct: true },
          { text: '4/3 ft/s', correct: false },
          { text: '2 ft/s', correct: false },
          { text: '6 ft/s', correct: false },
        ],
        hint: 'Use similar triangles: 15/s = 6/(s-x)',
        concept: 'Related Rates - Similar Triangles'
      },
      {
        id: 'rate-9',
        text: 'A trough is 12 ft long with triangular cross-section (height 4 ft, width 6 ft). Water fills at 2 ft³/min. How fast is water level rising when depth = 2 ft?',
        options: [
          { text: '1/6 ft/min', correct: true },
          { text: '1/3 ft/min', correct: false },
          { text: '1/2 ft/min', correct: false },
          { text: '2/3 ft/min', correct: false },
        ],
        hint: 'V = (1/2)bh·12, where b = 1.5h',
        concept: 'Related Rates - Volume'
      },
      {
        id: 'rate-10',
        text: 'Two cars approach intersection: Car A north at 60 mph, Car B east at 40 mph. How fast is distance between them changing when A is 3 mi north, B is 4 mi east?',
        options: [
          { text: '72 mph', correct: true },
          { text: '50 mph', correct: false },
          { text: '100 mph', correct: false },
          { text: '60 mph', correct: false },
        ],
        hint: 'Distance = √(x² + y²), differentiate with respect to time',
        concept: 'Related Rates - Distance'
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
          { text: 'x = 2', correct: true },
          { text: 'x = 4', correct: false },
          { text: 'x = 0', correct: false },
          { text: 'x = 3', correct: false },
        ],
        hint: 'Set f\'(x) = 0 and solve',
        concept: 'Finding Critical Points'
      },
      {
        id: 'opt-2',
        text: 'For f(x) = x³ - 3x² + 2, the critical points are at:',
        options: [
          { text: 'x = 0 and x = 2', correct: true },
          { text: 'x = 1 and x = 2', correct: false },
          { text: 'x = -2 and x = 0', correct: false },
          { text: 'x = 3 only', correct: false },
        ],
        hint: 'f\'(x) = 3x² - 6x = 3x(x - 2) = 0',
        concept: 'Multiple Critical Points'
      },
      {
        id: 'opt-3',
        text: 'What rectangle with perimeter 100 has maximum area?',
        options: [
          { text: '25 × 25 square', correct: true },
          { text: '30 × 20', correct: false },
          { text: '40 × 10', correct: false },
          { text: '35 × 15', correct: false },
        ],
        hint: 'For fixed perimeter, square maximizes area',
        concept: 'Optimization - Geometry'
      },
      {
        id: 'opt-4',
        text: 'To maximize f(x) = -x² + 8x - 5, the optimal x is:',
        options: [
          { text: 'x = 4', correct: true },
          { text: 'x = 8', correct: false },
          { text: 'x = 2', correct: false },
          { text: 'x = 5', correct: false },
        ],
        hint: 'f\'(x) = -2x + 8 = 0',
        concept: 'Parabola Optimization'
      },
      {
        id: 'opt-5',
        text: 'What is the maximum value of f(x) = 4x - x²?',
        options: [
          { text: '4', correct: true },
          { text: '2', correct: false },
          { text: '8', correct: false },
          { text: '16', correct: false },
        ],
        hint: 'Find critical point, then evaluate f(x)',
        concept: 'Maximum Value'
      },
      {
        id: 'opt-6',
        text: 'A farmer wants to fence a rectangular area of 200 m². What dimensions minimize fencing?',
        options: [
          { text: '10√2 × 10√2', correct: true },
          { text: '10 × 20', correct: false },
          { text: '5 × 40', correct: false },
          { text: '8 × 25', correct: false },
        ],
        hint: 'Minimize perimeter P = 2x + 2y subject to xy = 200',
        concept: 'Optimization - Geometry'
      },
      {
        id: 'opt-7',
        text: 'What is the minimum value of f(x) = x² - 6x + 10?',
        options: [
          { text: '1', correct: true },
          { text: '0', correct: false },
          { text: '3', correct: false },
          { text: '10', correct: false },
        ],
        hint: 'Complete the square or find critical point',
        concept: 'Minimum Value'
      },
      {
        id: 'opt-8',
        text: 'A box with square base and volume 1000 cm³. What dimensions minimize surface area?',
        options: [
          { text: '10 × 10 × 10', correct: true },
          { text: '5 × 5 × 40', correct: false },
          { text: '20 × 20 × 2.5', correct: false },
          { text: '8 × 8 × 15.625', correct: false },
        ],
        hint: 'Minimize S = 2x² + 4xh subject to x²h = 1000',
        concept: 'Optimization - Volume'
      },
      {
        id: 'opt-9',
        text: 'What is the critical point of f(x) = x³ - 12x?',
        options: [
          { text: 'x = ±2', correct: true },
          { text: 'x = 0', correct: false },
          { text: 'x = ±√12', correct: false },
          { text: 'x = ±4', correct: false },
        ],
        hint: 'f\'(x) = 3x² - 12 = 3(x² - 4) = 0',
        concept: 'Multiple Critical Points'
      },
      {
        id: 'opt-10',
        text: 'A cylindrical can with volume 1000 cm³. What radius minimizes surface area?',
        options: [
          { text: 'r = ∛(500/π)', correct: true },
          { text: 'r = ∛(1000/π)', correct: false },
          { text: 'r = ∛(250/π)', correct: false },
          { text: 'r = ∛(2000/π)', correct: false },
        ],
        hint: 'Minimize S = 2πr² + 2πrh subject to πr²h = 1000',
        concept: 'Optimization - Cylinder'
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
          { text: 'x³/3 + C', correct: true },
          { text: '2x + C', correct: false },
          { text: 'x³ + C', correct: false },
          { text: '3x² + C', correct: false },
        ],
        hint: 'Power rule for integration: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C',
        concept: 'Power Rule Integration'
      },
      {
        id: 'int-2',
        text: 'What is ∫(3x² + 2x - 5) dx?',
        options: [
          { text: 'x³ + x² - 5x + C', correct: true },
          { text: '6x + 2 + C', correct: false },
          { text: 'x³ + x² + C', correct: false },
          { text: '3x³ + 2x² - 5x + C', correct: false },
        ],
        hint: 'Integrate each term separately',
        concept: 'Sum Rule Integration'
      },
      {
        id: 'int-3',
        text: 'What is ∫e^x dx?',
        options: [
          { text: 'e^x + C', correct: true },
          { text: 'xe^x + C', correct: false },
          { text: 'e^(x+1) + C', correct: false },
          { text: 'e^x/x + C', correct: false },
        ],
        hint: 'e^x is its own antiderivative',
        concept: 'Exponential Integration'
      },
      {
        id: 'int-4',
        text: 'What is ∫sin(x) dx?',
        options: [
          { text: '-cos(x) + C', correct: true },
          { text: 'cos(x) + C', correct: false },
          { text: '-sin(x) + C', correct: false },
          { text: 'tan(x) + C', correct: false },
        ],
        hint: 'Antiderivative of sin is -cos',
        concept: 'Trig Integration'
      },
      {
        id: 'int-5',
        text: 'What is ∫1/x dx?',
        options: [
          { text: 'ln|x| + C', correct: true },
          { text: 'x² + C', correct: false },
          { text: '1/x² + C', correct: false },
          { text: 'log(x) + C', correct: false },
        ],
        hint: 'The antiderivative of 1/x is natural log',
        concept: 'Logarithmic Integration'
      },
      {
        id: 'int-6',
        text: 'What is ∫cos(x) dx?',
        options: [
          { text: 'sin(x) + C', correct: true },
          { text: '-sin(x) + C', correct: false },
          { text: 'cos(x) + C', correct: false },
          { text: 'tan(x) + C', correct: false },
        ],
        hint: 'The antiderivative of cos is sin',
        concept: 'Trig Integration'
      },
      {
        id: 'int-7',
        text: 'What is ∫(2x³ - 3x² + 4x - 1) dx?',
        options: [
          { text: 'x⁴/2 - x³ + 2x² - x + C', correct: true },
          { text: '6x² - 6x + 4 + C', correct: false },
          { text: 'x⁴ - x³ + 2x² - x + C', correct: false },
          { text: '2x⁴ - 3x³ + 4x² - x + C', correct: false },
        ],
        hint: 'Integrate each term using power rule',
        concept: 'Polynomial Integration'
      },
      {
        id: 'int-8',
        text: 'What is ∫x^(-2) dx?',
        options: [
          { text: '-1/x + C', correct: true },
          { text: '1/x + C', correct: false },
          { text: '-2/x + C', correct: false },
          { text: 'x^(-1) + C', correct: false },
        ],
        hint: 'Power rule: ∫x^n dx = x^(n+1)/(n+1) + C',
        concept: 'Negative Power Integration'
      },
      {
        id: 'int-9',
        text: 'What is ∫sec²(x) dx?',
        options: [
          { text: 'tan(x) + C', correct: true },
          { text: 'sec(x) + C', correct: false },
          { text: 'cot(x) + C', correct: false },
          { text: 'csc(x) + C', correct: false },
        ],
        hint: 'The antiderivative of sec² is tan',
        concept: 'Trig Integration'
      },
      {
        id: 'int-10',
        text: 'What is ∫(5x⁴ - 2x + 7) dx?',
        options: [
          { text: 'x⁵ - x² + 7x + C', correct: true },
          { text: '20x³ - 2 + C', correct: false },
          { text: '5x⁵ - 2x² + 7x + C', correct: false },
          { text: 'x⁵ - x² + C', correct: false },
        ],
        hint: 'Integrate each term separately',
        concept: 'Polynomial Integration'
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
          { text: '2', correct: true },
          { text: '4', correct: false },
          { text: '1', correct: false },
          { text: '8', correct: false },
        ],
        hint: '[x²/2] from 0 to 2 = 4/2 - 0 = 2',
        concept: 'Definite Integral Evaluation'
      },
      {
        id: 'def-2',
        text: 'What is ∫[1 to 3] 2x dx?',
        options: [
          { text: '8', correct: true },
          { text: '6', correct: false },
          { text: '4', correct: false },
          { text: '10', correct: false },
        ],
        hint: '[x²] from 1 to 3 = 9 - 1 = 8',
        concept: 'Definite Integrals'
      },
      {
        id: 'def-3',
        text: 'What is ∫[0 to π] sin(x) dx?',
        options: [
          { text: '2', correct: true },
          { text: '0', correct: false },
          { text: 'π', correct: false },
          { text: '1', correct: false },
        ],
        hint: '[-cos(x)] from 0 to π = -(-1) - (-1) = 2',
        concept: 'Trig Definite Integrals'
      },
      {
        id: 'def-4',
        text: 'The area under y = x² from x = 0 to x = 2 is:',
        options: [
          { text: '8/3', correct: true },
          { text: '4', correct: false },
          { text: '2', correct: false },
          { text: '8', correct: false },
        ],
        hint: '∫x² dx = [x³/3] from 0 to 2',
        concept: 'Area Under Curve'
      },
      {
        id: 'def-5',
        text: 'What is ∫[0 to π/2] cos(x) dx?',
        options: [
          { text: '1', correct: true },
          { text: '0', correct: false },
          { text: 'π/2', correct: false },
          { text: '2', correct: false },
        ],
        hint: '∫cos(x) dx = sin(x), evaluate from 0 to π/2',
        concept: 'Trig Definite Integrals'
      },
      {
        id: 'def-6',
        text: 'What is ∫[1 to 4] 1/x dx?',
        options: [
          { text: 'ln(4)', correct: true },
          { text: 'ln(3)', correct: false },
          { text: '1/4 - 1', correct: false },
          { text: '4 - 1', correct: false },
        ],
        hint: '∫1/x dx = ln|x|, so ln(4) - ln(1) = ln(4)',
        concept: 'Logarithmic Definite Integrals'
      },
      {
        id: 'def-7',
        text: 'What is ∫[0 to 1] (x³ + 2x) dx?',
        options: [
          { text: '5/4', correct: true },
          { text: '1', correct: false },
          { text: '3/4', correct: false },
          { text: '7/4', correct: false },
        ],
        hint: '∫(x³ + 2x) dx = [x⁴/4 + x²] from 0 to 1',
        concept: 'Polynomial Definite Integrals'
      },
      {
        id: 'def-8',
        text: 'What is ∫[0 to 2] (3x² - 2x + 1) dx?',
        options: [
          { text: '7', correct: true },
          { text: '5', correct: false },
          { text: '9', correct: false },
          { text: '11', correct: false },
        ],
        hint: '∫(3x² - 2x + 1) dx = [x³ - x² + x] from 0 to 2',
        concept: 'Polynomial Definite Integrals'
      },
      {
        id: 'def-9',
        text: 'What is ∫[0 to π] x·sin(x) dx?',
        options: [
          { text: 'π', correct: true },
          { text: '0', correct: false },
          { text: 'π/2', correct: false },
          { text: '2π', correct: false },
        ],
        hint: 'Use integration by parts: u = x, dv = sin(x) dx',
        concept: 'Integration by Parts - Definite'
      },
      {
        id: 'def-10',
        text: 'What is ∫[1 to e] 1/x dx?',
        options: [
          { text: '1', correct: true },
          { text: 'e', correct: false },
          { text: '0', correct: false },
          { text: 'e - 1', correct: false },
        ],
        hint: '∫1/x dx = ln|x|, so ln(e) - ln(1) = 1 - 0 = 1',
        concept: 'Logarithmic Definite Integrals'
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
          { text: 'e^(x²) + C', correct: true },
          { text: '2xe^(x²) + C', correct: false },
          { text: 'x²e^(x²) + C', correct: false },
          { text: 'e^(x²)/2 + C', correct: false },
        ],
        hint: 'Let u = x², then du = 2x dx',
        concept: 'U-Substitution'
      },
      {
        id: 'adv-2',
        text: 'What is ∫x·e^x dx using integration by parts?',
        options: [
          { text: 'e^x(x - 1) + C', correct: true },
          { text: 'xe^x + C', correct: false },
          { text: 'e^x + C', correct: false },
          { text: 'x²e^x + C', correct: false },
        ],
        hint: 'Let u = x, dv = e^x dx',
        concept: 'Integration by Parts'
      },
      {
        id: 'adv-3',
        text: 'What is ∫sin(3x) dx?',
        options: [
          { text: '-cos(3x)/3 + C', correct: true },
          { text: '-cos(3x) + C', correct: false },
          { text: 'cos(3x)/3 + C', correct: false },
          { text: '-3cos(3x) + C', correct: false },
        ],
        hint: 'Use u-substitution with u = 3x',
        concept: 'Trig Substitution'
      },
      {
        id: 'adv-4',
        text: 'What is ∫1/(x² + 1) dx?',
        options: [
          { text: 'arctan(x) + C', correct: true },
          { text: 'ln(x² + 1) + C', correct: false },
          { text: '-1/(x² + 1) + C', correct: false },
          { text: 'arcsin(x) + C', correct: false },
        ],
        hint: 'This is the derivative of arctan',
        concept: 'Inverse Trig Integration'
      },
      {
        id: 'adv-5',
        text: 'What is ∫x·ln(x) dx using integration by parts?',
        options: [
          { text: 'x²(ln(x) - 1/2)/2 + C', correct: true },
          { text: 'x²ln(x)/2 + C', correct: false },
          { text: 'xln(x) - x + C', correct: false },
          { text: 'x²(ln(x) + 1/2)/2 + C', correct: false },
        ],
        hint: 'Let u = ln(x), dv = x dx',
        concept: 'Integration by Parts'
      },
      {
        id: 'adv-6',
        text: 'What is ∫e^(2x) dx?',
        options: [
          { text: 'e^(2x)/2 + C', correct: true },
          { text: 'e^(2x) + C', correct: false },
          { text: '2e^(2x) + C', correct: false },
          { text: 'e^(2x)/4 + C', correct: false },
        ],
        hint: 'Use u-substitution with u = 2x',
        concept: 'Exponential Substitution'
      },
      {
        id: 'adv-7',
        text: 'What is ∫x²·e^x dx using integration by parts?',
        options: [
          { text: 'e^x(x² - 2x + 2) + C', correct: true },
          { text: 'e^x(x² + 2x + 2) + C', correct: false },
          { text: 'e^x(x² - 2x) + C', correct: false },
          { text: 'e^x(x² + 2x) + C', correct: false },
        ],
        hint: 'Apply integration by parts twice',
        concept: 'Integration by Parts - Repeated'
      },
      {
        id: 'adv-8',
        text: 'What is ∫cos(2x) dx?',
        options: [
          { text: 'sin(2x)/2 + C', correct: true },
          { text: 'sin(2x) + C', correct: false },
          { text: '2sin(2x) + C', correct: false },
          { text: '-sin(2x)/2 + C', correct: false },
        ],
        hint: 'Use u-substitution with u = 2x',
        concept: 'Trig Substitution'
      },
      {
        id: 'adv-9',
        text: 'What is ∫x·sin(x) dx using integration by parts?',
        options: [
          { text: 'sin(x) - x·cos(x) + C', correct: true },
          { text: 'x·sin(x) + cos(x) + C', correct: false },
          { text: 'sin(x) + x·cos(x) + C', correct: false },
          { text: '-sin(x) - x·cos(x) + C', correct: false },
        ],
        hint: 'Let u = x, dv = sin(x) dx',
        concept: 'Integration by Parts'
      },
      {
        id: 'adv-10',
        text: 'What is ∫1/√(1 - x²) dx?',
        options: [
          { text: 'arcsin(x) + C', correct: true },
          { text: 'arctan(x) + C', correct: false },
          { text: 'ln(1 - x²) + C', correct: false },
          { text: '-1/√(1 - x²) + C', correct: false },
        ],
        hint: 'This is the derivative of arcsin',
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
