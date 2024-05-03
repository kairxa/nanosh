import type { Game } from '@nanosh/types/game'
import {
  CANNON_DEFAULT_MAX_DAMAGE,
  type DefaultCalculatorReturnType,
} from '@nanosh/types/generic'

export function equilibrium(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const currentDamage = stateCopy.ship.damage.get(
    'action.bridge.command.cannon',
  )
  stateCopy.ship.damage.set('action.bridge.command.cannon', {
    min: currentDamage?.max || CANNON_DEFAULT_MAX_DAMAGE,
    max: currentDamage?.max || CANNON_DEFAULT_MAX_DAMAGE,
  })

  return [stateCopy, null]
}
