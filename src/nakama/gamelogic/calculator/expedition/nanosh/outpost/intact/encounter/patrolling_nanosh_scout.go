package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// PatrollingNanoshScout - Add 1-2 ground threat
func PatrollingNanoshScout(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for threat increase (1-2)
	threatIncrease := dice.RollRange(prng, 1, 2)

	// Add to ground threat
	game.Expedition.GroundThreat += threatIncrease

	return game, nil
}