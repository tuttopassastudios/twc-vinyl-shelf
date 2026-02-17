import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import useUiStore from '../../stores/uiStore'
import { albumToColor } from '../../utils/colors'

const textureLoader = new THREE.TextureLoader()

export default function RecordPullOut({ album }) {
  const groupRef = useRef()
  const vinylRef = useRef()
  const setAnimating = useUiStore((s) => s.setAnimating)

  const spineColor = useMemo(() => albumToColor(album.name), [album.name])
  const coverUrl = album.images?.[0]?.url
  const [coverTexture, setCoverTexture] = useState(null)

  // Load cover texture imperatively (avoids Suspense/loading spinners)
  useEffect(() => {
    if (!coverUrl) return
    textureLoader.load(coverUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      setCoverTexture(tex)
    })
  }, [coverUrl])

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

  // Gentle idle spin on the vinyl — slightly reduced
  useFrame((_, delta) => {
    if (vinylRef.current) {
      vinylRef.current.rotation.y -= delta * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 2.5]}>
      {/* Album sleeve — RoundedBox for subtle corner radius */}
      <RoundedBox args={[2, 2, 0.06]} radius={0.02} smoothness={4} castShadow>
        <meshStandardMaterial color={spineColor} roughness={0.5} metalness={0.05} />
      </RoundedBox>

      {/* Cover art — flat plane on front face */}
      {coverTexture && (
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.96, 1.96]} />
          <meshStandardMaterial map={coverTexture} roughness={0.5} metalness={0.05} />
        </mesh>
      )}

      {/* Sleeve back */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[2, 2, 0.01]} />
        <meshStandardMaterial color={spineColor} roughness={0.7} />
      </mesh>

      {/* Album title text area (centered on sleeve) — only show if no cover art */}
      {!coverUrl && (
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
        {/* Main disc — improved reflective material */}
        <mesh>
          <cylinderGeometry args={[0.9, 0.9, 0.02, 64]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.15}
            metalness={0.6}
            envMapIntensity={1.0}
          />
        </mesh>

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
