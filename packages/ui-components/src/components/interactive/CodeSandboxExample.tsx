import React, { useState } from 'react'
import { CodeSandboxSDK } from './CodeSandboxSDK'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  Code2, 
  Zap, 
  Palette, 
  BookOpen,
  ExternalLink,
  Github,
  Star
} from 'lucide-react'

interface CodeSandboxExampleProps {
  className?: string
}

export const CodeSandboxExample: React.FC<CodeSandboxExampleProps> = ({ className }) => {
  const [activeSandbox, setActiveSandbox] = useState<any>(null)

  const handleSandboxCreated = (sandbox: any) => {
    setActiveSandbox(sandbox)
    console.log('沙箱创建成功:', sandbox)
  }

  const handleCodeChange = (files: Record<string, string>) => {
    console.log('代码变更:', files)
  }

  const handleError = (error: Error) => {
    console.error('沙箱错误:', error)
  }

  // 自定义 React 组件示例
  const customReactFiles = {
    'package.json': {
      code: JSON.stringify({
        "name": "custom-react-example",
        "version": "1.0.0",
        "description": "自定义 React 示例",
        "main": "index.js",
        "scripts": {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test"
        },
        "dependencies": {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-scripts": "5.0.1",
          "axios": "^1.4.0",
          "date-fns": "^2.30.0"
        }
      }, null, 2)
    },
    'public/index.html': {
      code: `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>自定义 React 示例</title>
    <style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
    },
    'src/index.js': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
    },
    'src/App.js': {
      code: `import React, { useState, useEffect } from 'react';
import TodoApp from './components/TodoApp';
import Weather from './components/Weather';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 React 示例应用</h1>
        <p className="time">
          当前时间: {currentTime.toLocaleTimeString('zh-CN')}
        </p>
      </header>
      
      <main className="App-main">
        <div className="container">
          <TodoApp />
          <Weather />
        </div>
      </main>
    </div>
  );
}

export default App;`
    },
    'src/components/TodoApp.js': {
      code: `import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '使用 CodeSandbox', completed: true },
    { id: 3, text: '构建应用', completed: false }
  ]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h2>📝 待办事项</h2>
      <div className="todo-input">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加新任务..."
        />
        <button onClick={addTodo}>添加</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={\`todo-item \${todo.completed ? 'completed' : ''}\`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
      <p className="todo-stats">
        总共: {todos.length} | 已完成: {todos.filter(t => t.completed).length}
      </p>
    </div>
  );
}

export default TodoApp;`
    },
    'src/components/Weather.js': {
      code: `import React, { useState } from 'react';

function Weather() {
  const [weather, setWeather] = useState({
    city: '北京',
    temperature: 22,
    condition: '晴天',
    humidity: 65,
    windSpeed: 12
  });

  const refreshWeather = () => {
    // 模拟获取新的天气数据
    const conditions = ['晴天', '多云', '雨天', '雪天'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 35) + 5;
    const randomHumidity = Math.floor(Math.random() * 40) + 40;
    const randomWindSpeed = Math.floor(Math.random() * 20) + 5;

    setWeather({
      ...weather,
      temperature: randomTemp,
      condition: randomCondition,
      humidity: randomHumidity,
      windSpeed: randomWindSpeed
    });
  };

  return (
    <div className="weather-app">
      <h2>🌤️ 天气信息</h2>
      <div className="weather-card">
        <h3>{weather.city}</h3>
        <div className="weather-main">
          <span className="temperature">{weather.temperature}°C</span>
          <span className="condition">{weather.condition}</span>
        </div>
        <div className="weather-details">
          <div className="detail">
            <span>湿度</span>
            <span>{weather.humidity}%</span>
          </div>
          <div className="detail">
            <span>风速</span>
            <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
        <button onClick={refreshWeather} className="refresh-btn">
          刷新天气
        </button>
      </div>
    </div>
  );
}

export default Weather;`
    },
    'src/App.css': {
      code: `.App {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.App-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.App-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

.time {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}

/* Todo App 样式 */
.todo-app {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.todo-app h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.todo-input {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.todo-input button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.todo-input button:hover {
  background: #5a6fd8;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fafafa;
  transition: all 0.2s;
}

.todo-item:hover {
  background: #f0f0f0;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed span {
  text-decoration: line-through;
}

.todo-item span {
  flex: 1;
  cursor: pointer;
}

.todo-item button {
  padding: 4px 12px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.todo-stats {
  color: #666;
  font-size: 14px;
  margin: 0;
  text-align: center;
}

/* Weather App 样式 */
.weather-app {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.weather-app h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.weather-card {
  text-align: center;
}

.weather-card h3 {
  font-size: 1.5rem;
  margin: 0 0 20px 0;
  color: #555;
}

.weather-main {
  margin-bottom: 20px;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  display: block;
}

.condition {
  font-size: 1.2rem;
  color: #666;
  margin-top: 5px;
  display: block;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail span:first-child {
  color: #666;
  font-size: 14px;
}

.detail span:last-child {
  color: #333;
  font-weight: bold;
}

.refresh-btn {
  padding: 12px 24px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #219a3e;
}`
    }
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* 标题和说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-6 w-6" />
              CodeSandbox SDK 示例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              这个组件展示了如何使用 @codesandbox/sdk 创建和嵌入 CodeSandbox 沙箱。
              你可以选择不同的模板，自定义文件内容，并实时预览结果。
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                实时预览
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Palette className="h-3 w-3" />
                多种模板
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                文件管理
              </Badge>
            </div>

            {activeSandbox && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ 沙箱创建成功！URL: 
                  <a 
                    href={activeSandbox.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-green-600 hover:underline inline-flex items-center gap-1"
                  >
                    查看沙箱 <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 示例标签页 */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">基础示例</TabsTrigger>
            <TabsTrigger value="react">React 应用</TabsTrigger>
            <TabsTrigger value="custom">自定义模板</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>基础 JavaScript 沙箱</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeSandboxSDK
                  template="vanilla"
                  title="基础 JavaScript 示例"
                  description="一个简单的 JavaScript 沙箱示例"
                  onSandboxCreated={handleSandboxCreated}
                  onCodeChange={handleCodeChange}
                  onError={handleError}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="react" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>React TypeScript 沙箱</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeSandboxSDK
                  template="react-ts"
                  title="React TypeScript 示例"
                  description="使用 TypeScript 的 React 应用示例"
                  onSandboxCreated={handleSandboxCreated}
                  onCodeChange={handleCodeChange}
                  onError={handleError}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>自定义文件模板</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeSandboxSDK
                  template="react"
                  title="自定义 React 应用"
                  description="包含待办事项和天气组件的完整 React 应用"
                  files={customReactFiles}
                  onSandboxCreated={handleSandboxCreated}
                  onCodeChange={handleCodeChange}
                  onError={handleError}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 使用指南 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              使用指南
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">快速开始</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>选择一个模板类型（Vanilla JS、React、React TypeScript）</li>
                  <li>输入沙箱标题和描述</li>
                  <li>点击"创建沙箱"按钮</li>
                  <li>等待沙箱创建完成，然后可以在预览窗口中查看结果</li>
                  <li>使用"复制链接"分享你的沙箱，或"打开"在新标签页中编辑</li>
                </ol>
              </div>

              <div>
                <h4 className="font-medium mb-2">功能特性</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>支持多种前端框架和模板</li>
                  <li>实时预览和代码编辑</li>
                  <li>自动依赖管理</li>
                  <li>一键分享和协作</li>
                  <li>响应式嵌入界面</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">@codesandbox/sdk</Badge>
                  <Badge variant="outline">React</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">Tailwind CSS</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CodeSandboxExample