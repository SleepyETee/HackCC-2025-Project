import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../state/store'

interface Point {
  x: number
  y: number
  color: string
  label?: string
  isSpider?: boolean
  isHazard?: boolean
}

// Halloween theme colors
const THEME = {
  bg: '#0a0a0f',
  primary: '#ff6b35',      // Pumpkin orange
  secondary: '#8b5cf6',     // Purple
  accent: '#10b981',        // Spooky green
  danger: '#ef4444',        // Blood red
  ghost: '#e0e7ff',         // Ghost white
  web: 'rgba(139, 92, 246, 0.15)'
}

export function GraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [spiderPos, setSpiderPos] = useState({ x: 0, y: 0 })
  const [anchors, setAnchors] = useState<Point[]>([])
  const [showDerivative, setShowDerivative] = useState(false)
  const [showIntegral, setShowIntegral] = useState(false)
  const [bats, setBats] = useState<{x: number, y: number, angle: number}[]>([])
  
  const line = useGameStore(s => s.line)
  const curveMode = useGameStore(s => s.curveMode)
  const curveFunc = useGameStore(s => s.curveFunc)
  
  // Initialize spider and anchors
  useEffect(() => {
    // Generate random anchor points
    const newAnchors: Point[] = []
    for (let i = 0; i < 18; i++) {
      newAnchors.push({
        x: Math.random() * 14 + 1,  // 1 to 15
        y: Math.random() * 8 - 4,    // -4 to 4
        color: Math.random() < 0.2 ? '#ff4d4d' : '#55ffd7',
        isHazard: Math.random() < 0.2
      })
    }
    setAnchors(newAnchors)
    setSpiderPos({ x: 0.5, y: 0 })
  }, [])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const W = canvas.width
    const H = canvas.height
    
    // Coordinate system parameters
    const xMin = -1, xMax = 15
    const yMin = -5, yMax = 5
    const xRange = xMax - xMin
    const yRange = yMax - yMin
    
    // Convert math coords to screen coords
    const toScreenX = (x: number) => ((x - xMin) / xRange) * W
    const toScreenY = (y: number) => H - ((y - yMin) / yRange) * H
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)'
    ctx.lineWidth = 1
    
    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      const sx = toScreenX(x)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, H)
      ctx.stroke()
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      const sy = toScreenY(y)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(W, sy)
      ctx.stroke()
    }
    
    // Draw axes (thicker)
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)'
    ctx.lineWidth = 2
    
    // X-axis
    const yAxisScreen = toScreenY(0)
    ctx.beginPath()
    ctx.moveTo(0, yAxisScreen)
    ctx.lineTo(W, yAxisScreen)
    ctx.stroke()
    
    // Y-axis
    const xAxisScreen = toScreenX(0)
    ctx.beginPath()
    ctx.moveTo(xAxisScreen, 0)
    ctx.lineTo(xAxisScreen, H)
    ctx.stroke()
    
    // Draw axis labels
    ctx.fillStyle = '#00e5ff'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    
    // X-axis labels
    for (let x = Math.ceil(xMin); x <= xMax; x++) {
      if (x === 0) continue
      const sx = toScreenX(x)
      ctx.fillText(x.toString(), sx, yAxisScreen + 15)
      
      // Tick marks
      ctx.beginPath()
      ctx.moveTo(sx, yAxisScreen - 5)
      ctx.lineTo(sx, yAxisScreen + 5)
      ctx.stroke()
    }
    
    // Y-axis labels
    ctx.textAlign = 'right'
    for (let y = Math.ceil(yMin); y <= yMax; y++) {
      if (y === 0) continue
      const sy = toScreenY(y)
      ctx.fillText(y.toString(), xAxisScreen - 8, sy + 4)
      
      // Tick marks
      ctx.beginPath()
      ctx.moveTo(xAxisScreen - 5, sy)
      ctx.lineTo(xAxisScreen + 5, sy)
      ctx.stroke()
    }
    
    // Origin label
    ctx.fillText('0', xAxisScreen - 8, yAxisScreen + 15)
    
    // Axis titles
    ctx.font = 'italic 14px sans-serif'
    ctx.fillText('x', W - 15, yAxisScreen - 10)
    ctx.fillText('y', xAxisScreen + 15, 15)
    
    // Draw equation line or curve
    ctx.strokeStyle = '#ff8c00'
    ctx.lineWidth = 3
    ctx.beginPath()
    
    if (curveFunc) {
      // Draw curve
      let firstPoint = true
      for (let x = xMin; x <= xMax; x += 0.1) {
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
      // Draw line: y = mx + b
      const x1 = xMin
      const x2 = xMax
      const y1 = line.m * x1 + line.b
      const y2 = line.m * x2 + line.b
      
      ctx.moveTo(toScreenX(x1), toScreenY(y1))
      ctx.lineTo(toScreenX(x2), toScreenY(y2))
    }
    ctx.stroke()
    
    // Draw anchors
    anchors.forEach(point => {
      const sx = toScreenX(point.x)
      const sy = toScreenY(point.y)
      
      // Glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = point.color
      
      ctx.fillStyle = point.color
      ctx.beginPath()
      ctx.arc(sx, sy, point.isHazard ? 7 : 6, 0, Math.PI * 2)
      ctx.fill()
      
      // Reset shadow
      ctx.shadowBlur = 0
      
      // Add spikes for hazards
      if (point.isHazard) {
        ctx.strokeStyle = point.color
        ctx.lineWidth = 2
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          ctx.lineTo(sx + Math.cos(angle) * 12, sy + Math.sin(angle) * 12)
          ctx.stroke()
        }
      }
    })
    
    // Draw spider
    const spiderX = toScreenX(spiderPos.x)
    const spiderY = toScreenY(spiderPos.y)
    
    // Spider body
    ctx.fillStyle = '#ffffff'
    ctx.shadowBlur = 15
    ctx.shadowColor = '#00e5ff'
    ctx.beginPath()
    ctx.arc(spiderX, spiderY, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
    
    // Spider legs
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      ctx.beginPath()
      ctx.moveTo(spiderX, spiderY)
      ctx.lineTo(spiderX + Math.cos(angle) * 16, spiderY + Math.sin(angle) * 16)
      ctx.stroke()
    }
    
    // Spider coordinate label
    ctx.fillStyle = '#000'
    ctx.fillRect(spiderX - 35, spiderY - 35, 70, 20)
    ctx.fillStyle = '#fff'
    ctx.font = '11px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`(${spiderPos.x.toFixed(1)}, ${spiderPos.y.toFixed(1)})`, spiderX, spiderY - 22)
    
  }, [line, curveMode, curveFunc, spiderPos, anchors])
  
  // Handle grapple (for demo)
  useEffect(() => {
    const handleFire = () => {
      // Pick a random anchor
      if (anchors.length > 0) {
        const target = anchors[Math.floor(Math.random() * anchors.length)]
        
        // Animate spider to target
        const startX = spiderPos.x
        const startY = spiderPos.y
        const endX = target.x
        const endY = target.y
        
        let progress = 0
        const animate = () => {
          progress += 0.02
          if (progress >= 1) {
            setSpiderPos({ x: endX, y: endY })
            return
          }
          
          const newX = startX + (endX - startX) * progress
          const newY = startY + (endY - startY) * progress
          setSpiderPos({ x: newX, y: newY })
          requestAnimationFrame(animate)
        }
        animate()
      }
    }
    
    window.addEventListener('spidercalc-fire', handleFire)
    return () => window.removeEventListener('spidercalc-fire', handleFire)
  }, [spiderPos, anchors])
  
  return (
    <canvas
      ref={canvasRef}
      width={960}
      height={540}
      style={{
        background: '#0b0b14',
        borderRadius: '8px',
        display: 'block'
      }}
    />
  )
}

