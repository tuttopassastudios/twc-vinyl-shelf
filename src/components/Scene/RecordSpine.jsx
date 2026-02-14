import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { albumToColor } from '../../utils/colors'
import useUiStore from '../../stores/uiStore'

const SPINE_THICKNESS = 0.04
const SPINE_HEIGHT = 1.3
const SPINE_DEPTH = 1.3

export default function RecordSpine({ album, position, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const originalY = position[1]
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const isAnimating = useUiStore((s) => s.isAnimating)
  const isSelected = selectedAlbumId === album.id

  const spineColor = useMemo(() => albumToColor(album.name), [album.name])
  const coverUrl = album.images?.[0]?.url

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

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      castShadow
    >
      <boxGeometry args={[SPINE_THICKNESS, SPINE_HEIGHT, SPINE_DEPTH]} />
      <meshStandardMaterial color={spineColor} roughness={0.6} metalness={0.1} />

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
              background: 'rgba(20, 16, 12, 0.95)',
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
                color: '#e8dcc8',
                fontFamily: 'inherit',
                lineHeight: 1.3,
              }}
            >
              <div style={{ fontStyle: 'italic', marginBottom: 2 }}>{album.name}</div>
              <div style={{ color: '#c9a84c', fontSize: 9 }}>{album.artist}</div>
            </div>
          </div>
        </Html>
      )}
    </mesh>
  )
}
