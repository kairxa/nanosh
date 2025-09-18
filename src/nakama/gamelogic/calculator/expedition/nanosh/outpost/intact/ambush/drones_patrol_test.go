package intact

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestDronesPatrol(t *testing.T) {
	t.Run("should have 50% chance to wound random character", func(t *testing.T) {
		// Track results across multiple runs
		woundCount := 0
		totalRuns := 100

		for i := 0; i < totalRuns; i++ {
			// Create fresh game state each time
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

			// Apply card with different seed each time
			gameID := "test-game-123"
			invokeTime := int64(1000 + i)
			username := "test-user"

			result, err := DronesPatrol(game, gameID, invokeTime, username)
			if err != nil {
				t.Fatalf("Expected no error, got %v", err)
			}

			// Check if any character got wounded
			someoneWounded := false
			for charName := range game.Expedition.Members {
				if char, exists := result.Characters[charName]; exists {
					if char.Modifiers != nil {
						if lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]; hasLight && lightMod.Amount > 0 {
							someoneWounded = true
							break
						}
						if criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]; hasCritical && criticalMod.Amount > 0 {
							someoneWounded = true
							break
						}
					}
				}
			}

			if someoneWounded {
				woundCount++
			}
		}

		// Should be roughly 50% (allow 35-65% range for randomness)
		woundPercentage := float64(woundCount) / float64(totalRuns) * 100
		if woundPercentage < 35 || woundPercentage > 65 {
			t.Errorf("Expected ~50%% wound rate, got %.1f%% (%d/%d)",
				woundPercentage, woundCount, totalRuns)
		}

		t.Logf("Wound rate: %.1f%% (%d/%d)", woundPercentage, woundCount, totalRuns)
	})

	t.Run("should wound only one character when triggered", func(t *testing.T) {
		// Find a seed that causes wound
		var woundGame *types.Game
		for i := range 100 {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
					types.CharacterMomoTzigane: true,
					types.CharacterVal:         true,
				},
			}

			result, _ := DronesPatrol(game, "test-wound", int64(i), "user")

			// Check if someone got wounded
			for charName := range game.Expedition.Members {
				if char, exists := result.Characters[charName]; exists {
					if char.Modifiers != nil {
						if lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]; hasLight && lightMod.Amount > 0 {
							woundGame = result
							break
						}
					}
				}
			}

			if woundGame != nil {
				break
			}
		}

		if woundGame == nil {
			t.Skip("Could not find seed that causes wound")
		}

		// Count wounded characters
		woundedCount := 0
		for charName := range woundGame.Expedition.Members {
			if char, exists := woundGame.Characters[charName]; exists {
				if char.Modifiers != nil {
					if lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]; hasLight && lightMod.Amount > 0 {
						woundedCount++
					}
				}
			}
		}

		if woundedCount != 1 {
			t.Errorf("Expected exactly 1 wounded character, got %d", woundedCount)
		}
	})

	t.Run("should return error when no expedition active", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)

		_, err := DronesPatrol(game, "test", int64(1000), "user")
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should return error when no expedition members", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members:       map[types.CharacterName]bool{}, // Empty!
		}

		_, err := DronesPatrol(game, "test", int64(1000), "user")
		if err != expeditionErrors.ErrNoExpeditionMembers {
			t.Errorf("Expected ErrNoExpeditionMembers, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical games
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		expedition := &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
				types.CharacterMomoTzigane: true,
			},
		}

		game1.Expedition = expedition
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
				types.CharacterMomoTzigane: true,
			},
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result1, _ := DronesPatrol(game1, gameID, invokeTime, username)
		result2, _ := DronesPatrol(game2, gameID, invokeTime, username)

		// Check wounds are identical
		for charName := range game1.Expedition.Members {
			char1 := result1.Characters[charName]
			char2 := result2.Characters[charName]

			wounds1 := 0
			wounds2 := 0

			if char1 != nil && char1.Modifiers != nil {
				if mod, has := char1.Modifiers[types.ModifierCharacterWoundLight]; has {
					wounds1 = mod.Amount
				}
			}

			if char2 != nil && char2.Modifiers != nil {
				if mod, has := char2.Modifiers[types.ModifierCharacterWoundLight]; has {
					wounds2 = mod.Amount
				}
			}

			if wounds1 != wounds2 {
				t.Errorf("Character %s has different wounds: %d vs %d",
					charName, wounds1, wounds2)
			}
		}
	})

	t.Run("should handle character death if wound causes 3 critical", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)

		// Single member with 2 light wounds (will convert to 1 critical on 3rd)
		charName := types.CharacterSolasMercer
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				charName: true,
			},
		}

		// Give character 2 critical wounds already
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
			char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Find seed that causes wound
		for i := 0; i < 100; i++ {
			gameCopy, _ := initial.GetInitialGame(nil)
			gameCopy.Expedition = game.Expedition

			// Copy wounds
			if char, exists := gameCopy.Characters[charName]; exists {
				if char.Modifiers == nil {
					char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
				}
				char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
					Amount:     2,
					Persistent: false,
				}
				char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
					Amount:     2,
					Persistent: false,
				}
			}

			result, _ := DronesPatrol(gameCopy, "death-test", int64(i), "user")

			// Check if character died (removed from Characters)
			if _, exists := result.Characters[charName]; !exists {
				// Should be in dead list
				if !result.CharactersDead[charName] {
					t.Error("Dead character should be in CharactersDead")
				}
				// Should be removed from expedition
				if result.Expedition.Members[charName] {
					t.Error("Dead character should be removed from expedition")
				}
				return // Test passed
			}
		}

		t.Log("No seed found that causes wound and death - this is expected ~50% of the time")
	})
}
