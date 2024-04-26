import { describe, expect, it, setSystemTime } from 'bun:test'
import getUniqueRandomNumbers from './getUniqueRandomNumbers'

describe('getUniqueRandomNumbers', () => {
  it('should return three unique random numbers', () => {
    setSystemTime(new Date(2024, 4, 14))
    const uniqueRandomNumbers = getUniqueRandomNumbers(
      30,
      3,
      'unique-random-numbers',
    )
    expect(uniqueRandomNumbers.length).toBe(3)
    expect(uniqueRandomNumbers[1]).not.toBe(uniqueRandomNumbers[2])
    expect(uniqueRandomNumbers[1]).not.toBe(uniqueRandomNumbers[3])
    expect(uniqueRandomNumbers[2]).not.toBe(uniqueRandomNumbers[3])
  })
})
