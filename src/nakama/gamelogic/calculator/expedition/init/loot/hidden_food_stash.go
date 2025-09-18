package loot

import (
	"fmt"
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// HiddenFoodStash - Gain 3-4 random food items
func HiddenFoodStash(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for number of food items (3-4)
	numItems := dice.RollRange(prng, 3, 4)

	// Define all food items
	foodItems := []types.ItemName{
		types.ItemFoodAstrotatoFries,
		types.ItemFoodFrisbread,
		types.ItemFoodFrostberry,
		types.ItemFoodGlownana,
		types.ItemFoodGourmetPack,
		types.ItemFoodLightspeedRamen,
		types.ItemFoodVoidplum,
		types.ItemFoodZinglime,
	}

	// Check if enough cargo space
	currentCargoSize := len(game.Ship.Cargo)
	availableSpace := game.Ship.MaxCargoSize - currentCargoSize
	if availableSpace < numItems {
		return nil, fmt.Errorf("not enough cargo space: need %d, have %d", numItems, availableSpace)
	}

	// Add random food items to cargo
	for range numItems {
		// Pick random food item
		foodIndex := prng.Intn(len(foodItems))
		selectedFood := foodItems[foodIndex]

		// Generate unique item ID using PRNG (8 chars)
		itemID := random.GetRandomString(8, prng)

		// Add to cargo
		game.Ship.Cargo[itemID] = &types.ShipCargo{
			ID:       itemID,
			ItemName: selectedFood,
			Broken:   false,
		}
	}

	return game, nil
}
