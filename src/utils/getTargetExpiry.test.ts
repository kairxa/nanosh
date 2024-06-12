import { describe, expect, it } from 'bun:test'
import GetTargetExpiry from './getTargetExpiry'

describe('GetTargetExpiry', () => {
  it.each([
    [{ day: 1, cycle: 2 }, 1, { day: 1, cycle: 2 }],
    [{ day: 1, cycle: 4 }, 1, { day: 1, cycle: 4 }],
    [{ day: 1, cycle: 2 }, 3, { day: 1, cycle: 4 }],
    [{ day: 2, cycle: 3 }, 7, { day: 4, cycle: 1 }],
    [{ day: 3, cycle: 4 }, 13, { day: 6, cycle: 4 }],
  ])(
    'should calculate %p added by %p cycles, will result in %p',
    (start, duration, expiry) => {
      const result = GetTargetExpiry(start, duration)
      expect(result).toMatchObject(expiry)
    },
  )
})
