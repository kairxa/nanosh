// INVALID_* = 4xx errors
// FATAL_* = 5xx errors

// Initial Creation Errors
export const INVALID_INITIAL_SUPERSECTOR =
  'Initial Creation Error: Failed to get initial supersector location'

// Action Guard Errors
export const INVALID_CHARACTER_ID = 'Invalid Character ID'
export const INVALID_PLAYER_MISMATCH = 'Player - Character Mismatch'
export const INVALID_MAX_ACTIONS_PER_CYCLE_REACHED =
  'Maximum Actions per Cycle Reached'
export const INVALID_CHARACTER_DEAD = 'Character is Dead'
export const INVALID_CHARACTER_DIRTY = 'Excessive filth detected.'

// Generic Errors
export const INVALID_NOT_ENOUGH_AP = 'Not Enough AP.'
export const INVALID_NOT_ENOUGH_ECELLS = 'Not Enough eCells.'
export const INVALID_NOT_ENOUGH_SUPPLIES = 'Not Enough supplies.'
export const FATAL_SHIP_LOCATION_STORE_MISMATCH =
  'Invalid ship location inside stored state.'
export const INVALID_INVENTORY_FULL = 'Inventory is full.'
export const INVALID_INVENTORY_ITEM_NOT_FOUND =
  'Item is not found in inventory.'
export const INVALID_TARGET_LOCATION = 'Invalid target location.'

// action.generic Errors
export const INVALID_UNEQUIP_EMPTY_TARGET = 'Nothing is equipped in that slot.'
export const INVALID_EQUIP_ITEM_UNEQUIPPABLE = 'Item is not equippable.'

// action.bridge.command.advance Errors
export const INVALID_SUPERSECTOR_TARGET_ID = 'Invalid Supersector Target ID'

// action.bridge.command.cannon Errors
export const INVALID_TARGET_NOT_NANOSH = 'Target is not a targetable structure.'
export const INVALID_SHIP_LOCATION =
  'Ship is not in the vicinity of target structure.'

// action.bridge.command.mobilize Errors
export const INVALID_MOBILIZE_TARGET = 'Target is not an empty subsector.'
export const INVALID_MOBILIZE_CONFIRM = 'What are you trying to confirm?'
export const INVALID_MOBILIZE_NOT_ENOUGH_RESOURCES =
  'Mobilize failed. Not enough resources.'

// action.bridge.command.reinforce Errors
export const INVALID_REINFORCE_TARGET = 'Target is not a liberation point.'
export const INVALID_REINFORCE_NOT_ENOUGH_RESOURCES =
  'Reinforce failed. Not enough selected resources.'

// action.bridge.command.liberate Errors
export const INVALID_LIBERATE_NO_LIBPO =
  'No liberation point inside current supersector.'
export const FATAL_LIBERATE_REDUCE_ADVANCE_SUBSECTOR_NAME_MISMATCH =
  'Invalid subsector name when reducing advance count, using subsector name'

// action.bridge.command.analyze Errors
export const INVALID_ANALYZE_NOT_ENOUGH_BASIC_INTEL = 'Not enough basic intel.'

// action.rnd.review Errors
export const INVALID_REVIEW_PROJECT_QUEUE_MAX_REACHED =
  'Maximum project queue reached.'

// action.rnd.research Errors
export const INVALID_RESEARCH_QUEUE_ID_MISMATCH =
  'Queue ID does not match any project.'
export const FATAL_RESEARCH_PROJECT_NAME_NOT_FOUND =
  'Invalid project name inside selected queue ID'

// action.rnd.build Errors
export const INVALID_BUILD_NOT_ENOUGH_RESOURCES =
  'Not enough resources to build.'
export const INVALID_BUILD_ITEM_NAME_NOT_CRAFTABLE =
  'Item is not craftable. Yet. Maybe.'

// action.rnd.repair Errors
export const INVALID_REPAIR_ITEM_IS_NOT_BROKEN = 'Item is not broken.'

// action.medlab.compound Errors
export const INVALID_COMPOUND_MEDS_NAME = 'Invalid meds name.'

// action.medlab.firstaid Errors
export const INVALID_FIRSTAID_TARGET_NOT_WOUNDED =
  'Target has no light wounded.'
