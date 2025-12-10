import { Header } from './header'
import { Sidebar } from './sidebar'
import { useState, createContext } from 'react'

// 创建布局上下文
export const LayoutContext = createContext<{
  sidebarOpen: boolean
} | null>(null)

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open on desktop

  return (
    <LayoutContext.Provider value={{ sidebarOpen }}>
      <div className="min-h-screen bg-background">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className={`flex-1 p-6 transition-all duration-200 ${sidebarOpen ? 'lg:pl-80' : 'lg:pl-6'}`}>
            <div className="mx-auto max-w-7xl  md:max-w-9xl lg:max-w-[100vw-18rem]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  )
}
