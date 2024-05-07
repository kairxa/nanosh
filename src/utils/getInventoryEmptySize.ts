import type { Skills } from '@nanosh/types/skills'

const INVENTORY_MAX_SPACE = 3
const INVENTORY_SNIPER_SIZE_REDUCE = 2

export default function GetInventoryEmptySize(
  currentInventorySize: number,
  skills: Set<Skills>,
): number {
  let inventorySpace = INVENTORY_MAX_SPACE
  if (skills.has('skill.sniper')) {
    inventorySpace -= INVENTORY_SNIPER_SIZE_REDUCE
  }

  return Math.max(inventorySpace - currentInventorySize, 0)
}
