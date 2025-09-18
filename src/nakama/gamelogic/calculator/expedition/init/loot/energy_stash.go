package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// EnergyStash - Gain 3-6 eCells
func EnergyStash(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for eCells gain (3-6)
	eCellsGain := dice.RollRange(prng, 3, 6)

	// Add eCells
	game.Ship.ECells += eCellsGain

	return game, nil
}
