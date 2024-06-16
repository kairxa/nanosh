import type {
  DefaultCalculatorReturnType,
  GenericCalculatorParams,
} from '@nanosh/types/generic'
import type { Skills } from '@nanosh/types/skills'
import ConvertLW from '@nanosh/utils/convertLW'
import getAPUsage from '@nanosh/utils/getAPUsage'
import GetAURemoved from '@nanosh/utils/getAURemoved'
import GetAgileLWBlock from '@nanosh/utils/getAgileLWBlock'
import KillCharacterFromWoundPerhaps from '@nanosh/utils/killCharacterFromWoundPerhaps'
import seedrandom from 'seedrandom'

interface FightercraftsBayDogfightParams
  extends Pick<
    GenericCalculatorParams,
    'state' | 'invokeTime' | 'characterID' | 'gameID'
  > {
  fightercraftID: number
}

const DOGFIGHT_AP_USAGE = 2
const DOGFIGHT_SKILL_MODIFIERS = new Set<Skills>(['skill.aviator'])
const DOGFIGHT_SKILL_AP_REDUCE = 1
const DOGFIGHT_DICE_2_LW_ADD = 2
const DOGFIGHT_DICE_10_CW_ADD = 1
const DOGFIGHT_FILE_011_LW_REDUCE = 1

export default function ({
  state,
  invokeTime,
  characterID,
  gameID,
  fightercraftID,
}: FightercraftsBayDogfightParams): DefaultCalculatorReturnType {
  const stateCopy = structuredClone(state)

  const character = stateCopy.characters.get(characterID)
  const [apUsed, error] = getAPUsage(
    character!,
    DOGFIGHT_SKILL_MODIFIERS,
    DOGFIGHT_AP_USAGE,
    DOGFIGHT_SKILL_AP_REDUCE,
  )
  if (error !== null) return [null, error]

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const { hornets, talons, diceResult } = GetAURemoved({
    actionName: 'action.fightercrafts-bay.dogfight',
    characterTraits: character!.trait,
    characterModifier: character!.modifiers,
    prng,
    projectsDone: stateCopy.ship.projects.done,
    currentAU: stateCopy.nanosh.aerialUnits,
  })

  let cwAdd = 0
  let lwAdd = 0
  let isBuzzardBroken = false
  switch (diceResult) {
    case 2:
      lwAdd = DOGFIGHT_DICE_2_LW_ADD
      isBuzzardBroken = true
      break
    case 10:
      cwAdd = DOGFIGHT_DICE_10_CW_ADD
      isBuzzardBroken = true

      // if aviator, 10 is the same with 2.
      if (character?.skills.has('skill.aviator')) {
        cwAdd = 0
        lwAdd = DOGFIGHT_DICE_2_LW_ADD
      }
      break
    default:
      lwAdd = 0
      cwAdd = 0
      break
  }

  if (
    stateCopy.ship.projects.done.has(
      'File 012 - M22 "Buzzard" Defensive Retrofit',
    )
  ) {
    lwAdd = Math.max(lwAdd - DOGFIGHT_FILE_011_LW_REDUCE, 0)
  }

  const agileLWBlock = GetAgileLWBlock(character!, prng)
  if (agileLWBlock) {
    lwAdd = 0
  }

  let currentLW = character?.modifiers.get('character.wound.light')
  let currentCW = character?.modifiers.get('character.wound.critical')
  if (lwAdd > 0) {
    if (!currentLW) {
      currentLW = {
        start: { day: stateCopy.day, cycle: stateCopy.cycle },
        expiry: { day: -1, cycle: -1 },
        amount: 0,
      }
    }

    currentLW.amount = currentLW.amount + lwAdd
    character?.modifiers.set('character.wound.light', currentLW)
  }

  if (cwAdd > 0) {
    if (!currentCW) {
      currentCW = {
        start: { day: stateCopy.day, cycle: stateCopy.cycle },
        expiry: { day: -1, cycle: -1 },
        amount: 0,
      }
    }

    currentCW.amount = currentCW.amount + cwAdd
    character?.modifiers.set('character.wound.critical', currentCW)
  }

  stateCopy.ship.fighterCrafts.get(fightercraftID)!.broken = isBuzzardBroken
  stateCopy.nanosh.aerialUnits.hornets = Math.max(
    stateCopy.nanosh.aerialUnits.hornets - hornets,
    0,
  )
  stateCopy.nanosh.aerialUnits.talons = Math.max(
    stateCopy.nanosh.aerialUnits.talons - talons,
    0,
  )

  const [convertedLWState, _errorConvertLW] = ConvertLW({
    state: stateCopy,
    characterID,
  })
  const [killResultState, _errorKillResult] = KillCharacterFromWoundPerhaps({
    state: convertedLWState!,
    characterID,
    isDayChange: false,
  })

  if (!killResultState?.charactersDead.has(characterID)) {
    const newCharacter = killResultState?.characters.get(characterID)
    newCharacter?.cycleActions.set(
      invokeTime,
      'action.fightercrafts-bay.dogfight',
    )
    newCharacter!.ap -= apUsed
  }

  return [killResultState, null]
}
