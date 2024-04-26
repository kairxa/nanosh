import { INVALID_NOT_ENOUGH_AP } from '@nanosh/messages/errors'
import type { Character } from '@nanosh/types/character'
import type { Skills } from '@nanosh/types/skills'
import { describe, expect, it } from 'bun:test'
import getAPUsage from './getAPUsage'
import { GetInitialCharacters } from './initialState/characters'

describe('getAPUsage', () => {
  const characters = GetInitialCharacters()
  const solasMercer = characters.get('Solas Mercer') as Character
  solasMercer.ap = 1
  const teal = characters.get('Tee\'elise "Teal" Qing') as Character
  teal.ap = 1

  it('should return AP usage accordingly', () => {
    let apUsed: number
    let error: Error | null
    ;[apUsed, error] = getAPUsage(
      solasMercer,
      new Set<Skills>(['skill.experienced-commander', 'skill.prodigy-leader']),
      2,
      1,
    )
    expect(error).toBe(null)
    expect(apUsed).toBe(1)
    ;[apUsed, error] = getAPUsage(
      teal,
      new Set<Skills>(['skill.experienced-commander', 'skill.prodigy-leader']),
      2,
      1,
    )
    expect(error?.message).toBe(INVALID_NOT_ENOUGH_AP)
    expect(apUsed).toBe(2)
  })
})
