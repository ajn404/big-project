import React, { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'

interface ShaderPlaygroundProps {
  width?: number
  height?: number
  initialVertexShader?: string
  initialFragmentShader?: string
  showEditor?: boolean
  className?: string
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
const shaderPresets = {
  rainbow: {
    name: '彩虹渐变',
    fragment: defaultFragmentShader
  },
  circles: {
    name: '同心圆',
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
function ShaderMaterial({ fragmentShader, vertexShader }: { 
  fragmentShader: string
  vertexShader: string 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(512, 512) },
    u_mouse: { value: new THREE.Vector2(0, 0) }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
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
  className = ''
}: ShaderPlaygroundProps) {
  const [fragmentShader, setFragmentShader] = useState(initialFragmentShader)
  const [vertexShader, setVertexShader] = useState(initialVertexShader)
  const [selectedPreset, setSelectedPreset] = useState<string>('rainbow')
  const [isEditing, setIsEditing] = useState(false)

  const loadPreset = useCallback((presetKey: string) => {
    const preset = shaderPresets[presetKey as keyof typeof shaderPresets]
    if (preset) {
      setFragmentShader(preset.fragment)
      setSelectedPreset(presetKey)
    }
  }, [])

  const handleShaderUpdate = useCallback((newShader: string) => {
    setFragmentShader(newShader)
  }, [])

  return (
    <div className={`shader-playground ${className}`}>
      <div className="mb-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🎨 Shader Playground</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {isEditing ? '隐藏编辑器' : '显示编辑器'}
            </button>
          </div>
        </div>
        
        {/* 预设选择器 */}
        <div className="flex flex-wrap gap-2">
          <label className="text-sm font-medium">预设案例:</label>
          {Object.entries(shaderPresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                selectedPreset === key
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* 3D 渲染区域 */}
        <div className="shader-canvas" style={{ width, height }}>
          <Canvas
            camera={{ position: [0, 0, 2], fov: 75 }}
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              background: '#000'
            }}
          >
            <ShaderMaterial 
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
            />
          </Canvas>
        </div>

        {/* 代码编辑器 */}
        {showEditor && isEditing && (
          <div className="flex-1 min-w-[400px]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  片段着色器 (Fragment Shader):
                </label>
                <textarea
                  value={fragmentShader}
                  onChange={(e) => handleShaderUpdate(e.target.value)}
                  className="w-full h-[300px] font-mono text-xs border border-gray-300 rounded p-3 resize-y"
                  spellCheck={false}
                  placeholder="在这里编写你的片段着色器..."
                />
              </div>
              
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>可用的 uniform 变量:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li><code>u_time</code> - 时间 (float)</li>
                  <li><code>u_resolution</code> - 分辨率 (vec2)</li>
                  <li><code>u_mouse</code> - 鼠标位置 (vec2)</li>
                  <li><code>gl_FragCoord</code> - 片段坐标</li>
                </ul>
              </div>
              
              <div className="text-xs text-gray-600">
                <p><strong>💡 提示:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>修改代码后会实时更新预览</li>
                  <li>尝试不同的预设案例学习技巧</li>
                  <li>可以参考 <a href="https://thebookofshaders.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Book of Shaders</a> 教程</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 自动注册组件
const RegisteredShaderPlayground = createAutoRegisterComponent({
  id: 'shader-playground',
  name: 'ShaderPlayground',
  description: '实时 Shader 编辑器和可视化工具，支持 Book of Shaders 案例实践',
  category: CATEGORIES.THREE_D,
  template: `:::react{component="ShaderPlayground" width="500" height="400" showEditor="true"}
实时 Shader 编程环境
:::`,
  tags: ['shader', 'webgl', 'glsl', '3d', 'playground'],
  version: '1.0.0',
  props: {
    width: {
      type: 'number',
      default: 400
    },
    height: {
      type: 'number', 
      default: 400
    },
    showEditor: {
      type: 'boolean',
      default: true
    }
  }
})(ShaderPlayground)

export { RegisteredShaderPlayground as ShaderPlayground }