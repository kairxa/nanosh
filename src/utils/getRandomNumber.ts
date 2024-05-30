import type seedrandom from 'seedrandom'

export default function GetRandomNumber(
  min: number = 0,
  max: number = 1,
  prng: seedrandom.PRNG,
): number {
  return Math.floor(prng() * (max - min + 1)) + min
}
