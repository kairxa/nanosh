import type seedrandom from 'seedrandom'

export default function (prng: seedrandom.PRNG): boolean {
  return prng() > 0.5
}
