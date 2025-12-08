import React from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { CodeSandbox } from '../ui/CodeSandbox'

interface CodeSandboxDemoProps {
  initialCode?: string
  initialCSS?: string
  language?: 'javascript' | 'typescript' | 'jsx' | 'tsx'
  width?: number | string
  height?: number | string
  theme?: 'light' | 'dark' | 'auto'
  showEditor?: boolean
  showPreview?: boolean
  showCSS?: boolean
  allowFullscreen?: boolean
  readOnly?: boolean
  enableConsole?: boolean
}

const CodeSandboxDemo: React.FC<CodeSandboxDemoProps> = (props) => {
  const defaultCode = `// React 代码沙箱示例 - 使用自定义 CSS 样式
function CounterExample() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('点击按钮开始计数！')
  
  useEffect(() => {
    console.log('组件已挂载，当前计数:', count)
    if (count === 0) {
      setMessage('点击按钮开始计数！')
    } else if (count <= 3) {
      setMessage('继续点击...')
    } else if (count <= 8) {
      setMessage('你做得很好！🎉')
    } else {
      setMessage('你真是个点击大师！🚀')
    }
  }, [count])
  
  const handleIncrement = () => {
    setCount(prev => prev + 1)
    console.log('计数增加到:', count + 1)
  }
  
  const handleReset = () => {
    setCount(0)
    setMessage('计数器已重置!')
    console.log('计数器重置')
  }
  
  return (
    <div className="counter-container">
      <h3 className="counter-title">
        🎯 计数器演示
      </h3>
      
      <div className="counter-display">
        计数: <span className="counter-number">{count}</span>
      </div>
      
      <div className="message">
        {message}
      </div>
      
      <div className="button-container">
        <button
          onClick={handleIncrement}
          className="counter-btn increment-btn"
        >
          增加 ➕
        </button>
        <button
          onClick={handleReset}
          className="counter-btn reset-btn"
        >
          重置 🔄
        </button>
      </div>
      
      {count > 10 && (
        <div className="achievement">
          🏆 恭喜！你已经点击了 {count} 次！成为了真正的点击大师！
        </div>
      )}
    </div>
  )
}

return <CounterExample />
`

  const defaultCSS = `/* 自定义样式 */
.counter-container {
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  color: white;
  font-family: 'Arial', sans-serif;
}

.counter-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.counter-display {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.counter-number {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.2);
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 2rem;
  min-width: 4rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.counter-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

.counter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.counter-btn:hover::before {
  left: 100%;
}

.increment-btn {
  background: #4CAF50;
  color: white;
  box-shadow: 0 4px 15px rgba(76,175,80,0.3);
}

.increment-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76,175,80,0.4);
}

.reset-btn {
  background: #ff6b6b;
  color: white;
  box-shadow: 0 4px 15px rgba(255,107,107,0.3);
}

.reset-btn:hover {
  background: #ee5a52;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,107,107,0.4);
}

.message {
  text-align: center;
  margin: 1rem 0;
  font-style: italic;
  opacity: 0.9;
}

.achievement {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255,193,7,0.9);
  color: #333;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: bold;
  animation: celebrate 1s ease;
  backdrop-filter: blur(5px);
}

@keyframes celebrate {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}`;

  return (
    <CodeSandbox 
      initialCode={props.initialCode || defaultCode}
      initialCSS={props.initialCSS || defaultCSS}
      language={props.language || 'jsx'}
      width={props.width || '100%'}
      height={props.height || 600}
      theme={props.theme || 'auto'}
      showEditor={props.showEditor !== false}
      showPreview={props.showPreview !== false}
      showCSS={props.showCSS !== false}
      allowFullscreen={props.allowFullscreen !== false}
      readOnly={props.readOnly || false}
      enableConsole={props.enableConsole !== false}
    />
  )
}

// 自动注册组件
const RegisteredCodeSandboxDemo = createAutoRegisterComponent({
  id: 'code-sandbox',
  name: 'CodeSandboxDemo',
  description: '交互式 React 代码沙箱，支持实时编辑、预览、CSS 样式和控制台输出',
  category: CATEGORIES.INTERACTIVE,
  template: `:::react{component="CodeSandboxDemo" language="jsx" height="600" enableConsole="true" showCSS="true"}
实时 React 代码编辑环境 - 支持 JavaScript/CSS 双编辑器
:::`,
  tags: ['react', 'code', 'sandbox', 'editor', 'playground', 'interactive', 'monaco', 'css', 'styling'],
  version: '1.1.0',
  props: {
    initialCode: {
      type: 'string',
      default: '',
      description: '初始 React 代码内容'
    },
    initialCSS: {
      type: 'string',
      default: '',
      description: '初始 CSS 样式内容'
    },
    language: {
      type: 'string',
      default: 'jsx',
      description: '编程语言: javascript, typescript, jsx, tsx',
      options: ['javascript', 'typescript', 'jsx', 'tsx']
    },
    width: {
      type: 'string',
      default: '100%',
      description: '组件宽度'
    },
    height: {
      type: 'number',
      default: 600,
      description: '组件高度'
    },
    theme: {
      type: 'string',
      default: 'auto',
      description: '编辑器主题: light, dark, auto',
      options: ['light', 'dark', 'auto']
    },
    showEditor: {
      type: 'boolean',
      default: true,
      description: '是否显示代码编辑器'
    },
    showPreview: {
      type: 'boolean',
      default: true,
      description: '是否显示预览区域'
    },
    showCSS: {
      type: 'boolean',
      default: true,
      description: '是否显示 CSS 编辑器'
    },
    allowFullscreen: {
      type: 'boolean',
      default: true,
      description: '是否允许全屏模式'
    },
    readOnly: {
      type: 'boolean',
      default: false,
      description: '是否为只读模式'
    },
    enableConsole: {
      type: 'boolean',
      default: true,
      description: '是否启用控制台输出'
    }
  }
})(CodeSandboxDemo)

export { RegisteredCodeSandboxDemo as CodeSandboxDemo }
export default CodeSandboxDemo