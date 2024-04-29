import type seedrandom from 'seedrandom'
import { GetRandomArray } from './getRandomArray'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function GetRandomString(
  length: number,
  prng: seedrandom.PRNG,
): string {
  return GetRandomArray(letters, length, prng).join('')
}
