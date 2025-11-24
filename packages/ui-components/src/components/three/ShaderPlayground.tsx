import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { Editor, loader } from '@monaco-editor/react'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { cn } from '../../utils'
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Code2,
  Palette,
  Info,
  Moon,
  Sun
} from 'lucide-react'

// 配置 Monaco Editor 使用本地静态资源
loader.config({
  paths: {
    vs: '/monaco/vs'
  }
})

interface ShaderPlaygroundProps {
  width?: number
  height?: number
  initialVertexShader?: string
  initialFragmentShader?: string
  showEditor?: boolean
  className?: string
  theme?: 'light' | 'dark' | 'auto'
}

interface ShaderPreset {
  name: string
  description?: string
  fragment: string
  vertex?: string
  category?: string
}

// 默认的 Book of Shaders 风格片段着色器
const defaultFragmentShader = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
    // 将坐标标准化到 [0.0, 1.0]
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // Book of Shaders 经典案例：彩色渐变
    vec3 color = vec3(0.0);
    
    // 彩虹渐变
    color.r = sin(u_time * 2.0 + st.x * 3.14159);
    color.g = sin(u_time * 2.0 + st.x * 3.14159 + 2.094);
    color.b = sin(u_time * 2.0 + st.x * 3.14159 + 4.188);
    
    // 添加时间变化的波纹效果
    float wave = sin(st.y * 10.0 + u_time * 3.0) * 0.1;
    color += wave;
    
    gl_FragColor = vec4(color, 1.0);
}
`

const defaultVertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Shader 预设案例库
const shaderPresets: Record<string, ShaderPreset> = {
  rainbow: {
    name: '彩虹渐变',
    description: '时间驱动的彩色渐变效果',
    category: '基础',
    fragment: defaultFragmentShader
  },
  circles: {
    name: '同心圆',
    description: '径向距离创建的动态同心圆',
    category: '几何',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5);
    float dist = distance(st, center);
    
    // 创建同心圆效果
    float rings = sin(dist * 20.0 - u_time * 3.0);
    vec3 color = vec3(rings * 0.5 + 0.5);
    
    // 添加颜色
    color *= vec3(1.0 - dist, 0.5, dist);
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },
  noise: {
    name: '噪声波纹',
    description: '基于Perlin噪声的多层波纹效果',
    category: '噪声',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

// 简单噪声函数
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    
    // 多层噪声
    float n = noise(st * 5.0 + u_time * 0.5);
    n += 0.5 * noise(st * 10.0 + u_time * 0.8);
    n += 0.25 * noise(st * 20.0 + u_time * 1.2);
    
    vec3 color = vec3(n);
    color *= vec3(0.8, 1.0, 1.2); // 蓝色调
    
    gl_FragColor = vec4(color, 1.0);
}
`
  },
  fractal: {
    name: 'Mandelbrot 分形',
    description: '经典的Mandelbrot集合分形图案',
    category: '分形',
    fragment: `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

vec2 complexMul(vec2 a, vec2 b) {
    return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    // 缩放和偏移
    st = st * 3.0 + vec2(-0.5, 0.0);
    
    vec2 z = vec2(0.0);
    vec2 c = st;
    
    int iterations = 0;
    const int maxIterations = 100;
    
    for (int i = 0; i < maxIterations; i++) {
        if (length(z) > 2.0) break;
        z = complexMul(z, z) + c;
        iterations++;
    }
    
    float t = float(iterations) / float(maxIterations);
    
    // 颜色映射
    vec3 color = vec3(0.0);
    if (t < 1.0) {
        color = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)) + u_time);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`
  }
}

// Shader 材质组件
function ShaderMaterial({
  fragmentShader,
  vertexShader,
  isRunning = true
}: {
  fragmentShader: string
  vertexShader: string
  isRunning?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(512, 512) },
    u_mouse: { value: new THREE.Vector2(0, 0) }
  }), [])

  useFrame((state) => {
    if (materialRef.current && isRunning) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime
    }
  })

  const material = useMemo(() => {
    try {
      return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide
      })
    } catch (error) {
      console.error('Shader compilation error:', error)
      // 返回错误时的默认材质
      return new THREE.MeshBasicMaterial({ color: 0xff0000 })
    }
  }, [fragmentShader, vertexShader, uniforms])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  )
}

// 主要的 Shader Playground 组件
function ShaderPlayground({
  width = 400,
  height = 400,
  initialVertexShader = defaultVertexShader,
  initialFragmentShader = defaultFragmentShader,
  showEditor = true,
  className = '',
  theme = 'auto'
}: ShaderPlaygroundProps) {
  const [fragmentShader, setFragmentShader] = useState(initialFragmentShader)
  const [vertexShader, setVertexShader] = useState(initialVertexShader)
  const [selectedPreset, setSelectedPreset] = useState<string>('rainbow')
  const [isEditing, setIsEditing] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRunning, setIsRunning] = useState(true)
  const [activeTab, setActiveTab] = useState<'fragment' | 'vertex'>('fragment')

  // 主题检测
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setIsDarkMode(theme === 'dark')
    }
  }, [theme])

  const loadPreset = useCallback((presetKey: string) => {
    const preset = shaderPresets[presetKey]
    if (preset) {
      setFragmentShader(preset.fragment)
      if (preset.vertex) {
        setVertexShader(preset.vertex)
      }
      setSelectedPreset(presetKey)
    }
  }, [])

  const handleFragmentShaderUpdate = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setFragmentShader(value)
    }
  }, [])

  const handleVertexShaderUpdate = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setVertexShader(value)
    }
  }, [])

  const resetShaders = useCallback(() => {
    setFragmentShader(defaultFragmentShader)
    setVertexShader(defaultVertexShader)
    setSelectedPreset('rainbow')
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode)
  }, [isDarkMode])

  // 获取分类的预设
  const categorizedPresets = useMemo(() => {
    const categories: Record<string, ShaderPreset[]> = {}
    Object.entries(shaderPresets).forEach(([key, preset]) => {
      const category = preset.category || '其他'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push({ ...preset, name: key })
    })
    return categories
  }, [])

  return (
    <div className={cn("w-full space-y-6 p-6", className)}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Shader Playground
              </CardTitle>
              <CardDescription>
                实时 GLSL Shader 编辑器和可视化工具
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetShaders}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              {showEditor && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {isEditing ? '隐藏编辑器' : '显示编辑器'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 预设选择器 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-medium">预设案例</span>
            </div>
            <Select value={selectedPreset} onValueChange={loadPreset}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="选择预设案例" />
              </SelectTrigger>
              <SelectContent >
                {Object.entries(categorizedPresets).map(([category, presets]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {category}
                    </div>
                    {presets.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        <div className="flex justify-center items-center gap-4">
                          <div className="font-medium">{shaderPresets[preset.name].name}</div>
                          {preset.description && (
                            <div className="text-xs text-muted-foreground">
                              {preset.description}
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="@container">
            <div className="flex flex-col @3xl:flex-row gap-6 @3xl:items-center">
              {/* 3D 渲染区域 */}
              <Card className="flex-shrink-0 @3xl:flex-shrink-0">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden rounded-lg border mx-auto @3xl:mx-0"
                    style={{ 
                      width: typeof width === 'number' && width > 600 ? Math.min(width, 500) : width, 
                      height: typeof height === 'number' && height > 400 ? Math.min(height, 400) : height 
                    }}
                  >
                    <Canvas
                      camera={{ position: [0, 0, 2], fov: 75 }}
                      className="bg-black"
                    >
                      <ShaderMaterial
                        fragmentShader={fragmentShader}
                        vertexShader={vertexShader}
                        isRunning={isRunning}
                      />
                    </Canvas>
                  </div>
                </CardContent>
              </Card>

              {/* 代码编辑器 */}
              {showEditor && isEditing && (
                <Card className="flex-1 @3xl:min-w-[500px] w-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Shader 编辑器
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'fragment' | 'vertex')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="fragment">Fragment Shader</TabsTrigger>
                      <TabsTrigger value="vertex">Vertex Shader</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fragment" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Fragment Shader</Badge>
                          <div className="text-xs text-muted-foreground">
                            片段着色器 - 控制像素颜色
                          </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <Editor
                            height="400px"
                            language="glsl"
                            value={fragmentShader}
                            onChange={handleFragmentShaderUpdate}
                            theme={isDarkMode ? 'vs-dark' : 'light'}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              wordWrap: 'on',
                              automaticLayout: true,
                              tabSize: 2,
                              insertSpaces: true,
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="vertex" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">Vertex Shader</Badge>
                          <div className="text-xs text-muted-foreground">
                            顶点着色器 - 控制几何体变换
                          </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                          <Editor
                            height="400px"
                            language="glsl"
                            value={vertexShader}
                            onChange={handleVertexShaderUpdate}
                            theme={isDarkMode ? 'vs-dark' : 'light'}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                              lineNumbers: 'on',
                              scrollBeyondLastLine: false,
                              wordWrap: 'on',
                              automaticLayout: true,
                              tabSize: 2,
                              insertSpaces: true,
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* 帮助信息 */}
                  <Card className="mt-6 bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="space-y-2">
                          <div className="text-sm font-medium">可用的 Uniform 变量</div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div><code className="bg-background px-1 py-0.5 rounded">u_time</code> - 时间 (float)</div>
                            <div><code className="bg-background px-1 py-0.5 rounded">u_resolution</code> - 分辨率 (vec2)</div>
                            <div><code className="bg-background px-1 py-0.5 rounded">u_mouse</code> - 鼠标位置 (vec2)</div>
                            <div><code className="bg-background px-1 py-0.5 rounded">gl_FragCoord</code> - 片段坐标</div>
                          </div>
                          <div className="text-xs text-muted-foreground pt-2">
                            <strong>💡 提示:</strong> 修改代码后会实时更新预览，可以参考{' '}
                            <a
                              href="https://thebookofshaders.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Book of Shaders
                            </a>{' '}
                            教程学习更多技巧
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 自动注册组件
const RegisteredShaderPlayground = createAutoRegisterComponent({
  id: 'shader-playground',
  name: 'ShaderPlayground',
  description: '专业的 GLSL Shader 编辑器，支持 Monaco Editor 和主题切换',
  category: CATEGORIES.THREE_D,
  template: `:::react{component="ShaderPlayground" width="500" height="400" showEditor="true" theme="auto"}
实时 Shader 编程环境
:::`,
  tags: ['shader', 'webgl', 'glsl', '3d', 'playground', 'monaco', 'editor'],
  version: '2.0.0',
  props: {
    width: {
      type: 'number',
      default: 400,
      description: '渲染区域宽度'
    },
    height: {
      type: 'number',
      default: 400,
      description: '渲染区域高度'
    },
    showEditor: {
      type: 'boolean',
      default: true,
      description: '是否显示代码编辑器'
    },
    theme: {
      type: 'string',
      default: 'auto',
      description: '编辑器主题: light, dark, auto',
      options: ['light', 'dark', 'auto']
    },
    initialVertexShader: {
      type: 'string',
      default: '',
      description: '初始顶点着色器代码'
    },
    initialFragmentShader: {
      type: 'string',
      default: '',
      description: '初始片段着色器代码'
    }
  }
})(ShaderPlayground)

export { RegisteredShaderPlayground as ShaderPlayground }