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
import type {
  Subsector,
  SubsectorNames,
  Supersector,
  SupersectorNames,
} from '@nanosh/types/sectors'
import seedrandom from 'seedrandom'
import { uuidv7 } from 'uuidv7'
import { GetRandomArray } from '../getRandomArray'
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
    gameID,
    invokeTime,
  ) as SupersectorNames[]
  const randomizedSubsectorNames = GetRandomArray(
    SubsectorNamesCollection,
    SubsectorNamesCollection.length + 1,
    gameID,
    invokeTime,
  ) as SubsectorNames[]

  const nanoshMainBase =
    prng() < 0.1 ? randomizedSupersectorNames[0] : randomizedSupersectorNames[1]
  const nanoshAuxBaseInitial = randomizedSupersectorNames[2]
  const nanoshOutposts = randomizedSubsectorNames.slice(0, 3)
  const sectors = GetSectors()
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
    characters: GetInitialCharacters(),
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
    },
    subsectors: {
      empty: new Set<SubsectorNames>(randomizedSubsectorNames.slice(3)),
    },
    sectors,
    anyMap: new Map(),
  }

  return [initialGame, null]
}
