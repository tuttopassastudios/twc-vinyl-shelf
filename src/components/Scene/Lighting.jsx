export default function Lighting() {
  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight color="#FFF5EA" intensity={0.4} />

      {/* Main key light — warm white, top-left */}
      <spotLight
        position={[-3, 4, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color="#FFF8F0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
      />

      {/* Fill light — right side, neutral */}
      <spotLight
        position={[3, 3, 4]}
        angle={0.6}
        penumbra={1}
        intensity={0.7}
        color="#FAFAFA"
        castShadow
      />

      {/* Rim/accent light — warm glow from below */}
      <spotLight
        position={[-4, -2, 2]}
        angle={0.8}
        penumbra={1}
        intensity={0.2}
        color="#FFD4A8"
      />

      {/* Warm backlight for depth */}
      <pointLight position={[0, 1, -3]} intensity={0.15} color="#FFF5EA" />
    </>
  )
}
