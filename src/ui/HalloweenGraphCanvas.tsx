import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../state/store'

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
  
  const line = useGameStore(s => s.line)
  const curveFunc = useGameStore(s => s.curveFunc)
  const answerCorrect = useGameStore(s => s.answerCorrect)
  const selectedAnswer = useGameStore(s => s.selectedAnswer)
  const pullsRemaining = useGameStore(s => s.pullsRemaining)
  
  // Initialize with Halloween-themed points
  useEffect(() => {
    const newPoints: Point[] = []
    
    // Create pumpkins and ghosts as anchor points
    for (let i = 0; i < 12; i++) {
      const isPumpkin = Math.random() < 0.6
      newPoints.push({
        x: Math.random() * 12 + 2,
        y: Math.random() * 7 - 3.5,
        color: isPumpkin ? THEME.pumpkin : THEME.ghost,
        isPumpkin,
        isGhost: !isPumpkin
      })
    }
    setPoints(newPoints)
    
    // Initialize flying bats
    const newBats = Array.from({ length: 5 }, () => ({
      x: Math.random() * 15,
      y: Math.random() * 10 - 5,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1
    }))
    setBats(newBats)
    
    setSpiderPos({ x: 0.5, y: 0 })
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
    
    const W = canvas.width
    const H = canvas.height
    
    // Clear with spooky gradient background
    const bgGradient = ctx.createRadialGradient(W/2, H/4, 0, W/2, H/4, W)
    bgGradient.addColorStop(0, '#1a1a2e')
    bgGradient.addColorStop(1, '#0a0a0f')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, W, H)
    
    // Coordinate system
    const xMin = -1, xMax = 15
    const yMin = -5, yMax = 5
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    
    const toScreenX = (x: number) => ((x - xMin) / xRange) * W
    const toScreenY = (y: number) => H - ((y - yMin) / yRange) * H
    const toMathX = (sx: number) => (sx / W) * xRange + xMin
    const toMathY = (sy: number) => yMax - (sy / H) * yRange
    
    // Draw FINISH LINE (Goal) at right side
    const finishX = toScreenX(14)
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
    const progressPercent = (spiderPos.x / 14) * 100
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
    
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const sx = toScreenX(x)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, H)
      ctx.stroke()
    }
    
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const sy = toScreenY(y)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(W, sy)
      ctx.stroke()
    }
    
    // Draw axes
    ctx.strokeStyle = THEME.purple
    ctx.lineWidth = 3
    
    const yAxisScreen = toScreenY(0)
    const xAxisScreen = toScreenX(0)
    
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
    
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue
      const sx = toScreenX(x)
      ctx.fillText(x.toString(), sx, yAxisScreen + 20)
    }
    
    ctx.textAlign = 'right'
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue
      const sy = toScreenY(y)
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
      for (let x = xMin; x <= xMax; x += 0.05) {
        const y = curveFunc(x)
        if (y >= yMin && y <= yMax) {
          const sx = toScreenX(x)
          const sy = toScreenY(y)
          if (firstPoint) {
            ctx.moveTo(sx, sy)
            firstPoint = false
          } else {
            ctx.lineTo(sx, sy)
          }
        }
      }
    } else {
      const x1 = xMin
      const x2 = xMax
      const y1 = line.m * x1 + line.b
      const y2 = line.m * x2 + line.b
      ctx.moveTo(toScreenX(x1), toScreenY(y1))
      ctx.lineTo(toScreenX(x2), toScreenY(y2))
    }
    ctx.stroke()
    ctx.shadowBlur = 0
    
    // Draw tangent line if enabled (CALCULUS CONCEPT!)
    if (showTangent && curveFunc) {
      const h = 0.0001
      const derivative = (curveFunc(tangentPoint.x + h) - curveFunc(tangentPoint.x - h)) / (2 * h)
      const y0 = curveFunc(tangentPoint.x)
      
      ctx.strokeStyle = THEME.green
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      const x1 = tangentPoint.x - 2
      const x2 = tangentPoint.x + 2
      const y1 = y0 + derivative * (x1 - tangentPoint.x)
      const y2 = y0 + derivative * (x2 - tangentPoint.x)
      ctx.moveTo(toScreenX(x1), toScreenY(y1))
      ctx.lineTo(toScreenX(x2), toScreenY(y2))
      ctx.stroke()
      ctx.setLineDash([])
      
      // Show derivative value
      ctx.fillStyle = THEME.green
      ctx.font = 'bold 14px monospace'
      ctx.fillText(`f'(${tangentPoint.x.toFixed(1)}) = ${derivative.toFixed(2)}`, 
        toScreenX(tangentPoint.x) + 20, toScreenY(y0) - 20)
    }
    
    // Draw area under curve (INTEGRAL CONCEPT!)
    if (showArea && curveFunc) {
      ctx.fillStyle = THEME.purple + '40'
      for (let x = 1; x < 8; x += 0.2) {
        const y = curveFunc(x)
        if (y >= 0 && y <= yMax) {
          ctx.fillRect(toScreenX(x), toScreenY(y), 
            toScreenX(x + 0.2) - toScreenX(x), 
            toScreenY(0) - toScreenY(y))
        }
      }
      
      // Calculate approximate integral
      let area = 0
      for (let x = 1; x < 8; x += 0.1) {
        const y = curveFunc(x)
        if (y >= 0) area += y * 0.1
      }
      
      ctx.fillStyle = THEME.purple
      ctx.font = 'bold 16px monospace'
      ctx.fillText(`∫ f(x)dx ≈ ${area.toFixed(2)}`, W/2, 30)
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
        const sx = toScreenX(pt.x)
        const sy = toScreenY(pt.y)
        if (i === 0) ctx.moveTo(sx, sy)
        else ctx.lineTo(sx, sy)
      })
      ctx.stroke()
      ctx.setLineDash([])
      ctx.shadowBlur = 0
      
      // Draw landing zone circle
      if (trajectoryPoints.length > 0) {
        const last = trajectoryPoints[trajectoryPoints.length - 1]
        const lx = toScreenX(last.x)
        const ly = toScreenY(last.y)
        
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
      const spiderX = toScreenX(spiderPos.x)
      const spiderY = toScreenY(spiderPos.y)
      
      points.forEach((point, i) => {
        const prob = beamProbabilities[i] || 0
        if (prob < 0.05) return // Don't draw very weak beams
        
        const sx = toScreenX(point.x)
        const sy = toScreenY(point.y)
        
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
      const sx = toScreenX(bat.x)
      const sy = toScreenY(bat.y)
      
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
      const sx = toScreenX(point.x)
      const sy = toScreenY(point.y)
      
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
    
    // Draw spider (PLAYER CHARACTER)
    const spiderX = toScreenX(spiderPos.x)
    const spiderY = toScreenY(spiderPos.y)
    
    // Spider animation state
    const spiderScale = jumpPreparing ? 0.9 + Math.sin(moonPhase * 10) * 0.1 : 1.0
    const spiderBounce = !isJumping ? Math.sin(moonPhase * 2) * 2 : 0
    
    // Spider body with glow
    ctx.save()
    ctx.translate(spiderX, spiderY + spiderBounce)
    ctx.scale(spiderScale, spiderScale)
    
    // Shadow under spider
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.beginPath()
    ctx.ellipse(0, 20, 15, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Spider body outer glow
    ctx.fillStyle = '#2d1b4e'
    ctx.shadowBlur = jumpPreparing ? 30 : 20
    ctx.shadowColor = jumpPreparing ? THEME.green : THEME.purple
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fill()
    
    // Spider body inner
    ctx.fillStyle = jumpPreparing ? THEME.green : '#8b5cf6'
    ctx.shadowBlur = jumpPreparing ? 40 : 0
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Spider legs (8 legs) - animated
    ctx.strokeStyle = '#2d1b4e'
    ctx.lineWidth = 3
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + moonPhase * 0.5
      const bend = Math.PI / 6 + (jumpPreparing ? Math.sin(moonPhase * 10) * 0.2 : 0)
      const legLength = jumpPreparing ? 20 : 22
      
      const midX = Math.cos(angle) * 12
      const midY = Math.sin(angle) * 12
      const endX = Math.cos(angle + bend) * legLength
      const endY = Math.sin(angle + bend) * legLength
      
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(midX, midY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }
    
    // Spider eyes (8 eyes!) - glowing when preparing
    ctx.fillStyle = jumpPreparing ? THEME.green : THEME.red
    ctx.shadowBlur = jumpPreparing ? 10 : 5
    ctx.shadowColor = jumpPreparing ? THEME.green : THEME.red
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(-6 + i * 4, -4, 2, 2)
      ctx.fillRect(-6 + i * 4, 2, 2, 2)
    }
    ctx.shadowBlur = 0
    
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
    
    // Draw game state instructions
    ctx.font = 'bold 16px "Comic Sans MS"'
    ctx.textAlign = 'center'
    
    if (!selectedAnswer && pullsRemaining > 0) {
      // State 1: Waiting for answer
      ctx.fillStyle = THEME.pumpkin
      ctx.shadowBlur = 10
      ctx.shadowColor = THEME.pumpkin
      ctx.fillText('👉 Answer the question on the right!', W/2, H - 20)
      ctx.shadowBlur = 0
    } else if (showBeams && !jumpPreparing) {
      // State 2: Beams shown, calculating
      ctx.fillStyle = THEME.purple
      ctx.shadowBlur = 10
      ctx.shadowColor = THEME.purple
      ctx.fillText('📊 Probability beams active...', W/2, H - 20)
      ctx.shadowBlur = 0
    } else if (jumpPreparing) {
      // State 3: Ready to jump
      ctx.fillStyle = THEME.green
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.green
      ctx.fillText('🎯 Press SPACE to JUMP!', W/2, H - 20)
      ctx.shadowBlur = 0
    } else if (isJumping) {
      // State 4: Jumping
      ctx.fillStyle = THEME.pumpkin
      ctx.shadowBlur = 15
      ctx.shadowColor = THEME.pumpkin
      ctx.fillText('🕷️ JUMPING!!!', W/2, H - 20)
      ctx.shadowBlur = 0
    }
    
  }, [line, curveFunc, spiderPos, points, bats, showTangent, tangentPoint, showArea, moonPhase, showBeams, beamProbabilities, jumpPreparing, isJumping, selectedAnswer, pullsRemaining])
  
  // Update beams when answer is selected
  useEffect(() => {
    if (selectedAnswer !== null && points.length > 0) {
      // Calculate probabilities for visualization
      const probabilities = points.map(point => {
        let score = 0
        score += point.x / 15 * 1.2
        
        let underLine = true
        if (curveFunc) {
          const curveY = curveFunc(point.x)
          underLine = point.y <= curveY + 0.5
        } else {
          const lineY = line.m * point.x + line.b
          underLine = point.y <= lineY
        }
        
        if (answerCorrect) {
          if (point.isPumpkin && underLine) score += 2.0
          else if (!point.isPumpkin) score -= 0.5
        } else {
          if (point.isGhost) score += 0.5
          else if (point.isPumpkin && underLine) score -= 0.3
        }
        
        if (point.isGhost) score -= 0.5
        return score
      })
      
      const maxScore = Math.max(...probabilities)
      const expScores = probabilities.map(s => Math.exp(s - maxScore))
      const sumExp = expScores.reduce((a, b) => a + b, 0)
      const probs = expScores.map(e => e / sumExp)
      
      setBeamProbabilities(probs)
      setShowBeams(true)
      setJumpPreparing(false) // Reset jump prep when answer changes
    } else {
      setShowBeams(false)
      setBeamProbabilities([])
      setJumpPreparing(false)
    }
  }, [selectedAnswer, answerCorrect, points, line, curveFunc])
  
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
  
  // Handle grapple with probability mechanics
  useEffect(() => {
    const handleFire = () => {
      const store = useGameStore.getState()
      const { answerCorrect } = store
      
      if (points.length === 0) return
      
      // Calculate probability for each point based on answer correctness
      const probabilities = points.map(point => {
        let score = 0
        
        // Base structural score (favor points to the right)
        score += point.x / 15 * 1.2
        
        // Check if point is "under the line"
        let underLine = true
        if (curveFunc) {
          const curveY = curveFunc(point.x)
          underLine = point.y <= curveY + 0.5 // With tolerance
        } else {
          const lineY = line.m * point.x + line.b
          underLine = point.y <= lineY
        }
        
        // Correctness modifier
        if (answerCorrect) {
          // Correct answer: boost pumpkins under the line
          if (point.isPumpkin && underLine) {
            score += 2.0
          } else if (!point.isPumpkin) {
            score -= 0.5  // Slight penalty for ghosts
          }
        } else {
          // Wrong answer: boost ghosts, penalize pumpkins
          if (point.isGhost) {
            score += 0.5
          } else if (point.isPumpkin && underLine) {
            score -= 0.3
          }
        }
        
        // Hazard penalty for ghosts
        if (point.isGhost) {
          score -= 0.5
        }
        
        return score
      })
      
      // Softmax to convert scores to probabilities
      const maxScore = Math.max(...probabilities)
      const expScores = probabilities.map(s => Math.exp(s - maxScore))
      const sumExp = expScores.reduce((a, b) => a + b, 0)
      const probs = expScores.map(e => e / sumExp)
      
      // Sample from probability distribution
      const rand = Math.random()
      let cumulative = 0
      let targetIdx = 0
      for (let i = 0; i < probs.length; i++) {
        cumulative += probs[i]
        if (rand <= cumulative) {
          targetIdx = i
          break
        }
      }
      
      const target = points[targetIdx]
      setTargetPos({ x: target.x, y: target.y })
      
      // Update score based on result
      if (target.isPumpkin) {
        store.addScore(100)  // Safe pumpkin
        if (answerCorrect) {
          store.addScore(150)  // Correctness bonus
          store.incrementCombo()
        } else {
          store.resetCombo()
        }
      } else {
        store.addScore(-100)  // Ghost penalty
        store.resetCombo()
      }
      
      store.decrementPulls()
      store.setCurrentQuestion(null)  // Load next question
      
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
          
          // Check win condition
          if (store.pullsRemaining <= 0) {
            setTimeout(() => {
              alert(`🎃 Level Complete! Final Score: ${store.score} 🕷️`)
            }, 500)
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
  }, [spiderPos, points, line, curveFunc])
  
  return (
    <div style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        style={{
          background: THEME.bg,
          borderRadius: '8px',
          display: 'block',
          cursor: 'crosshair'
        }}
      />
      
      {/* Teacher Controls Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        display: 'flex',
        gap: 8,
        pointerEvents: 'auto'
      }}>
        <button
          onClick={() => setShowTangent(!showTangent)}
          style={{
            background: showTangent ? THEME.green : 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: `2px solid ${THEME.green}`,
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 'bold'
          }}
        >
          📐 Show Derivative (Tangent)
        </button>
        
        <button
          onClick={() => setShowArea(!showArea)}
          style={{
            background: showArea ? THEME.purple : 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: `2px solid ${THEME.purple}`,
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 'bold'
          }}
        >
          📊 Show Integral (Area)
        </button>
      </div>
    </div>
  )
}

