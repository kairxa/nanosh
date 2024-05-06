import type { Game } from '@nanosh/types/game'
import {
  HP_NANOSH_AUX_BASE,
  HP_NANOSH_MAIN_BASE,
  HP_NANOSH_OUTPOST,
  INITIAL_MORALE,
  INITIAL_NANOSH_SYMPATHY,
  MAX_MORALE,
  MAX_NANOSH_SYMPATHY,
} from '@nanosh/types/generic'
import type { ItemNames } from '@nanosh/types/item'
import type {
  Subsector,
  SubsectorNames,
  Supersector,
  SupersectorNames,
} from '@nanosh/types/sectors'
import seedrandom from 'seedrandom'
import { uuidv7 } from 'uuidv7'
import { GetRandomArray, GetRandomSet } from '../getRandomArray'
import { GetInitialCharacters } from './characters'
import {
  GetSectors,
  SubsectorNamesCollection,
  SupersectorNamesCollection,
} from './sectors'
import { GetInitialShip } from './ship'

export const GetInitialGame = (
  gameID: string = uuidv7(),
  invokeTime: number = new Date().getTime(),
): [Game | null, Error | null] => {
  // TODO: LOG GAME INIT

  const prng = seedrandom(`${gameID}-${invokeTime}`)
  const randomizedSupersectorNames = GetRandomArray(
    SupersectorNamesCollection,
    SupersectorNamesCollection.length + 1,
    prng,
  ) as SupersectorNames[]
  const randomizedSubsectorNames = GetRandomArray(
    SubsectorNamesCollection,
    SubsectorNamesCollection.length + 1,
    prng,
  ) as SubsectorNames[]

  const sectors = GetSectors()
  const nanoshMainBase = (
    GetRandomArray(SupersectorNamesCollection, 1, prng) as SupersectorNames[]
  )[0]
  const nanoshAuxBaseInitial = randomizedSupersectorNames[2]
  const nanoshOutpostSupersectors = GetRandomArray(
    SupersectorNamesCollection,
    3,
    prng,
  ) as SupersectorNames[]
  const nanoshOutposts: SubsectorNames[] = []
  nanoshOutpostSupersectors.forEach((supersectorName) => {
    const subsectors = (sectors.get(supersectorName) as Supersector).subsectors
    const outpostSubsector = GetRandomSet(
      subsectors,
      1,
      prng,
    ) as Set<SubsectorNames>
    const outpostSubsectorName = outpostSubsector.values().next()
      .value as SubsectorNames

    nanoshOutposts.push(outpostSubsectorName)
  })
  ;(sectors.get(nanoshMainBase) as Supersector).hp = HP_NANOSH_MAIN_BASE
  ;(sectors.get(nanoshAuxBaseInitial) as Supersector).hp = HP_NANOSH_AUX_BASE
  nanoshOutposts.forEach((outpost) => {
    ;(sectors.get(outpost) as Subsector).hp = HP_NANOSH_OUTPOST
  })

  const initialGame: Game = {
    id: gameID,
    day: 0,
    cycle: 0,
    ship: GetInitialShip({ type: 'griffin' }),
    morale: INITIAL_MORALE,
    maxMorale: MAX_MORALE,
    nanoshSympathy: INITIAL_NANOSH_SYMPATHY,
    maxNanoshSympathy: MAX_NANOSH_SYMPATHY,
    intel: {
      basic: 0,
      critical: 0,
    },
    characters: GetInitialCharacters(gameID, invokeTime),
    shipLocation: randomizedSupersectorNames[0],
    nanosh: {
      mainBase: nanoshMainBase,
      auxBase: new Set<SupersectorNames>([nanoshAuxBaseInitial]),
      outposts: new Set<SubsectorNames>(nanoshOutposts),
      advances: new Set<SubsectorNames>(),
      liberationPoints: new Set<SubsectorNames>(),
      destroyed: {
        outposts: new Set<SubsectorNames>(),
        auxBase: new Set<SupersectorNames>(),
      },
      assimilateEnabled: false,
    },
    subsectors: {
      empty: new Set<SubsectorNames>(randomizedSubsectorNames.slice(3)),
    },
    sectors,
    craftable: new Set<ItemNames>(),
    anyMap: new Map(),
  }

  return [initialGame, null]
}
