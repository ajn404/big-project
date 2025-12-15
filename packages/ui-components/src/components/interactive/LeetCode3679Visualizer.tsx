import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register'
import { useTheme } from '../../hooks'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'

interface LeetCode3679VisualizerProps {
  className?: string
}

interface SimulationState {
  arrivals: number[]
  w: number
  m: number
  currentDay: number
  keptItems: number[] // array indicating kept(1) or discarded(0) for each day
  discardedCount: number
  isRunning: boolean
  speed: number
}

function LeetCode3679Visualizer({ className = "" }: LeetCode3679VisualizerProps) {
  const { isDark } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<SimulationState>({
    arrivals: [7, 3, 9, 9, 7, 3, 5, 9, 7, 2, 6, 10, 9, 7, 9, 1, 3, 6, 2, 4, 6, 2, 6, 8, 4, 8, 2, 7, 5, 6],
    w: 10,
    m: 1,
    currentDay: 0,
    keptItems: [],
    discardedCount: 0,
    isRunning: false,
    speed: 1000
  })

  const [inputArrivals, setInputArrivals] = useState("7,3,9,9,7,3,5,9,7,2,6,10,9,7,9,1,3,6,2,4,6,2,6,8,4,8,2,7,5,6")
  const [inputW, setInputW] = useState("10")
  const [inputM, setInputM] = useState("1")

  // Reset simulation
  const resetSimulation = () => {
    setState(prev => ({
      ...prev,
      currentDay: 0,
      keptItems: [],
      discardedCount: 0,
      isRunning: false
    }))
  }

  // Update parameters
  const updateParameters = () => {
    const newArrivals = inputArrivals.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x))
    const newW = parseInt(inputW)
    const newM = parseInt(inputM)

    if (newArrivals.length > 0 && newW > 0 && newM > 0) {
      setState(prev => ({
        ...prev,
        arrivals: newArrivals,
        w: newW,
        m: newM,
        currentDay: 0,
        keptItems: [],
        discardedCount: 0,
        isRunning: false
      }))
    }
  }

  // Correct simulation step - can only decide on arrival day
  const simulateStep = () => {
    setState(prev => {
      if (prev.currentDay >= prev.arrivals.length) {
        return { ...prev, isRunning: false }
      }

      const dayIndex = prev.currentDay // 0-based
      const day = dayIndex + 1 // 1-based
      const itemType = prev.arrivals[dayIndex]
      const newKeptItems = [...prev.keptItems]
      let newDiscardedCount = prev.discardedCount

      // Get current window range (1-based)
      const windowStart = Math.max(1, day - prev.w + 1)
      const windowEnd = day

      // Count how many items of this type are currently kept in the window
      let countInWindow = 0
      for (let i = windowStart - 1; i < windowEnd - 1; i++) { // Convert to 0-based for array access
        if (i < newKeptItems.length && newKeptItems[i] === 1 && prev.arrivals[i] === itemType) {
          countInWindow++
        }
      }

      // Check if we can keep this item
      if (countInWindow < prev.m) {
        // Keep this item
        newKeptItems[dayIndex] = 1
      } else {
        // Must discard this item
        newKeptItems[dayIndex] = 0
        newDiscardedCount++
      }

      return {
        ...prev,
        currentDay: day,
        keptItems: newKeptItems,
        discardedCount: newDiscardedCount,
        isRunning: prev.isRunning && day < prev.arrivals.length // 保持原有isRunning状态，除非到达终点
      }
    })
  }

  // Auto simulation
  useEffect(() => {
    if (!state.isRunning || state.currentDay >= state.arrivals.length) return

    const timer = setTimeout(() => {
      simulateStep()
    }, state.speed)

    return () => clearTimeout(timer)
  }, [state.isRunning, state.currentDay, state.speed])

  // Auto-scroll to current position
  useEffect(() => {
    if (!containerRef.current || state.currentDay === 0) return

    const container = containerRef.current
    const dayWidth = 60 // Width per day
    const containerWidth = container.clientWidth
    const targetX = (state.currentDay - 1) * dayWidth
    const scrollX = targetX - containerWidth / 2 + dayWidth / 2

    container.scrollTo({
      left: Math.max(0, scrollX),
      behavior: state.isRunning ? 'smooth' : 'auto'
    })
  }, [state.currentDay, state.isRunning])

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 40, right: 40, bottom: 60, left: 40 }
    const dayWidth = 60 // Fixed width per day for consistent spacing
    const totalWidth = Math.max(state.arrivals.length * dayWidth + margin.left + margin.right, 800)
    const height = 400 - margin.top - margin.bottom

    // Update SVG width dynamically
    svg.attr("viewBox", `0 0 ${totalWidth} 400`)

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, state.arrivals.length])
      .range([0, state.arrivals.length * dayWidth])

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...state.arrivals, 5)])
      .range([height - 100, 50])

    // Draw days
    state.arrivals.forEach((itemType, index) => {
      const day = index + 1
      const x = xScale(index) + dayWidth / 2 // Center in the allocated space
      const isCurrentDay = day === state.currentDay
      const isInWindow = state.currentDay > 0 && day >= Math.max(1, state.currentDay - state.w + 1) && day <= state.currentDay

      // Day background
      g.append("rect")
        .attr("x", x - dayWidth / 2 + 5)
        .attr("y", 0)
        .attr("width", dayWidth - 10)
        .attr("height", height - 80)
        .attr("fill", isCurrentDay ? "#fef3c7" : isInWindow ? "#e0f2fe" : "#f8fafc")
        .attr("stroke", isCurrentDay ? "#f59e0b" : isInWindow ? "#0284c7" : "#e2e8f0")
        .attr("stroke-width", isCurrentDay ? 3 : 1)
        .attr("rx", 4)

      // Item circle
      const isProcessed = day <= state.currentDay
      const isKept = state.keptItems[index] === 1
      const isDiscarded = state.keptItems[index] === 0

      let fillColor = "#9ca3af" // not processed
      if (isProcessed) {
        if (isKept) {
          fillColor = "#10b981" // kept (green)
        } else if (isDiscarded) {
          fillColor = "#ef4444" // discarded (red)
        }
      }

      g.append("circle")
        .attr("cx", x)
        .attr("cy", yScale(itemType))
        .attr("r", 12)
        .attr("fill", fillColor)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)

      // Item type text
      g.append("text")
        .attr("x", x)
        .attr("y", yScale(itemType) + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-weight", "bold")
        .attr("font-size", "11px")
        .text(itemType)

      // Day label
      g.append("text")
        .attr("x", x)
        .attr("y", height - 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text(`Day ${day}`)
    })

    // Window indicator
    if (state.currentDay > 0) {
      const windowStart = Math.max(1, state.currentDay - state.w + 1)
      const windowEnd = state.currentDay
      const startX = xScale(windowStart - 1) + 5
      const endX = xScale(windowEnd - 1) + dayWidth - 5

      g.append("rect")
        .attr("x", startX)
        .attr("y", height - 50)
        .attr("width", endX - startX)
        .attr("height", 20)
        .attr("fill", "#3b82f6")
        .attr("opacity", 0.3)
        .attr("rx", 4)

      g.append("text")
        .attr("x", (startX + endX) / 2)
        .attr("y", height - 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#3b82f6")
        .text(`Window [${windowStart}, ${windowEnd}]`)
    }

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(state.arrivals.length, 20))
      .tickFormat((d) => `${d.valueOf() + 1}`)

    g.append("g")
      .attr("transform", `translate(0,${height - 80})`)
      .call(xAxis)

    g.append("g")
      .call(d3.axisLeft(yScale))

    // Labels
    g.append("text")
      .attr("x", state.arrivals.length * dayWidth / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Days")

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height - 100) / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .text("Item Type")

    // Legend
    const legend = g.append("g")
      .attr("transform", `translate(${Math.max(state.arrivals.length * dayWidth - 150, 20)}, 20)`)

    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 8)
      .attr("fill", "#10b981")

    legend.append("text")
      .attr("x", 25)
      .attr("y", 15)
      .text("Kept")
      .attr("font-size", "12px")

    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 30)
      .attr("r", 8)
      .attr("fill", "#ef4444")

    legend.append("text")
      .attr("x", 25)
      .attr("y", 35)
      .text("Discarded")
      .attr("font-size", "12px")

    legend.append("circle")
      .attr("cx", 10)
      .attr("cy", 50)
      .attr("r", 8)
      .attr("fill", "#9ca3af")

    legend.append("text")
      .attr("x", 25)
      .attr("y", 55)
      .text("Not processed")
      .attr("font-size", "12px")

  }, [state])

  return (
    <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-200'} ${className} m-auto max-w-4xl md:max-w-6xl lg:max-w-7xl overflow-auto` }>
      <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
        LeetCode 3679: 使库存平衡的最少丢弃次数
      </h3>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">到达序列 (arrivals)</label>
          <Input
            value={inputArrivals}
            onChange={(e) => setInputArrivals(e.target.value)}
            placeholder="1,2,1,3,2,1"
          />
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">窗口大小 (w)</label>
          <Input
            type="number"
            value={inputW}
            onChange={(e) => setInputW(e.target.value)}
            min="1"
          />
        </Card>

        <Card className="p-4">
          <label className="block text-sm font-medium mb-2">最大出现次数 (m)</label>
          <Input
            type="number"
            value={inputM}
            onChange={(e) => setInputM(e.target.value)}
            min="1"
          />
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button onClick={updateParameters}>
          更新参数
        </Button>
        <Button
          onClick={resetSimulation}
          variant="destructive"
        >
          重置
        </Button>
        <Button
          onClick={() => {
            // 单步执行的独立逻辑，不依赖simulateStep
            setState(prev => {
              if (prev.currentDay >= prev.arrivals.length) {
                return prev
              }

              const dayIndex = prev.currentDay // 0-based
              const day = dayIndex + 1 // 1-based
              const itemType = prev.arrivals[dayIndex]
              const newKeptItems = [...prev.keptItems]
              let newDiscardedCount = prev.discardedCount

              // Get current window range (1-based)
              const windowStart = Math.max(1, day - prev.w + 1)
              const windowEnd = day

              // Count how many items of this type are currently kept in the window
              let countInWindow = 0
              for (let i = windowStart - 1; i < windowEnd - 1; i++) { // Convert to 0-based for array access
                if (i < newKeptItems.length && newKeptItems[i] === 1 && prev.arrivals[i] === itemType) {
                  countInWindow++
                }
              }

              // Check if we can keep this item
              if (countInWindow < prev.m) {
                // Keep this item
                newKeptItems[dayIndex] = 1
              } else {
                // Must discard this item
                newKeptItems[dayIndex] = 0
                newDiscardedCount++
              }

              return {
                ...prev,
                currentDay: day,
                keptItems: newKeptItems,
                discardedCount: newDiscardedCount,
                isRunning: false // 单步执行后确保不自动继续
              }
            })
          }}
          disabled={state.currentDay >= state.arrivals.length}
        >
          单步执行
        </Button>
        <Button
          onClick={() => setState(prev => ({ ...prev, isRunning: !prev.isRunning }))}
          disabled={state.currentDay >= state.arrivals.length}
          variant={state.isRunning ? "destructive" : "default"}
        >
          {state.isRunning ? "暂停" : "自动执行"}
        </Button>
        <div className="flex items-center gap-2">
          <label className="text-sm">速度:</label>
          <Input
            type="range"
            min="100"
            max="2000"
            value={state.speed}
            onChange={(e) => setState(prev => ({ ...prev, speed: parseInt(e.target.value) }))}
            className="w-20"
          />
          <span className="text-sm">{state.speed}ms</span>
        </div>
      </div>

      {/* Status */}
      <div className={`mb-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>当前天数:</strong> {state.currentDay} / {state.arrivals.length}
          </div>
          <div>
            <strong>窗口大小:</strong> {state.w}
          </div>
          <div>
            <strong>最大次数:</strong> {state.m}
          </div>
          <div>
            <strong>丢弃总数:</strong> {state.discardedCount}
          </div>
        </div>

        {state.currentDay > 0 && (
          <div className="mt-2">
            <strong>当前窗口:</strong> [{Math.max(1, state.currentDay - state.w + 1)}, {state.currentDay}]
          </div>
        )}
      </div>

      {/* Visualization */}
      <div className="mb-4 w-full">
        <div
          ref={containerRef}
          className={`overflow-x-auto border rounded-lg ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-200'}`}
          style={{ maxHeight: '500px' }}
        >
          <svg
            ref={svgRef}
            className="block"
            style={{ minWidth: '800px', height: '400px' }}
          />
        </div>
      </div>

      {/* Algorithm Description */}
      <div className={`text-sm space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        <p><strong>算法说明:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>物品只能在<strong>到达当天</strong>决定保留或丢弃，一旦决定就不能更改</li>
          <li>对于第 i 天到达的物品，检查窗口 [max(1, i-w+1), i] 内该类型<strong>已保留</strong>的物品数量</li>
          <li>如果已保留数量 &lt; m，则保留该物品</li>
          <li>如果已保留数量 ≥ m，则<strong>必须丢弃</strong>该物品（因为会超出限制）</li>
          <li>绿色圆圈表示保留的物品，红色圆圈表示丢弃的物品</li>
          <li>蓝色区域表示当前的滑动窗口范围</li>
        </ul>
        <p className="mt-2"><strong>示例：arrivals=[1,2,3,3,3,4], w=3, m=2</strong></p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Day 1: 物品1，窗口[1]，物品1出现0次 → 保留</li>
          <li>Day 2: 物品2，窗口[1,2]，物品2出现0次 → 保留</li>
          <li>Day 3: 物品3，窗口[1,2,3]，物品3出现0次 → 保留</li>
          <li>Day 4: 物品3，窗口[2,3,4]，物品3已出现1次(&lt;2) → 保留</li>
          <li>Day 5: 物品3，窗口[3,4,5]，物品3已出现2次(=2) → <strong>必须丢弃</strong></li>
          <li>Day 6: 物品4，窗口[4,5,6]，物品4出现0次 → 保留</li>
          <li>结果：丢弃1个物品（第5天的物品3）</li>
        </ul>
      </div>
    </div>
  )
}

// Auto-register the component
const RegisteredLeetCode3679Visualizer = createAutoRegisterComponent({
  id: 'leetcode-3679-visualizer',
  name: 'LeetCode3679Visualizer',
  description: 'LeetCode 3679 使库存平衡的最少丢弃次数 - 滑动窗口算法可视化',
  category: CATEGORIES.INTERACTIVE,
  template: `:::react{component="LeetCode3679Visualizer"}
:::`,
  tags: ['算法', 'LeetCode', '滑动窗口', '可视化', 'D3'],
  version: '1.0.0',
})(LeetCode3679Visualizer)

export { RegisteredLeetCode3679Visualizer as LeetCode3679Visualizer }