import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { PracticePage } from '@/pages/practice'
import { PracticeDetailPage } from '@/pages/practice-detail'
import { AboutPage } from '@/pages/about'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/practice/:id" element={<PracticeDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  )
}

export default App