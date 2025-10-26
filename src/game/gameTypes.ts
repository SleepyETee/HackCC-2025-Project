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

export type AdventureAction = 'jump' | 'web'

export type AdventureMode = 'classic' | 'story'

export type AdventureSceneId = 
  | 'ch1-s1' | 'ch1-s2' | 'ch1-s3'
  | 'ch2-s1' | 'ch2-s2'
  | 'ch3-s1'
  | 'ch4-s1'

