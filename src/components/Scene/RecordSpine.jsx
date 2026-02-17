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

export default function RecordSpine({ album, position, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [dominantColor, setDominantColor] = useState(null)
  const originalY = position[1]
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const isAnimating = useUiStore((s) => s.isAnimating)
  const isSelected = selectedAlbumId === album.id

  const fallbackColor = useMemo(() => albumToColor(album.name), [album.name])
  const spineColor = dominantColor || fallbackColor
  const coverUrl = album.images?.[0]?.url

  // Extract dominant color from cover art
  useEffect(() => {
    if (!coverUrl) return
    extractDominantColor(coverUrl).then((color) => {
      if (color) setDominantColor(color)
    })
  }, [coverUrl])

  const handlePointerEnter = (e) => {
    e.stopPropagation()
    if (isAnimating || isSelected) return
    setHovered(true)
    document.body.style.cursor = 'pointer'
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
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
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: originalY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    if (isAnimating) return
    onClick?.(album, meshRef)
  }

  // Hover glow
  useFrame(() => {
    if (!meshRef.current) return
    const mat = meshRef.current.material
    if (hovered) {
      mat.emissive = new THREE.Color(spineColor)
      mat.emissiveIntensity = 0.15
    } else {
      mat.emissiveIntensity = 0
    }
  })

  if (isSelected) return null

  // Build spine text: "ARTIST — Title"
  const spineText = `${album.artist || ''}  —  ${album.name || ''}`

  return (
    <group
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <mesh castShadow>
        <boxGeometry args={[SPINE_THICKNESS, SPINE_HEIGHT, SPINE_DEPTH]} />
        <meshStandardMaterial color={spineColor} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Artist/title text running vertically along the spine */}
      <Text
        position={[SPINE_THICKNESS / 2 + 0.001, 0, 0]}
        rotation={[0, Math.PI / 2, Math.PI / 2]}
        fontSize={0.055}
        maxWidth={SPINE_DEPTH * 0.85}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
        font={undefined}
      >
        {spineText}
      </Text>

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
              background: 'rgba(10, 10, 10, 0.95)',
              borderRadius: 4,
              padding: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
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
                color: '#f0f0f0',
                fontFamily: 'inherit',
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontStyle: 'italic', marginBottom: 2 }}>{album.name}</div>
              <div style={{ color: '#7c9cff', fontSize: 9 }}>{album.artist}</div>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

export { SPINE_THICKNESS }
