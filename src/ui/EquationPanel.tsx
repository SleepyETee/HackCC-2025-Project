
import { useGameStore } from '../state/store'

export function EquationPanel(){
  const line = useGameStore(s=>s.line)
  const curveMode = useGameStore(s=>s.curveMode)
  const setLine = useGameStore(s=>s.setLine)
  const setCurveMode = useGameStore(s=>s.setCurveMode)
  
  return (
    <div className="panel stack">
      <div style={{ 
        fontWeight:700, 
        color: '#8b5cf6',
        fontSize: 15,
        marginBottom: 8
      }}>
        📐 Equation Control
      </div>
      
      <label style={{ color: '#e0e7ff', fontWeight: 600 }}>Function Type:</label>
      <select 
        value={curveMode} 
        onChange={e=>setCurveMode(e.target.value as any)}
        style={{ 
          padding: 10, 
          borderRadius: 8, 
          background: 'linear-gradient(135deg, #22263b, #15182b)', 
          color: '#fff', 
          border: '2px solid #8b5cf6',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        <option value="line">📏 Line (y = mx + b)</option>
        <option value="quadratic">📊 Quadratic (y = x²)</option>
        <option value="sin">〰️ Sine Wave (y = sin x)</option>
        <option value="exp">📈 Exponential (y = e^x)</option>
      </select>
      
      {curveMode === 'line' && (
        <>
          <div style={{ 
            marginTop: 8, 
            padding: 8, 
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: 6,
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}>
            <label style={{ color: '#10b981', fontWeight: 600 }}>
              m (slope): <strong style={{ color: '#fff' }}>{line.m.toFixed(2)}</strong>
            </label>
            <input 
              type="range" 
              min={-2} 
              max={2} 
              step={0.01}
              value={line.m}
              onChange={e=>setLine(parseFloat(e.target.value), line.b)}
              style={{ marginTop: 4 }}
            />
            
            <label style={{ color: '#10b981', fontWeight: 600, marginTop: 8 }}>
              b (y-intercept): <strong style={{ color: '#fff' }}>{line.b.toFixed(2)}</strong>
            </label>
            <input 
              type="range" 
              min={-4} 
              max={4} 
              step={0.05}
              value={line.b}
              onChange={e=>setLine(line.m, parseFloat(e.target.value))}
              style={{ marginTop: 4 }}
            />
          </div>
          
          <div style={{ 
            fontSize: 11, 
            opacity: 0.8, 
            marginTop: 6,
            color: '#c4b5fd',
            fontStyle: 'italic',
            padding: 6,
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 6
          }}>
            💡 Pumpkins UNDER the line are safer when you answer correctly!
          </div>
        </>
      )}
      
      {curveMode !== 'line' && (
        <div style={{ 
          fontSize: 12, 
          opacity: 0.8, 
          marginTop: 8,
          color: '#c4b5fd',
          fontStyle: 'italic',
          padding: 8,
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: 6,
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          📊 Points near the curve are favored. Adjust equation in next levels!
        </div>
      )}
    </div>
  )
}
