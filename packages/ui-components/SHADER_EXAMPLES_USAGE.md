# 🎯 Shader Playground 使用示例

## 🚀 在项目中使用

### 基础用法
```tsx
import { ShaderPlayground } from '@workspace/ui-components'

function ShaderLearningPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shader 学习</h1>
      
      {/* 基础 Playground */}
      <ShaderPlayground />
      
      {/* 自定义尺寸 */}
      <ShaderPlayground width={600} height={500} />
      
      {/* 隐藏编辑器，仅显示效果 */}
      <ShaderPlayground showEditor={false} />
    </div>
  )
}
```

### 预设自定义 Shader
```tsx
const myCustomShader = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 创建波纹效果
    float dist = distance(st, vec2(0.5));
    float wave = sin(dist * 15.0 - u_time * 3.0);
    
    vec3 color = vec3(wave * 0.5 + 0.5);
    color *= vec3(1.0, 0.7, 0.9);
    
    gl_FragColor = vec4(color, 1.0);
}
`

<ShaderPlayground 
  initialFragmentShader={myCustomShader}
  width={500}
  height={400}
/>
```

## 📚 教学场景应用

### 1. 渐进式教程
```tsx
// 第一步：纯色
const lesson1 = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.5, 0.8, 1.0);
}
`

// 第二步：使用坐标
const lesson2 = `
precision mediump float;
uniform vec2 u_resolution;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(st.x, st.y, 0.5, 1.0);
}
`

// 第三步：添加动画
const lesson3 = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(st.x, st.y, abs(sin(u_time)), 1.0);
}
`

function ProgressiveTutorial() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const lessons = [lesson1, lesson2, lesson3]
  
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {lessons.map((_, index) => (
          <button 
            key={index}
            onClick={() => setCurrentLesson(index)}
            className={`px-4 py-2 rounded ${
              currentLesson === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            第 {index + 1} 课
          </button>
        ))}
      </div>
      
      <ShaderPlayground 
        key={currentLesson}
        initialFragmentShader={lessons[currentLesson]}
        width={500}
        height={400}
      />
    </div>
  )
}
```

### 2. 对比展示
```tsx
function ShaderComparison() {
  const basicShader = `
precision mediump float;
uniform vec2 u_resolution;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(vec3(step(0.5, st.x)), 1.0);
}
`

  const smoothShader = `
precision mediump float;
uniform vec2 u_resolution;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(vec3(smoothstep(0.3, 0.7, st.x)), 1.0);
}
`

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3>Step 函数 (硬边)</h3>
        <ShaderPlayground 
          initialFragmentShader={basicShader}
          width={300}
          height={300}
          showEditor={false}
        />
      </div>
      
      <div>
        <h3>Smoothstep 函数 (平滑)</h3>
        <ShaderPlayground 
          initialFragmentShader={smoothShader}
          width={300}
          height={300}
          showEditor={false}
        />
      </div>
    </div>
  )
}
```

## 🎨 创意应用场景

### 1. 艺术创作工具
```tsx
function ArtisticShaderStudio() {
  const [savedShaders, setSavedShaders] = useState([])
  
  const saveCurrentShader = (shaderCode) => {
    const newShader = {
      id: Date.now(),
      name: `作品 ${savedShaders.length + 1}`,
      code: shaderCode,
      thumbnail: '生成缩略图...' // 可以实现截图功能
    }
    setSavedShaders([...savedShaders, newShader])
  }
  
  return (
    <div className="artist-studio">
      <ShaderPlayground 
        width={600}
        height={600}
        onShaderChange={setCurrentShader}
      />
      
      <div className="saved-works grid grid-cols-3 gap-4 mt-4">
        {savedShaders.map(shader => (
          <div key={shader.id} className="work-item p-2 border rounded">
            <div className="thumbnail bg-gray-200 h-20"></div>
            <p className="text-sm mt-1">{shader.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 2. 交互式文档
```tsx
function InteractiveShaderDocs() {
  const examples = {
    'distance函数': `
precision mediump float;
uniform vec2 u_resolution;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float dist = distance(st, vec2(0.5));
    gl_FragColor = vec4(vec3(dist), 1.0);
}`,
    
    'sin波': `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float wave = sin(st.x * 10.0 + u_time);
    gl_FragColor = vec4(vec3(wave * 0.5 + 0.5), 1.0);
}`,
  }
  
  return (
    <div className="docs-interactive">
      <div className="sidebar w-1/3">
        <h3>函数说明</h3>
        {Object.keys(examples).map(name => (
          <button 
            key={name}
            onClick={() => setCurrentExample(examples[name])}
            className="block w-full text-left p-2 hover:bg-gray-100"
          >
            {name}
          </button>
        ))}
      </div>
      
      <div className="main-content w-2/3">
        <ShaderPlayground 
          initialFragmentShader={currentExample}
          width={400}
          height={400}
        />
      </div>
    </div>
  )
}
```

## 🎯 教育应用场景

### 数学可视化
```tsx
const mathVisualizations = {
  '三角函数': `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float y = sin(st.x * 6.28318 + u_time);
    float line = 1.0 - step(0.02, abs(st.y * 2.0 - 1.0 - y * 0.5));
    gl_FragColor = vec4(vec3(line), 1.0);
}`,
  
  '波的叠加': `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float wave1 = sin(st.x * 10.0 + u_time);
    float wave2 = sin(st.x * 15.0 + u_time * 1.5);
    float result = (wave1 + wave2) * 0.25 + 0.5;
    gl_FragColor = vec4(vec3(result), 1.0);
}`
}

<ShaderPlayground 
  initialFragmentShader={mathVisualizations['三角函数']}
/>
```

## 🔧 自定义扩展

### 添加新的 Uniform
```tsx
// 可以扩展 ShaderPlayground 支持更多 uniform
const extendedShader = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
// uniform vec2 u_mouse;  // 鼠标位置
// uniform float u_scale; // 自定义缩放

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    // 使用鼠标位置作为中心点
    // vec2 center = u_mouse;
    // float dist = distance(st, center) * u_scale;
    
    gl_FragColor = vec4(st, abs(sin(u_time)), 1.0);
}
`
```

现在你可以在各种场景中灵活使用 ShaderPlayground 了！🎨