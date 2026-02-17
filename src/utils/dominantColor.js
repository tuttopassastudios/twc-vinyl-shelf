const colorCache = new Map()

/**
 * Extract the dominant color from an image URL using canvas sampling.
 * Returns a promise that resolves to a hex color string.
 */
export function extractDominantColor(imageUrl) {
  if (colorCache.has(imageUrl)) {
    return Promise.resolve(colorCache.get(imageUrl))
  }

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 32 // small sample for performance
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)

      const data = ctx.getImageData(0, 0, size, size).data
      let r = 0, g = 0, b = 0, count = 0

      // Sample pixels, skip very dark and very light ones
      for (let i = 0; i < data.length; i += 4) {
        const pr = data[i], pg = data[i + 1], pb = data[i + 2]
        const brightness = (pr + pg + pb) / 3
        if (brightness > 30 && brightness < 240) {
          r += pr
          g += pg
          b += pb
          count++
        }
      }

      if (count === 0) {
        // Fallback: average all pixels
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }
      }

      r = Math.round(r / count)
      g = Math.round(g / count)
      b = Math.round(b / count)

      // Boost saturation slightly so spines aren't too muddy
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      if (max > 0 && max - min < 40) {
        // Very desaturated — nudge channels apart
        const mid = (r + g + b) / 3
        r = Math.min(255, Math.round(r + (r - mid) * 0.3))
        g = Math.min(255, Math.round(g + (g - mid) * 0.3))
        b = Math.min(255, Math.round(b + (b - mid) * 0.3))
      }

      const hex = '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
      colorCache.set(imageUrl, hex)
      resolve(hex)
    }

    img.onerror = () => {
      resolve(null) // caller falls back to hash color
    }

    img.src = imageUrl
  })
}
