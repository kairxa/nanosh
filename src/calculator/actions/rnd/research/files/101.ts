import type { Game } from '@nanosh/types/game'
import type { DefaultCalculatorReturnType } from '@nanosh/types/generic'

export function supportBpRecoB(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.craftable.add('body.swiftmesh')
  stateCopy.craftable.add('weapon.unique.vigiles-45')
  stateCopy.craftable.add('acc.omni-converter')
  stateCopy.craftable.add('weapon.heavy.arcus-driver')
  stateCopy.craftable.add('item.grenade')

  return [stateCopy, null]
}
