/**
 * Game Type Definitions
 */

export type AdventureQuestion = {
  id: string
  text: string
  options: { text: string; correct: boolean; action: 'jump' | 'web' }[]
  hint?: string
  concept: string
  storyContext: string
}

