import { useState, useEffect, useRef } from 'react'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { useTheme } from '../../hooks'

interface LeetCode547VisualizerProps {
  title?: string
  className?: string
  animationSpeed?: number
}

interface Step {
  type: 'init' | 'find' | 'union' | 'result'
  description: string
  matrix?: number[][]
  parent?: number[]
  currentI?: number
  currentJ?: number
  provinces?: number[][]
  provinceCount?: number
}

function LeetCode547Visualizer({
  title = "LeetCode 547: 省份数量（朋友圈）",
  className = "",
  animationSpeed = 1000
}: LeetCode547VisualizerProps) {
  const { isDark } = useTheme()
  const [cityCount, setCityCount] = useState(10)
  const [matrix, setMatrix] = useState<number[][]>([[1,1,0],[1,1,0],[0,0,1]])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<Step[]>([])
  const [parent, setParent] = useState<number[]>([])
  const [provinces, setProvinces] = useState<number[][]>([])
  const [provinceCount, setProvinceCount] = useState(0)
  const timeoutRef = useRef<number | undefined>()

  // 创建单位矩阵（对角线为1，其他为0）
  const createIdentityMatrix = (n: number): number[][] => {
    return Array.from({ length: n }, (_, i) => 
      Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
    )
  }

  // 生成随机连接矩阵
  const generateRandomMatrix = (n: number, connectivity: number = 0.3): number[][] => {
    const newMatrix = createIdentityMatrix(n)
    
    // 随机添加连接
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.random() < connectivity) {
          newMatrix[i][j] = 1
          newMatrix[j][i] = 1
        }
      }
    }
    
    return newMatrix
  }

  // 更新城市数量
  const updateCityCount = (newCount: number) => {
    if (isPlaying) return
    
    setCityCount(newCount)
    
    // 如果减少城市数量，裁剪矩阵
    if (newCount < matrix.length) {
      const newMatrix = matrix.slice(0, newCount).map(row => row.slice(0, newCount))
      setMatrix(newMatrix)
    } 
    // 如果增加城市数量，扩展矩阵
    else if (newCount > matrix.length) {
      const oldSize = matrix.length
      const newMatrix = createIdentityMatrix(newCount)
      
      // 保留原有连接
      for (let i = 0; i < oldSize; i++) {
        for (let j = 0; j < oldSize; j++) {
          newMatrix[i][j] = matrix[i][j]
        }
      }
      
      setMatrix(newMatrix)
    }
    
    resetAnimation()
  }

  // Union-Find算法实现
  const find = (parent: number[], x: number): number => {
    if (parent[x] !== x) {
      parent[x] = find(parent, parent[x]) // 路径压缩
    }
    return parent[x]
  }

  const union = (parent: number[], x: number, y: number): void => {
    const rootX = find(parent, x)
    const rootY = find(parent, y)
    if (rootX !== rootY) {
      parent[rootX] = rootY
    }
  }

  // 生成算法步骤
  const generateSteps = (inputMatrix: number[][]): Step[] => {
    const n = inputMatrix.length
    const tempParent = Array.from({ length: n }, (_, i) => i)
    const stepList: Step[] = []

    stepList.push({
      type: 'init',
      description: '初始化：每个城市都是自己的父节点',
      matrix: inputMatrix.map(row => [...row]),
      parent: [...tempParent]
    })

    // 遍历矩阵的上三角部分
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (inputMatrix[i][j] === 1) {
          stepList.push({
            type: 'find',
            description: `检查城市${i}和城市${j}是否连接`,
            matrix: inputMatrix.map(row => [...row]),
            parent: [...tempParent],
            currentI: i,
            currentJ: j
          })

          const rootI = find(tempParent, i)
          const rootJ = find(tempParent, j)
          
          if (rootI !== rootJ) {
            union(tempParent, i, j)
            stepList.push({
              type: 'union',
              description: `合并城市${i}和城市${j}的集合`,
              matrix: inputMatrix.map(row => [...row]),
              parent: [...tempParent],
              currentI: i,
              currentJ: j
            })
          }
        }
      }
    }

    // 计算省份
    const rootSet = new Set<number>()
    const provinceGroups: number[][] = []
    
    for (let i = 0; i < n; i++) {
      const root = find(tempParent, i)
      rootSet.add(root)
    }

    // 按根节点分组
    const rootToGroup = new Map<number, number[]>()
    for (let i = 0; i < n; i++) {
      const root = find(tempParent, i)
      if (!rootToGroup.has(root)) {
        rootToGroup.set(root, [])
      }
      rootToGroup.get(root)!.push(i)
    }

    provinceGroups.push(...rootToGroup.values())

    stepList.push({
      type: 'result',
      description: `算法完成！共找到 ${rootSet.size} 个省份`,
      matrix: inputMatrix.map(row => [...row]),
      parent: [...tempParent],
      provinces: provinceGroups,
      provinceCount: rootSet.size
    })

    return stepList
  }

  // 开始/暂停动画
  const toggleAnimation = () => {
    if (isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsPlaying(false)
    } else {
      const newSteps = generateSteps(matrix)
      setSteps(newSteps)
      setCurrentStep(0)
      setIsPlaying(true)
      playNextStep(newSteps, 0)
    }
  }

  const playNextStep = (stepList: Step[], stepIndex: number) => {
    if (stepIndex >= stepList.length) {
      setIsPlaying(false)
      return
    }

    const step = stepList[stepIndex]
    setCurrentStep(stepIndex)
    
    if (step.parent) setParent([...step.parent])
    if (step.provinces) setProvinces([...step.provinces])
    if (step.provinceCount !== undefined) setProvinceCount(step.provinceCount)

    timeoutRef.current = setTimeout(() => {
      if (stepIndex < stepList.length - 1) {
        playNextStep(stepList, stepIndex + 1)
      } else {
        setIsPlaying(false)
      }
    }, animationSpeed)
  }

  // 重置动画
  const resetAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPlaying(false)
    setCurrentStep(0)
    setParent([])
    setProvinces([])
    setProvinceCount(0)
  }

  // 更新矩阵
  const updateMatrix = (i: number, j: number) => {
    if (isPlaying) return
    const newMatrix = matrix.map(row => [...row])
    newMatrix[i][j] = newMatrix[i][j] === 1 ? 0 : 1
    newMatrix[j][i] = newMatrix[i][j] // 保持对称
    setMatrix(newMatrix)
    resetAnimation()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const n = matrix.length
  const currentStepData = steps[currentStep]
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg ${className}`}>
      <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{title}</h3>
      
      {/* 问题描述 */}
      <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'}`}>
        <h4 className={`font-semibold mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>问题描述：</h4>
        <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
          有 n 个城市，返回矩阵中省份的数量。省份是一组直接或间接相连的城市。
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-blue-100' : 'text-blue-600'}`}>
          <strong>示例：</strong> [[1,1,0],[1,1,0],[0,0,1]] → 输出：2
        </p>
      </div>

      {/* 城市数量控制 */}
      <div className="mb-6">
        <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>城市数量设置：</h4>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              城市数量 (1-200):
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={cityCount}
              onChange={(e) => updateCityCount(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
              disabled={isPlaying}
              className={`w-20 px-2 py-1 border rounded text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'} disabled:opacity-50`}
            />
          </div>
          <button
            onClick={() => setMatrix(generateRandomMatrix(cityCount, 0.2))}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
          >
            随机生成 (20%连接)
          </button>
          <button
            onClick={() => setMatrix(generateRandomMatrix(cityCount, 0.5))}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 ${isDark ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
          >
            随机生成 (50%连接)
          </button>
          <button
            onClick={() => setMatrix(createIdentityMatrix(cityCount))}
            disabled={isPlaying}
            className={`px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} text-white`}
          >
            重置为单位矩阵
          </button>
        </div>
      </div>

      {/* 连接矩阵 */}
      <div className="mb-6">
        <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          连接矩阵（点击修改） - {n}×{n}:
        </h4>
        <div className="w-full overflow-auto">
          <div 
            className={`inline-block p-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
            style={{ 
              maxHeight: '500px',
              minWidth: n > 10 ? `${n * 2.5}rem` : 'auto'
            }}
          >
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
              {matrix.map((row, i) => 
                row.map((cell, j) => (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => i !== j && updateMatrix(i, j)}
                    className={`
                      ${n <= 10 ? 'w-12 h-12 text-sm' : n <= 20 ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-xs'}
                      border flex items-center justify-center font-medium cursor-pointer
                      ${isDark ? 'border-gray-600' : 'border-gray-300'}
                      ${i === j ? 
                        (isDark ? 'bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-gray-200 cursor-not-allowed') : 
                        cell === 1 ? 
                          (isDark ? 'bg-green-800 hover:bg-green-700 text-green-100' : 'bg-green-100 hover:bg-green-200') : 
                          (isDark ? 'bg-red-800 hover:bg-red-700 text-red-100' : 'bg-red-100 hover:bg-red-200')}
                      ${currentStepData?.currentI === i && currentStepData?.currentJ === j ? 'ring-1 ring-yellow-400' : ''}
                      ${currentStepData?.currentI === j && currentStepData?.currentJ === i ? 'ring-1 ring-yellow-400' : ''}
                    `}
                    title={`城市${i} - 城市${j}: ${cell === 1 ? '已连接' : '未连接'}`}
                  >
                    {n <= 20 ? cell : (cell === 1 ? '●' : '○')}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          绿色表示连接，红色表示不连接，对角线固定为1
          {n > 20 && ' (●表示连接，○表示未连接)'}
        </p>
      </div>

      {/* Union-Find可视化 */}
      <div className="mb-6">
        <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Union-Find 数据结构：</h4>
        <div className="w-full overflow-auto" style={{ maxHeight: '300px' }}>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="text-center">
                <div className={`border rounded mb-1 ${isDark ? 'bg-blue-800 border-blue-600' : 'bg-blue-100 border-blue-300'}
                  ${n <= 10 ? 'px-3 py-2' : n <= 30 ? 'px-2 py-1' : 'px-1 py-1'}`}>
                  <div className={`${n <= 20 ? 'text-xs' : 'text-2xs'} ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {n <= 50 ? `城市 ${i}` : i}
                  </div>
                  <div className={`font-medium ${n <= 30 ? 'text-xs' : 'text-2xs'}`}>
                    {n <= 50 ? `parent[${i}] = ${parent[i] ?? i}` : `${parent[i] ?? i}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {n > 50 && (
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            显示格式：城市编号 → 父节点编号
          </p>
        )}
      </div>

      {/* 省份可视化 */}
      {provinces.length > 0 && (
        <div className="mb-6">
          <h4 className={`font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            省份分组 (共 {provinceCount} 个省份)：
          </h4>
          <div className="flex flex-wrap gap-3">
            {provinces.map((province, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{ backgroundColor: colors[index % colors.length] }}
              >
                省份 {index + 1}: 城市 {province.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={toggleAnimation}
          className={`px-4 py-2 text-white rounded transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isPlaying ? '暂停' : '开始演示'}
        </button>
        <button
          onClick={resetAnimation}
          className={`px-4 py-2 text-white rounded transition-colors ${isDark ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'}`}
        >
          重置
        </button>
      </div>

      {/* 当前步骤说明 */}
      {currentStepData && (
        <div className={`border p-3 rounded ${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className={isDark ? 'text-yellow-200' : 'text-yellow-800'}>
            <strong>步骤 {currentStep + 1}/{steps.length}:</strong> {currentStepData.description}
          </p>
        </div>
      )}

      {/* 算法复杂度 */}
      <div className={`mt-6 text-sm p-3 rounded ${isDark ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-50'}`}>
        <p><strong>时间复杂度:</strong> O(n² × α(n))，其中α为阿克曼函数的反函数</p>
        <p><strong>空间复杂度:</strong> O(n)</p>
        <p><strong>核心思想:</strong> 使用Union-Find数据结构，将连接的城市合并到同一个集合中</p>
      </div>
    </div>
  )
}

// Auto-register the component
const RegisteredLeetCode547Visualizer = createAutoRegisterComponent({
  id: 'leetcode-547-visualizer',
  name: 'LeetCode547Visualizer',
  description: 'LeetCode 547题身份数量（朋友圈）的Union-Find算法可视化',
  category: CATEGORIES.INTERACTIVE,
  template: `:::react{component="LeetCode547Visualizer" title="省份数量算法演示" animationSpeed="800"}
:::`,
  tags: ['LeetCode', '算法', 'Union-Find', '图论', '可视化'],
  version: '1.0.0',
})(LeetCode547Visualizer)

export { RegisteredLeetCode547Visualizer as LeetCode547Visualizer }