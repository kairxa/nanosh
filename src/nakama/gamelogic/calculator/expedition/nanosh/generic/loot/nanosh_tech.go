package loot

import (
	"errors"

	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// NanoshTech - Add 1 Nanosh Datapad to ship cargo
func NanoshTech(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check if cargo has space
	if len(game.Ship.Cargo) >= game.Ship.MaxCargoSize {
		return nil, errors.New("ship cargo is full")
	}

	// Create deterministic PRNG for item ID
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Generate unique item ID
	itemID := random.GetRandomString(types.ITEM_ID_LENGTH, prng)

	// Add Nanosh Datapad to cargo
	game.Ship.Cargo[itemID] = &types.ShipCargo{
		ID:       itemID,
		ItemName: types.ItemMiscNanoshDatapad,
		Broken:   false,
	}

	return game, nil
}
