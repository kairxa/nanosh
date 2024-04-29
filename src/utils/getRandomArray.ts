import seedrandom from 'seedrandom'

export function GetRandomArray(
  array: unknown[],
  retrievedTotal: number,
  prng: seedrandom.PRNG,
): unknown[] {
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
  prng: seedrandom.PRNG,
): Set<unknown> {
  const arr = Array.from(set)

  return new Set(GetRandomArray(arr, retrievedTotal, prng))
}
