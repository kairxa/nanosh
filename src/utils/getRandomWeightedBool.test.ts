import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import GetRandomWeightedBool from './getRandomWeightedBool'

describe('GetRandomWeightedBool', () => {
  it('should calculate weighted bool', () => {
    const prng = seedrandom('random-weighted-bool-test')
    // 0.35, 0.94, 0.65, 0.48, 0.38
    const result1 = GetRandomWeightedBool(prng, 40)
    const result2 = GetRandomWeightedBool(prng, 40)
    const result3 = GetRandomWeightedBool(prng, 40)
    const result4 = GetRandomWeightedBool(prng, 40)
    const result5 = GetRandomWeightedBool(prng, 40)

    expect(result1).toBeFalse()
    expect(result2).toBeTrue()
    expect(result3).toBeTrue()
    expect(result4).toBeFalse()
    expect(result5).toBeFalse()
  })
})
