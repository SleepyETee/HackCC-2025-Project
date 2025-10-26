
import { create } from 'zustand'
import type { Line } from '../game/types'
import type { Anchor } from '../game/types'
import type { Question } from '../game/questions'
import type { AdventureQuestion } from '../game/gameTypes'

type UIState = {
  // Game mode
  gameMode: 'classic' | 'adventure'
  setGameMode: (mode: 'classic' | 'adventure') => void
  
  // Classic mode state
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
  resetAnswer: ()=>void
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
  
  // Adventure mode state
  adventureMode: 'classic' | 'story'
  currentSceneId: string
  currentAdventureQuestion: AdventureQuestion | null
  adventureAction: 'jump' | 'web' | null
  adventureLives: number
  adventureScore: number
  setAdventureMode: (mode: 'classic' | 'story') => void
  setCurrentSceneId: (id: string) => void
  setCurrentAdventureQuestion: (q: AdventureQuestion | null) => void
  setAdventureAction: (action: 'jump' | 'web', correct: boolean) => void
  setAdventureLives: (lives: number) => void
  addAdventureScore: (points: number) => void
}

const DEFAULT_MODE = (import.meta as unknown as any)?.env?.VITE_DEFAULT_MODE as 'classic' | 'adventure' | undefined
const DEFAULT_ADVENTURE_MODE = (import.meta as unknown as any)?.env?.VITE_DEFAULT_ADVENTURE_MODE as 'classic' | 'story' | undefined

export const useGameStore = create<UIState>((set) => ({
  // Game mode
  gameMode: DEFAULT_MODE === 'classic' ? 'classic' : 'adventure',
  setGameMode: (mode) => set({ gameMode: mode }),
  
  // Classic mode state
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
  resetAnswer: () => set({ selectedAnswer: null, answerCorrect: null }),
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
  
  // Adventure mode state
  adventureMode: DEFAULT_ADVENTURE_MODE === 'story' ? 'story' : 'classic',
  currentSceneId: 'ch1-s1',
  currentAdventureQuestion: null,
  adventureAction: null,
  adventureLives: 3,
  adventureScore: 0,
  setAdventureMode: (mode) => set({ adventureMode: mode }),
  setCurrentSceneId: (id) => set({ currentSceneId: id, currentAdventureQuestion: null }),
  setCurrentAdventureQuestion: (q) => set({ currentAdventureQuestion: q }),
  setAdventureAction: (action, correct) => {
    set({ adventureAction: action })
    // Dispatch event to game scene
    window.dispatchEvent(new CustomEvent('spidercalc-action', { 
      detail: { action, correct } 
    }))
    // Reset after action
    setTimeout(() => {
      set({ currentAdventureQuestion: null, adventureAction: null })
    }, 100)
  },
  setAdventureLives: (lives) => set({ adventureLives: lives }),
  addAdventureScore: (points) => set(s => ({ adventureScore: s.adventureScore + points }))
}))
