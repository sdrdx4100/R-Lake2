import { useRef, useState } from 'react'
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const CHART_COLS = ['温度', '湿度', '圧力', '電圧', '電流', '電力', '回転数']

const TABLE_COLS = [
  { label: '#', key: 'id' },
  { label: 'タイムスタンプ', key: 'timestamp' },
  { label: '温度 (°C)', key: '温度' },
  { label: '湿度 (%)', key: '湿度' },
  { label: '圧力 (MPa)', key: '圧力' },
  { label: '電圧 (V)', key: '電圧' },
  { label: '回転数 (rpm)', key: '回転数' },
] as const

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

const buildSampleData = (): SampleRow[] => Array.from({ length: 32 }, (_, index) => ({
  id: index + 1,
  timestamp: `2026-03-${String((index % 12) + 1).padStart(2, '0')} ${String(index % 24).padStart(2, '0')}:00`,
  温度: +(82 + Math.sin(index * 0.25) * 18).toFixed(2),
  湿度: +(58 + Math.cos(index * 0.2) * 14).toFixed(2),
  圧力: +(0.82 + Math.sin(index * 0.1) * 0.08).toFixed(3),
  電圧: +(220 + Math.cos(index * 0.18) * 4).toFixed(2),
  電流: +(5.5 + Math.sin(index * 0.24) * 0.8).toFixed(2),
  電力: +(1140 + Math.cos(index * 0.18) * 90).toFixed(2),
  回転数: Math.round(1480 + Math.sin(index * 0.15) * 260),
}))

export default function VisualizationPage() {
  const [rows] = useState<SampleRow[]>(() => buildSampleData())
  const [xAxis, setXAxis] = useState<keyof SampleRow>('温度')
  const [yAxis, setYAxis] = useState<keyof SampleRow>('湿度')
  const [splitPos, setSplitPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const chartData = rows.map((row) => ({
    x: row[xAxis] as number,
    y: row[yAxis] as number,
  }))

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current || !containerRef.current) {
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    const nextPosition = ((event.clientX - rect.left) / rect.width) * 100
    setSplitPos(Math.max(24, Math.min(76, nextPosition)))
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      style={{ display: 'flex', height: 'calc(100vh - 80px)', userSelect: dragging.current ? 'none' : 'auto' }}
    >
      <section style={{ width: `${splitPos}%`, background: '#FFFFFF', border: '1px solid #D1D5DB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #D1D5DB', fontSize: '13px', fontWeight: 600, color: '#111827', background: '#F3F4F6', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          抽出結果データ
          <span style={{ fontSize: '12px', fontWeight: 400, color: '#374151' }}>{rows.length} 行</span>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ borderCollapse: 'collapse', fontSize: '12px', width: 'max-content', minWidth: '100%' }}>
            <thead>
              <tr style={{ background: '#F3F4F6' }}>
                {TABLE_COLS.map((column) => (
                  <th
                    key={column.key}
                    style={{
                      padding: '8px 16px',
                      textAlign: column.key === 'id' ? 'right' : 'left',
                      borderBottom: '1px solid #D1D5DB',
                      fontWeight: 600,
                      color: '#111827',
                      position: 'sticky',
                      top: 0,
                      background: '#F3F4F6',
                      whiteSpace: 'nowrap',
                      minWidth: column.key === 'id' ? '48px' : '120px',
                      borderRight: '1px solid #D1D5DB',
                    }}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} style={{ background: index % 2 === 0 ? '#FFFFFF' : '#F3F4F6' }}>
                  {TABLE_COLS.map((column) => (
                    <td
                      key={column.key}
                      style={{
                        padding: '8px 16px',
                        borderBottom: '1px solid #D1D5DB',
                        borderRight: '1px solid #D1D5DB',
                        whiteSpace: 'nowrap',
                        textAlign: column.key === 'id' ? 'right' : column.key === 'timestamp' ? 'left' : 'right',
                        color: column.key === 'id' ? '#374151' : '#111827',
                      }}
                    >
                      {String(row[column.key as keyof SampleRow])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div
        onMouseDown={() => { dragging.current = true }}
        style={{ width: '8px', background: '#F3F4F6', cursor: 'col-resize', flexShrink: 0, borderLeft: '1px solid #D1D5DB', borderRight: '1px solid #D1D5DB' }}
      />

      <section style={{ flex: 1, background: '#FFFFFF', border: '1px solid #D1D5DB', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #D1D5DB', background: '#F3F4F6', flexShrink: 0, display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>グラフ</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>X軸:</label>
            <select value={xAxis} onChange={(event) => setXAxis(event.target.value as keyof SampleRow)} style={{ height: '32px', fontSize: '12px', width: '128px' }}>
              {CHART_COLS.map((column) => <option key={column}>{column}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#374151', whiteSpace: 'nowrap' }}>Y軸:</label>
            <select value={yAxis} onChange={(event) => setYAxis(event.target.value as keyof SampleRow)} style={{ height: '32px', fontSize: '12px', width: '128px' }}>
              {CHART_COLS.map((column) => <option key={column}>{column}</option>)}
            </select>
          </div>
        </div>
        <div style={{ flex: 1, padding: '16px', overflow: 'hidden' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
              <CartesianGrid vertical={false} stroke="#D1D5DB" />
              <XAxis
                dataKey="x"
                name={String(xAxis)}
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: String(xAxis), position: 'insideBottom', offset: -8, fontSize: 11, fill: '#374151' }}
              />
              <YAxis
                dataKey="y"
                name={String(yAxis)}
                tick={{ fontSize: 11, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={{ stroke: '#D1D5DB' }}
                label={{ value: String(yAxis), angle: -90, position: 'insideLeft', fontSize: 11, fill: '#374151' }}
              />
              <Tooltip
                contentStyle={{ border: '1px solid #D1D5DB', fontSize: '12px', background: '#FFFFFF' }}
                cursor={{ stroke: '#D1D5DB' }}
              />
              <Scatter data={chartData} fill="#374151" opacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
