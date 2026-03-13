import { useState } from 'react'

const ALL_COLUMNS_INITIAL = [
  '電圧', '電流', '電力', '周波数', '信号強度',
  'デバイス名', '設置場所', '担当者', 'シフト', 'ロットID',
  '製品ID', '品質スコア', '備考', '更新日時', 'タイムスタンプ',
  '回転数', 'エラーコード', 'センサーID',
]

const SELECTED_COLUMNS_INITIAL = ['温度', '湿度', '圧力']

export default function ColumnSetPage() {
  const [allColumns, setAllColumns] = useState(ALL_COLUMNS_INITIAL)
  const [selectedColumns, setSelectedColumns] = useState<string[]>(SELECTED_COLUMNS_INITIAL)
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')
  const [leftSelected, setLeftSelected] = useState<string[]>([])
  const [rightSelected, setRightSelected] = useState<string[]>([])

  const filteredAll = allColumns.filter((column) => column.includes(leftSearch))
  const filteredSelected = selectedColumns.filter((column) => column.includes(rightSearch))

  const addSelected = () => {
    const nextColumns = leftSelected.filter((column) => !selectedColumns.includes(column))
    setSelectedColumns((prev) => [...prev, ...nextColumns])
    setAllColumns((prev) => prev.filter((column) => !leftSelected.includes(column)))
    setLeftSelected([])
  }

  const removeSelected = () => {
    const removedColumns = rightSelected
    setAllColumns((prev) => [...prev, ...removedColumns].sort((a, b) => ALL_COLUMNS_INITIAL.indexOf(a) - ALL_COLUMNS_INITIAL.indexOf(b)))
    setSelectedColumns((prev) => prev.filter((column) => !removedColumns.includes(column)))
    setRightSelected([])
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
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#111827',
    background: selected ? '#F3F4F6' : '#FFFFFF',
    borderBottom: '1px solid #D1D5DB',
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  })

  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '16px' }}>
      <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
        カラムセット管理
      </h2>

      <div style={{ display: 'flex', gap: '0', height: '400px' }}>
        <div style={listStyle}>
          <div style={{ padding: '8px', borderBottom: '1px solid #D1D5DB', background: '#F3F4F6' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              全カラム一覧 ({filteredAll.length})
            </div>
            <input
              type="text"
              placeholder="検索..."
              value={leftSearch}
              onChange={(event) => setLeftSearch(event.target.value)}
              style={{ width: '100%', height: '32px', fontSize: '12px' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredAll.map((column) => (
              <div
                key={column}
                onClick={() => setLeftSelected((prev) => prev.includes(column) ? prev.filter((item) => item !== column) : [...prev, column])}
                style={listItemStyle(leftSelected.includes(column))}
              >
                {column}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '0 16px' }}>
          <button
            onClick={addSelected}
            disabled={leftSelected.length === 0}
            title="追加"
            style={{ width: '32px', height: '32px', padding: '0', fontWeight: 700, fontSize: '16px', opacity: leftSelected.length === 0 ? 0.4 : 1 }}
          >
            ›
          </button>
          <button
            onClick={removeSelected}
            disabled={rightSelected.length === 0}
            title="削除"
            style={{ width: '32px', height: '32px', padding: '0', fontWeight: 700, fontSize: '16px', opacity: rightSelected.length === 0 ? 0.4 : 1 }}
          >
            ‹
          </button>
        </div>

        <div style={listStyle}>
          <div style={{ padding: '8px', borderBottom: '1px solid #D1D5DB', background: '#F3F4F6' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              選択済みカラム ({filteredSelected.length})
            </div>
            <input
              type="text"
              placeholder="検索..."
              value={rightSearch}
              onChange={(event) => setRightSearch(event.target.value)}
              style={{ width: '100%', height: '32px', fontSize: '12px' }}
            />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredSelected.map((column) => (
              <div
                key={column}
                onClick={() => setRightSelected((prev) => prev.includes(column) ? prev.filter((item) => item !== column) : [...prev, column])}
                style={listItemStyle(rightSelected.includes(column))}
              >
                {column}
              </div>
            ))}
            {filteredSelected.length === 0 && (
              <div style={{ padding: '16px', color: '#374151', fontSize: '12px', textAlign: 'center' }}>
                カラムが選択されていません
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          style={{ color: '#374151' }}
          onClick={() => {
            setSelectedColumns(SELECTED_COLUMNS_INITIAL)
            setAllColumns(ALL_COLUMNS_INITIAL)
            setLeftSelected([])
            setRightSelected([])
            setLeftSearch('')
            setRightSearch('')
          }}
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
