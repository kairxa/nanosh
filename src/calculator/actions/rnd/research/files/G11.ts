import type { Game } from '@nanosh/types/game'
import {
  CANNON_DEFAULT_MAX_DAMAGE,
  CANNON_DEFAULT_MIN_DAMAGE,
  type DefaultCalculatorReturnType,
} from '@nanosh/types/generic'

const APEX_CANNON_DAMAGE_MAX_ADDITION = 1

export function apexBioEnhancement(state: Game): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const currentDamage = stateCopy.ship.damage.get(
    'action.bridge.command.cannon',
  )
  stateCopy.ship.damage.set('action.bridge.command.cannon', {
    min: currentDamage?.min || CANNON_DEFAULT_MIN_DAMAGE,
    max:
      (currentDamage?.max || CANNON_DEFAULT_MAX_DAMAGE) +
      APEX_CANNON_DAMAGE_MAX_ADDITION,
  })

  return [stateCopy, null]
}
