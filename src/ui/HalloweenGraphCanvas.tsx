import { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useGameStore } from '../state/store'
import { getLevel } from '../game/questions'
import { ViewState, toSx, toSy, toX, toY, zoomAround, panByPixels, resetView, fitToData, getRect } from '../game/view'
import { softmax, sampleCategorical } from '../math/probability'

/**
 * CLASSIC MODE - PROBABILITY-BASED GRAPPLING GAME
 * 
 * HOW IT WORKS:
 * 
 * 1. OBJECTIVE: Move the spider from left (x=0) to the FINISH LINE (x=14)
 * 
 * 2. GAMEPLAY LOOP:
 *    a) Answer a calculus question
 *    b) Click "FIRE!" button
 *    c) Spider grapples to a random anchor point based on PROBABILITY
 *    d) Score changes based on where you land
 *    e) Repeat until you reach the finish (on pumpkin with positive score) or fail
 * 
 * 3. PROBABILITY MECHANICS:
 *    - Each anchor point (pumpkin/ghost) has a probability of being selected
 *    - Probabilities shown as glowing beams from spider
 *    - CORRECT answer → Higher probability for safe pumpkins (especially under the line)
 *    - WRONG answer → Higher probability for dangerous ghosts
 * 
 * 4. EQUATION CURVE:
 *    - Adjust the line/curve with equation controls
 *    - Points UNDER the curve are "safe zones" when you answer correctly
 *    - Strategic: Position the line to make safe pumpkins more accessible
 * 
 * 5. SCORING:
 *    - Regular 🎃 Pumpkin + Correct: +30 points
 *    - Regular 👻 Ghost + Wrong: -50 points
 *    - Finish Line 🎃 Pumpkin + Correct: +200 points (big bonus!)
 *    - Finish Line 👻 Ghost + Wrong: -100 points (big penalty!)
 *    - Build combos for multipliers!
 * 
 * 6. WIN/LOSE:
 *    - WIN: Spider reaches x ≥ 14 (finish line) on pumpkin with score ≥ 0 → Advance to next round
 *    - LOSE: Run out of pulls before finish OR land on ghost at finish OR finish with negative score → Retry current round
 */

interface Point {
  x: number
  y: number
  color: string
  isPumpkin?: boolean
  isGhost?: boolean
}

// Halloween theme colors
const THEME = {
  bg: '#0a0a0f',
  pumpkin: '#ff6b35',
  purple: '#8b5cf6',
  green: '#10b981',
  red: '#ef4444',
  ghost: '#e0e7ff',
  web: 'rgba(139, 92, 246, 0.15)',
  moonlight: 'rgba(255, 255, 255, 0.1)'
}

// ---- Classic mode constants & helpers ----
const FINISH_X = 14; // one source of truth

const GOAL_BAND = { min: FINISH_X + 0.4, max: FINISH_X + 2.0 }; // guarantee a pumpkin past finish
const HAZARD_RATIO = 0.40;   // 40% ghosts, 60% pumpkins
const STRUCTURAL_WEIGHT = 1.2;
const UNDERLINE_BONUS_CORRECT = 3.0;
const GHOST_PENALTY_CORRECT   = -2.0;
const GHOST_BONUS_WRONG       = 1.5;
const PUMPKIN_PENALTY_WRONG   = -1.0;
const FINISH_MAGNET_CORRECT   = 3.0;  // help end runs on correct answers
const FINISH_MAGNET_WRONG     = 0.5;  // tiny pull even when wrong

function toProbs(scores: number[]): number[] {
  return softmax(scores);
}

function sampleIndex(p: number[]): number {
  return sampleCategorical(p);
}

function computeScores(points: Point[], opts: {
  correct: boolean;
  line: { m:number; b:number };
  curveFunc?: ((x:number)=>number) | null;
}): number[] {
  const { correct, line, curveFunc } = opts;
  return points.map(p => {
    let s = 0;

    // 1) structural progress (favor rightward / near-finish)
    const normX = Math.min(p.x, FINISH_X + 2) / (FINISH_X + 2);
    s += STRUCTURAL_WEIGHT * normX;

    // 2) under line / close to curve
    let under = true;
    if (curveFunc) {
      under = p.y <= curveFunc(p.x) + 0.5; // small tolerance
    } else {
      under = p.y <= line.m * p.x + line.b;
    }

    // 3) correctness effects
    if (correct) {
      if (p.isGhost) s += GHOST_PENALTY_CORRECT;            // ghosts are bad when correct
      if (p.isPumpkin && under) s += UNDERLINE_BONUS_CORRECT;
      if (p.isPumpkin && p.x >= FINISH_X) s += FINISH_MAGNET_CORRECT;
    } else {
      if (p.isGhost) s += GHOST_BONUS_WRONG;                 // more ghosty when wrong
      if (p.isPumpkin && under) s += PUMPKIN_PENALTY_WRONG;
      if (p.isPumpkin && p.x >= FINISH_X) s += FINISH_MAGNET_WRONG;
    }

    return s;
  });
}

// Helper for crisp 1px lines
const crisp = (n: number) => Math.round(n) + 0.5

export function HalloweenGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spiderPos, setSpiderPos] = useState({ x: 0, y: 0 })
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 })
  const [points, setPoints] = useState<Point[]>([])
  const [bats, setBats] = useState<{x: number, y: number, vx: number, vy: number}[]>([])
  const [showTangent, setShowTangent] = useState(false)
  const [tangentPoint, setTangentPoint] = useState({ x: 3, y: 0 })
  const [showArea, setShowArea] = useState(false)
  const [moonPhase, setMoonPhase] = useState(0)
  const [showBeams, setShowBeams] = useState(false)
  const [beamProbabilities, setBeamProbabilities] = useState<number[]>([])
  const [isJumping, setIsJumping] = useState(false)
  const [jumpPreparing, setJumpPreparing] = useState(false)
  const [trajectoryPoints, setTrajectoryPoints] = useState<{x: number, y: number}[]>([])
  const [view, setView] = useState<ViewState>({
    base: { xMin: -2, xMax: 18, yMin: -8, yMax: 8 },
    zoom: 1.0,
    cx: 8, cy: 0
  })
  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [showFailureModal, setShowFailureModal] = useState(false)
  const [modalScore, setModalScore] = useState(0)
  const [failureReason, setFailureReason] = useState<'out_of_pulls' | 'ghost_finish' | 'negative_score'>('out_of_pulls')
  const [scoreChange, setScoreChange] = useState<{amount: number, type: 'add' | 'subtract', visible: boolean}>({amount: 0, type: 'add', visible: false})
  
  const line = useGameStore(s => s.line)
  const curveFunc = useGameStore(s => s.curveFunc)
  const curveMode = useGameStore(s => s.curveMode)
  const answerCorrect = useGameStore(s => s.answerCorrect)
  const selectedAnswer = useGameStore(s => s.selectedAnswer)
  const pullsRemaining = useGameStore(s => s.pullsRemaining)
  
  // Hi-DPI canvas setup
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')!
    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect() // CSS pixel size
      // Size the backing store in device pixels
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      // Scale the drawing context so all draws use CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('resize', resize)
    
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Mouse wheel zoom (focus on cursor)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const sx = e.clientX - rect.left
      const sy = e.clientY - rect.top
      // Convert cursor to world coords (CSS px -> world)
      const wx = toX(view, rect.width, sx)
      const wy = toY(view, rect.height, sy)
      const factor = e.deltaY < 0 ? 1.1 : 1/1.1
      setView(v => zoomAround(v, factor, wx, wy))
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', onWheel)
  }, [view])

  // Drag to pan
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let dragging = false, lastX = 0, lastY = 0

    const down = (e: MouseEvent) => { 
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    
    const move = (e: MouseEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const rect = canvas.getBoundingClientRect()
      setView(v => panByPixels(v, rect.width, rect.height, dx, dy))
      lastX = e.clientX
      lastY = e.clientY
    }
    
    const up = () => { 
      dragging = false
    }

    canvas.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    
    return () => {
      canvas.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
  }, [])
  
  // Initialize with Halloween-themed points
  useEffect(() => {
    const pts: Point[] = [];

    // (A) Guarantee a 🎃 beyond the finish so victory is possible
    const goalX = GOAL_BAND.min + Math.random() * (GOAL_BAND.max - GOAL_BAND.min); // [14.4..16.0]
    const goalY = Math.random() * 6 - 3;
    pts.push({ x: goalX, y: goalY, color: THEME.pumpkin, isPumpkin: true, isGhost: false });

    // (B) Fill remaining anchors across the field leaning to the right, mostly before FINISH_X
    const TOTAL = 15; // includes goal pumpkin
    for (let i = 1; i < TOTAL; i++) {
      const isPumpkin = Math.random() > HAZARD_RATIO;
      const x = 1 + Math.pow(Math.random(), 0.6) * (FINISH_X - 1.2); // bias right but < FINISH_X
      const y = Math.random() * 6 - 3;
      pts.push({ x, y, color: isPumpkin ? THEME.pumpkin : THEME.ghost, isPumpkin, isGhost: !isPumpkin });
    }

    // Shuffle
    pts.sort(() => Math.random() - 0.5);
    setPoints(pts);

    // bats
    const newBats = Array.from({ length: 5 }, () => ({
      x: Math.random() * 15,
      y: Math.random() * 10 - 5,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1
    }));
    setBats(newBats);

    // spider start
    setSpiderPos({ x: 0.5, y: 0 });
  }, [])
  
  // Animate bats
  useEffect(() => {
    const interval = setInterval(() => {
      setBats(prev => prev.map(bat => ({
        x: (bat.x + bat.vx + 15) % 15,
        y: bat.y + bat.vy,
        vx: bat.vx + (Math.random() - 0.5) * 0.02,
        vy: bat.vy + (Math.random() - 0.5) * 0.02
      })))
      setMoonPhase(prev => (prev + 0.01) % (Math.PI * 2))
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  // Draw everything
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Get canvas dimensions for coordinate conversion
    const rect = canvas.getBoundingClientRect()
    const W = rect.width
    const H = rect.height
    const viewRect = getRect(view, W, H)
    
    // Set consistent text properties
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Clear with spooky gradient background
    const bgGradient = ctx.createRadialGradient(W/2, H/4, 0, W/2, H/4, W)
    bgGradient.addColorStop(0, '#1a1a2e')
    bgGradient.addColorStop(1, '#0a0a0f')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, W, H)
    
    // Draw FINISH LINE (Goal) at right side
    const finishX = toSx(view, W, FINISH_X)
    ctx.fillStyle = THEME.pumpkin
    ctx.shadowBlur = 25
    ctx.shadowColor = THEME.pumpkin
    ctx.font = 'bold 24px "Comic Sans MS"'
    ctx.textAlign = 'center'
    ctx.save()
    ctx.translate(finishX, H/2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('🏁 FINISH 🏁', 0, 0)
    ctx.restore()
    ctx.shadowBlur = 0
    
    // Draw finish line stripe
    ctx.strokeStyle = THEME.pumpkin
    ctx.lineWidth = 8
    ctx.setLineDash([20, 20])
    ctx.beginPath()
    ctx.moveTo(finishX, 0)
    ctx.lineTo(finishX, H)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw progress bar showing how far spider has traveled
    const progressPercent = Math.min(100, Math.max(0, (spiderPos.x / FINISH_X) * 100))
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, 10, 200, 25)
    ctx.strokeStyle = THEME.purple
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, 200, 25)
    
    // Fill progress
    const progressGradient = ctx.createLinearGradient(10, 0, 210, 0)
    progressGradient.addColorStop(0, THEME.green)
    progressGradient.addColorStop(1, THEME.pumpkin)
    ctx.fillStyle = progressGradient
    ctx.fillRect(10, 10, (200 * progressPercent / 100), 25)
    
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`PROGRESS: ${progressPercent.toFixed(0)}%`, 110, 28)
    
    // Draw score change indicator
    if (scoreChange.visible) {
      const changeText = scoreChange.type === 'add' ? `+${scoreChange.amount}` : `-${scoreChange.amount}`;
      const changeColor = scoreChange.type === 'add' ? '#10b981' : '#ef4444';
      
      ctx.fillStyle = changeColor;
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = changeColor;
      ctx.fillText(changeText, W / 2, 50);
      ctx.shadowBlur = 0;
    }
    
    // Draw spooky moon
    const moonX = W - 80
    const moonY = 60
    ctx.fillStyle = THEME.ghost
    ctx.shadowBlur = 30
    ctx.shadowColor = THEME.ghost
    ctx.beginPath()
    ctx.arc(moonX, moonY, 30 + Math.sin(moonPhase) * 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Draw spiderweb background pattern
    ctx.strokeStyle = THEME.web
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(W/2, H/2)
      ctx.lineTo(W/2 + Math.cos(angle) * W, H/2 + Math.sin(angle) * H)
      ctx.stroke()
    }
    
    // Draw grid with Halloween colors
    ctx.strokeStyle = THEME.purple + '30'
    ctx.lineWidth = 1
    
    for (let x = Math.ceil(viewRect.xMin); x <= viewRect.xMax; x++) {
      const sx = crisp(toSx(view, W, x))
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, H)
      ctx.stroke()
    }
    
    for (let y = Math.ceil(viewRect.yMin); y <= viewRect.yMax; y++) {
      const sy = crisp(toSy(view, H, y))
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(W, sy)
      ctx.stroke()
    }
    
    // Draw axes
    ctx.strokeStyle = THEME.purple
    ctx.lineWidth = 3
    
    const yAxisScreen = toSy(view, H, 0)
    const xAxisScreen = toSx(view, W, 0)
    
    ctx.beginPath()
    ctx.moveTo(0, yAxisScreen)
    ctx.lineTo(W, yAxisScreen)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(xAxisScreen, 0)
    ctx.lineTo(xAxisScreen, H)
    ctx.stroke()
    
    // Axis labels with spooky font
    ctx.fillStyle = THEME.pumpkin
    ctx.font = 'bold 12px "Comic Sans MS", cursive'
    ctx.textAlign = 'center'
    
    for (let x = Math.ceil(viewRect.xMin); x <= viewRect.xMax; x++) {
      if (x === 0) continue
      const sx = toSx(view, W, x)
      ctx.fillText(x.toString(), sx, yAxisScreen + 20)
    }
    
    ctx.textAlign = 'right'
    for (let y = Math.ceil(viewRect.yMin); y <= viewRect.yMax; y++) {
      if (y === 0) continue
      const sy = toSy(view, H, y)
      ctx.fillText(y.toString(), xAxisScreen - 10, sy + 4)
    }
    
    // Draw equation curve/line
    ctx.strokeStyle = THEME.pumpkin
    ctx.lineWidth = 4
    ctx.shadowBlur = 10
    ctx.shadowColor = THEME.pumpkin
    ctx.beginPath()
    
    if (curveFunc) {
      let firstPoint = true
      for (let x = viewRect.xMin; x <= viewRect.xMax; x += 0.05) {
        const y = curveFunc(x)
        if (y >= viewRect.yMin && y <= viewRect.yMax) {
          const sx = toSx(view, W, x)
          const sy = toSy(view, H, y)
          if (firstPoint) {
            ctx.moveTo(sx, sy)
            firstPoint = false
          } else {
            ctx.lineTo(sx, sy)
          }
        }
      }
    } else {
      const x1 = viewRect.xMin
      const x2 = viewRect.xMax
      const y1 = line.m * x1 + line.b
      const y2 = line.m * x2 + line.b
      ctx.moveTo(toSx(view, W, x1), toSy(view, H, y1))
      ctx.lineTo(toSx(view, W, x2), toSy(view, H, y2))
    }
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Draw tangent line if enabled (CALCULUS CONCEPT!)
    if (showTangent && curveFunc) {
      const h = 0.0001
      const derivative = (curveFunc(tangentPoint.x + h) - curveFunc(tangentPoint.x - h)) / (2 * h)
      const y0 = curveFunc(tangentPoint.x)
      
      // Draw point on curve
      ctx.fillStyle = THEME.green
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.green
      ctx.beginPath()
      ctx.arc(toSx(view, W, tangentPoint.x), toSy(view, H, y0), 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Draw tangent line
      ctx.strokeStyle = THEME.green
      ctx.lineWidth = 3
      ctx.setLineDash([8, 4])
      ctx.shadowBlur = 10
      ctx.shadowColor = THEME.green
      ctx.beginPath()
      const x1 = tangentPoint.x - 3
      const x2 = tangentPoint.x + 3
      const y1 = y0 + derivative * (x1 - tangentPoint.x)
      const y2 = y0 + derivative * (x2 - tangentPoint.x)
      ctx.moveTo(toSx(view, W, x1), toSy(view, H, y1))
      ctx.lineTo(toSx(view, W, x2), toSy(view, H, y2))
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0
      
      // Show derivative value in a box
      const labelX = toSx(view, W, tangentPoint.x) + 25
      const labelY = toSy(view, H, y0) - 25
      
      ctx.fillStyle = 'rgba(16, 185, 129, 0.9)'
      ctx.fillRect(labelX - 5, labelY - 18, 110, 24)
      ctx.strokeStyle = THEME.green
      ctx.lineWidth = 2
      ctx.strokeRect(labelX - 5, labelY - 18, 110, 24)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 12px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`f'(${tangentPoint.x.toFixed(1)}) = ${derivative.toFixed(2)}`, labelX, labelY)
    }
    
    // Draw area under curve (INTEGRAL CONCEPT!)
    if (showArea && curveFunc) {
      const areaStartX = 2
      const areaEndX = Math.min(10, viewRect.xMax - 1)
      
      // Draw Riemann sum rectangles
      ctx.fillStyle = THEME.purple + '40'
      const rectWidth = 0.3
      for (let x = areaStartX; x < areaEndX; x += rectWidth) {
        const y = curveFunc(x)
        if (y >= viewRect.yMin && y <= viewRect.yMax) {
          const rectHeight = Math.max(0, y - 0)
          if (rectHeight > 0) {
            ctx.fillRect(
              toSx(view, W, x), 
              toSy(view, H, y), 
              toSx(view, W, x + rectWidth) - toSx(view, W, x), 
              toSy(view, H, 0) - toSy(view, H, y)
            )
          }
        }
      }
      
      // Calculate approximate integral
      let area = 0
      for (let x = areaStartX; x < areaEndX; x += 0.1) {
        const y = curveFunc(x)
        if (y >= 0) area += y * 0.1
      }
      
      // Show integral value in a box
      ctx.fillStyle = 'rgba(139, 92, 246, 0.9)'
      ctx.fillRect(W/2 - 80, 15, 160, 30)
      ctx.strokeStyle = THEME.purple
      ctx.lineWidth = 2
      ctx.strokeRect(W/2 - 80, 15, 160, 30)
      
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 14px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`∫ f(x)dx ≈ ${area.toFixed(2)}`, W/2, 35)
    }
    
    // Draw trajectory arc if preparing to jump
    if (jumpPreparing && trajectoryPoints.length > 0) {
      ctx.strokeStyle = THEME.green
      ctx.lineWidth = 3
      ctx.setLineDash([10, 5])
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.green
      
      ctx.beginPath()
      trajectoryPoints.forEach((pt, i) => {
        const sx = toSx(view, W, pt.x)
        const sy = toSy(view, H, pt.y)
        if (i === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      })
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0
      
      // Draw landing zone circle
      if (trajectoryPoints.length > 0) {
        const last = trajectoryPoints[trajectoryPoints.length - 1]
        const lx = toSx(view, W, last.x)
        const ly = toSy(view, H, last.y)
        
        ctx.strokeStyle = THEME.green
        ctx.lineWidth = 4
        ctx.shadowBlur = 20
        ctx.shadowColor = THEME.green
        ctx.beginPath()
        ctx.arc(lx, ly, 25 + Math.sin(moonPhase * 5) * 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.shadowBlur = 0
      }
    }
    
    // Draw probability beams if answer selected
    if (showBeams && beamProbabilities.length > 0 && !jumpPreparing) {
      const spiderX = toSx(view, W, spiderPos.x)
      const spiderY = toSy(view, H, spiderPos.y)
      
      points.forEach((point, i) => {
        const prob = beamProbabilities[i] || 0
        if (prob < 0.05) return // Don't draw very weak beams
        
        const sx = toSx(view, W, point.x)
        const sy = toSy(view, H, point.y)
        
        // Pulsing effect
        const pulse = 0.8 + Math.sin(moonPhase * 3 + i * 0.5) * 0.2
        
        // Draw beam with thickness based on probability
        ctx.strokeStyle = point.isPumpkin ? 
          `rgba(255, 107, 53, ${prob * 2.5 * pulse})` : 
          `rgba(224, 231, 255, ${prob * 1.5 * pulse})`
        ctx.lineWidth = 1 + prob * 18
        ctx.shadowBlur = 12
        ctx.shadowColor = point.isPumpkin ? THEME.pumpkin : THEME.ghost
        
        ctx.beginPath()
        ctx.moveTo(spiderX, spiderY)
        ctx.lineTo(sx, sy)
        ctx.stroke()
        
        // Draw probability percentage on high-prob beams
        if (prob > 0.15) {
          ctx.fillStyle = point.isPumpkin ? THEME.pumpkin : THEME.ghost
          ctx.font = 'bold 11px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(`${(prob * 100).toFixed(0)}%`, sx, sy - 25)
        }
      })
      ctx.shadowBlur = 0
    }
    
    // Draw flying bats
    bats.forEach(bat => {
      const sx = toSx(view, W, bat.x)
      const sy = toSy(view, H, bat.y)
      
      ctx.fillStyle = '#000'
      ctx.beginPath()
      // Bat body
      ctx.arc(sx, sy, 4, 0, Math.PI * 2)
      ctx.fill()
      
      // Bat wings
      ctx.beginPath()
      ctx.moveTo(sx - 8, sy)
      ctx.lineTo(sx - 4, sy - 6)
      ctx.lineTo(sx, sy)
      ctx.lineTo(sx + 4, sy - 6)
      ctx.lineTo(sx + 8, sy)
      ctx.fill()
    })
    
    // Draw pumpkins and ghosts
    points.forEach(point => {
      const sx = toSx(view, W, point.x)
      const sy = toSy(view, H, point.y)
      
      if (point.isPumpkin) {
        // Draw pumpkin
        ctx.fillStyle = THEME.pumpkin
        ctx.shadowBlur = 15
        ctx.shadowColor = THEME.pumpkin
        ctx.beginPath()
        ctx.arc(sx, sy, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
        
        // Jack-o-lantern face
        ctx.fillStyle = '#000'
        // Eyes
        ctx.fillRect(sx - 5, sy - 3, 3, 3)
        ctx.fillRect(sx + 2, sy - 3, 3, 3)
        // Mouth
        ctx.beginPath()
        ctx.arc(sx, sy + 2, 4, 0, Math.PI, false)
        ctx.fill()
        
        // Stem
        ctx.fillStyle = THEME.green
        ctx.fillRect(sx - 2, sy - 15, 4, 6)
      } else {
        // Draw ghost
        ctx.fillStyle = THEME.ghost
        ctx.shadowBlur = 20
        ctx.shadowColor = THEME.ghost
        ctx.beginPath()
        ctx.arc(sx, sy - 5, 10, Math.PI, 0)
        ctx.lineTo(sx + 10, sy + 8)
        ctx.lineTo(sx + 7, sy + 5)
        ctx.lineTo(sx + 4, sy + 8)
        ctx.lineTo(sx, sy + 5)
        ctx.lineTo(sx - 4, sy + 8)
        ctx.lineTo(sx - 7, sy + 5)
        ctx.lineTo(sx - 10, sy + 8)
        ctx.closePath()
        ctx.fill()
        ctx.shadowBlur = 0
        
        // Ghost eyes
        ctx.fillStyle = '#000'
        ctx.fillRect(sx - 4, sy - 5, 2, 3)
        ctx.fillRect(sx + 2, sy - 5, 2, 3)
        
        // Ghost mouth
        ctx.fillRect(sx - 2, sy, 4, 2)
      }
    })
    
    // Draw spider (PLAYER CHARACTER) - Small Cursor Style from Adventure Mode
    const spiderX = toSx(view, W, spiderPos.x)
    const spiderY = toSy(view, H, spiderPos.y)
    
    // Spider animation state
    const spiderScale = jumpPreparing ? 0.9 + Math.sin(moonPhase * 10) * 0.1 : 1.0
    const spiderBounce = !isJumping ? Math.sin(moonPhase * 2) * 2 : 0
    
    // Spider body with glow
    ctx.save()
    ctx.translate(spiderX, spiderY + spiderBounce)
    ctx.scale(spiderScale, spiderScale)
    
    // ========== SPIDER SHADOW ==========
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(1, 12, 28, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // ========== SPIDER BODY ==========
    // Main body (smaller, more compact)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.ellipse(0, 0, 15, 11, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Body highlight (3D effect)
    ctx.fillStyle = 'rgba(51, 51, 51, 0.7)'
    ctx.beginPath()
    ctx.ellipse(-4, -3, 5, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // ========== BIG CUTE EYES ==========
    // Left eye white
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(-6, -2, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Right eye white
    ctx.beginPath()
    ctx.arc(6, -2, 6, 0, Math.PI * 2)
    ctx.fill()
    
    // Left pupil (red for spooky effect)
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(-5, -1, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Right pupil (red for spooky effect)
    ctx.beginPath()
    ctx.arc(7, -1, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // Eye shine highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.beginPath()
    ctx.arc(-6, -3, 1.5, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(6, -3, 1.5, 0, Math.PI * 2)
    ctx.fill()
    
    // ========== 8 LEGS WITH CURVED DESIGN ==========
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      const side = i < 4 ? -1 : 1
      const index = i % 4
      
      // Draw curved leg
      const startX = side * 6
      const startY = -1.5 + index * 1.5
      const midX = side * 9
      const midY = -2 + index * 1
      const endX = side * 12
      const endY = 1 + index * 1
      
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(midX, midY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }
    
    ctx.restore()
    
    // Spider coordinate label
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(spiderX - 40, spiderY - 45, 80, 22)
    ctx.strokeStyle = THEME.purple
    ctx.lineWidth = 2
    ctx.strokeRect(spiderX - 40, spiderY - 45, 80, 22)
    ctx.fillStyle = THEME.pumpkin
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`(${spiderPos.x.toFixed(1)}, ${spiderPos.y.toFixed(1)})`, spiderX, spiderY - 29)
    
    // Draw game state instructions at bottom center
    ctx.font = 'bold 14px "Arial", sans-serif'
    ctx.textAlign = 'center'
    
    if (!selectedAnswer && pullsRemaining > 0) {
      // State 1: Waiting for answer
      ctx.fillStyle = THEME.pumpkin
      ctx.shadowBlur = 10
      ctx.shadowColor = THEME.pumpkin
      ctx.fillText('📝 Step 1: Answer the question on the right! →', W/2, H - 15)
      ctx.shadowBlur = 0
    } else if (showBeams && !jumpPreparing) {
      // State 2: Beams shown, ready to fire
      ctx.fillStyle = THEME.green
      ctx.shadowBlur = 12
      ctx.shadowColor = THEME.green
      ctx.fillText('✅ Step 2: Click "🚀 FIRE!" button to grapple! ←', W/2, H - 15)
      ctx.shadowBlur = 0
    } else if (jumpPreparing) {
      // State 3: Ready to jump (showing trajectory)
      ctx.fillStyle = THEME.green
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.green
      ctx.fillText('🎯 Click FIRE or Press SPACE to JUMP!', W/2, H - 15)
      ctx.shadowBlur = 0
    } else if (isJumping) {
      // State 4: Jumping animation in progress
      ctx.fillStyle = THEME.pumpkin
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.pumpkin
      ctx.fillText('🕷️ JUMPING!!!', W/2, H - 15)
      ctx.shadowBlur = 0
    }
    
  }, [line, curveFunc, spiderPos, points, bats, showTangent, tangentPoint, showArea, moonPhase, showBeams, beamProbabilities, jumpPreparing, isJumping, selectedAnswer, pullsRemaining, view])
  
  // Handle canvas click for tangent point selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!showTangent || !curveFunc) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    
    // Convert to CSS pixels
    const cssX = e.clientX - rect.left
    const cssY = e.clientY - rect.top
    
    // Convert to world coordinates
    const mathX = toX(view, rect.width, cssX)
    const mathY = toY(view, rect.height, cssY)
    
    // Set tangent point to clicked location
    setTangentPoint({ x: mathX, y: curveFunc(mathX) })
  }
  
  // Update beams when answer is selected
  useEffect(() => {
    if (selectedAnswer !== null && points.length > 0) {
      const scores = computeScores(points, { correct: !!answerCorrect, line, curveFunc });
      const probs = toProbs(scores);
      setBeamProbabilities(probs);
      setShowBeams(true);
      setJumpPreparing(false);
    } else {
      setShowBeams(false);
      setBeamProbabilities([]);
      setJumpPreparing(false);
    }
  }, [selectedAnswer, answerCorrect, points, line, curveFunc]);
  
  // Show trajectory when user hovers over Fire button (simulated by time delay)
  useEffect(() => {
    if (showBeams && beamProbabilities.length > 0 && !isJumping) {
      // Auto-show trajectory preview after selecting answer
      const timer = setTimeout(() => {
        setJumpPreparing(true)
        
        // Calculate most likely target
        const maxProb = Math.max(...beamProbabilities)
        const targetIdx = beamProbabilities.indexOf(maxProb)
        const target = points[targetIdx]
        
        if (target) {
          // Create parabolic trajectory
          const startX = spiderPos.x
          const startY = spiderPos.y
          const endX = target.x
          const endY = target.y
          
          const trajectory: {x: number, y: number}[] = []
          for (let t = 0; t <= 1; t += 0.05) {
            const x = startX + (endX - startX) * t
            const height = Math.sin(t * Math.PI) * 3 // Arc height
            const y = startY + (endY - startY) * t - height
            trajectory.push({ x, y })
          }
          setTrajectoryPoints(trajectory)
        }
      }, 800)
      
      return () => clearTimeout(timer)
    }
  }, [showBeams, beamProbabilities, points, spiderPos, isJumping])
  
  // Listen for probability display events
  useEffect(() => {
    const handleShowProbabilities = (event: CustomEvent) => {
      const { correct } = event.detail
      
      // Calculate probabilities based on answer correctness
      const scores = computeScores(points, { 
        correct, 
        line, 
        curveFunc 
      })
      const probs = toProbs(scores)
      setBeamProbabilities(probs)
      setShowBeams(true)
    }
    
    const handleHideProbabilities = () => {
      setShowBeams(false)
    }
    
    window.addEventListener('spidercalc-show-probabilities', handleShowProbabilities as EventListener)
    window.addEventListener('spidercalc-hide-probabilities', handleHideProbabilities)
    
    return () => {
      window.removeEventListener('spidercalc-show-probabilities', handleShowProbabilities as EventListener)
      window.removeEventListener('spidercalc-hide-probabilities', handleHideProbabilities)
    }
  }, [points, line, curveFunc])

  // Handle grapple with probability mechanics
  useEffect(() => {
    const handleFire = () => {
      const store = useGameStore.getState()
      const { answerCorrect } = store
      
      if (points.length === 0) return
      
      // Use existing probabilities if beams are already shown, otherwise calculate new ones
      let probs = beamProbabilities
      if (probs.length === 0) {
        // Calculate probabilities using shared scoring
        const scores = computeScores(points, { correct: !!answerCorrect, line, curveFunc });
        probs = toProbs(scores);
        setBeamProbabilities(probs)
        setShowBeams(true)
      }

      // Sample from probability distribution
      const targetIdx = sampleIndex(probs);
      const target = points[targetIdx];
      setTargetPos({ x: target.x, y: target.y })
      
      // Update score based on result
      let totalScoreChange = 0;
      const isAtFinishLine = target.x >= FINISH_X;
      
      if (target.isPumpkin) {
        if (answerCorrect) {
          if (isAtFinishLine) {
            // Finish line pumpkin + correct = big bonus!
            store.addScore(200)
            totalScoreChange = 200;
          } else {
            // Regular pumpkin + correct = small reward
            store.addScore(30)
            totalScoreChange = 30;
          }
          store.incrementCombo()
        } else {
          // Pumpkin + wrong answer = no points (but no penalty)
          store.addScore(0)
          totalScoreChange = 0;
          store.resetCombo()
        }
      } else {
        // Landed on ghost
        if (isAtFinishLine) {
          // Finish line ghost = big penalty
          store.addScore(-100)
          totalScoreChange = -100;
        } else {
          // Regular ghost = moderate penalty
          store.addScore(-50)
          totalScoreChange = -50;
        }
        store.resetCombo()
      }
      
      // Show score change feedback
      setScoreChange({
        amount: Math.abs(totalScoreChange),
        type: totalScoreChange >= 0 ? 'add' : 'subtract',
        visible: true
      });
      
      // Hide score change after animation
      setTimeout(() => {
        setScoreChange(prev => ({ ...prev, visible: false }));
      }, 2000);
      
      // Check for negative score failure
      const newScore = store.score + totalScoreChange;
      if (newScore < 0) {
        setTimeout(() => {
          setShowFailureModal(true);
          setFailureReason('negative_score');
          setModalScore(newScore);
        }, 1000); // Wait for jump animation to complete
        return; // Don't continue with normal game flow
      }
      
      // Decrement pulls and reset for next turn
      store.decrementPulls()
      
      // Start jumping animation
      setIsJumping(true)
      setJumpPreparing(false)
      setShowBeams(false)
      
      // Animate spider JUMP with parabolic arc
      const startX = spiderPos.x
      const startY = spiderPos.y
      const endX = target.x
      const endY = target.y
      
      let progress = 0
      const animate = () => {
        progress += 0.02
        if (progress >= 1) {
          setSpiderPos({ x: endX, y: endY })
          setIsJumping(false)
          
          // Landing effect - create particle burst
          // (Visual feedback that spider landed)
          
          // CRITICAL: Reset state and load next question after animation
          setTimeout(() => {
            // Reset answer selection
            const currentStore = useGameStore.getState()
            currentStore.resetAnswer()
            // Load next question
            currentStore.setCurrentQuestion(null)
          }, 300)
          
          // Check win condition - reached the finish line or out of pulls
          if (endX >= FINISH_X) {
            // Separate outcomes based on landing type AND final score
            const finalScore = store.score;
            if (target.isPumpkin && finalScore >= 0) {
              // VICTORY with bonus (clean win)
              setTimeout(() => {
                setModalScore(finalScore)
                setShowVictoryModal(true)
              }, 600)
            } else {
              // Crossed finish on a ghost, or finished with negative score => FAIL
              const reason = target.isGhost ? 'ghost_finish' : 'negative_score';
              setTimeout(() => {
                setFailureReason(reason)
                setModalScore(finalScore)
                setShowFailureModal(true)
              }, 600)
            }
          } else if (store.pullsRemaining <= 0) {
            // Out of pulls but didn't reach finish
            setTimeout(() => {
              setFailureReason('out_of_pulls')
              setModalScore(store.score)
              setShowFailureModal(true)
            }, 600)
          }
          return
        }
        
        // Smooth easing with parabolic jump
        const t = progress
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        
        // Add jump arc (goes UP then DOWN)
        const jumpHeight = Math.sin(t * Math.PI) * 3
        
        const newX = startX + (endX - startX) * ease
        const newY = startY + (endY - startY) * ease - jumpHeight
        setSpiderPos({ x: newX, y: newY })
        requestAnimationFrame(animate)
      }
      animate()
    }
    
    window.addEventListener('spidercalc-fire', handleFire)
    return () => window.removeEventListener('spidercalc-fire', handleFire)
  }, [spiderPos, points, line, curveFunc, beamProbabilities])
  
  // Handle victory modal
  const handleVictoryNext = () => {
    setShowVictoryModal(false)
    const store = useGameStore.getState()
    
    // Reset spider position for next level
    setSpiderPos({ x: 0.5, y: 0 })
    
    // Auto-advance to next level
    const nextLevel = store.currentLevel + 1
    if (nextLevel < 10) {
      store.setLevel(nextLevel)
      store.resetUsedQuestions()
      store.setCurrentQuestion(null)
      const levelData = getLevel(nextLevel)
      if (levelData) {
        store.resetPulls(levelData.targetPulls)
        store.setCurveMode(levelData.requiredCurveMode)
      }
    } else {
      // Completed all levels!
      alert('🎉 CONGRATULATIONS! 🎉\n\nYou completed ALL 10 levels!\nYou are a CALCULUS MASTER! 🧙‍♂️✨')
      setSpiderPos({ x: 0.5, y: 0 })
      store.setLevel(0)
      store.resetUsedQuestions()
      store.setCurrentQuestion(null)
      const levelData = getLevel(0)
      if (levelData) {
        store.resetPulls(levelData.targetPulls)
        store.setCurveMode(levelData.requiredCurveMode)
      }
    }
  }
  
  // Handle failure modal
  const handleFailureRetry = () => {
    setShowFailureModal(false)
    const store = useGameStore.getState()
    
    // Reset spider position
    setSpiderPos({ x: 0.5, y: 0 })
    
    // Restart current level
    const levelData = getLevel(store.currentLevel)
    if (levelData) {
      store.resetPulls(levelData.targetPulls)
      store.resetUsedQuestions()
      store.setCurrentQuestion(null)
      // Reset score for retry
      store.addScore(-store.score)
    }
  }
  
  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          width: 960,
          height: 540,
          background: THEME.bg,
          borderRadius: '8px',
          display: 'block',
          cursor: showTangent && curveFunc ? 'crosshair' : 'default'
        }}
      />
      
      {/* Calculus Visualization Controls */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        display: 'flex',
        gap: 8,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => {
            const newState = !showTangent
            setShowTangent(newState)
            if (!newState) setShowArea(false) // Turn off area if turning off tangent
          }}
          disabled={!curveFunc}
          style={{
            background: showTangent ? THEME.green : 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: `2px solid ${THEME.green}`,
            padding: '8px 12px',
            borderRadius: 8,
            cursor: curveFunc ? 'pointer' : 'not-allowed',
            fontSize: 12,
            fontWeight: 'bold',
            opacity: curveFunc ? 1 : 0.5,
            transition: 'all 0.2s',
            boxShadow: showTangent ? `0 0 15px ${THEME.green}` : 'none'
          }}
          onMouseEnter={(e) => {
            if (curveFunc && !showTangent) {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (curveFunc && !showTangent) {
              e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
            }
          }}
        >
          📐 Derivative
        </button>
        
        <button
          onClick={() => {
            const newState = !showArea
            setShowArea(newState)
          }}
          disabled={!curveFunc}
          style={{
            background: showArea ? THEME.purple : 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: `2px solid ${THEME.purple}`,
            padding: '8px 12px',
            borderRadius: 8,
            cursor: curveFunc ? 'pointer' : 'not-allowed',
            fontSize: 12,
            fontWeight: 'bold',
            opacity: curveFunc ? 1 : 0.5,
            transition: 'all 0.2s',
            boxShadow: showArea ? `0 0 15px ${THEME.purple}` : 'none'
          }}
          onMouseEnter={(e) => {
            if (curveFunc && !showArea) {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'
            }
          }}
          onMouseLeave={(e) => {
            if (curveFunc && !showArea) {
              e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
            }
          }}
        >
          📊 Integral
        </button>
      </div>
      
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => setView(v => zoomAround(v, 1.2, v.cx, v.cy))}
          style={{
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: '2px solid #ffd700',
            padding: '6px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          🔍 +
        </button>
        <button
          onClick={() => setView(v => zoomAround(v, 1/1.2, v.cx, v.cy))}
          style={{
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: '2px solid #ffd700',
            padding: '6px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          🔍 -
        </button>
        <button
          onClick={() => setView(v => resetView(v))}
          style={{
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            border: '2px solid #ffd700',
            padding: '6px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 'bold'
          }}
        >
          🎯 Reset
        </button>
        <div style={{
          background: 'rgba(0,0,0,0.75)',
          color: '#ffd700',
          border: '2px solid #ffd700',
          padding: '4px 8px',
          borderRadius: 6,
          fontSize: 11,
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {view.zoom.toFixed(1)}×
        </div>
      </div>
      
      {/* Victory Modal */}
      {showVictoryModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #0a0a0f)',
            border: '4px solid #ffd700',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
            animation: 'scaleIn 0.4s ease-out'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎃 🏆 VICTORY! 🏆 🎃</div>
            <div style={{ fontSize: 22, color: '#10b981', marginBottom: 12 }}>
              You reached the finish line!
            </div>
            <div style={{ fontSize: 28, color: '#ffd700', marginBottom: 24 }}>
              Final Score: {modalScore}
            </div>
            <button
              onClick={handleVictoryNext}
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ffaa00)',
                color: '#000',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)'
              }}
            >
              ➡️ Next Round
            </button>
          </div>
        </div>
      )}
      
      {/* Failure Modal */}
      {showFailureModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e, #0a0a0f)',
            border: '4px solid #ff0000',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(255, 0, 0, 0.6)',
            animation: 'scaleIn 0.4s ease-out'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💀 LEVEL FAILED! 💀</div>
            <div style={{ fontSize: 20, color: '#ff6b35', marginBottom: 12 }}>
              {failureReason === 'out_of_pulls' && "You ran out of pulls before reaching the finish."}
              {failureReason === 'ghost_finish' && "You landed on a ghost at the finish line! 👻"}
              {failureReason === 'negative_score' && "Your score went negative! Game over! 📉"}
            </div>
            <div style={{ fontSize: 24, color: '#888', marginBottom: 24 }}>
              Final Score: {modalScore}
            </div>
            <button
              onClick={handleFailureRetry}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
              }}
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


