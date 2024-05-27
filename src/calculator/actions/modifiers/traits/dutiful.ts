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
    const currentDeprived = character.modifiers.get(
      'character.cycle.deprived',
    ) || {
      start: { day: stateCopy.day, cycle: stateCopy.cycle },
      expiry: { day: -1, cycle: -1 },
      amount: 0,
    }
    character.modifiers.set('character.cycle.deprived', {
      start: { ...currentDeprived.start },
      expiry: { ...currentDeprived.expiry },
      amount: Math.max(currentDeprived.amount - DUTIFUL_DEPRIVED_REDUCE, 0),
    })
  }

  return [stateCopy, null]
}
