import { MAX_CYCLE_PER_DAY } from '@nanosh/types/generic'
import type { ModifierTimeDetail } from '@nanosh/types/modifiers'

export default function GetTargetExpiry(
  start: ModifierTimeDetail,
  duration: number,
): ModifierTimeDetail {
  const startInNumber = (start.day - 1) * MAX_CYCLE_PER_DAY + start.cycle
  const expiryInNumber = startInNumber + duration - 1 // - 1 because expiry will be calculated by the end of cycle. e.g. d1c1 + 8, will be gone at d3c1 yet this will be determined in d2c4.

  if (expiryInNumber % 4 === 0) {
    return {
      day: Math.floor(expiryInNumber / MAX_CYCLE_PER_DAY),
      cycle: MAX_CYCLE_PER_DAY,
    }
  }

  return {
    day: Math.floor(expiryInNumber / MAX_CYCLE_PER_DAY) + 1,
    cycle: expiryInNumber % MAX_CYCLE_PER_DAY,
  }
}
