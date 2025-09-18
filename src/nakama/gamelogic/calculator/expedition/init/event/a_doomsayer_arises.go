package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
)

// ADoomsayerArises - Add 1 Nanosh Sympathy token
func ADoomsayerArises(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Add 1 Nanosh Sympathy, capped at max
	game.NanoshSympathy = min(game.NanoshSympathy+1, game.MaxNanoshSympathy)

	return game, nil
}
