import * as THREE from 'three'

// Procedural wood texture
export function createWoodTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Base color
  ctx.fillStyle = '#8B6914'
  ctx.fillRect(0, 0, 512, 512)

  // Wood grain lines
  for (let i = 0; i < 80; i++) {
    const y = Math.random() * 512
    const width = Math.random() * 3 + 0.5
    const alpha = Math.random() * 0.15 + 0.05
    ctx.strokeStyle = `rgba(60, 40, 10, ${alpha})`
    ctx.lineWidth = width
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x < 512; x += 20) {
      ctx.lineTo(x, y + Math.sin(x * 0.02) * 3 + (Math.random() - 0.5) * 2)
    }
    ctx.stroke()
  }

  // Subtle knots
  for (let i = 0; i < 3; i++) {
    const x = Math.random() * 512
    const y = Math.random() * 512
    const r = Math.random() * 15 + 5
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, 'rgba(90, 55, 10, 0.3)')
    grad.addColorStop(1, 'rgba(90, 55, 10, 0)')
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

  ctx.fillStyle = '#f5e6c8'
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
