import { ReactNode } from 'react'

interface NavItem {
  id: string
  label: string
  children?: NavItem[]
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'data',
    label: 'データ管理',
    children: [
      { id: 'upload', label: 'データアップロード' },
      { id: 'columns', label: 'カラムセット登録' },
    ],
  },
  {
    id: 'analysis',
    label: '分析・抽出',
    children: [
      { id: 'query', label: 'INDEX条件抽出設定' },
      { id: 'visualization', label: 'グラフ・可視化' },
    ],
  },
]

interface LayoutProps {
  children: ReactNode
  currentPage: string
  onNavigate: (page: string) => void
  pageLabel: string
}

export default function Layout({ children, currentPage, onNavigate, pageLabel }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Header */}
      <header style={{
        height: '48px',
        background: '#FFFFFF',
        borderBottom: '1px solid #D1D5DB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#111827' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>R-Lake2</span>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#6B7280' }}>{pageLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            border: '1px solid #D1D5DB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#374151', cursor: 'pointer',
            background: '#F3F4F6',
          }}>
            U
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: '#FFFFFF',
          borderRight: '1px solid #D1D5DB',
          flexShrink: 0,
          overflowY: 'auto',
          padding: '8px 0',
        }}>
          {NAV_ITEMS.map(group => (
            <div key={group.id}>
              <div style={{
                padding: '6px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {group.label}
              </div>
              {group.children?.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    padding: '7px 16px 7px 24px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: currentPage === item.id ? '#111827' : '#374151',
                    background: currentPage === item.id ? '#F3F4F6' : 'transparent',
                    borderLeft: currentPage === item.id ? '2px solid #111827' : '2px solid transparent',
                    userSelect: 'none',
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1,
          background: '#F3F4F6',
          overflowY: 'auto',
          padding: '16px',
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}
