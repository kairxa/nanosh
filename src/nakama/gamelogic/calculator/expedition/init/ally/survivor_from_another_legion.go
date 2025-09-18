package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
)

// SurvivorFromAnotherLegion - Gain 1 Praetorians
func SurvivorFromAnotherLegion(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Add 1 Praetorian to ship
	game.Ship.Praetorians += 1

	return game, nil
}
