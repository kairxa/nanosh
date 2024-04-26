import type { Point } from '../types/generic'

export default function CalculateDistance(
  oriPos: Point,
  targetPos: Point,
  gridSize: Point = { x: 4, y: 3 },
): number {
  const dx = Math.abs(oriPos.x - targetPos.x)
  const dy = Math.abs(oriPos.y - targetPos.y)

  const wrappedDx = Math.min(dx, gridSize.x - dx)

  return Math.max(wrappedDx, dy)
}
