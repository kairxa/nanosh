import type { ExpoCraft, FighterCraft, ShipTypes } from '../../types/ship'

export interface GetInitialAircraftsParams {
  shipType: ShipTypes
}

export const GetInitialFighterCrafts = (
  { shipType }: GetInitialAircraftsParams = { shipType: 'griffin' },
): Map<number, FighterCraft> => {
  const fighterCrafts = new Map<number, FighterCraft>()

  switch (shipType) {
    case 'griffin':
      fighterCrafts.set(1, { type: 'buzzard', broken: [] })
      fighterCrafts.set(2, { type: 'buzzard', broken: [] })
      fighterCrafts.set(3, { type: 'buzzard', broken: [] })
      fighterCrafts.set(4, { type: 'buzzard', broken: [] })
      fighterCrafts.set(5, { type: 'buzzard', broken: [] })
      break
  }

  return fighterCrafts
}

const BLITZHOPPER_MAX_HEALTH = 5
export const GetInitialExpoCrafts = (
  { shipType }: GetInitialAircraftsParams = { shipType: 'griffin' },
) => {
  const expoCrafts = new Map<number, ExpoCraft>()

  switch (shipType) {
    case 'griffin':
      expoCrafts.set(1, {
        type: 'blitzhopper',
        health: BLITZHOPPER_MAX_HEALTH,
        maxHealth: BLITZHOPPER_MAX_HEALTH,
      })
      expoCrafts.set(2, {
        type: 'forthopper',
        health: BLITZHOPPER_MAX_HEALTH,
        maxHealth: BLITZHOPPER_MAX_HEALTH,
      })
      break
  }

  return expoCrafts
}
