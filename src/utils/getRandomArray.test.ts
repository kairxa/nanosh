import { describe, expect, it, setSystemTime } from 'bun:test'
import { GetRandomArray } from './getRandomArray'
import { SupersectorNamesCollection } from './initialState/sectors'

describe('getRandomArray', () => {
  it('should randomize array', () => {
    setSystemTime(new Date(2024, 4, 14))
    const randomizedSupersectorCollection = GetRandomArray(
      SupersectorNamesCollection,
      SupersectorNamesCollection.length,
    )

    expect(randomizedSupersectorCollection[0]).not.toBe(
      randomizedSupersectorCollection[1],
    )
  })
})
