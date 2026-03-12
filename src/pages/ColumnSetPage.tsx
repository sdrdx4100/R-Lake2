import { useState } from 'react'

// All available columns (left list)
const ALL_COLUMNS_INITIAL = [
  '電圧', '電流', '電力', '周波数', '信号強度',
  'デバイス名', '設置場所', '担当者', 'シフト', 'ロットID',
  '製品ID', '品質スコア', '備考', '更新日時', 'タイムスタンプ',
  '回転数', 'エラーコード', 'センサーID',
]

// Pre-selected columns (right list) — representative set shown by default
const SELECTED_COLUMNS_INITIAL = ['温度', '湿度', '圧力']

export default function ColumnSetPage() {
  const [allColumns, setAllColumns] = useState(ALL_COLUMNS_INITIAL)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(SELECTED_COLUMNS_INITIAL)
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')
  const [leftSelected, setLeftSelected] = useState<string[]>([])
  const [rightSelected, setRightSelected] = useState<string[]>([])

  const filteredAll = allColumns.filter(c => c.includes(leftSearch))
  const filteredSelected = selectedColumns.filter(c => c.includes(rightSearch))

  const addSelected = () => {
    const toAdd = leftSelected.filter(c => !selectedColumns.includes(c))
    setSelectedColumns(prev => [...prev, ...toAdd])
    setAllColumns(prev => prev.filter(c => !leftSelected.includes(c)))
    setLeftSelected([])
  }

  const removeSelected = () => {
    const toRemove = rightSelected
    setAllColumns(prev => [...prev, ...toRemove].sort((a, b) => ALL_COLUMNS_INITIAL.indexOf(a) - ALL_COLUMNS_INITIAL.indexOf(b)))
    setSelectedColumns(prev => prev.filter(c => !toRemove.includes(c)))
    setRightSelected([])
  }

  const toggleLeft = (col: string) => {
    setLeftSelected(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])
  }

  const toggleRight = (col: string) => {
    setRightSelected(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])
  }

  const listStyle = {
    flex: 1,
    border: '1px solid #D1D5DB',
    background: '#FFFFFF',
    overflow: 'hidden' as const,
    display: 'flex',
    flexDirection: 'column' as const,
  }

  const listItemStyle = (selected: boolean) => ({
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#111827',
    background: selected ? '#EFF6FF' : 'transparent',
    borderBottom: '1px solid #F3F4F6',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  })

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '16px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
        リードカラムセット登録
      </h2>

      <div style={{ display: 'flex', gap: '0', height: '400px' }}>
        {/* Left list - All columns */}
        <div style={listStyle}>
          <div style={{ padding: '8px', borderBottom: '1px solid #D1D5DB', background: '#F9FAFB' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              全カラム一覧 ({filteredAll.length})
            </div>
            <input
              type="text"
              placeholder="検索..."
              value={leftSearch}
              onChange={e => setLeftSearch(e.target.value)}
              style={{ width: '100%', height: '32px', fontSize: '12px' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredAll.map(col => (
              <div key={col} onClick={() => toggleLeft(col)} style={listItemStyle(leftSelected.includes(col))}>
                {col}
              </div>
            ))}
          </div>
        </div>

        {/* Center buttons */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', gap: '8px', padding: '0 12px',
        }}>
          <button
            onClick={addSelected}
            disabled={leftSelected.length === 0}
            title="追加"
            style={{
              width: '32px', height: '32px', padding: '0',
              fontWeight: 700, fontSize: '16px',
              opacity: leftSelected.length === 0 ? 0.4 : 1,
            }}
          >
            ›
          </button>
          <button
            onClick={removeSelected}
            disabled={rightSelected.length === 0}
            title="削除"
            style={{
              width: '32px', height: '32px', padding: '0',
              fontWeight: 700, fontSize: '16px',
              opacity: rightSelected.length === 0 ? 0.4 : 1,
            }}
          >
            ‹
          </button>
        </div>

        {/* Right list - Selected columns */}
        <div style={listStyle}>
          <div style={{ padding: '8px', borderBottom: '1px solid #D1D5DB', background: '#F9FAFB' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              選択済みカラム ({filteredSelected.length})
            </div>
            <input
              type="text"
              placeholder="検索..."
              value={rightSearch}
              onChange={e => setRightSearch(e.target.value)}
              style={{ width: '100%', height: '32px', fontSize: '12px' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredSelected.map(col => (
              <div key={col} onClick={() => toggleRight(col)} style={listItemStyle(rightSelected.includes(col))}>
                {col}
              </div>
            ))}
            {filteredSelected.length === 0 && (
              <div style={{ padding: '16px', color: '#9CA3AF', fontSize: '12px', textAlign: 'center' }}>
                カラムが選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          style={{ color: '#6B7280' }}
          onClick={() => { setSelectedColumns(SELECTED_COLUMNS_INITIAL); setAllColumns(ALL_COLUMNS_INITIAL) }}
        >
          リセット
        </button>
        <button style={{ background: '#111827', color: '#FFFFFF', borderColor: '#111827' }}>
          保存
        </button>
      </div>
    </div>
  )
}
