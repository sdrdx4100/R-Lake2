import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DataUploadPage from './pages/DataUploadPage'
import ColumnSetPage from './pages/ColumnSetPage'
import QueryBuilderPage from './pages/QueryBuilderPage'
import VisualizationPage from './pages/VisualizationPage'

export default function App() {
  const [apiStatus, setApiStatus] = useState<'確認中' | '接続中' | '接続失敗'>('確認中')

  useEffect(() => {
    let isMounted = true

    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health/')

        if (!response.ok) {
          throw new Error('health check failed')
        }

        const data = await response.json() as { status?: string }

        if (isMounted) {
          setApiStatus(data.status === 'ok' ? '接続中' : '接続失敗')
        }
      } catch {
        if (isMounted) {
          setApiStatus('接続失敗')
        }
      }
    }

    void loadHealth()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout apiStatus={apiStatus} />}>
        <Route index element={<Navigate to="/upload" replace />} />
        <Route path="upload" element={<DataUploadPage />} />
        <Route path="columns" element={<ColumnSetPage />} />
        <Route path="query" element={<QueryBuilderPage />} />
        <Route path="visualization" element={<VisualizationPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/upload" replace />} />
    </Routes>
  )
}
