import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import getRandomNumber from './getRandomNumber'

describe('getRandomNumber with min max values', () => {
  const prng = seedrandom('get-random-number')
  it('should generate numbers between min and max values', () => {
    const numbers: number[] = []
    for (let i = 0; i < 100; i++) {
      // assuming we will generate min and max numbers by this iteration
      numbers.push(getRandomNumber(10, 30, prng))
    }

    numbers.sort((a, b) => a - b)

    expect(numbers[0]).toBe(10)
    expect(numbers[numbers.length - 1]).toBe(30)
  })
})
