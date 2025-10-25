
import { useGameStore } from '../state/store'

export function EquationPanel(){
  const line = useGameStore(s=>s.line)
  const curveMode = useGameStore(s=>s.curveMode)
  const setLine = useGameStore(s=>s.setLine)
  const setCurveMode = useGameStore(s=>s.setCurveMode)
  
  return (
    <div className="panel stack">
      <div style={{ fontWeight:700 }}>Equation</div>
      
      <label>Mode:</label>
      <select 
        value={curveMode} 
        onChange={e=>setCurveMode(e.target.value as any)}
        style={{ padding: 8, borderRadius: 8, background: '#22263b', color: '#fff', border: '1px solid #323855' }}
      >
        <option value="line">Line (y = mx + b)</option>
        <option value="quadratic">Quadratic (y = x²)</option>
        <option value="sin">Sinusoidal (y = sin x)</option>
        <option value="exp">Exponential (y = eˣ)</option>
      </select>
      
      {curveMode === 'line' && (
        <>
          <label>m (slope): {line.m.toFixed(2)}</label>
          <input type="range" min={-2} max={2} step={0.01}
            value={line.m}
            onChange={e=>setLine(parseFloat(e.target.value), line.b)} />
          <label>b (intercept): {line.b.toFixed(2)}</label>
          <input type="range" min={-4} max={4} step={0.05}
            value={line.b}
            onChange={e=>setLine(line.m, parseFloat(e.target.value))} />
        </>
      )}
      
      {curveMode !== 'line' && (
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
          Curve preview shown. Anchors close to curve are favored.
        </div>
      )}
    </div>
  )
}
