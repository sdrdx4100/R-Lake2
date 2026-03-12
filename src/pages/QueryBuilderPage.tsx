import { useState } from 'react'
import { generateId } from '../utils/uuid'

interface Condition {
  id: string
  logic: 'AND' | 'OR'
  column: string
  operator: string
  value: string
}

const COLUMNS = ['timestamp', 'sensor_id', 'temperature', 'humidity', 'pressure', 'voltage', 'current', 'power']
const OPERATORS = ['=', '≠', '>', '≥', '<', '≤', '含む', '含まない', '空白', '非空白']

const newCondition = (): Condition => ({
  id: generateId(),
  logic: 'AND',
  column: COLUMNS[0],
  operator: '=',
  value: '',
})

export default function QueryBuilderPage() {
  const [mode, setMode] = useState<'ui' | 'text'>('ui')
  const [conditions, setConditions] = useState<Condition[]>([newCondition()])
  const [rawText, setRawText] = useState('')

  const update = (id: string, field: keyof Condition, value: string) => {
    setConditions(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const duplicate = (id: string) => {
    const idx = conditions.findIndex(c => c.id === id)
    const clone = { ...conditions[idx], id: generateId() }
    setConditions(prev => [...prev.slice(0, idx + 1), clone, ...prev.slice(idx + 1)])
  }

  const remove = (id: string) => {
    setConditions(prev => prev.filter(c => c.id !== id))
  }

  const add = () => setConditions(prev => [...prev, newCondition()])

  const colW = { logic: '80px', column: '160px', operator: '100px', value: '200px' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB' }}>
        {/* Header with tabs */}
        <div style={{
          borderBottom: '1px solid #D1D5DB',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 16px',
        }}>
          <h2 style={{ margin: '12px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            INDEX条件抽出設定
          </h2>
          <div style={{ display: 'flex', gap: '0' }}>
            {(['ui', 'text'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  height: '32px', padding: '0 16px',
                  background: mode === m ? '#111827' : '#FFFFFF',
                  color: mode === m ? '#FFFFFF' : '#374151',
                  borderColor: '#D1D5DB',
                  borderRadius: 0,
                  marginLeft: '-1px',
                  fontWeight: mode === m ? 600 : 400,
                }}
              >
                {m === 'ui' ? 'UIモード' : '直接入力'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'ui' ? (
          <div style={{ padding: '16px' }}>
            {/* Column headers */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '4px',
              paddingRight: '72px',
            }}>
              <div style={{ width: colW.logic, fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>論理演算子</div>
              <div style={{ width: colW.column, fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>カラム名</div>
              <div style={{ width: colW.operator, fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>条件</div>
              <div style={{ flex: 1, fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>入力値</div>
            </div>

            {/* Condition rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {conditions.map((cond, idx) => (
                <div key={cond.id} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <select
                    value={cond.logic}
                    onChange={e => update(cond.id, 'logic', e.target.value)}
                    disabled={idx === 0}
                    style={{ width: colW.logic, height: '32px', opacity: idx === 0 ? 0.4 : 1 }}
                  >
                    <option>AND</option>
                    <option>OR</option>
                  </select>
                  <select
                    value={cond.column}
                    onChange={e => update(cond.id, 'column', e.target.value)}
                    style={{ width: colW.column, height: '32px' }}
                  >
                    {COLUMNS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={e => update(cond.id, 'operator', e.target.value)}
                    style={{ width: colW.operator, height: '32px' }}
                  >
                    {OPERATORS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input
                    type="text"
                    value={cond.value}
                    onChange={e => update(cond.id, 'value', e.target.value)}
                    placeholder="値を入力..."
                    style={{ flex: 1, height: '32px' }}
                  />
                  <button
                    onClick={() => duplicate(cond.id)}
                    title="複製"
                    style={{ width: '32px', height: '32px', padding: '0', fontSize: '14px', flexShrink: 0 }}
                  >
                    ⧉
                  </button>
                  <button
                    onClick={() => remove(cond.id)}
                    disabled={conditions.length === 1}
                    title="削除"
                    style={{
                      width: '32px', height: '32px', padding: '0', fontSize: '14px', flexShrink: 0,
                      opacity: conditions.length === 1 ? 0.4 : 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '12px' }}>
              <button onClick={add} style={{ fontSize: '13px' }}>
                + 条件を追加
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="例: temperature > 30 AND humidity < 80"
              style={{
                width: '100%', height: '200px',
                border: '1px solid #D1D5DB',
                padding: '8px', fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'vertical',
                borderRadius: '0',
                color: '#111827',
                background: '#FFFFFF',
              }}
            />
          </div>
        )}

        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #D1D5DB',
          display: 'flex', gap: '8px', justifyContent: 'flex-end',
        }}>
          <button style={{ color: '#6B7280' }}>クリア</button>
          <button style={{ background: '#111827', color: '#FFFFFF', borderColor: '#111827' }}>
            抽出実行
          </button>
        </div>
      </div>
    </div>
  )
}
