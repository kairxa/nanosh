package event

import (
	"sort"

	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
	"nanosh/nakama-modules/gamelogic/utils/wounds"
)

// HazardousTerrain - If blitzhopper: damage it by 1. Otherwise: wound 1-3 characters
func HazardousTerrain(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check if using blitzhopper
	if game.Expedition.CraftType == types.ExpoCraftBlitzhopper {
		// Damage blitzhopper by 1
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				craft.Health = max(0, craft.Health-1) // Don't go below 0
				break
			}
		}
		// No character wounds when blitzhopper takes the damage
		return game, nil
	}

	// Not using blitzhopper - wound 1-3 characters

	// Check expedition has members
	if len(game.Expedition.Members) == 0 {
		return nil, expeditionErrors.ErrNoExpeditionMembers
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Determine how many characters to wound (1-3)
	numToWound := dice.RollRange(prng, 1, 3)

	// Cap at number of members available
	numToWound = min(numToWound, len(game.Expedition.Members))

	// Convert members map to slice for random selection
	memberSlice := make([]types.CharacterName, 0, len(game.Expedition.Members))
	for charName := range game.Expedition.Members {
		memberSlice = append(memberSlice, charName)
	}

	// Sort for deterministic ordering (map iteration is random in Go)
	sort.Slice(memberSlice, func(i, j int) bool {
		return string(memberSlice[i]) < string(memberSlice[j])
	})

	// Randomly select members to wound
	selectedMembers := random.GetRandomArray(memberSlice, numToWound, prng)

	// Apply light wounds to selected members using utility that handles death
	for _, charName := range selectedMembers {
		// Use utility function that handles stacking, conversion, and death
		wounds.ApplyLightWoundWithDeath(game, charName, 1)
	}

	return game, nil
}
