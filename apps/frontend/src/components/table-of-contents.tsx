import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui-components'
import { List, ChevronRight } from 'lucide-react'
import { generateHeadingId } from '@/lib/heading-utils'

interface TocItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  content: string
  className?: string
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // 从Markdown内容中提取标题
  useEffect(() => {
    if (!content) return

    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const items: TocItem[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const id = generateHeadingId(title)

      items.push({
        id,
        title,
        level
      })
    }

    setTocItems(items)
  }, [content])

  // 监听滚动以高亮当前章节
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => {
        const element = document.getElementById(item.id)
        return {
          id: item.id,
          element,
          top: element?.getBoundingClientRect().top || Infinity
        }
      }).filter(item => item.element)

      // 找到最接近顶部的标题
      const current = headings.find(heading => heading.top >= 0) || headings[headings.length - 1]
      if (current) {
        setActiveId(current.id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始调用

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  // 滚动到指定章节
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    console.log('Scrolling to:', id, 'Element found:', !!element)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      console.warn(`Element with id "${id}" not found`)
    }
  }
  if (tocItems.length === 0) {
    return null
  }

  return (
    <div className="hidden lg:block w-80 flex-shrink-0 print:w-0 hidden">
      <Card className={cn("sticky top-20", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-sm font-medium">
            <List className="h-4 w-4 mr-2" />
            目录
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <nav className="space-y-1">
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "w-full text-left text-sm transition-colors hover:text-foreground group flex items-center",
                  item.level === 1 && "font-medium",
                  item.level === 2 && "pl-4 text-muted-foreground",
                  item.level === 3 && "pl-8 text-muted-foreground",
                  item.level === 4 && "pl-12 text-muted-foreground",
                  item.level === 5 && "pl-16 text-muted-foreground",
                  item.level === 6 && "pl-20 text-muted-foreground",
                  activeId === item.id
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-3 w-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity",
                    activeId === item.id && "opacity-100"
                  )}
                />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}