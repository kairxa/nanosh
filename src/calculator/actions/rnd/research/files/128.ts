import type { Game } from '@nanosh/types/game'
import {
  CANNON_DEFAULT_MAX_DAMAGE,
  CANNON_DEFAULT_MIN_DAMAGE,
  type DefaultCalculatorReturnType,
} from '@nanosh/types/generic'

const FINESSE_CANNON_DAMAGE_MIN_ADDITION = 1
const FINESSE_CANNON_DAMAGE_MAX_ADDITION = 1

export function finesseProtocol(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const currentDamage = stateCopy.ship.damage.get(
    'action.bridge.command.cannon',
  )
  stateCopy.ship.damage.set('action.bridge.command.cannon', {
    min:
      (currentDamage?.min || CANNON_DEFAULT_MIN_DAMAGE) +
      FINESSE_CANNON_DAMAGE_MIN_ADDITION,
    max:
      (currentDamage?.max || CANNON_DEFAULT_MAX_DAMAGE) +
      FINESSE_CANNON_DAMAGE_MAX_ADDITION,
  })

  return [stateCopy, null]
}
