import React, { useState, useEffect, useRef } from 'react'
import { CodeSandbox } from '@codesandbox/sdk'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Alert, AlertDescription } from '../ui/alert'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Play, 
  Plus, 
  Save, 
  Share, 
  ExternalLink, 
  Code2, 
  FileText, 
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
  Copy,
  FolderOpen
} from 'lucide-react'
import { cn } from '../../lib/utils'

// CodeSandbox SDK 组件的接口定义
interface CodeSandboxSDKProps {
  /** CodeSandbox API Key */
  apiKey?: string
  /** 初始模板类型 */
  template?: 'vanilla' | 'react' | 'react-ts'
  /** 嵌入样式 */
  embedStyle?: 'light' | 'dark' | 'auto'
  /** 显示工具栏 */
  showToolbar?: boolean
  /** 显示文件浏览器 */
  showFileExplorer?: boolean
  /** 显示控制台 */
  showConsole?: boolean
  /** 显示预览 */
  showPreview?: boolean
  /** 自定义文件内容 */
  files?: Record<string, { code: string; isBinary?: boolean }>
  /** 沙箱标题 */
  title?: string
  /** 沙箱描述 */
  description?: string
  /** 公开/私有 */
  isPublic?: boolean
  /** 容器样式类名 */
  className?: string
  /** 容器高度 */
  height?: string | number
  /** 宽度 */
  width?: string | number
  /** 当沙箱创建完成时的回调 */
  onSandboxCreated?: (sandbox: any) => void
  /** 当代码变更时的回调 */
  onCodeChange?: (files: Record<string, string>) => void
  /** 错误回调 */
  onError?: (error: Error) => void
}

// 预定义模板
const TEMPLATES = {
  vanilla: {
    name: 'Vanilla JS',
    description: 'Plain JavaScript sandbox',
    files: {
      'index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS Sandbox</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Hello, CodeSandbox!</h1>
        <button id="click-btn">Click me!</button>
        <p id="output">Click the button above</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`
      },
      'script.js': {
        code: `const button = document.getElementById('click-btn');
const output = document.getElementById('output');
let clickCount = 0;

button.addEventListener('click', () => {
    clickCount++;
    output.textContent = 'Button clicked ' + clickCount + ' time' + (clickCount === 1 ? '' : 's') + '!';
    
    // Add some animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
});

console.log('Vanilla JS sandbox initialized!');`
      },
      'styles.css': {
        code: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

#app {
    background: white;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
    max-width: 400px;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 20px;
}

button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}

#output {
    color: #666;
    font-size: 14px;
    margin: 0;
}`
      }
    }
  },
  react: {
    name: 'React',
    description: 'React application sandbox',
    files: {
      'package.json': {
        code: JSON.stringify({
          "name": "react-sandbox",
          "version": "1.0.0",
          "description": "",
          "main": "index.js",
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1"
          },
          "browserslist": {
            "production": [
              ">0.2%",
              "not dead",
              "not op_mini all"
            ],
            "development": [
              "last 1 chrome version",
              "last 1 firefox version",
              "last 1 safari version"
            ]
          }
        }, null, 2)
      },
      'public/index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React Sandbox</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`
      },
      'src/index.js': {
        code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      'src/App.js': {
        code: `import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Welcome to React!');

  useEffect(() => {
    if (count === 0) {
      setMessage('Welcome to React!');
    } else if (count <= 5) {
      setMessage('You clicked ' + count + ' time' + (count === 1 ? '' : 's') + '!');
    } else if (count <= 10) {
      setMessage('You\\'re getting the hang of it! 🎉');
    } else {
      setMessage('React Master! 🚀');
    }
  }, [count]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React CodeSandbox</h1>
        <p>{message}</p>
        <div className="counter-section">
          <button 
            className="counter-btn"
            onClick={() => setCount(count + 1)}
          >
            Count: {count}
          </button>
          <button 
            className="reset-btn"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;`
      },
      'src/App.css': {
        code: `.App {
  text-align: center;
}

.App-header {
  background: linear-gradient(135deg, #282c34 0%, #61dafb 100%);
  padding: 40px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

h1 {
  margin-bottom: 20px;
  font-size: 2.5rem;
}

p {
  margin-bottom: 30px;
  font-size: 1.2rem;
  opacity: 0.9;
}

.counter-section {
  display: flex;
  gap: 15px;
  align-items: center;
}

.counter-btn, .reset-btn {
  font-size: 1rem;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.counter-btn {
  background: #61dafb;
  color: #282c34;
}

.counter-btn:hover {
  background: #21a9c7;
  transform: scale(1.05);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}`
      },
      'src/index.css': {
        code: `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
      }
    }
  },
  'react-ts': {
    name: 'React TypeScript',
    description: 'React with TypeScript sandbox',
    files: {
      'package.json': {
        code: JSON.stringify({
          "name": "react-typescript-sandbox",
          "version": "1.0.0",
          "description": "",
          "main": "index.tsx",
          "scripts": {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test",
            "eject": "react-scripts eject"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-scripts": "5.0.1",
            "typescript": "^4.9.4",
            "@types/react": "^18.0.26",
            "@types/react-dom": "^18.0.10"
          }
        }, null, 2)
      },
      'public/index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React TypeScript Sandbox</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
      },
      'src/index.tsx': {
        code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      'src/App.tsx': {
        code: `import React, { useState, useEffect } from 'react';
import './App.css';

interface CounterState {
  count: number;
  message: string;
}

const App: React.FC = () => {
  const [state, setState] = useState<CounterState>({
    count: 0,
    message: 'Welcome to React with TypeScript!'
  });

  useEffect(() => {
    const { count } = state;
    let newMessage: string;

    if (count === 0) {
      newMessage = 'Welcome to React with TypeScript!';
    } else if (count <= 5) {
      newMessage = 'You clicked ' + count + ' time' + (count === 1 ? '' : 's') + '!';
    } else if (count <= 10) {
      newMessage = 'You\\'re mastering TypeScript! 🎉';
    } else {
      newMessage = 'TypeScript React Master! 🚀';
    }

    setState(prev => ({ ...prev, message: newMessage }));
  }, [state.count]);

  const handleIncrement = (): void => {
    setState(prev => ({ ...prev, count: prev.count + 1 }));
  };

  const handleReset = (): void => {
    setState({ count: 0, message: 'Counter reset!' });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + TypeScript</h1>
        <p>{state.message}</p>
        <div className="counter-section">
          <button 
            className="counter-btn"
            onClick={handleIncrement}
            type="button"
          >
            Count: {state.count}
          </button>
          <button 
            className="reset-btn"
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </header>
    </div>
  );
};

export default App;`
      }
    }
  }
}

export const CodeSandboxSDK: React.FC<CodeSandboxSDKProps> = ({
  apiKey: defaultApiKey = '',
  template = 'react',
  embedStyle = 'auto',
  showToolbar = true,
  showFileExplorer = true,
  showConsole = true,
  showPreview = true,
  files,
  title = '新建沙箱',
  description = '使用 CodeSandbox SDK 创建的沙箱',
  isPublic = true,
  className,
  height = '600px',
  width = '100%',
  onSandboxCreated,
  onCodeChange,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sandboxUrl, setSandboxUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState(template)
  const [customTitle, setCustomTitle] = useState(title)
  const [customDescription, setCustomDescription] = useState(description)
  const [apiKey, setApiKey] = useState(defaultApiKey)
  const embedRef = useRef<HTMLDivElement>(null)

  // 创建新沙箱
  const createSandbox = async () => {
    if (!apiKey) {
      setError('请输入您的 CodeSandbox API Key')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const sdk = new CodeSandbox(apiKey)
      const templateFiles = files || TEMPLATES[selectedTemplate]?.files || TEMPLATES.react.files
      
      const sandbox = await sdk.sandboxes.create({
        title: customTitle,
        description: customDescription,
        privacy: isPublic ? 'public' : 'private',
      })
      
      const client = await sandbox.connect()
      
      const filesToWrite = Object.entries(templateFiles).map(([path, file]) => ({
        path: path,
        content: file.code,
        isBinary: 'isBinary' in file && file.isBinary ? file.isBinary : false
      }));

      await client.fs.batchWrite(filesToWrite)

      const newSandboxUrl = `https://codesandbox.io/p/sandbox/${sandbox.id}`
      setSandboxUrl(newSandboxUrl)
      setSuccess('沙箱创建成功！')
      
      if (onSandboxCreated) {
        onSandboxCreated(sandbox)
      }

      // 如果有嵌入容器，加载嵌入式预览
      if (embedRef.current) {
        const embedUrl = `https://codesandbox.io/embed/${sandbox.id}?fontsize=14&hidenavigation=1&theme=${embedStyle}&view=${showPreview ? 'preview' : 'editor'}`
        
        const iframe = document.createElement('iframe')
        iframe.src = embedUrl
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.border = 'none'
        iframe.style.borderRadius = '8px'
        
        embedRef.current.innerHTML = ''
        embedRef.current.appendChild(iframe)
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建沙箱时出现错误'
      setError(errorMessage)
      if (onError) {
        onError(new Error(errorMessage))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 复制沙箱链接
  const copySandboxUrl = async () => {
    if (sandboxUrl) {
      try {
        await navigator.clipboard.writeText(sandboxUrl)
        setSuccess('链接已复制到剪贴板！')
        setTimeout(() => setSuccess(''), 3000)
      } catch {
        setError('复制链接失败')
        setTimeout(() => setError(''), 3000)
      }
    }
  }

  // 在新标签页打开
  const openInNewTab = () => {
    if (sandboxUrl) {
      window.open(sandboxUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            CodeSandbox SDK
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 配置表单 */}
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                配置
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                预览
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CodeSandbox API Key</label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="输入您的 CodeSandbox API Key"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">模板类型</label>
                  <Select value={selectedTemplate} onValueChange={(value: 'vanilla' | 'react' | 'react-ts') => setSelectedTemplate(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择模板" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vanilla">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">JS</Badge>
                          Vanilla JS
                        </div>
                      </SelectItem>
                      <SelectItem value="react">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">React</Badge>
                          React
                        </div>
                      </SelectItem>
                      <SelectItem value="react-ts">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">React TS</Badge>
                          React TypeScript
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">沙箱标题</label>
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="输入沙箱标题"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">描述</label>
                <Input
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="输入沙箱描述"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={createSandbox}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isLoading ? '创建中...' : '创建沙箱'}
                </Button>

                {sandboxUrl && (
                  <>
                    <Button
                      onClick={copySandboxUrl}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      复制链接
                    </Button>
                    
                    <Button
                      onClick={openInNewTab}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      打开
                    </Button>
                  </>
                )}
              </div>

              {/* 状态提示 */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* 模板预览 */}
              {TEMPLATES[selectedTemplate] && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {TEMPLATES[selectedTemplate].name} - {TEMPLATES[selectedTemplate].description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>包含文件:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {Object.keys(TEMPLATES[selectedTemplate].files).map(fileName => (
                          <li key={fileName} className="flex items-center gap-2">
                            <FolderOpen className="h-3 w-3" />
                            <code>{fileName}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div 
                ref={embedRef}
                className="border rounded-lg"
                style={{ 
                  width: typeof width === 'number' ? width + 'px' : width, 
                  height: typeof height === 'number' ? height + 'px' : height,
                  minHeight: '400px'
                }}
              >
                {!sandboxUrl ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Code2 className="h-12 w-12 mb-4" />
                    <p>创建沙箱后将显示预览</p>
                  </div>
                ) : null}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default CodeSandboxSDK