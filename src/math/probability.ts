
import type { Anchor, Line } from '../game/types'

export function softmax(scores: number[]): number[] {
  const max = Math.max(...scores)
  const exps = scores.map(s => Math.exp(s - max))
  const sum = exps.reduce((a,b)=>a+b,0)
  return exps.map(e => e / sum)
}

export function sampleCategorical(p: number[]): number {
  const r = Math.random()
  let acc = 0
  for (let i=0;i<p.length;i++){ acc += p[i]; if (r <= acc) return i }
  return p.length - 1
}

export function calculateEntropy(p: number[]): number {
  // Shannon entropy: -Σ(p_i * log2(p_i))
  // Lower entropy = more concentrated/confident distribution
  let entropy = 0
  for (const prob of p) {
    if (prob > 0) {
      entropy -= prob * Math.log2(prob)
    }
  }
  return entropy
}

export function calculateConfidenceBonus(p: number[]): number {
  // Lower entropy = higher confidence bonus (0-60 points)
  const entropy = calculateEntropy(p)
  const maxEntropy = Math.log2(p.length) // Max possible entropy for uniform distribution
  const normalized = 1 - (entropy / maxEntropy) // 0 (uniform) to 1 (certain)
  return Math.floor(normalized * 60)
}

export function buildProbabilities(params: {
  anchors: Anchor[],
  answerCorrect: boolean,
  line?: Line,
  f?: (x:number)=>number
}): number[] {
  const { anchors, answerCorrect, line, f } = params
  const underLine = (a: Anchor) => line ? a.y <= line.m * a.x + line.b : true
  const funcFit = (a: Anchor) => f ? -Math.abs(a.y - f(a.x)) : 0

  const alpha = 1.2
  const beta = answerCorrect ? 2.0 : -0.5
  const gamma = 1.0

  const raw = anchors.map(a => {
    const S = a.structuralScore
    const F = funcFit(a)
    const C = answerCorrect ? (underLine(a)? 1 : -0.5)
                            : (underLine(a)? -0.3 : 0.2)
    const hazardPenalty = a.hazard ? -1.0 : 0
    return alpha*S + beta*C + gamma*F + hazardPenalty
  })

  return softmax(raw)
}
