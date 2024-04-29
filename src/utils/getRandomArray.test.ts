import { describe, expect, it } from 'bun:test'
import seedrandom from 'seedrandom'
import { GetRandomArray } from './getRandomArray'
import { SupersectorNamesCollection } from './initialState/sectors'

describe('getRandomArray', () => {
  it('should randomize array', () => {
    const prng = seedrandom('randomize-array-test')
    const randomizedSupersectorCollection = GetRandomArray(
      SupersectorNamesCollection,
      SupersectorNamesCollection.length,
      prng,
    )

    expect(randomizedSupersectorCollection[0]).not.toBe(
      randomizedSupersectorCollection[1],
    )
  })
})
