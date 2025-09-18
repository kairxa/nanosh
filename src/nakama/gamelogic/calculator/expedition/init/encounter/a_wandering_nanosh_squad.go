package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// AWanderingNanoshSquad - Add 4-5 ground threat
func AWanderingNanoshSquad(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for ground threat increase (4-5)
	threatIncrease := dice.RollRange(prng, 4, 5)

	// Add ground threat to expedition
	game.Expedition.GroundThreat += threatIncrease

	return game, nil
}
