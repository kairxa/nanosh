import seedrandom from 'seedrandom'
import { uuidv7 } from 'uuidv7'

export default function (
  length: number,
  retrievedTotal: number,
  gameID: string = uuidv7(),
  invokeTime: number = new Date().getTime(),
): number[] {
  const arr = []
  for (let i = 1; i <= length; i++) {
    arr.push(i)
  }

  const prng = seedrandom(`${gameID}-${invokeTime}`)

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
