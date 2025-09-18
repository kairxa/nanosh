package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// NanoshScraps - Gain 12-24 Supplies
func NanoshScraps(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for supplies gain (12-24)
	suppliesGain := dice.RollRange(prng, 12, 24)

	// Add supplies to ship
	game.Ship.Supplies += suppliesGain

	return game, nil
}
