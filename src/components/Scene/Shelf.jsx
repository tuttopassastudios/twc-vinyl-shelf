import { useMemo, useRef, useEffect } from 'react'
import { loadShelfTextures } from '../../utils/textures'

// Layout constants
const SPINE_T = 0.06
const SPINE_GAP = 0.005
const PLANK_THICKNESS = 0.08
const PLANK_DEPTH = 1.4
const SIDE_PADDING = 0.3

export { SPINE_T, SPINE_GAP, PLANK_THICKNESS }

function WoodPanel({ position, size, textures }) {
  const meshRef = useRef()

  useEffect(() => {
    if (meshRef.current) {
      const geo = meshRef.current.geometry
      geo.setAttribute('uv2', geo.attributes.uv)
    }
  }, [])

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        map={textures['albedo']}
        normalMap={textures['normal-ogl']}
        roughnessMap={textures['roughness']}
        roughness={1.0}
        aoMap={textures['ao']}
        displacementMap={textures['height']}
        displacementScale={0.02}
        metalnessMap={textures['metallic']}
        metalness={1.0}
      />
    </mesh>
  )
}

export default function Shelf({ totalAlbums = 17 }) {
  const shelfTextures = useMemo(() => loadShelfTextures(), [])

  const shelfWidth = useMemo(() => {
    return totalAlbums * (SPINE_T + SPINE_GAP) + SIDE_PADDING * 2
  }, [totalAlbums])

  // Single-row shelf: one top plank, one bottom plank
  const panels = useMemo(() => {
    const topY = 0.65 + 1.3 / 2 + PLANK_THICKNESS / 2
    const bottomY = 0.65 - 1.3 / 2 - PLANK_THICKNESS / 2

    return [
      {
        key: 'plank-top',
        position: [0, topY, 0],
        size: [shelfWidth, PLANK_THICKNESS, PLANK_DEPTH],
      },
      {
        key: 'plank-bottom',
        position: [0, bottomY, 0],
        size: [shelfWidth, PLANK_THICKNESS, PLANK_DEPTH],
      },
    ]
  }, [shelfWidth])

  // Bookend panels (vertical sides)
  const bookends = useMemo(() => {
    const height = 1.3 + PLANK_THICKNESS * 2 + 0.1
    const centerY = 0.65
    return [
      {
        key: 'bookend-left',
        position: [-shelfWidth / 2, centerY, 0],
        size: [PLANK_THICKNESS, height, PLANK_DEPTH],
      },
      {
        key: 'bookend-right',
        position: [shelfWidth / 2, centerY, 0],
        size: [PLANK_THICKNESS, height, PLANK_DEPTH],
      },
    ]
  }, [shelfWidth])

  return (
    <group>
      {panels.map(({ key, position, size }) => (
        <WoodPanel key={key} position={position} size={size} textures={shelfTextures} />
      ))}
      {bookends.map(({ key, position, size }) => (
        <WoodPanel key={key} position={position} size={size} textures={shelfTextures} />
      ))}
    </group>
  )
}
