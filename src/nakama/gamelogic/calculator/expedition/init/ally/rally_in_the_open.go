package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// RallyInTheOpen - Gain 1 Praetorians, +1-2 civitates if hasSilver
func RallyInTheOpen(game *types.Game, gameID string, invokeTime int64, username string, hasSilver bool) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Add 1 Praetorian to ship
	game.Ship.Praetorians += 1

	// If has Silver skill, also gain 1-2 civitates
	if hasSilver {
		// Create deterministic PRNG using standard pattern
		prng := random.CreateSeededPRNG(gameID, invokeTime, username)

		// Roll for bonus civitates (1-2)
		civitatesGain := dice.RollRange(prng, 1, 2)
		game.Ship.Civitates += civitatesGain
	}

	return game, nil
}
