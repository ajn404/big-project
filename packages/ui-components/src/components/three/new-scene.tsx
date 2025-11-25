export function Scene() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2.9]} />
        <meshStandardMaterial />
      </mesh>
      <mesh>
        <sphereGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}
