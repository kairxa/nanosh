import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import GetRandomBool from './getRandomBool'

describe('GetRandomBool', () => {
  it('should generate bool', () => {
    const prng = seedrandom('bool-test')

    expect(GetRandomBool(prng)).toBeTrue()
    expect(GetRandomBool(prng)).toBeTrue()
    expect(GetRandomBool(prng)).toBeFalse()
    expect(GetRandomBool(prng)).toBeTrue()
    expect(GetRandomBool(prng)).toBeFalse()
  })
})
