import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, Edit, Eye, Trash2, Download } from 'lucide-react'
import { MDXRenderer } from './mdx-renderer'
import { EnhancedMDXEditor } from './enhanced-mdx-editor'
import { getRandomSampleMarkdown } from '@/lib/sample-markdown'
import { advancedSample } from '@/lib/advanced-sample'

export function QuickTest() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'editor' | 'renderer'>('overview')
  const [testContent, setTestContent] = useState('')

  const loadSample = () => {
    setTestContent(getRandomSampleMarkdown())
  }

  const loadAdvancedSample = () => {
    setTestContent(advancedSample)
  }

  const features = [
    {
      icon: FileText,
      title: '文章管理',
      description: '完整的CRUD功能，支持创建、编辑、删除文章',
      status: '已完成'
    },
    {
      icon: Upload,
      title: 'Markdown 导入',
      description: '支持文件上传、URL导入、文本粘贴三种方式',
      status: '已完成'
    },
    {
      icon: Edit,
      title: '增强编辑器',
      description: '工具栏、快捷键、实时预览、语法高亮',
      status: '已完成'
    },
    {
      icon: Eye,
      title: '优化渲染器',
      description: 'GitHub Flavored Markdown、数学公式、代码高亮、任务列表',
      status: '已升级'
    }
  ]

  const sampleMarkdown = `# 测试 Markdown 渲染

这是一个**粗体**文本和*斜体*文本的示例。

## 代码示例

这里是内联代码：\`console.log("Hello World")\`

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}

const message = greet("World")
console.log(message)
\`\`\`

## 列表

### 无序列表
- 项目 1
- 项目 2
- 项目 3

### 有序列表
1. 第一步
2. 第二步
3. 第三步

### 任务列表
- [x] 已完成的任务
- [ ] 待完成的任务

## 引用

> 这是一个引用块的例子。
> 它可以包含多行内容。

## 表格

| 特性 | 状态 | 描述 |
|------|------|------|
| 文章管理 | ✅ | 完整的CRUD功能 |
| Markdown导入 | ✅ | 多种导入方式 |
| 增强编辑器 | ✅ | 工具栏和预览 |
| 优化渲染 | ✅ | 美观的样式 |

## 链接

[内部链接](/practice)
[外部链接](https://github.com)

---

这就是优化后的 MDX 渲染效果！`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">功能测试</h1>
        <p className="text-muted-foreground mt-1">
          测试新增的文章管理功能和优化的 MDX 渲染器
        </p>
      </div>

      {/* Feature Overview */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>功能概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {feature.description}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>快速开始</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setCurrentTab('editor')}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Edit className="h-6 w-6" />
                    <span>测试编辑器</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setCurrentTab('renderer')}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <Eye className="h-6 w-6" />
                    <span>测试渲染器</span>
                  </Button>
                  
                  <Button 
                    asChild
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    variant="outline"
                  >
                    <a href="/admin/practice">
                      <FileText className="h-6 w-6" />
                      <span>文章管理</span>
                    </a>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <h4 className="font-medium mb-2">🚀 新增专业渲染支持：</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-4">
                    <li>• React Markdown 专业渲染</li>
                    <li>• GitHub Flavored Markdown 完整支持</li>
                    <li>• LaTeX 数学公式渲染 (KaTeX)</li>
                    <li>• 多语言代码高亮 (highlight.js)</li>
                    <li>• 自动锚点和目录生成</li>
                    <li>• 任务列表交互式复选框</li>
                    <li>• 表格对齐和高级样式</li>
                    <li>• 自动链接和邮箱识别</li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded border">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
                      💡 现在使用专业开源库：react-markdown + remark-gfm + rehype-highlight + katex
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor Test */}
      {currentTab === 'editor' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">编辑器测试</h2>
            <div className="space-x-2">
              <Button onClick={loadSample} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                加载示例
              </Button>
              <Button onClick={loadAdvancedSample} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                高级功能演示
              </Button>
              <Button onClick={() => setCurrentTab('overview')} variant="outline">
                返回概览
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <EnhancedMDXEditor
                value={testContent}
                onChange={setTestContent}
                placeholder="在这里测试 Markdown 编辑器的功能..."
                height="600px"
              />
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">编辑器功能：</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-4">
              <li>• 工具栏快速插入</li>
              <li>• 快捷键支持 (Ctrl+B, Ctrl+I 等)</li>
              <li>• 实时预览切换</li>
              <li>• 语法高亮</li>
              <li>• 自动补全</li>
              <li>• 行号显示</li>
              <li>• 字符统计</li>
              <li>• 阅读时间预估</li>
            </ul>
          </div>
        </div>
      )}

      {/* Renderer Test */}
      {currentTab === 'renderer' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">渲染器测试</h2>
            <Button onClick={() => setCurrentTab('overview')} variant="outline">
              返回概览
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>MDX 渲染效果</CardTitle>
            </CardHeader>
            <CardContent>
              <MDXRenderer content={sampleMarkdown} />
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <h4 className="font-medium mb-2">渲染器特性：</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-4">
              <li>• 代码块语言标识</li>
              <li>• 一键复制代码</li>
              <li>• 标题锚点导航</li>
              <li>• 任务列表支持</li>
              <li>• 表格样式优化</li>
              <li>• 外链图标提示</li>
              <li>• 响应式图片</li>
              <li>• 引用块美化</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}