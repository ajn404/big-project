import React, { useState, useEffect } from 'react'

interface InteractiveDemoProps {
  title?: string
  description?: string
  animationSpeed?: number
  gridSize?: number
  className?: string
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  title = "交互式演示",
  description = "这是一个交互式组件演示区域。",
  animationSpeed = 0.1,
  gridSize = 6,
  className = ""
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg ${className}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-4 opacity-90">{description}</p>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: gridSize }).map((_, i) => (
          <div
            key={i}
            className={`h-8 rounded transition-all duration-300 cursor-pointer ${
              hoveredIndex === i 
                ? 'bg-white/40 scale-105' 
                : 'bg-white/20'
            }`}
            style={{ 
              animationDelay: `${i * animationSpeed}s`,
              animation: hoveredIndex === null ? 'pulse 2s infinite' : 'none'
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        ))}
      </div>

      <div className="text-sm opacity-75">
        💡 悬停在方块上查看交互效果
      </div>
    </div>
  )
}