import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Component,
  FileText,
  Home,
  Plus,
  FolderOpen
} from 'lucide-react'

const navigationItems = [
  {
    name: '首页',
    path: '/',
    icon: Home
  },
  {
    name: '实践练习',
    path: '/practice',
    icon: FileText
  },
  {
    name: '组件管理',
    path: '/component-manage',
    icon: Component
  },
  {
    name: '资源管理',
    path: '/asset-manage',
    icon: FolderOpen
  },
  {
    name: '添加内容',
    path: '/practice-manage',
    icon: Plus
  }
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="space-y-2">
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            asChild
          >
            <Link to={item.path}>
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}