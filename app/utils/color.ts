export type RGB = { r: number; g: number; b: number }

export const defaultAccent: RGB = { r: 100, g: 100, b: 100 }

export function rgbToStyle({ r, g, b }: RGB): Record<string, string> {
  return {
    '--accent': `rgb(${r} ${g} ${b})`,
    '--accent-glow': `rgba(${r}, ${g}, ${b}, 0.7)`,
  }
}

export async function pickDominantColor(url: string): Promise<RGB> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url

    img.onload = () => {
      try {
        const W = 64, H = 64
        const canvas = document.createElement('canvas')
        canvas.width = W; canvas.height = H
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return resolve(defaultAccent)
        ctx.drawImage(img, 0, 0, W, H)

        const bytes: Uint8ClampedArray = ctx.getImageData(0, 0, W, H).data

        let r = 0, g = 0, b = 0, n = 0
        for (let i = 0; i + 3 < bytes.length; i += 4) {
          const rr = bytes[i]       // number
          const gg = bytes[i + 1]   // number
          const bb = bytes[i + 2]   // number
          const aa = bytes[i + 3]   // number

          if (aa < 200) continue
          const max = Math.max(rr, gg, bb)
          const min = Math.min(rr, gg, bb)
          const sat = max - min
          if (max < 16) continue
          if (min > 245) continue
          if (sat < 12 && max > 160) continue

          r += rr; g += gg; b += bb; n++
        }
        if (!n) return resolve(defaultAccent)
        resolve({ r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) })
      } catch {
        resolve(defaultAccent)
      }
    }

    img.onerror = () => resolve(defaultAccent)
  })
}
