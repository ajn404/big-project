import React from 'react'
import { Editor, loader } from '@monaco-editor/react'

// 确保 Monaco Editor 使用本地静态资源
loader.config({
  paths: {
    vs: '/monaco/vs'
  }
})

export interface CodeEditorProps {
  value?: string
  onChange?: (value: string | undefined) => void
  language?: string
  theme?: 'vs-dark' | 'light' | 'vs'
  height?: string | number
  width?: string | number
  readOnly?: boolean
  options?: any
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value = '',
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
  height = '400px',
  width = '100%',
  readOnly = false,
  options = {}
}) => {
  return (
    <Editor
      height={height}
      width={width}
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      options={{
        readOnly,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        ...options
      }}
      loading={<div>Loading Monaco Editor...</div>}
    />
  )
}

export default CodeEditor