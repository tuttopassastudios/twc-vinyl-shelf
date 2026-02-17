import { useRef, useEffect } from 'react'
import usePlayerStore from '../../stores/playerStore'

export default function VinylSpinner({ size = 44, albumImage }) {
  const canvasRef = useRef()
  const rotationRef = useRef(0)
  const rafRef = useRef()
  const isPlaying = usePlayerStore((s) => s.isPlaying)
  const imageRef = useRef(null)

  // Load album image
  useEffect(() => {
    if (!albumImage) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = albumImage
    img.onload = () => {
      imageRef.current = img
    }
  }, [albumImage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const r = size / 2

    function draw() {
      if (isPlaying) rotationRef.current += 0.02
      ctx.clearRect(0, 0, size, size)
      ctx.save()
      ctx.translate(r, r)
      ctx.rotate(rotationRef.current)

      // Vinyl disc
      ctx.beginPath()
      ctx.arc(0, 0, r - 1, 0, Math.PI * 2)
      ctx.fillStyle = '#1a1a1a'
      ctx.fill()

      // Grooves
      for (let i = 3; i < r - 8; i += 3) {
        ctx.beginPath()
        ctx.arc(0, 0, i, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(50,50,50,0.5)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Center label (album art or color)
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      if (imageRef.current) {
        const s = r * 0.6
        ctx.drawImage(imageRef.current, -s, -s, s * 2, s * 2)
      } else {
        ctx.fillStyle = '#B87D56'
        ctx.fill()
      }

      ctx.restore()

      // Center hole
      ctx.beginPath()
      ctx.arc(r, r, 2, 0, Math.PI * 2)
      ctx.fillStyle = '#F7F5F0'
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [size, isPlaying])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%' }}
    />
  )
}
