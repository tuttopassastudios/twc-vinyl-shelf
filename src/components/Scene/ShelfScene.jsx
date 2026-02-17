import { Suspense, useMemo, useCallback, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import Shelf, { SPINE_T, SPINE_GAP } from './Shelf'
import RecordSpine from './RecordSpine'
import RecordPullOut from './RecordPullOut'
import Lighting from './Lighting'
import useCollectionStore from '../../stores/collectionStore'
import useRouterStore from '../../stores/routerStore'

// Horizontal drag-to-scroll wrapper around shelf + records
function ScrollableShelf({ albums, selectedAlbum }) {
  const groupRef = useRef()
  const scrollX = useRef(0)
  const velocity = useRef(0)
  const isDragging = useRef(false)
  const lastPointerX = useRef(0)
  const { size, camera } = useThree()

  // Calculate scroll bounds based on album count
  const totalWidth = albums.length * (SPINE_T + SPINE_GAP)
  // How much of the shelf is visible (rough estimate based on fov and distance)
  const visibleWidth = 2 * Math.tan((50 * Math.PI) / 360) * 6 // fov=50, distance=6
  const maxScroll = Math.max(0, (totalWidth - visibleWidth) / 2 + 0.3)

  // Record positions: single horizontal row
  const recordPositions = useMemo(() => {
    const positions = []
    const rowWidth = albums.length * (SPINE_T + SPINE_GAP) - SPINE_GAP
    const startX = -rowWidth / 2 + SPINE_T / 2

    albums.forEach((album, index) => {
      const x = startX + index * (SPINE_T + SPINE_GAP)
      const y = 0.65
      const z = 0.05
      positions.push({ album, position: [x, y, z] })
    })

    return positions
  }, [albums])

  const handlePointerDown = useCallback((e) => {
    // Only left mouse / primary touch
    if (e.button !== undefined && e.button !== 0) return
    isDragging.current = true
    velocity.current = 0
    lastPointerX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    e.stopPropagation()
  }, [])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current) return
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const delta = clientX - lastPointerX.current
    lastPointerX.current = clientX

    // Convert pixel delta to 3D units (approximate)
    const scale = visibleWidth / size.width
    scrollX.current += delta * scale
    velocity.current = delta * scale
  }, [size.width, visibleWidth])

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // Apply scroll position + momentum each frame
  useFrame(() => {
    if (!groupRef.current) return

    // Apply momentum when not dragging
    if (!isDragging.current) {
      scrollX.current += velocity.current
      velocity.current *= 0.92 // friction
      if (Math.abs(velocity.current) < 0.0001) velocity.current = 0
    }

    // Clamp
    scrollX.current = Math.max(-maxScroll, Math.min(maxScroll, scrollX.current))

    // Apply to group
    groupRef.current.position.x = scrollX.current
  })

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Shelf totalAlbums={albums.length} />

      <Suspense fallback={null}>
        {recordPositions.map(({ album, position }) => (
          <RecordSpine
            key={album.id}
            album={album}
            position={position}
          />
        ))}
      </Suspense>

      {selectedAlbum && <RecordPullOut album={selectedAlbum} />}
    </group>
  )
}

export default function ShelfScene() {
  const albums = useCollectionStore((s) => s.albums)
  const albumId = useRouterStore((s) => s.albumId)
  const selectedAlbum = useMemo(
    () => albums.find((a) => a.id === albumId),
    [albums, albumId]
  )

  const canvasRef = useRef(null)

  return (
    <Canvas
      ref={canvasRef}
      shadows
      camera={{ position: [0, 0.8, 6], fov: 50 }}
      style={{ background: 'transparent', touchAction: 'pan-y' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, alpha: true }}
    >
      <Lighting />

      <ScrollableShelf albums={albums} selectedAlbum={selectedAlbum} />

      {/* Floating dust motes */}
      <Sparkles
        count={20}
        scale={8}
        size={1}
        speed={0.3}
        opacity={0.04}
        color="#E8E4DC"
      />
    </Canvas>
  )
}
