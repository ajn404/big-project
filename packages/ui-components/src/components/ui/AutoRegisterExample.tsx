import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface AutoRegisterExampleProps {
  title?: string
  description?: string
  children?: React.ReactNode
}

function AutoRegisterExample({ title = '自动注册组件', description, children }: AutoRegisterExampleProps) {
  return (
    <div className="p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 dark:bg-blue-950 dark:border-blue-700">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-blue-600 dark:text-blue-300 mb-4">
            {description}
          </p>
        )}
        <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
          ✅ 自动注册成功
        </div>
        {children && (
          <div className="mt-4 text-blue-700 dark:text-blue-300">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

// Auto-register the component
const RegisteredAutoRegisterExample = createAutoRegisterComponent({
  id: 'auto-register-example',
  name: 'AutoRegisterExample',
  description: '自动注册示例组件，展示如何使用自动注册功能',
  category: CATEGORIES.UI,
  template: `:::react{component="AutoRegisterExample" title="自动注册示例" description="这是一个自动注册的组件"}
示例内容
:::`,
  tags: ['示例', '自动注册', 'UI'],
  version: '1.0.0',
  author: 'Developer',
})(AutoRegisterExample)

export { RegisteredAutoRegisterExample as AutoRegisterExample }