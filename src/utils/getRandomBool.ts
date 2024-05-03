import type seedrandom from 'seedrandom'

export default function GetRandomBool(prng: seedrandom.PRNG): boolean {
  return prng() > 0.5
}
