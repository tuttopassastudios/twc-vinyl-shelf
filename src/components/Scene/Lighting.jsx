import { ContactShadows } from '@react-three/drei'
import { TOTAL_H, LEG_H } from './Shelf'

export default function Lighting() {
  return (
    <>
      {/* Bright ambient fill — gallery lighting */}
      <ambientLight color="#ffffff" intensity={0.6} />

      {/* Main key light — warm white, top-left */}
      <spotLight
        position={[-3, 5, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.9}
        color="#FFF8F0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.001}
      />

      {/* Fill light — right side, neutral */}
      <spotLight
        position={[3, 4, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        color="#FAFAFA"
      />

      {/* Warm backlight for depth */}
      <pointLight position={[0, 2, -3]} intensity={0.15} color="#FFF5EA" />

      {/* Contact shadows under shelf for grounding */}
      <ContactShadows
        position={[0, -(TOTAL_H / 2) + LEG_H / 2 - 0.01, 0]}
        opacity={0.12}
        scale={8}
        blur={4}
        far={4}
        color="#000000"
      />
    </>
  )
}
