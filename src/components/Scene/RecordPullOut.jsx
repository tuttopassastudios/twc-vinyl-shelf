import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import useUiStore from '../../stores/uiStore'
import { albumToColor } from '../../utils/colors'

export default function RecordPullOut({ album }) {
  const groupRef = useRef()
  const vinylRef = useRef()
  const setAnimating = useUiStore((s) => s.setAnimating)

  const spineColor = useMemo(() => albumToColor(album.name), [album.name])

  // Entry animation
  useEffect(() => {
    if (!groupRef.current) return
    setAnimating(true)
    groupRef.current.scale.set(0.01, 0.01, 0.01)
    groupRef.current.position.z = -1

    const tl = gsap.timeline({
      onComplete: () => setAnimating(false),
    })

    tl.to(groupRef.current.position, {
      z: 2.5,
      duration: 0.5,
      ease: 'power2.out',
    })
    tl.to(
      groupRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: 'back.out(1.2)',
      },
      '<'
    )

    // Vinyl peek out
    if (vinylRef.current) {
      tl.to(
        vinylRef.current.position,
        {
          x: 0.4,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.2'
      )
    }

    return () => tl.kill()
  }, [setAnimating])

  // Gentle idle spin on the vinyl
  useFrame((_, delta) => {
    if (vinylRef.current) {
      vinylRef.current.rotation.z -= delta * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 2.5]}>
      {/* Album sleeve — colored front face */}
      <mesh castShadow>
        <boxGeometry args={[2, 2, 0.06]} />
        <meshStandardMaterial color={spineColor} roughness={0.5} metalness={0.05} />
      </mesh>

      {/* Sleeve back */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2, 2, 0.01]} />
        <meshStandardMaterial color={spineColor} roughness={0.7} />
      </mesh>

      {/* Album title text area (centered on sleeve) */}
      {/* Using a lighter patch as a label area */}
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[1.6, 0.5]} />
        <meshStandardMaterial
          color="#000000"
          transparent
          opacity={0.3}
          roughness={0.9}
        />
      </mesh>

      {/* Vinyl disc — peeks out to the right */}
      <group ref={vinylRef} position={[0.4, 0, 0]}>
        {/* Main disc */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 64]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Grooves — rings */}
        {[0.3, 0.45, 0.55, 0.65, 0.75, 0.85].map((r, i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
            <ringGeometry args={[r - 0.01, r, 64]} />
            <meshStandardMaterial
              color="#2a2a2a"
              roughness={0.2}
              metalness={0.5}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}

        {/* Center label */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.013, 0]}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color={spineColor} roughness={0.6} />
        </mesh>

        {/* Center hole */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.014, 0]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  )
}
