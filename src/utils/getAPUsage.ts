import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Character } from '@nanosh/types/character'
import type { Skills } from '@nanosh/types/skills'
import 'core-js/stable/set/intersection'

export default function (
  character: Character,
  skillModifiers: Set<Skills>,
  defaultAPUsage: number,
  skillAPReduce: number,
): [number, Error | null] {
  let apUsed = defaultAPUsage
  if (character.skills.intersection(skillModifiers).size > 0)
    apUsed -= skillAPReduce

  if (character.ap < apUsed) return [apUsed, new Error(INVALID_NOT_ENOUGH_AP)]

  return [apUsed, null]
}
