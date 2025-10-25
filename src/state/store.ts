
import { create } from 'zustand'
import type { Line } from '../game/types'
import type { Anchor } from '../game/types'
import type { Question } from '../game/questions'

type UIState = {
  line: Line
  curveFunc: ((x: number) => number) | null
  curveMode: 'line' | 'quadratic' | 'sin' | 'exp'
  selectedAnswer: number | null
  answerCorrect: boolean | null
  anchors: Anchor[]
  score: number
  combo: number
  pullsRemaining: number
  currentLevel: number
  currentQuestion: Question | null
  usedQuestionIds: string[]
  setLine: (m:number, b:number)=>void
  setCurveMode: (mode: 'line' | 'quadratic' | 'sin' | 'exp')=>void
  setAnswer: (i:number, correct:boolean)=>void
  setAnchors: (a:Anchor[])=>void
  addScore: (n:number)=>void
  incrementCombo: ()=>void
  resetCombo: ()=>void
  decrementPulls: ()=>void
  resetPulls: (n:number)=>void
  setLevel: (n:number)=>void
  setCurrentQuestion: (q: Question | null)=>void
  addUsedQuestionId: (id: string)=>void
  resetUsedQuestions: ()=>void
}

export const useGameStore = create<UIState>((set) => ({
  line: { m: 0.5, b: 2 },
  curveFunc: null,
  curveMode: 'line',
  selectedAnswer: null,
  answerCorrect: null,
  anchors: [],
  score: 0,
  combo: 0,
  pullsRemaining: 5,
  currentLevel: 0,
  currentQuestion: null,
  usedQuestionIds: [],
  setLine: (m,b)=> {
    set({ line:{m,b} })
    window.dispatchEvent(new CustomEvent('spidercalc-update-preview'))
  },
  setCurveMode: (mode)=> {
    let func = null
    if (mode === 'quadratic') func = (x:number) => x*x
    else if (mode === 'sin') func = (x:number) => Math.sin(x)
    else if (mode === 'exp') func = (x:number) => Math.exp(x * 0.3)
    set({ curveMode: mode, curveFunc: func })
    window.dispatchEvent(new CustomEvent('spidercalc-update-preview'))
  },
  setAnswer: (i,correct)=> set({ selectedAnswer:i, answerCorrect:correct }),
  setAnchors: (a)=> set({ anchors:a }),
  addScore: (n)=> set(s => ({ score: s.score + n })),
  incrementCombo: ()=> set(s => ({ combo: s.combo + 1 })),
  resetCombo: ()=> set({ combo: 0 }),
  decrementPulls: ()=> set(s => ({ pullsRemaining: s.pullsRemaining - 1 })),
  resetPulls: (n)=> set({ pullsRemaining: n }),
  setLevel: (n)=> set({ currentLevel: n }),
  setCurrentQuestion: (q)=> set({ currentQuestion: q, selectedAnswer: null, answerCorrect: null }),
  addUsedQuestionId: (id)=> set(s => ({ usedQuestionIds: [...s.usedQuestionIds, id] })),
  resetUsedQuestions: ()=> set({ usedQuestionIds: [] }),
}))
