import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { X, Home, BookOpen, Info, Folder, Tag, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@apollo/client'
import { GET_CATEGORIES, GET_TAGS } from '@/lib/graphql/queries'
import { useFilter } from '@/contexts/filter-context'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { onFilterSelect } = useFilter()
  const { data: categoriesData } = useQuery(GET_CATEGORIES)
  const { data: tagsData } = useQuery(GET_TAGS)

  // 处理分类和标签点击
  const handleFilterClick = (type: 'category' | 'tag', value: string) => {
    onClose()
    
    if (location.pathname === '/practice') {
      // 如果当前在 practice 页面，使用回调函数
      onFilterSelect?.(type, value)
    } else {
      // 如果不在 practice 页面，导航到 practice 页面
      navigate('/practice')
      // 延迟调用筛选，确保页面已经加载
      setTimeout(() => {
        onFilterSelect?.(type, value)
      }, 100)
    }
  }

  const navigation = [
    { name: '首页', href: '/', icon: Home },
    { name: '实践', href: '/practice', icon: BookOpen },
    { name: '文章管理', href: '/admin/practice', icon: Settings },
    { name: '关于', href: '/about', icon: Info },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <div className="h-8 w-8 rounded-lg bg-primary"></div>
              <span className="font-bold">学习实践</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Main Navigation */}
              <div>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  导航
                </h2>
                <ul className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={onClose}
                          className={cn(
                            'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            location.pathname === item.href
                              ? 'bg-primary text-primary-foreground'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Categories */}
              {categoriesData?.categories && (
                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    分类
                  </h2>
                  <ul className="space-y-1">
                    {categoriesData.categories.map((category: any) => (
                      <li key={category.id}>
                        <button
                          onClick={() => handleFilterClick('category', category.name)}
                          className="w-full flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Folder className="h-4 w-4" />
                          <span>{category.name}</span>
                          <span className="ml-auto text-xs">
                            {category.practiceNodes?.length || 0}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Tags */}
              {tagsData?.tags && (
                <div>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    热门标签
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {tagsData.tags.slice(0, 10).map((tag: any) => (
                      <button
                        key={tag.id}
                        onClick={() => handleFilterClick('tag', tag.name)}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}