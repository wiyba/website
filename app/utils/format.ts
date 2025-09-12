export function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n))
}

export function fmtTime(ms: number) {
  if (!ms || ms < 0) ms = 0
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const ss = String(s % 60).padStart(2, '0')
  return `${m}:${ss}`
}
