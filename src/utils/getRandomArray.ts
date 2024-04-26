import seedrandom from 'seedrandom'
import { uuidv7 } from 'uuidv7'

export function GetRandomArray(
  array: unknown[],
  retrievedTotal: number,
  gameID: string = uuidv7(),
  invokeTime: number = new Date().getTime(),
): unknown[] {
  const prng = seedrandom(`${gameID}-${invokeTime}`)

  const arr = structuredClone(array)
  let currentIndex = arr.length
  while (currentIndex != 0) {
    let randomIndex = Math.floor(prng() * currentIndex)
    currentIndex--
    ;[arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ]
  }

  return arr.slice(0, retrievedTotal)
}

export function GetRandomSet(
  set: Set<unknown>,
  retrievedTotal: number,
  gameID: string = uuidv7(),
  invokeTime: number = new Date().getTime(),
): Set<unknown> {
  const arr = Array.from(set)

  return new Set(GetRandomArray(arr, retrievedTotal, gameID, invokeTime))
}
