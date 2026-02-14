import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lighting() {
  const spotRef1 = useRef()
  const spotRef2 = useRef()
  const flickerRef = useRef(0)

  // Subtle light flicker
  useFrame((_, delta) => {
    flickerRef.current += delta * 2
    const flicker = Math.sin(flickerRef.current * 1.3) * 0.02 + Math.sin(flickerRef.current * 3.7) * 0.01
    if (spotRef1.current) spotRef1.current.intensity = 1.2 + flicker
    if (spotRef2.current) spotRef2.current.intensity = 0.8 + flicker * 0.5
  })

  return (
    <>
      {/* Neutral ambient fill */}
      <ambientLight color="#ffffff" intensity={0.4} />

      {/* Main key light — top-left angled at shelf */}
      <spotLight
        ref={spotRef1}
        position={[-3, 5, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />

      {/* Fill light — right side */}
      <spotLight
        ref={spotRef2}
        position={[3, 4, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#e8e8e8"
      />

      {/* Subtle rim light from behind */}
      <pointLight position={[0, 2, -3]} intensity={0.15} color="#c0c8ff" />
    </>
  )
}
