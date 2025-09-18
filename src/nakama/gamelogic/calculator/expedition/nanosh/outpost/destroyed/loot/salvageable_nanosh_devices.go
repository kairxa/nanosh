package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// SalvageableNanoshDevices - Gain 3-9 eCells
func SalvageableNanoshDevices(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for eCells gain (3-9)
	eCellsGain := dice.RollRange(prng, 3, 9)

	// Add eCells to ship
	game.Ship.ECells += eCellsGain

	return game, nil
}