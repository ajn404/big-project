import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { PracticePage } from '@/pages/practice'
import { PracticeDetailPage } from '@/pages/practice-detail'
import { PracticeManagePage } from '@/pages/practice-manage'
import { AboutPage } from '@/pages/about'
import { QuickTest } from '@/components/quick-test'
import ComponentManage from '@/pages/component-manage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:id" element={<PracticeDetailPage />} />
        <Route path="/admin/practice" element={<PracticeManagePage />} />
        <Route path="/component-manage" element={<ComponentManage />} />
        <Route path="/test" element={<QuickTest />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  )
}

export default App