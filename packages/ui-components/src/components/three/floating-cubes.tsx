import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

function FloatingCube({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 0.3
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
    </mesh>
  )
}

export function FloatingCubes() {
  const cubes = [
    [-4, 0, 0],
    [0, 2, -2],
    [4, -1, 1],
    [-2, -2, 2],
    [3, 1, -1],
  ] as [number, number, number][]

  return (
    <>
      {cubes.map((position, index) => (
        <FloatingCube key={index} position={position} />
      ))}
    </>
  )
}