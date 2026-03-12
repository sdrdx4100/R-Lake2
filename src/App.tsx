import { useState } from 'react'
import Layout from './components/Layout'
import DataUploadPage from './pages/DataUploadPage'
import ColumnSetPage from './pages/ColumnSetPage'
import QueryBuilderPage from './pages/QueryBuilderPage'
import VisualizationPage from './pages/VisualizationPage'

type Page = 'upload' | 'columns' | 'query' | 'visualization'

const PAGE_LABELS: Record<Page, string> = {
  upload: 'データアップロード',
  columns: 'リードカラムセット登録',
  query: 'INDEX条件抽出設定',
  visualization: 'グラフ・可視化',
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('upload')

  const renderPage = () => {
    switch (currentPage) {
      case 'upload': return <DataUploadPage />
      case 'columns': return <ColumnSetPage />
      case 'query': return <QueryBuilderPage />
      case 'visualization': return <VisualizationPage />
    }
  }

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page as Page)}
      pageLabel={PAGE_LABELS[currentPage]}
    >
      {renderPage()}
    </Layout>
  )
}
