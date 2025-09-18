package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestHazardousTerrain(t *testing.T) {
	t.Run("should damage blitzhopper when using blitzhopper", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with blitzhopper
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftBlitzhopper,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
				types.CharacterMomoTzigane: true,
			},
		}

		// Get blitzhopper initial health (assuming it exists)
		var initialHealth int
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				initialHealth = craft.Health
				break
			}
		}

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check blitzhopper health decreased by 1
		var finalHealth int
		for _, craft := range result.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				finalHealth = craft.Health
				break
			}
		}

		if finalHealth != initialHealth-1 {
			t.Errorf("Expected blitzhopper health to decrease by 1, was %d now %d",
				initialHealth, finalHealth)
		}

		// Check no characters got wounds
		for charName := range game.Expedition.Members {
			if char, exists := result.Characters[charName]; exists {
				if _, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
					t.Error("Characters should not get wounds when blitzhopper present")
				}
			}
		}
	})

	t.Run("should wound 1-3 characters when using forthopper", func(t *testing.T) {
		// Create initial game state
		game, _ := initial.GetInitialGame(nil)

		// Add expedition with forthopper (not blitzhopper)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
				types.CharacterMomoTzigane: true,
				types.CharacterVal:         true,
				types.CharacterNiralPierce: true,
			},
		}

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Count how many characters got wounded
		woundCount := 0
		for charName := range game.Expedition.Members {
			if char, exists := result.Characters[charName]; exists {
				if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
					if modifier.Amount > 0 {
						woundCount++
					}
				}
			}
		}

		// Should wound 1-3 members
		if woundCount < 1 || woundCount > 3 {
			t.Errorf("Expected 1-3 characters with wounds, got %d", woundCount)
		}

		// Check forthopper not damaged
		for _, craft := range result.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftForthopper {
				// Forthopper should have full health still
				if craft.Health != craft.MaxHealth {
					t.Error("Forthopper should not be damaged")
				}
			}
		}
	})

	t.Run("should stack wounds if character already wounded", func(t *testing.T) {
		// Create game with wounded character
		game, _ := initial.GetInitialGame(nil)

		// Add expedition without blitzhopper
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Give Solas existing light wound
		if char, exists := game.Characters[types.CharacterSolasMercer]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
				Amount:     1,
				Persistent: false,
			}
		}

		// Apply card
		gameID := "test-game-single"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check wounds stacked
		if char, exists := result.Characters[types.CharacterSolasMercer]; exists {
			if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
				if modifier.Amount != 2 {
					t.Errorf("Expected wounds to stack to 2, got %d", modifier.Amount)
				}
			} else {
				t.Error("Character should still have wound modifier")
			}
		}
	})

	t.Run("should convert 3 light wounds to 1 critical wound", func(t *testing.T) {
		// Create game with character having 2 light wounds
		game, _ := initial.GetInitialGame(nil)

		// Add expedition without blitzhopper
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Give Solas 2 existing light wounds
		if char, exists := game.Characters[types.CharacterSolasMercer]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Apply card (will add 1 more wound, totaling 3)
		gameID := "test-game-convert"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check wounds converted to critical
		if char, exists := result.Characters[types.CharacterSolasMercer]; exists {
			// Should have no light wounds
			if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
				t.Errorf("Expected no light wounds after conversion, got %d", modifier.Amount)
			}

			// Should have 1 critical wound
			if modifier, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]; hasCritical {
				if modifier.Amount != 1 {
					t.Errorf("Expected 1 critical wound, got %d", modifier.Amount)
				}
			} else {
				t.Error("Character should have critical wound after conversion")
			}
		}
	})

	t.Run("should return error when no expedition active", func(t *testing.T) {
		// Create game without expedition
		game, _ := initial.GetInitialGame(nil)

		// Try to apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should return error when no expedition members and no blitzhopper", func(t *testing.T) {
		// Create game with empty expedition and no blitzhopper
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members:       map[types.CharacterName]bool{}, // Empty!
		}

		// Try to apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoExpeditionMembers {
			t.Errorf("Expected ErrNoExpeditionMembers, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical game states
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		// Add identical expeditions without blitzhopper
		members := map[types.CharacterName]bool{
			types.CharacterSolasMercer: true,
			types.CharacterMomoTzigane: true,
			types.CharacterVal:         true,
			types.CharacterNiralPierce: true,
		}

		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members:       members,
		}
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members:       members,
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := HazardousTerrain(game1, gameID, invokeTime, username)
		result2, _ := HazardousTerrain(game2, gameID, invokeTime, username)

		// Should affect same characters
		for charName := range members {
			char1 := result1.Characters[charName]
			char2 := result2.Characters[charName]

			mod1, has1 := char1.Modifiers[types.ModifierCharacterWoundLight]
			mod2, has2 := char2.Modifiers[types.ModifierCharacterWoundLight]

			if has1 != has2 {
				t.Errorf("Character %s: inconsistent wound assignment", charName)
			}
			if has1 && has2 && mod1.Amount != mod2.Amount {
				t.Errorf("Character %s: different wound amounts %d vs %d",
					charName, mod1.Amount, mod2.Amount)
			}
		}
	})

	t.Run("should handle single member expedition without blitzhopper", func(t *testing.T) {
		// Create game with only one expedition member
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			CraftType:     types.ExpoCraftForthopper,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HazardousTerrain(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should give wound to the only member
		if char, exists := result.Characters[types.CharacterSolasMercer]; exists {
			if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
				if modifier.Amount != 1 {
					t.Errorf("Single member should get 1 wound, got %d", modifier.Amount)
				}
			} else {
				t.Error("Single member should have gotten wound")
			}
		}
	})
}
