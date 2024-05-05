import type { Traits } from '@nanosh/types/traits'
import type seedrandom from 'seedrandom'
import GetRandomBool from './getRandomBool'

export const DIRTY_FORBID_TRAITS = new Set<Traits>(['trait.droid'])

export function GetWillDirty(
  traits: Set<Traits> = new Set<Traits>(),
  prng: seedrandom.PRNG,
): boolean {
  return (
    traits.intersection(DIRTY_FORBID_TRAITS).size <= 0 && GetRandomBool(prng)
  )
}
