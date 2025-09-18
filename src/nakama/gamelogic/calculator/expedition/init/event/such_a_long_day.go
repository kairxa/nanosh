package event

import (
	"sort"

	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// SuchALongDay - Add 1 attrition to 1-2 expedition members
func SuchALongDay(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check expedition has members
	if len(game.Expedition.Members) == 0 {
		return nil, expeditionErrors.ErrNoExpeditionMembers
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Determine how many characters to affect (1-2)
	numToAffect := dice.RollRange(prng, 1, 2)

	// Cap at number of members available
	numToAffect = min(numToAffect, len(game.Expedition.Members))

	// Convert members map to slice for random selection
	memberSlice := make([]types.CharacterName, 0, len(game.Expedition.Members))
	for charName := range game.Expedition.Members {
		memberSlice = append(memberSlice, charName)
	}

	// Sort for deterministic ordering (map iteration is random in Go)
	sort.Slice(memberSlice, func(i, j int) bool {
		return string(memberSlice[i]) < string(memberSlice[j])
	})

	// Randomly select members to affect
	selectedMembers := random.GetRandomArray(memberSlice, numToAffect, prng)

	// Apply attrition to selected members
	for _, charName := range selectedMembers {
		if char, exists := game.Characters[charName]; exists {
			// Initialize modifiers map if nil
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}

			// Add or stack attrition
			if modifier, hasAttrition := char.Modifiers[types.ModifierCharacterPersistentAttrition]; hasAttrition {
				// Stack on existing attrition
				modifier.Amount += 1
			} else {
				// Add new attrition modifier
				char.Modifiers[types.ModifierCharacterPersistentAttrition] = &types.ModifierTracker{
					Amount:     1,
					Persistent: true,
				}
			}
		}
	}

	return game, nil
}
