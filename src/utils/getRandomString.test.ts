import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import GetRandomString from './getRandomString'

describe('GetRandomString', () => {
  it('should generate a random string with specified length', () => {
    const prng = seedrandom('random-string')
    const str = GetRandomString(8, prng)

    expect(typeof str).toBe('string')
    expect(str.length).toBe(8)
  })
})
