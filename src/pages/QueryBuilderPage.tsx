import { useState } from 'react'
import { generateId } from '../utils/uuid'

interface Condition {
  id: string
  logic: 'AND' | 'OR'
  column: string
  operator: string
  value: string
}

const COLUMNS = ['温度', '湿度', '圧力', '回転数', 'エラーコード', '電圧', '電流', '電力', 'センサーID', 'タイムスタンプ']
const OPERATORS = ['=', '≠', '>', '≥', '<', '≤', '含む', '含まない', '空白', '非空白']

// Pre-filled conditions shown on initial load
const INITIAL_CONDITIONS: Condition[] = [
  { id: generateId(), logic: 'AND', column: '温度',      operator: '>',  value: '100'  },
  { id: generateId(), logic: 'AND', column: '湿度',      operator: '<',  value: '80'   },
  { id: generateId(), logic: 'OR',  column: 'エラーコード', operator: '≠', value: '0'   },
]

const newCondition = (): Condition => ({
  id: generateId(),
  logic: 'AND',
  column: COLUMNS[0],
  operator: '=',
  value: '',
})

// Serialize conditions to a human-readable text representation
const conditionsToText = (conds: Condition[]): string =>
  conds.map((c, i) =>
    `${i === 0 ? '' : c.logic + ' '}${c.column} ${c.operator} ${c.value}`
  ).join('\n')

export default function QueryBuilderPage() {
  const [mode, setMode] = useState<'ui' | 'text'>('ui')
  const [conditions, setConditions] = useState<Condition[]>(INITIAL_CONDITIONS)
  const [rawText, setRawText] = useState(() => conditionsToText(INITIAL_CONDITIONS))

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

  const switchToText = () => {
    setRawText(conditionsToText(conditions))
    setMode('text')
  }

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
            <button
              onClick={() => setMode('ui')}
              style={{
                height: '32px', padding: '0 16px',
                background: mode === 'ui' ? '#111827' : '#FFFFFF',
                color: mode === 'ui' ? '#FFFFFF' : '#374151',
                borderColor: '#D1D5DB',
                marginLeft: '-1px',
                fontWeight: mode === 'ui' ? 600 : 400,
              }}
            >
              UIモード
            </button>
            <button
              onClick={switchToText}
              style={{
                height: '32px', padding: '0 16px',
                background: mode === 'text' ? '#111827' : '#FFFFFF',
                color: mode === 'text' ? '#FFFFFF' : '#374151',
                borderColor: '#D1D5DB',
                marginLeft: '-1px',
                fontWeight: mode === 'text' ? 600 : 400,
              }}
            >
              直接入力
            </button>
          </div>
        </div>

        {mode === 'ui' ? (
          <div style={{ padding: '16px' }}>
            {/* Column headers */}
            <div style={{
              display: 'flex', gap: '4px', marginBottom: '4px',
              paddingRight: '72px',
            }}>
              <div style={{ width: colW.logic,    fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>論理演算子</div>
              <div style={{ width: colW.column,   fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>カラム名</div>
              <div style={{ width: colW.operator, fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>条件</div>
              <div style={{ flex: 1,              fontSize: '11px', fontWeight: 600, color: '#6B7280', paddingLeft: '4px' }}>入力値</div>
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
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>
              例: 温度 &gt; 100 AND 湿度 &lt; 80
            </div>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              style={{
                width: '100%', height: '200px',
                border: '1px solid #D1D5DB',
                padding: '8px', fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'vertical',
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
          <button
            style={{ color: '#6B7280' }}
            onClick={() => { setConditions(INITIAL_CONDITIONS); setRawText(conditionsToText(INITIAL_CONDITIONS)) }}
          >
            クリア
          </button>
          <button style={{ background: '#111827', color: '#FFFFFF', borderColor: '#111827' }}>
            抽出実行
          </button>
        </div>
      </div>
    </div>
  )
}
