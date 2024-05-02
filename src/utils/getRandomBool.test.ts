import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import getRandomBool from './getRandomBool'

describe('getRandomBool', () => {
  it('should generate bool', () => {
    const prng = seedrandom('bool-test')

    expect(getRandomBool(prng)).toBeTrue()
    expect(getRandomBool(prng)).toBeTrue()
    expect(getRandomBool(prng)).toBeFalse()
    expect(getRandomBool(prng)).toBeTrue()
    expect(getRandomBool(prng)).toBeFalse()
  })
})
