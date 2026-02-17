import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { TOTAL_H, LEG_H } from './Shelf'

export default function Lighting() {
  const spotRef1 = useRef()
  const spotRef2 = useRef()
  const flickerRef = useRef(0)

  // Subtle light flicker — halved amplitude
  useFrame((_, delta) => {
    flickerRef.current += delta * 2
    const flicker = Math.sin(flickerRef.current * 1.3) * 0.01 + Math.sin(flickerRef.current * 3.7) * 0.005
    if (spotRef1.current) spotRef1.current.intensity = 1.2 + flicker
    if (spotRef2.current) spotRef2.current.intensity = 0.8 + flicker * 0.5
  })

  return (
    <>
      {/* Warm ambient fill — reduced for deeper shadows */}
      <ambientLight color="#fff5e6" intensity={0.25} />

      {/* Main key light — warm white, top-left */}
      <spotLight
        ref={spotRef1}
        position={[-3, 5, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
      />

      {/* Fill light — right side, slightly warm */}
      <spotLight
        ref={spotRef2}
        position={[3, 4, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#f0e8d8"
      />

      {/* Warm backlight for depth */}
      <pointLight position={[0, 2, -3]} intensity={0.2} color="#ffe0c0" />

      {/* Contact shadows under shelf for grounding */}
      <ContactShadows
        position={[0, -(TOTAL_H / 2) + LEG_H / 2 - 0.01, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
        color="#000000"
      />
    </>
  )
}
