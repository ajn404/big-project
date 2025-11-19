import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface ExampleCardProps {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

function ExampleCard({
  title = "示例组件",
  description = "这是一个示例React组件",
  children,
  className = ""
}: ExampleCardProps) {
  return (
    <div className={`border rounded-lg shadow-sm bg-white dark:bg-gray-800 ${className}`}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <div className="p-4">
        {children || (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              这里可以放置任何React组件内容。
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                列表项1
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                列表项2
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

// Auto-register the component
const RegisteredExampleCard = createAutoRegisterComponent({
  id: 'example-card',
  name: 'ExampleCard',
  description: '示例卡片组件，展示基本的UI结构',
  category: CATEGORIES.UI,
  template: `:::react{component="ExampleCard" title="自定义标题" description="自定义描述"}
卡片内容
:::`,
  tags: ['卡片', 'UI', '示例'],
  version: '1.0.0',
})(ExampleCard)

export { RegisteredExampleCard as ExampleCard }