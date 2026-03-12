import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { generateId } from '../utils/uuid'

interface FileEntry {
  id: string
  name: string
  size: number
  status: '待機' | '処理中' | '完了' | 'エラー'
  progress: number
}

// Initial dummy data representing a realistic processing queue
const DUMMY_FILES: FileEntry[] = [
  { id: 'dummy-1', name: '20260312_sensor_data.zip',    size: 45_678_901, status: '完了',  progress: 100 },
  { id: 'dummy-2', name: 'log_A_merged.csv',             size:  2_345_678, status: '完了',  progress: 100 },
  { id: 'dummy-3', name: '20260311_batch_003.zip',       size: 12_345_678, status: '処理中', progress: 60  },
  { id: 'dummy-4', name: 'factory_B_signals.csv',        size:    987_654, status: '待機',  progress: 0   },
  { id: 'dummy-5', name: '20260310_quality_check.zip',   size:  8_192_000, status: '待機',  progress: 0   },
]

export default function DataUploadPage() {
  const [files, setFiles] = useState<FileEntry[]>(DUMMY_FILES)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (newFiles: File[]) => {
    const entries: FileEntry[] = newFiles.map(f => ({
      id: generateId(),
      name: f.name,
      size: f.size,
      status: '待機',
      progress: 0,
    }))
    setFiles(prev => [...prev, ...entries])
    entries.forEach(entry => {
      setTimeout(() => {
        setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: '処理中', progress: 30 } : f))
        setTimeout(() => {
          setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, progress: 70 } : f))
          setTimeout(() => {
            setFiles(prev => prev.map(f => f.id === entry.id ? { ...f, status: '完了', progress: 100 } : f))
          }, 1200)
        }, 800)
      }, 500)
    })
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  const statusColor = (status: FileEntry['status']) => {
    switch (status) {
      case '完了': return '#16A34A'
      case '処理中': return '#2563EB'
      case 'エラー': return '#DC2626'
      default: return '#6B7280'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', padding: '16px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
          データアップロード
        </h2>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? '#111827' : '#D1D5DB'}`,
            background: dragOver ? '#F9FAFB' : '#FFFFFF',
            padding: '32px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".csv,.zip"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: '13px', color: '#374151', marginBottom: '8px' }}>
            CSV・ZIPファイルをここにドロップ、またはクリックして選択
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            複数ファイル・ZIP内CSV対応
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => inputRef.current?.click()}>
            ファイルを選択
          </button>
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              style={{ borderColor: '#D1D5DB', color: '#6B7280' }}
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Processing Queue Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB' }}>
        <div style={{
          padding: '8px 16px',
          borderBottom: '1px solid #D1D5DB',
          fontSize: '13px', fontWeight: 600, color: '#111827',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>処理キュー</span>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 400 }}>
            {files.length} 件
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #D1D5DB' }}>
              <th style={{ padding: '7px 16px', textAlign: 'left', fontWeight: 600, width: '40%', color: '#374151' }}>ファイル名</th>
              <th style={{ padding: '7px 16px', textAlign: 'right', fontWeight: 600, width: '120px', color: '#374151' }}>サイズ</th>
              <th style={{ padding: '7px 16px', textAlign: 'center', fontWeight: 600, width: '100px', color: '#374151' }}>ステータス</th>
              <th style={{ padding: '7px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>進捗</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF' }}>
                  ファイルがありません
                </td>
              </tr>
            ) : (
              files.map((f, i) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #D1D5DB', background: i % 2 === 1 ? '#F9FAFB' : '#FFFFFF' }}>
                  <td style={{ padding: '7px 16px', maxWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </td>
                  <td style={{ padding: '7px 16px', textAlign: 'right', color: '#6B7280' }}>
                    {formatSize(f.size)}
                  </td>
                  <td style={{ padding: '7px 16px', textAlign: 'center' }}>
                    <span style={{ color: statusColor(f.status), fontSize: '12px', fontWeight: 500 }}>
                      {f.status}
                    </span>
                  </td>
                  <td style={{ padding: '7px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        flex: 1, height: '8px',
                        background: '#F3F4F6',
                        border: '1px solid #D1D5DB',
                      }}>
                        <div style={{
                          width: `${f.progress}%`,
                          height: '100%',
                          background: f.status === '完了' ? '#16A34A' : '#2563EB',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#6B7280', width: '32px', textAlign: 'right' }}>
                        {f.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
