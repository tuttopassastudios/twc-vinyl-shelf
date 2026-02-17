import { ContactShadows } from '@react-three/drei'
import { TOTAL_H, LEG_H } from './Shelf'

export default function Lighting() {
  return (
    <>
      {/* Warm ambient fill — reduced for contrast */}
      <ambientLight color="#FFF5EA" intensity={0.4} />

      {/* Main key light — warm white, top-left */}
      <spotLight
        position={[-3, 5, 4]}
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
        position={[3, 4, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.7}
        color="#FAFAFA"
        castShadow
      />

      {/* Rim/accent light — warm floor bounce */}
      <spotLight
        position={[-4, -2, 2]}
        angle={0.8}
        penumbra={1}
        intensity={0.2}
        color="#FFD4A8"
      />

      {/* Warm backlight for depth */}
      <pointLight position={[0, 2, -3]} intensity={0.15} color="#FFF5EA" />

      {/* Contact shadows under shelf for grounding */}
      <ContactShadows
        position={[0, -(TOTAL_H / 2) + LEG_H / 2 - 0.01, 0]}
        opacity={0.25}
        scale={8}
        blur={3}
        far={4}
        color="#000000"
      />
    </>
  )
}
