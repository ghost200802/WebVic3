export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin)
}

export function clampRange(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

export function lerpAngle(a: number, b: number, t: number): number {
  const diff = b - a
  return a + diff * t
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

export function normalizeAngle(angle: number): number {
  while (angle < 0) angle += 360
  while (angle >= 360) angle -= 360
  return angle
}

export function roundTo(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}

export function interpolate(start: number, end: number, progress: number, easing?: (t: number) => number): number {
  const ease = easing || ((t: number) => t)
  const t = ease(clamp(progress, 0, 1))
  return lerp(start, end, t)
}
