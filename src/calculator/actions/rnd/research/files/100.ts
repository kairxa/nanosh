import type { Game } from '@nanosh/types/game'
import type { DefaultCalculatorReturnType } from '@nanosh/types/generic'

export function supportBpRecoA(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  stateCopy.craftable.add('body.heavy.lorica')
  stateCopy.craftable.add('weapon.guns.pugio')
  stateCopy.craftable.add('weapon.guns.principes')
  stateCopy.craftable.add('weapon.guns.rondel')
  stateCopy.craftable.add('weapon.guns.heavy.cyclone')
  stateCopy.craftable.add('acc.force-deflector-shield')

  return [stateCopy, null]
}
