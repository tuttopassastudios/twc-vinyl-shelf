import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import useUiStore from '../../stores/uiStore'
import { albumToColor } from '../../utils/colors'

function SleeveFront({ url }) {
  const texture = useTexture(url)
  return <meshStandardMaterial map={texture} roughness={0.5} metalness={0.05} />
}

export default function RecordPullOut({ album }) {
  const groupRef = useRef()
  const vinylRef = useRef()
  const setAnimating = useUiStore((s) => s.setAnimating)

  const spineColor = useMemo(() => albumToColor(album.name), [album.name])
  const hasImage = album.images?.[0]?.url

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
      vinylRef.current.rotation.y -= delta * 0.3
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 2.5]}>
      {/* Album sleeve — front face with cover art or color */}
      <mesh castShadow>
        <boxGeometry args={[2, 2, 0.06]} />
        {hasImage ? (
          <SleeveFront url={album.images[0].url} />
        ) : (
          <meshStandardMaterial color={spineColor} roughness={0.5} metalness={0.05} />
        )}
      </mesh>

      {/* Sleeve back */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2, 2, 0.01]} />
        <meshStandardMaterial color={spineColor} roughness={0.7} />
      </mesh>

      {/* Album title text area (centered on sleeve) — only show if no cover art */}
      {!hasImage && (
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshStandardMaterial
            color="#000000"
            transparent
            opacity={0.3}
            roughness={0.9}
          />
        </mesh>
      )}

      {/* Vinyl disc — peeks out to the right */}
      <group ref={vinylRef} position={[0.4, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Main disc */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 64]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Grooves — full concentric rings */}
        {[0.3, 0.45, 0.55, 0.65, 0.75, 0.85].map((r, i) => (
          <mesh key={i} position={[0, 0, 0.012]}>
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
        <mesh position={[0, 0, 0.013]}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color={spineColor} roughness={0.6} />
        </mesh>

        {/* Center hole */}
        <mesh position={[0, 0, 0.014]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  )
}
