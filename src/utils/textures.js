import * as THREE from 'three'

// Procedural wood texture — hinoki wood
export function createWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Base color — warm hinoki wood
  ctx.fillStyle = '#C4A882'
  ctx.fillRect(0, 0, 512, 512)

  // Subtle grain lines for texture
  for (let i = 0; i < 80; i++) {
    const y = Math.random() * 512
    const width = Math.random() * 3 + 0.5
    const alpha = Math.random() * 0.08 + 0.02
    ctx.strokeStyle = `rgba(168, 137, 106, ${alpha})`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < 512; x += 20) {
      ctx.lineTo(x, y + Math.sin(x * 0.02) * 3 + (Math.random() - 0.5) * 2)
    }
    ctx.stroke()
  }

  // Very subtle knot spots
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = Math.random() * 15 + 5
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(180, 155, 120, 0.15)')
    grad.addColorStop(1, 'rgba(180, 155, 120, 0)')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

// Procedural paper texture for liner notes
export function createPaperTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#F5F0E8'
  ctx.fillRect(0, 0, 256, 256)

  // Noise
  const imageData = ctx.getImageData(0, 0, 256, 256)
  for (let i = 0; i < imageData.data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 15
    imageData.data[i] += noise
    imageData.data[i + 1] += noise
    imageData.data[i + 2] += noise
  }
  ctx.putImageData(imageData, 0, 0)

  return new THREE.CanvasTexture(canvas)
}

// Procedural vinyl groove texture — singleton
let _vinylGrooveTexture = null
export function createVinylGrooveTexture() {
  if (_vinylGrooveTexture) return _vinylGrooveTexture

  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Mid-grey base
  ctx.fillStyle = '#3a3a3a'
  ctx.fillRect(0, 0, size, size)

  const cx = size / 2
  const cy = size / 2

  // ~110 concentric rings alternating light/dark grey
  for (let i = 0; i < 110; i++) {
    const radius = 10 + i * 2.1
    if (radius > size / 2) break
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.strokeStyle = i % 2 === 0 ? '#4a4a4a' : '#2e2e2e'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  _vinylGrooveTexture = texture
  return texture
}
