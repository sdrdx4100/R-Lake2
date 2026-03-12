import { useState, useRef } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

// Columns available for axis selection (numeric only — excludes timestamp)
const CHART_COLS = ['温度', '湿度', '圧力', '電圧', '電流', '電力', '回転数']

// Table display columns (label: display header, key: data property)
const TABLE_COLS = [
  { label: '#',            key: 'id'         },
  { label: 'タイムスタンプ', key: 'timestamp'  },
  { label: '温度 (°C)',    key: '温度'        },
  { label: '湿度 (%)',     key: '湿度'        },
  { label: '圧力 (MPa)',   key: '圧力'        },
  { label: '電圧 (V)',     key: '電圧'        },
  { label: '回転数 (rpm)', key: '回転数'      },
]

type SampleRow = {
  id: number
  timestamp: string
  温度: number
  湿度: number
  圧力: number
  電圧: number
  電流: number
  電力: number
  回転数: number
}

const SAMPLE_DATA: SampleRow[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  timestamp: `2026-03-${String((i % 12) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:00`,
  温度:   +(80  + Math.sin(i * 0.3) * 20  + Math.random() * 5).toFixed(2),
  湿度:   +(60  + Math.cos(i * 0.2) * 15  + Math.random() * 3).toFixed(2),
  圧力:   +(0.8 + Math.sin(i * 0.1) * 0.1 + Math.random() * 0.02).toFixed(3),
  電圧:   +(220 + Math.random() * 10 - 5).toFixed(2),
  電流:   +(5   + Math.random() * 2).toFixed(2),
  電力:   +(1100 + Math.random() * 200).toFixed(2),
  回転数: Math.round(1500 + Math.sin(i * 0.15) * 300 + Math.random() * 50),
}))

export default function VisualizationPage() {
  const [xAxis, setXAxis] = useState<keyof SampleRow>('温度')
  const [yAxis, setYAxis] = useState<keyof SampleRow>('湿度')
  const [splitPos, setSplitPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handleMouseDown = () => { dragging.current = true }
  const handleMouseUp   = () => { dragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos  = ((e.clientX - rect.left) / rect.width) * 100
    setSplitPos(Math.max(20, Math.min(80, pos)))
  }

  const chartData = SAMPLE_DATA.map(d => ({
    x: d[xAxis] as number,
    y: d[yAxis] as number,
  }))

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ display: 'flex', height: 'calc(100vh - 80px)', userSelect: dragging.current ? 'none' : 'auto' }}
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
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          抽出結果データ
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>
            {SAMPLE_DATA.length} 行
          </span>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '12px', width: 'max-content', minWidth: '100%' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.key} style={{
                    padding: '6px 12px', textAlign: col.key === 'id' ? 'right' : 'left',
                    borderBottom: '1px solid #D1D5DB',
                    fontWeight: 600, color: '#374151',
                    position: 'sticky', top: 0, background: '#F9FAFB',
                    whiteSpace: 'nowrap',
                    minWidth: col.key === 'id' ? '40px' : '120px',
                    borderRight: '1px solid #D1D5DB',
                  }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DATA.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
                  {TABLE_COLS.map(col => (
                    <td key={col.key} style={{
                      padding: '5px 12px',
                      borderBottom: '1px solid #F3F4F6',
                      borderRight: '1px solid #D1D5DB',
                      whiteSpace: 'nowrap',
                      textAlign: col.key === 'id' || col.key === 'timestamp' ? (col.key === 'id' ? 'right' : 'left') : 'right',
                      color: col.key === 'id' ? '#9CA3AF' : '#111827',
                    }}>
                      {String(row[col.key as keyof SampleRow])}
                    </td>
                  ))}
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
            <select
              value={xAxis}
              onChange={e => setXAxis(e.target.value as keyof SampleRow)}
              style={{ height: '32px', fontSize: '12px', width: '130px' }}
            >
              {CHART_COLS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>Y軸:</label>
            <select
              value={yAxis}
              onChange={e => setYAxis(e.target.value as keyof SampleRow)}
              style={{ height: '32px', fontSize: '12px', width: '130px' }}
            >
              {CHART_COLS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="x"
                name={String(xAxis)}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: String(xAxis), position: 'insideBottom', offset: -8, fontSize: 11, fill: '#374151' }}
              />
              <YAxis
                dataKey="y"
                name={String(yAxis)}
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: String(yAxis), angle: -90, position: 'insideLeft', fontSize: 11, fill: '#374151' }}
              />
              <Tooltip
                contentStyle={{
                  border: '1px solid #D1D5DB',
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
