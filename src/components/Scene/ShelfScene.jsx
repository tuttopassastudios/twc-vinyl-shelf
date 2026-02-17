import { Suspense, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Sparkles } from '@react-three/drei'
import Shelf, { getRowY, SHELF_WIDTH, RECORDS_PER_ROW, SPINE_T, SPINE_GAP } from './Shelf'
import RecordSpine from './RecordSpine'
import RecordPullOut from './RecordPullOut'
import Lighting from './Lighting'
import useCollectionStore from '../../stores/collectionStore'
import useUiStore from '../../stores/uiStore'
import { albumToColor } from '../../utils/colors'
import { extractDominantColor } from '../../utils/dominantColor'

export default function ShelfScene() {
  const albums = useCollectionStore((s) => s.albums)
  const selectedAlbumId = useUiStore((s) => s.selectedAlbumId)
  const selectRecord = useUiStore((s) => s.selectRecord)
  const selectedAlbum = useMemo(
    () => albums.find((a) => a.id === selectedAlbumId),
    [albums, selectedAlbumId]
  )

  const canvasRef = useRef(null)

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

  const totalRows = Math.ceil(albums.length / RECORDS_PER_ROW)

  // Calculate position for each record on its shelf row
  const recordPositions = useMemo(() => {
    const positions = []

    albums.forEach((album, index) => {
      const row = Math.floor(index / RECORDS_PER_ROW)
      const slot = index % RECORDS_PER_ROW

      // How many albums in this row
      const albumsInRow = Math.min(RECORDS_PER_ROW, albums.length - row * RECORDS_PER_ROW)
      const rowWidth = albumsInRow * (SPINE_T + SPINE_GAP) - SPINE_GAP
      const startX = -rowWidth / 2 + SPINE_T / 2

      const x = startX + slot * (SPINE_T + SPINE_GAP)
      const y = getRowY(row, totalRows) + 0.65 + SPINE_T / 2 // records stand on plank
      const z = 0.05 // slightly forward

      positions.push({
        album,
        position: [x, y, z],
      })
    })

    return positions
  }, [albums, totalRows])

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
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1, alpha: true }}
    >
        <Lighting />
        <Shelf totalAlbums={albums.length} />

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

        {/* Pulled-out record */}
        {selectedAlbum && <RecordPullOut album={selectedAlbum} />}

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
