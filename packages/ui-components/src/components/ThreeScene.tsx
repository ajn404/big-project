import React, { Suspense } from 'react'

// 注意：这个组件需要 @react-three/fiber 和 @react-three/drei
// 在实际使用时需要确保这些依赖已安装

interface ThreeSceneProps {
  width?: number
  height?: number
  backgroundColor?: string
  className?: string
}

// 简化的 ThreeScene 组件，避免直接依赖
export const ThreeScene: React.FC<ThreeSceneProps> = ({
  width = 400,
  height = 300,
  backgroundColor = "#f0f0f0",
  className = ""
}) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor }}
      >
        <div className="text-center space-y-2">
          <div className="text-2xl">🎲</div>
          <div className="text-sm text-gray-600">3D Scene</div>
          <div className="text-xs text-gray-500">
            {width} × {height}
          </div>
        </div>
      </div>
    </div>
  )
}

// 如果需要完整的 Three.js 功能，可以使用以下组件：
/*
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  width = 400,
  height = 300,
  className = ""
}) => {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`} style={{ width, height }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} args={[1, 1, 1]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
*/