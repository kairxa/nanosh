import {
  INVALID_INVENTORY_ITEM_NOT_FOUND,
  INVALID_EQUIP_ITEM_UNEQUIPPABLE,
  INVALID_INVENTORY_FULL,
  INVALID_UNEQUIP_EMPTY_TARGET,
} from '@nanosh/messages/errors'
import type { CharacterEquipmentSlots } from '@nanosh/types/character'
import type { Game } from '@nanosh/types/game'
import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { ItemNames } from '@nanosh/types/item'
import GetInventoryEmptySize from '@nanosh/utils/getInventoryEmptySize'

interface GenericInventoryParams
  extends Pick<GenericCalculatorParams, 'state' | 'characterID'> {}

interface GenericInventoryUnequipParams extends GenericInventoryParams {
  equipSlot: CharacterEquipmentSlots
}

interface GenericInventoryEquipParams extends GenericInventoryParams {
  itemID?: string
  itemName?: ItemNames
}

export function unequip({
  state,
  characterID,
  equipSlot,
}: GenericInventoryUnequipParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const item = character!.equipment.get(equipSlot)
  // Slightly different with others behavior,
  // if there is no equipped item in the slot, then state will still be returned.
  // This is for reusing in equip function below.
  if (!item) return [stateCopy, new Error(INVALID_UNEQUIP_EMPTY_TARGET)]

  const inventoryEmptySize = GetInventoryEmptySize(
    character!.inventory.size,
    character!.skills,
  )
  if (inventoryEmptySize <= 0) return [null, new Error(INVALID_INVENTORY_FULL)]

  character!.equipment.delete(equipSlot)
  character!.inventory.add(item)

  return [stateCopy, null]
}

export function equip({
  state,
  characterID,
  itemName,
  itemID,
}: GenericInventoryEquipParams): DefaultCalculatorReturnType {
  let stateCopy: Game | null = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const inventory = Array.from(character!.inventory.values())
  const item = inventory.find((item) => {
    return item.itemName === itemName || item.id === itemID
  })
  if (!item) return [null, new Error(INVALID_INVENTORY_ITEM_NOT_FOUND)]

  const itemType = item.itemName.split('.')[0]
  if (itemType !== 'weapon' && itemType !== 'body' && itemType !== 'acc') {
    return [null, new Error(INVALID_EQUIP_ITEM_UNEQUIPPABLE)]
  }

  let equipSlot: CharacterEquipmentSlots
  switch (itemType) {
    case 'weapon':
    case 'body':
      equipSlot = itemType
      break
    case 'acc':
      equipSlot = 'acc-1'
      break
  }

  character!.inventory.delete(item)
  let error: Error | null
  ;[stateCopy, error] = unequip({
    state: stateCopy,
    characterID,
    equipSlot,
  })
  if (error !== null && error.message !== INVALID_UNEQUIP_EMPTY_TARGET) {
    return [null, error]
  }

  stateCopy!.characters.get(characterID)!.equipment.set(equipSlot, item)

  return [stateCopy, null]
}
