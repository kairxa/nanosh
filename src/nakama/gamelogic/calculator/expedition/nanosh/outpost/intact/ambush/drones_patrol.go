package intact

import (
	"sort"

	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/random"
	"nanosh/nakama-modules/gamelogic/utils/wounds"
)

// DronesPatrol - 50% chance to inflict 1 light wound to a random character
func DronesPatrol(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check expedition has members
	if len(game.Expedition.Members) == 0 {
		return nil, expeditionErrors.ErrNoExpeditionMembers
	}

	// Create deterministic PRNG
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// 50% chance to wound
	if prng.Float64() >= 0.5 {
		// No wound this time
		return game, nil
	}

	// Convert members to slice for random selection
	memberSlice := make([]types.CharacterName, 0, len(game.Expedition.Members))
	for charName := range game.Expedition.Members {
		memberSlice = append(memberSlice, charName)
	}

	// Sort for deterministic ordering
	sort.Slice(memberSlice, func(i, j int) bool {
		return string(memberSlice[i]) < string(memberSlice[j])
	})

	// Select random member to wound
	selectedIndex := prng.Intn(len(memberSlice))
	selectedMember := memberSlice[selectedIndex]

	// Apply light wound with death checking
	wounds.ApplyLightWoundWithDeath(game, selectedMember, 1)

	return game, nil
}