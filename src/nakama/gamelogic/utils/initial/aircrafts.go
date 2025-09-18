package initial

import "nanosh/nakama-modules/gamelogic/types"

// Constants for aircraft health values
const BLITZHOPPER_MAX_HEALTH = 5

// GetInitialAircraftsParams defines parameters for getting initial aircrafts
type GetInitialAircraftsParams struct {
	ShipType types.ShipType `json:"shipType"`
}

// GetInitialFighterCrafts creates and returns a map of fighter crafts for a given ship type
// Defaults to griffin if no ship type provided
func GetInitialFighterCrafts(params *GetInitialAircraftsParams) map[int]*types.FighterCraft {
	// Default to griffin if no params provided
	if params == nil {
		params = &GetInitialAircraftsParams{ShipType: types.ShipGriffin}
	}

	fighterCrafts := make(map[int]*types.FighterCraft)

	switch params.ShipType {
	case types.ShipGriffin:
		// Griffin has 5 Buzzard fighters
		fighterCrafts[1] = &types.FighterCraft{
			Type:   types.FighterCraftBuzzard,
			Broken: false,
		}
		fighterCrafts[2] = &types.FighterCraft{
			Type:   types.FighterCraftBuzzard,
			Broken: false,
		}
		fighterCrafts[3] = &types.FighterCraft{
			Type:   types.FighterCraftBuzzard,
			Broken: false,
		}
		fighterCrafts[4] = &types.FighterCraft{
			Type:   types.FighterCraftBuzzard,
			Broken: false,
		}
		fighterCrafts[5] = &types.FighterCraft{
			Type:   types.FighterCraftBuzzard,
			Broken: false,
		}
	}

	return fighterCrafts
}

// GetInitialExpoCrafts creates and returns a map of expedition crafts for a given ship type
// Defaults to griffin if no ship type provided
func GetInitialExpoCrafts(params *GetInitialAircraftsParams) map[int]*types.ExpoCraft {
	// Default to griffin if no params provided
	if params == nil {
		params = &GetInitialAircraftsParams{ShipType: types.ShipGriffin}
	}

	expoCrafts := make(map[int]*types.ExpoCraft)

	switch params.ShipType {
	case types.ShipGriffin:
		// Griffin has 1 Blitzhopper and 1 Forthopper
		expoCrafts[1] = &types.ExpoCraft{
			Type:      types.ExpoCraftBlitzhopper,
			Health:    BLITZHOPPER_MAX_HEALTH,
			MaxHealth: BLITZHOPPER_MAX_HEALTH,
		}
		expoCrafts[2] = &types.ExpoCraft{
			Type:      types.ExpoCraftForthopper,
			Health:    BLITZHOPPER_MAX_HEALTH, // Note: TypeScript uses same health for both
			MaxHealth: BLITZHOPPER_MAX_HEALTH,
		}
	}

	return expoCrafts
}