import { useState, useRef } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const COLUMNS = ['timestamp', 'temperature', 'humidity', 'pressure', 'voltage', 'current', 'power', 'frequency']

const SAMPLE_DATA = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  timestamp: `2024-01-${String((i % 28) + 1).padStart(2, '0')} ${String(Math.floor(i / 28) * 6).padStart(2, '0')}:00`,
  temperature: +(20 + Math.sin(i * 0.3) * 8 + Math.random() * 2).toFixed(2),
  humidity: +(60 + Math.cos(i * 0.2) * 15 + Math.random() * 3).toFixed(2),
  pressure: +(1013 + Math.sin(i * 0.1) * 5 + Math.random()).toFixed(2),
  voltage: +(220 + Math.random() * 10 - 5).toFixed(2),
  current: +(5 + Math.random() * 2).toFixed(2),
  power: +(1100 + Math.random() * 200).toFixed(2),
  frequency: +(50 + (Math.random() - 0.5) * 0.2).toFixed(3),
}))

export default function VisualizationPage() {
  const [xAxis, setXAxis] = useState('temperature')
  const [yAxis, setYAxis] = useState('humidity')
  const [splitPos, setSplitPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMouseDown = () => { dragging.current = true }
  const handleMouseUp = () => { dragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPos(Math.max(20, Math.min(80, pos)))
  }

  const chartData = SAMPLE_DATA.map(d => ({
    x: d[xAxis as keyof typeof d] as number,
    y: d[yAxis as keyof typeof d] as number,
  }))

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '0', userSelect: dragging.current ? 'none' : 'auto' }}
    >
      {/* Data Pane */}
      <div style={{
        width: `${splitPos}%`,
        background: '#FFFFFF',
        border: '1px solid #D1D5DB',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid #D1D5DB',
          fontSize: '13px', fontWeight: 600, color: '#111827',
          background: '#F9FAFB', flexShrink: 0,
        }}>
          抽出結果データ
          <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>
            {SAMPLE_DATA.length} 行
          </span>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '12px', width: 'max-content', minWidth: '100%' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['#', 'timestamp', 'temperature', 'humidity', 'pressure', 'voltage'].map(col => (
                  <th key={col} style={{
                    padding: '6px 12px', textAlign: 'left',
                    borderBottom: '1px solid #D1D5DB',
                    fontWeight: 600, color: '#374151',
                    position: 'sticky', top: 0, background: '#F9FAFB',
                    whiteSpace: 'nowrap',
                    minWidth: col === '#' ? '40px' : '120px',
                    borderRight: '1px solid #D1D5DB',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DATA.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', borderRight: '1px solid #D1D5DB', textAlign: 'right' }}>{row.id}</td>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', whiteSpace: 'nowrap', borderRight: '1px solid #D1D5DB' }}>{row.timestamp}</td>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', borderRight: '1px solid #D1D5DB', textAlign: 'right' }}>{row.temperature}</td>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', borderRight: '1px solid #D1D5DB', textAlign: 'right' }}>{row.humidity}</td>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', borderRight: '1px solid #D1D5DB', textAlign: 'right' }}>{row.pressure}</td>
                  <td style={{ padding: '5px 12px', borderBottom: '1px solid #F3F4F6', borderRight: '1px solid #D1D5DB', textAlign: 'right' }}>{row.voltage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '4px', background: '#D1D5DB',
          cursor: 'col-resize', flexShrink: 0,
          borderLeft: '1px solid #D1D5DB',
          borderRight: '1px solid #D1D5DB',
        }}
      />

      {/* Graph Pane */}
      <div style={{
        flex: 1,
        background: '#FFFFFF',
        border: '1px solid #D1D5DB',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid #D1D5DB',
          background: '#F9FAFB', flexShrink: 0,
          display: 'flex', gap: '16px', alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>グラフ</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>X軸:</label>
            <select value={xAxis} onChange={e => setXAxis(e.target.value)} style={{ height: '28px', fontSize: '12px', width: '130px' }}>
              {COLUMNS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>Y軸:</label>
            <select value={yAxis} onChange={e => setYAxis(e.target.value)} style={{ height: '28px', fontSize: '12px', width: '130px' }}>
              {COLUMNS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="x"
                name={xAxis}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: xAxis, position: 'insideBottom', offset: -4, fontSize: 11, fill: '#374151' }}
              />
              <YAxis
                dataKey="y"
                name={yAxis}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: yAxis, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #D1D5DB',
                  borderRadius: '0',
                  fontSize: '12px',
                  background: '#FFFFFF',
                  boxShadow: 'none',
                }}
                cursor={{ stroke: '#D1D5DB' }}
              />
              <Scatter data={chartData} fill="#374151" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
