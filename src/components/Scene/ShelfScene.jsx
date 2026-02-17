import { Suspense, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls, Sparkles, Environment } from '@react-three/drei'
import Shelf, { getCubbyCenter, CUBBY_W } from './Shelf'
import RecordSpine from './RecordSpine'
import RecordPullOut from './RecordPullOut'
import Lighting from './Lighting'
import useCollectionStore from '../../stores/collectionStore'
import useUiStore from '../../stores/uiStore'
import { albumToColor } from '../../utils/colors'
import { extractDominantColor } from '../../utils/dominantColor'

const MAX_PER_CUBBY = 18 // max records that fit side-by-side
const PAN_THRESHOLD = 7 // camera distance below which panning is enabled
const DEFAULT_TARGET = new THREE.Vector3(0, 0.5, 0)
const TARGET_LERP_SPEED = 0.03

function CameraWatcher({ controlsRef }) {
  useFrame(({ camera }) => {
    const controls = controlsRef.current
    if (!controls) return

    const dist = camera.position.length()

    if (dist < PAN_THRESHOLD) {
      controls.enablePan = true
    } else {
      controls.enablePan = false
      // Smoothly re-center the target when zoomed out
      controls.target.lerp(DEFAULT_TARGET, TARGET_LERP_SPEED)
    }

    // Clamp target to shelf bounds so user can't pan into empty space
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -2.0, 2.0)
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, -3.5, 3.5)
  })

  return null
}

const SPINE_T = 0.06
const SPINE_GAP = 0.005

export default function ShelfScene() {
  const albums = useCollectionStore((s) => s.albums)
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const selectRecord = useUiStore((s) => s.selectRecord)
  const selectedAlbum = useMemo(
    () => albums.find((a) => a.id === selectedAlbumId),
    [albums, selectedAlbumId]
  )

  const [canvasHovered, setCanvasHovered] = useState(false)
  const canvasRef = useRef(null)
  const controlsRef = useRef(null)

  // Set touch-action on the canvas DOM element for mobile scroll passthrough
  useEffect(() => {
    const el = canvasRef.current
    if (el) {
      el.style.touchAction = 'pan-y'
    }
  }, [])

  // Extract dominant color from selected album for background glow
  const [bgColor, setBgColor] = useState(null)
  useEffect(() => {
    if (!selectedAlbum) {
      setBgColor(null)
      return
    }
    const coverUrl = selectedAlbum.images?.[0]?.url
    if (coverUrl) {
      extractDominantColor(coverUrl).then((color) => {
        setBgColor(color || albumToColor(selectedAlbum.name))
      })
    } else {
      setBgColor(albumToColor(selectedAlbum.name))
    }
  }, [selectedAlbum])

  // Calculate position for each record in its cubby
  const recordPositions = useMemo(() => {
    const positions = []
    let cubbyIndex = 0
    let slotInCubby = 0

    albums.forEach((album) => {
      const col = cubbyIndex % 2
      const row = Math.floor(cubbyIndex / 2)

      if (row >= 4) return // shelf is full

      const [cx, cy, cz] = getCubbyCenter(col, row)
      const startX = cx - CUBBY_W / 2 + 0.1 // small padding from left wall
      const x = startX + slotInCubby * (SPINE_T + SPINE_GAP)
      positions.push({
        album,
        position: [x, cy - 0.1, cz + 0.05], // slightly forward in cubby
      })

      slotInCubby++
      if (slotInCubby >= MAX_PER_CUBBY) {
        slotInCubby = 0
        cubbyIndex++
      }
    })

    return positions
  }, [albums])

  const handleRecordClick = useCallback(
    (album) => {
      selectRecord(album.id)
    },
    [selectRecord]
  )

  return (
    <Canvas
      ref={canvasRef}
      shadows
      camera={{ position: [0, 0.5, 10], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, alpha: true }}
      onPointerEnter={() => setCanvasHovered(true)}
      onPointerLeave={() => setCanvasHovered(false)}
    >
        <fog attach="fog" args={['#1a1715', 12, 22]} />
        {/* Core scene — no Suspense needed (synchronous geometry) */}
        <Lighting />
        <Shelf />

        {/* Record spines — wrapped in Suspense for drei Text font loading */}
        <Suspense fallback={null}>
          {recordPositions.map(({ album, position }) => (
            <RecordSpine
              key={album.id}
              album={album}
              position={position}
              onClick={handleRecordClick}
            />
          ))}
        </Suspense>

        {/* Environment loads HDR async — isolated Suspense so it doesn't block the shelf */}
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>

        {/* Pulled-out record */}
        {selectedAlbum && <RecordPullOut album={selectedAlbum} />}

        {/* Floating dust motes — reduced for subtlety */}
        <Sparkles
          count={20}
          scale={8}
          size={1}
          speed={0.3}
          opacity={0.04}
          color="#E8E4DC"
        />

        {/* Camera controls — limited orbit, zoom gated on hover */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          panSpeed={0.8}
          screenSpacePanning={true}
          enableZoom={canvasHovered}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
        <CameraWatcher controlsRef={controlsRef} />
    </Canvas>
  )
}
