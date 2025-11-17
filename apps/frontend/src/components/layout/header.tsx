import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { GlobalSearch } from '@/components/global-search'
import { Menu, Search, Github, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onMenuClick: () => void
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function Header({ onMenuClick, sidebarOpen, onSidebarToggle }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // 全局快捷键监听器
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${sidebarOpen ? 'lg:left-72 lg:w-[calc(100vw-18rem)]' : 'left-0 w-full'}`}>
      <div className="container flex h-16 items-center">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Main navigation */}
        <nav className="mx-4 hidden lg:flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/"
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            首页
          </Link>
          <Link
            to="/practice"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            实践
          </Link>
          <Link
            to="/admin/practice"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            文章管理
          </Link>
          <Link
            to="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            关于
          </Link>
          <Link
            to="/test"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            功能测试
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* 全局搜索按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center space-x-2 text-muted-foreground hover:text-foreground border border-input"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:block">搜索...</span>
            <div className="hidden lg:flex items-center space-x-1 ml-auto">
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border">K</kbd>
            </div>
          </Button>
          
          {/* 移动端搜索按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Sidebar toggle (desktop only) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden lg:flex"
            title={sidebarOpen ? "收起侧边栏" : "展开侧边栏"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <PanelLeftOpen className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>

          {/* GitHub link */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            title="访问 GitHub 仓库"
          >
            <a
              href="https://github.com/ajn404/big-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-[1.2rem] w-[1.2rem]" />
            </a>
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
      
      {/* 全局搜索对话框 */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  )
}