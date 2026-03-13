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
const COLUMN_WIDTHS = { logic: '96px', column: '176px', operator: '112px', value: '240px' }

const INITIAL_CONDITIONS: Condition[] = [
  { id: generateId(), logic: 'AND', column: '温度', operator: '>', value: '100' },
  { id: generateId(), logic: 'AND', column: '湿度', operator: '<', value: '80' },
  { id: generateId(), logic: 'OR', column: 'エラーコード', operator: '≠', value: '0' },
]

const createCondition = (): Condition => ({
  id: generateId(),
  logic: 'AND',
  column: COLUMNS[0],
  operator: '=',
  value: '',
})

const conditionsToText = (conditions: Condition[]) => conditions.map((condition, index) => (
  `${index === 0 ? '' : `${condition.logic} `}${condition.column} ${condition.operator} ${condition.value}`
)).join('\n')

export default function QueryBuilderPage() {
  const [mode, setMode] = useState<'ui' | 'text'>('ui')
  const [conditions, setConditions] = useState<Condition[]>(INITIAL_CONDITIONS)
  const [rawText, setRawText] = useState(() => conditionsToText(INITIAL_CONDITIONS))

  const resetConditions = () => {
    setConditions(INITIAL_CONDITIONS)
    setRawText(conditionsToText(INITIAL_CONDITIONS))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB' }}>
        <div style={{ borderBottom: '1px solid #D1D5DB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px' }}>
          <h2 style={{ margin: '16px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            条件検索
          </h2>
          <div style={{ display: 'flex', gap: '0' }}>
            <button
              onClick={() => setMode('ui')}
              style={{
                height: '32px',
                padding: '0 16px',
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
              onClick={() => {
                setRawText(conditionsToText(conditions))
                setMode('text')
              }}
              style={{
                height: '32px',
                padding: '0 16px',
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', paddingRight: '72px' }}>
              <div style={{ width: COLUMN_WIDTHS.logic, fontSize: '11px', fontWeight: 600, color: '#374151' }}>AND / OR</div>
              <div style={{ width: COLUMN_WIDTHS.column, fontSize: '11px', fontWeight: 600, color: '#374151' }}>カラム名</div>
              <div style={{ width: COLUMN_WIDTHS.operator, fontSize: '11px', fontWeight: 600, color: '#374151' }}>演算子</div>
              <div style={{ width: COLUMN_WIDTHS.value, fontSize: '11px', fontWeight: 600, color: '#374151' }}>値</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {conditions.map((condition, index) => (
                <div key={condition.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={condition.logic}
                    onChange={(event) => setConditions((prev) => prev.map((item) => (
                      item.id === condition.id ? { ...item, logic: event.target.value as Condition['logic'] } : item
                    )))}
                    disabled={index === 0}
                    style={{ width: COLUMN_WIDTHS.logic, height: '32px', opacity: index === 0 ? 0.4 : 1 }}
                  >
                    <option>AND</option>
                    <option>OR</option>
                  </select>
                  <select
                    value={condition.column}
                    onChange={(event) => setConditions((prev) => prev.map((item) => (
                      item.id === condition.id ? { ...item, column: event.target.value } : item
                    )))}
                    style={{ width: COLUMN_WIDTHS.column, height: '32px' }}
                  >
                    {COLUMNS.map((column) => <option key={column}>{column}</option>)}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(event) => setConditions((prev) => prev.map((item) => (
                      item.id === condition.id ? { ...item, operator: event.target.value } : item
                    )))}
                    style={{ width: COLUMN_WIDTHS.operator, height: '32px' }}
                  >
                    {OPERATORS.map((operator) => <option key={operator}>{operator}</option>)}
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(event) => setConditions((prev) => prev.map((item) => (
                      item.id === condition.id ? { ...item, value: event.target.value } : item
                    )))}
                    placeholder="値を入力"
                    style={{ width: COLUMN_WIDTHS.value, height: '32px' }}
                  />
                  <button
                    onClick={() => {
                      const position = conditions.findIndex((item) => item.id === condition.id)
                      const duplicate = { ...conditions[position], id: generateId() }
                      setConditions((prev) => [...prev.slice(0, position + 1), duplicate, ...prev.slice(position + 1)])
                    }}
                    title="複製"
                    style={{ width: '32px', height: '32px', padding: '0', fontSize: '14px', flexShrink: 0 }}
                  >
                    ⧉
                  </button>
                  <button
                    onClick={() => setConditions((prev) => prev.filter((item) => item.id !== condition.id))}
                    disabled={conditions.length === 1}
                    title="削除"
                    style={{ width: '32px', height: '32px', padding: '0', fontSize: '14px', flexShrink: 0, opacity: conditions.length === 1 ? 0.4 : 1 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <button onClick={() => setConditions((prev) => [...prev, createCondition()])} style={{ fontSize: '13px' }}>
                + 条件を追加
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#374151', marginBottom: '8px' }}>
              例: 温度 &gt; 100 AND 湿度 &lt; 80
            </div>
            <textarea
              value={rawText}
              onChange={(event) => setRawText(event.target.value)}
              style={{
                width: '100%',
                height: '200px',
                border: '1px solid #D1D5DB',
                padding: '8px',
                fontSize: '13px',
                fontFamily: 'monospace',
                resize: 'vertical',
                color: '#111827',
                background: '#FFFFFF',
              }}
            />
          </div>
        )}

        <div style={{ padding: '16px', borderTop: '1px solid #D1D5DB', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button style={{ color: '#374151' }} onClick={resetConditions}>
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
