import { useMemo, useRef, useEffect } from 'react'
import { loadShelfTextures } from '../../utils/textures'

// Layout constants
const SPINE_T = 0.06
const SPINE_GAP = 0.005
const RECORDS_PER_ROW = 9
const SHELF_WIDTH = RECORDS_PER_ROW * (SPINE_T + SPINE_GAP) + 0.4 // padding on sides
const PLANK_THICKNESS = 0.08
const PLANK_DEPTH = 1.4
const ROW_HEIGHT = 1.5 // vertical spacing between shelf planks

export { SHELF_WIDTH, RECORDS_PER_ROW, SPINE_T, SPINE_GAP, PLANK_THICKNESS, ROW_HEIGHT }

// Get the Y position for records sitting on a given row's plank
export function getRowY(rowIndex, totalRows) {
  // Center the whole shelf vertically
  const totalHeight = totalRows * ROW_HEIGHT
  const topY = totalHeight / 2
  // Each row's plank sits at topY - (rowIndex + 1) * ROW_HEIGHT, records sit on top of plank
  const plankY = topY - (rowIndex + 1) * ROW_HEIGHT + PLANK_THICKNESS / 2
  return plankY
}

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

  const panels = useMemo(() => {
    const p = []
    const numRows = Math.ceil(totalAlbums / RECORDS_PER_ROW)
    const numPlanks = numRows + 1 // top + bottom of each row
    const totalHeight = numRows * ROW_HEIGHT
    const topY = totalHeight / 2

    for (let i = 0; i < numPlanks; i++) {
      const y = topY - i * ROW_HEIGHT
      p.push({
        key: `plank-${i}`,
        position: [0, y, 0],
        size: [SHELF_WIDTH, PLANK_THICKNESS, PLANK_DEPTH],
      })
    }

    return p
  }, [totalAlbums])

  return (
    <group>
      {panels.map(({ key, position, size }) => (
        <WoodPanel key={key} position={position} size={size} textures={shelfTextures} />
      ))}
    </group>
  )
}
