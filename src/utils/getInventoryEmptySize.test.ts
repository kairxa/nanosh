import type { Skills } from '@nanosh/types/skills'
import { describe, expect, it } from 'bun:test'
import GetInventoryEmptySize from './getInventoryEmptySize'

describe('GetInventoryEmptySize', () => {
  it('should return how many spaces are left in inventory', () => {
    const result = GetInventoryEmptySize(
      3,
      new Set<Skills>([
        'skill.cook',
        'skill.pirate',
        'skill.aviator',
        'skill.shooter',
      ]),
    )

    expect(result).toBe(2)
  })

  it('should return how many spaces left if character is a sniper', () => {
    const result = GetInventoryEmptySize(
      3,
      new Set<Skills>([
        'skill.sniper',
        'skill.pirate',
        'skill.aviator',
        'skill.shooter',
      ]),
    )

    expect(result).toBe(0)
  })
})
