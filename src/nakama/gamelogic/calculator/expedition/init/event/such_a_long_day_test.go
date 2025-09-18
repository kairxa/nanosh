package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestSuchALongDay(t *testing.T) {
	t.Run("should add attrition to 1-2 expedition members", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with members
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
				types.CharacterMomoTzigane: true,
				types.CharacterVal:         true,
			},
		}

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SuchALongDay(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Count how many characters got attrition
		attritionCount := 0
		for charName := range game.Expedition.Members {
			if char, exists := result.Characters[charName]; exists {
				if modifier, hasAttrition := char.Modifiers[types.ModifierCharacterPersistentAttrition]; hasAttrition {
					if modifier.Amount > 0 {
						attritionCount++
					}
				}
			}
		}

		// Should affect 1-2 members
		if attritionCount < 1 || attritionCount > 2 {
			t.Errorf("Expected 1-2 characters with attrition, got %d", attritionCount)
		}
	})

	t.Run("should stack attrition if character already has it", func(t *testing.T) {
		// Create game with character already having attrition
		game, _ := initial.GetInitialGame(nil)

		// Add expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Give Solas existing attrition
		if char, exists := game.Characters[types.CharacterSolasMercer]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterPersistentAttrition] = &types.ModifierTracker{
				Amount:     2,
				Persistent: true,
			}
		}

		// Apply card (with seed that will select Solas)
		gameID := "test-game-single"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SuchALongDay(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check attrition increased
		if char, exists := result.Characters[types.CharacterSolasMercer]; exists {
			if modifier, hasAttrition := char.Modifiers[types.ModifierCharacterPersistentAttrition]; hasAttrition {
				if modifier.Amount != 3 {
					t.Errorf("Expected attrition to stack to 3, got %d", modifier.Amount)
				}
			} else {
				t.Error("Character should still have attrition modifier")
			}
		}
	})

	t.Run("should return error when no expedition active", func(t *testing.T) {
		// Create game without expedition
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Try to apply card without expedition
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err = SuchALongDay(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should return error when expedition has no members", func(t *testing.T) {
		// Create game with empty expedition
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members:       map[types.CharacterName]bool{}, // Empty!
		}

		// Try to apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err := SuchALongDay(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoExpeditionMembers {
			t.Errorf("Expected ErrNoExpeditionMembers, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical game states
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		// Add identical expeditions
		members := map[types.CharacterName]bool{
			types.CharacterSolasMercer: true,
			types.CharacterMomoTzigane: true,
			types.CharacterVal:         true,
			types.CharacterNiralPierce: true,
		}

		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members:       members,
		}
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members:       members,
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := SuchALongDay(game1, gameID, invokeTime, username)
		result2, _ := SuchALongDay(game2, gameID, invokeTime, username)

		// Should affect same characters
		for charName := range members {
			char1 := result1.Characters[charName]
			char2 := result2.Characters[charName]

			mod1, has1 := char1.Modifiers[types.ModifierCharacterPersistentAttrition]
			mod2, has2 := char2.Modifiers[types.ModifierCharacterPersistentAttrition]

			if has1 != has2 {
				t.Errorf("Character %s: inconsistent attrition assignment", charName)
			}
			if has1 && has2 && mod1.Amount != mod2.Amount {
				t.Errorf("Character %s: different attrition amounts %d vs %d",
					charName, mod1.Amount, mod2.Amount)
			}
		}
	})

	t.Run("should handle single member expedition", func(t *testing.T) {
		// Create game with only one expedition member
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SuchALongDay(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should give attrition to the only member
		if char, exists := result.Characters[types.CharacterSolasMercer]; exists {
			if modifier, hasAttrition := char.Modifiers[types.ModifierCharacterPersistentAttrition]; hasAttrition {
				if modifier.Amount != 1 {
					t.Errorf("Single member should get 1 attrition, got %d", modifier.Amount)
				}
			} else {
				t.Error("Single member should have gotten attrition")
			}
		}
	})
}
