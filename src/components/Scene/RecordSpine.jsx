import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { albumToColor } from '../../utils/colors'
import { extractDominantColor } from '../../utils/dominantColor'
import useUiStore from '../../stores/uiStore'

const SPINE_THICKNESS = 0.06
const SPINE_HEIGHT = 1.3
const SPINE_DEPTH = 1.3

const coverLoader = new THREE.TextureLoader()
const coverCache = new Map()

export default function RecordSpine({ album, position, onClick }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const emissiveRef = useRef(0)
  const [hovered, setHovered] = useState(false)
  const [dominantColor, setDominantColor] = useState(null)
  const originalY = position[1]
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const isAnimating = useUiStore((s) => s.isAnimating)
  const isSelected = selectedAlbumId === album.id

  const fallbackColor = useMemo(() => albumToColor(album.name), [album.name])
  const spineColor = dominantColor || fallbackColor
  const coverUrl = album.images?.[0]?.url
  const [coverTexture, setCoverTexture] = useState(null)

  // Extract dominant color from cover art
  useEffect(() => {
    if (!coverUrl) return
    extractDominantColor(coverUrl).then((color) => {
      if (color) setDominantColor(color)
    })
  }, [coverUrl])

  // Load cover texture for side faces
  useEffect(() => {
    if (!coverUrl) return
    if (coverCache.has(coverUrl)) {
      setCoverTexture(coverCache.get(coverUrl))
      return
    }
    coverLoader.load(coverUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      coverCache.set(coverUrl, tex)
      setCoverTexture(tex)
    })
  }, [coverUrl])

  const handlePointerEnter = (e) => {
    e.stopPropagation()
    if (isAnimating || isSelected) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: originalY + 0.15,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handlePointerLeave = (e) => {
    e.stopPropagation()
    if (isSelected) return
    setHovered(false)
    document.body.style.cursor = 'auto'
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: originalY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (isAnimating) return
    onClick?.(album, groupRef)
  }

  // Smooth hover glow via lerp
  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material
    const target = hovered ? 0.2 : 0
    emissiveRef.current += (target - emissiveRef.current) * 0.08
    if (Math.abs(emissiveRef.current) < 0.001) emissiveRef.current = 0
    mat.emissive.set(spineColor)
    mat.emissiveIntensity = emissiveRef.current
  })

  if (isSelected) return null

  // Build spine text: "ARTIST — Title"
  const spineText = `${album.artist || ''}  —  ${album.name || ''}`

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
    >
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <boxGeometry args={[SPINE_THICKNESS, SPINE_HEIGHT, SPINE_DEPTH]} />
        <meshStandardMaterial color={spineColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Spine text on front face (+Z) — reads bottom-to-top */}
      <Text
        raycast={() => null}
        position={[0, 0, SPINE_DEPTH / 2 + 0.001]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.028}
        maxWidth={SPINE_HEIGHT * 0.9}
        color="#F0EDE8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#1a1a1a"
      >
        {spineText}
      </Text>

      {/* Cover art on +X face (right side) */}
      {coverTexture && (
        <mesh
          raycast={() => null}
          position={[SPINE_THICKNESS / 2 + 0.001, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[SPINE_DEPTH * 0.98, SPINE_HEIGHT * 0.98]} />
          <meshStandardMaterial map={coverTexture} roughness={0.5} metalness={0.05} />
        </mesh>
      )}

      {/* Cover art on -X face (left side) */}
      {coverTexture && (
        <mesh
          raycast={() => null}
          position={[-SPINE_THICKNESS / 2 - 0.001, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <planeGeometry args={[SPINE_DEPTH * 0.98, SPINE_HEIGHT * 0.98]} />
          <meshStandardMaterial map={coverTexture} roughness={0.5} metalness={0.05} />
        </mesh>
      )}

      {/* Hover preview — cover art floating above spine */}
      {hovered && coverUrl && (
        <Html
          position={[0, SPINE_HEIGHT / 2 + 0.1, 0]}
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              width: 120,
              background: 'rgba(247, 245, 240, 0.97)',
              borderRadius: 4,
              padding: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <img
              src={coverUrl}
              alt={album.name}
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: 2,
                display: 'block',
              }}
            />
            <div
              style={{
                padding: '6px 4px 4px',
                fontSize: 10,
                color: '#2C2824',
                fontFamily: 'inherit',
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontStyle: 'italic', marginBottom: 2 }}>{album.name}</div>
              <div style={{ color: '#B87D56', fontSize: 9 }}>{album.artist}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export { SPINE_THICKNESS }
