import { useMemo } from 'react'
import { createWoodTexture } from '../../utils/textures'

// Shelf dimensions (roughly matching a 2x4 KALLAX-style cubby unit)
const COLS = 2
const ROWS = 4
const CUBBY_W = 1.5   // inner cubby width
const CUBBY_H = 1.5   // inner cubby height
const CUBBY_D = 1.4   // cubby depth
const PANEL_T = 0.08  // panel thickness
const LEG_H = 0.2     // short legs

// Total outer dimensions
const TOTAL_W = COLS * CUBBY_W + (COLS + 1) * PANEL_T
const TOTAL_H = ROWS * CUBBY_H + (ROWS + 1) * PANEL_T
const SHELF_BOTTOM = -(TOTAL_H / 2)

export { COLS, ROWS, CUBBY_W, CUBBY_H, CUBBY_D, PANEL_T, TOTAL_W, TOTAL_H, SHELF_BOTTOM, LEG_H }

// Get world position for a cubby's center (for placing records)
export function getCubbyCenter(col, row) {
  const startX = -(TOTAL_W / 2) + PANEL_T + CUBBY_W / 2 + col * (CUBBY_W + PANEL_T)
  const startY = TOTAL_H / 2 - PANEL_T - CUBBY_H / 2 - row * (CUBBY_H + PANEL_T) + LEG_H / 2
  const z = 0
  return [startX, startY, z]
}

function WoodPanel({ position, size }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#8B6914" roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

export default function Shelf() {
  const panels = useMemo(() => {
    const p = []
    const offsetY = LEG_H / 2

    // Vertical dividers (COLS + 1)
    for (let c = 0; c <= COLS; c++) {
      const x = -(TOTAL_W / 2) + PANEL_T / 2 + c * (CUBBY_W + PANEL_T)
      p.push({
        key: `v-${c}`,
        position: [x, offsetY, 0],
        size: [PANEL_T, TOTAL_H, CUBBY_D],
      })
    }

    // Horizontal dividers (ROWS + 1)
    for (let r = 0; r <= ROWS; r++) {
      const y = TOTAL_H / 2 - PANEL_T / 2 - r * (CUBBY_H + PANEL_T) + offsetY
      p.push({
        key: `h-${r}`,
        position: [0, y, 0],
        size: [TOTAL_W, PANEL_T, CUBBY_D],
      })
    }

    // Back panel
    p.push({
      key: 'back',
      position: [0, offsetY, -(CUBBY_D / 2) - 0.02],
      size: [TOTAL_W, TOTAL_H, 0.04],
    })

    // Legs (4 corners)
    const legW = 0.1
    const legPositions = [
      [-(TOTAL_W / 2) + legW, -(TOTAL_H / 2) - LEG_H / 2 + offsetY, CUBBY_D / 2 - legW],
      [TOTAL_W / 2 - legW, -(TOTAL_H / 2) - LEG_H / 2 + offsetY, CUBBY_D / 2 - legW],
      [-(TOTAL_W / 2) + legW, -(TOTAL_H / 2) - LEG_H / 2 + offsetY, -(CUBBY_D / 2) + legW],
      [TOTAL_W / 2 - legW, -(TOTAL_H / 2) - LEG_H / 2 + offsetY, -(CUBBY_D / 2) + legW],
    ]
    legPositions.forEach((pos, i) => {
      p.push({
        key: `leg-${i}`,
        position: pos,
        size: [legW, LEG_H, legW],
      })
    })

    return p
  }, [])

  return (
    <group>
      {panels.map(({ key, position, size }) => (
        <WoodPanel key={key} position={position} size={size} />
      ))}
    </group>
  )
}
