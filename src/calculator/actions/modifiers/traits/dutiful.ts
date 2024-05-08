import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'

interface TraitsDutifulDeprivedReduceParams
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {}

const DUTIFUL_DEPRIVED_REDUCE = 1

export default function dutifulDeprivedReduce({
  state,
  characterID,
}: TraitsDutifulDeprivedReduceParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)

  if (character?.trait.has('trait.dutiful')) {
    const currentDeprived = character.modifiers.get('character.cycle.deprived')
    character.modifiers.set('character.cycle.deprived', {
      start: {
        day: currentDeprived?.start.day || 1,
        cycle: currentDeprived?.start.cycle || 1,
      },
      expiry: {
        day: currentDeprived?.expiry.day || -1,
        cycle: currentDeprived?.expiry.cycle || -1,
      },
      amount: Math.max(
        (currentDeprived?.amount || 0) - DUTIFUL_DEPRIVED_REDUCE,
        0,
      ),
    })
  }

  return [stateCopy, null]
}
