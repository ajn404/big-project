import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { FloatingCubes } from './floating-cubes'
import { CATEGORIES, createAutoRegisterComponent } from '../..'

function ThreeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <FloatingCubes />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}


// Auto-register the component
const RegisteredExampleCard = createAutoRegisterComponent({
  id: 'three-scene',
  name: 'ThreeScene',
  description: 'threejs demo',
  category: CATEGORIES.THREE_D,
  template: `:::react{component="ThreeScene"}
卡片内容
:::`,
  tags: ['卡片', 'UI', '示例'],
  version: '1.0.0',
})(ThreeScene)

export { RegisteredExampleCard as ThreeScene }