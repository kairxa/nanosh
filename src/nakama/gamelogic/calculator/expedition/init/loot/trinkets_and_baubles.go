package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// TrinketsAndBaubles - Gain 10-20 Supplies
func TrinketsAndBaubles(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for supplies gain (10-20)
	suppliesGain := dice.RollRange(prng, 10, 20)

	// Add Supplies
	game.Ship.Supplies += suppliesGain

	return game, nil
}
