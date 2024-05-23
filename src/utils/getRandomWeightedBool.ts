import type seedrandom from 'seedrandom'

const BASE_CHANCE = 1

export default function GetRandomWeightedBool(
  prng: seedrandom.PRNG,
  chance: number,
): boolean {
  const chanceFloat = BASE_CHANCE - chance / 100

  return prng() > chanceFloat
}
