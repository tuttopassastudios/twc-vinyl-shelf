import { Suspense, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import Shelf, { getCubbyCenter, CUBBY_W } from './Shelf'
import RecordSpine from './RecordSpine'
import RecordPullOut from './RecordPullOut'
import Lighting from './Lighting'
import useCollectionStore from '../../stores/collectionStore'
import useUiStore from '../../stores/uiStore'

const MAX_PER_CUBBY = 18 // max records that fit side-by-side
const SPINE_T = 0.04
const SPINE_GAP = 0.005

export default function ShelfScene() {
  const albums = useCollectionStore((s) => s.albums)
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const selectRecord = useUiStore((s) => s.selectRecord)

  const selectedAlbum = useMemo(
    () => albums.find((a) => a.id === selectedAlbumId),
    [albums, selectedAlbumId]
  )

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
      shadows
      camera={{ position: [0, 0.5, 10], fov: 45 }}
      style={{ flex: 1, background: '#121212' }}
      gl={{ antialias: true, toneMapping: 0 }} // NoToneMapping
    >
      <Suspense fallback={null}>
        <Lighting />
        <Shelf />

        {/* Record spines in cubbies */}
        {recordPositions.map(({ album, position }) => (
          <RecordSpine
            key={album.id}
            album={album}
            position={position}
            onClick={handleRecordClick}
          />
        ))}

        {/* Pulled-out record */}
        {selectedAlbum && <RecordPullOut album={selectedAlbum} />}

        {/* Floating dust motes */}
        <Sparkles
          count={40}
          scale={8}
          size={1.5}
          speed={0.3}
          opacity={0.15}
          color="#ffffff"
        />

        {/* Camera controls — limited orbit */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </Suspense>
    </Canvas>
  )
}
