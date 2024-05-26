import type {
  ModifierTracker,
  ModifiersCharacter,
} from '@nanosh/types/modifiers'
import type { Traits } from '@nanosh/types/traits'

export const UPLIFTED_FORBID_TRAITS = new Set<Traits>(['trait.droid'])
export const UPLIFTED_ALLOW_TRAITS = new Set<Traits>(['trait.amorous'])

export function GetWillUplifted(
  traits: Set<Traits>,
  modifiers: Map<ModifiersCharacter, ModifierTracker>,
): boolean {
  return (
    traits.intersection(UPLIFTED_FORBID_TRAITS).size <= 0 &&
    traits.intersection(UPLIFTED_ALLOW_TRAITS).size >= 1 &&
    modifiers.has('character.cycle.frustrated')
  )
}
