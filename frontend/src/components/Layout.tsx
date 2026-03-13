import { CSSProperties } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

interface NavItem {
  id: string
  path?: string
  label: string
  children?: NavItem[]
}

const COLORS = {
  background: '#F3F4F6',
  card: '#FFFFFF',
  text: '#111827',
  border: '#D1D5DB',
} as const

const NAV_ITEMS: NavItem[] = [
  {
    id: 'data',
    label: 'データ管理',
    children: [
      { id: 'upload', path: '/upload', label: 'データアップロード' },
      { id: 'columns', path: '/columns', label: 'カラムセット管理' },
    ],
  },
  {
    id: 'analysis',
    label: '分析・抽出',
    children: [
      { id: 'query', path: '/query', label: '条件検索' },
      { id: 'visualization', path: '/visualization', label: 'データ閲覧' },
    ],
  },
]

interface LayoutProps {
  apiStatus: '確認中' | '接続中' | '接続失敗'
}

const PAGE_LABELS: Record<string, string> = {
  '/upload': 'データアップロード',
  '/columns': 'カラムセット管理',
  '/query': '条件検索',
  '/visualization': 'データ閲覧',
}

const navLinkStyle = (isActive: boolean): CSSProperties => ({
  display: 'block',
  padding: '8px 16px 8px 24px',
  cursor: 'pointer',
  fontSize: '13px',
  color: COLORS.text,
  background: isActive ? COLORS.background : COLORS.card,
  borderTop: `1px solid ${COLORS.border}`,
  borderBottom: `1px solid ${COLORS.border}`,
  marginTop: '-1px',
  textDecoration: 'none',
  userSelect: 'none',
})

export default function Layout({ apiStatus }: LayoutProps) {
  const location = useLocation()
  const pageLabel = PAGE_LABELS[location.pathname] ?? 'データ分析基盤'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header style={{
        height: '48px',
        background: COLORS.card,
        borderBottom: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.text }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>R-Lake2</span>
          <span style={{ color: COLORS.border }}>/</span>
          <span>{pageLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            height: '32px',
            border: `1px solid ${COLORS.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#374151', cursor: 'pointer',
            background: COLORS.background,
            padding: '0 8px',
          }}>
            API {apiStatus}
          </div>
          <div style={{
            width: '32px',
            height: '32px',
            border: `1px solid ${COLORS.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: COLORS.text,
            background: COLORS.card,
          }}>
            U
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{
          width: '240px',
          background: COLORS.card,
          borderRight: `1px solid ${COLORS.border}`,
          flexShrink: 0,
          overflowY: 'auto',
          padding: '8px 0',
        }}>
          {NAV_ITEMS.map(group => (
            <div key={group.id}>
              <div style={{
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {group.label}
              </div>
              {group.children?.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path ?? '/upload'}
                  style={({ isActive }) => navLinkStyle(isActive)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </aside>

        <main style={{
          flex: 1,
          background: COLORS.background,
          overflowY: 'auto',
          padding: '16px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
