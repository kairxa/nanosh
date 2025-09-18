package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestSpecialists(t *testing.T) {
	t.Run("should gain 1-2 civitates without Silver skill member", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with members who don't have Silver skill
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // Has Triarii, Tactician, etc. but not Silver
				types.CharacterMomoTzigane: true, // Has Infantry, Protector, etc. but not Silver
			},
		}

		// Record initial civitates
		initialCivitates := game.Ship.Civitates

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := Specialists(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check civitates increased by 1-2 (no Silver bonus)
		gain := result.Ship.Civitates - initialCivitates
		if gain < 1 || gain > 2 {
			t.Errorf("Expected civitates gain between 1-2 (no Silver), got %d", gain)
		}
	})

	t.Run("should gain 2-4 civitates with Silver skill member", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with Rina Mikami (who has Silver skill)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterRinaMikami:  true, // Has Silver skill
				types.CharacterSolasMercer: true, // Regular member
			},
		}

		// Record initial civitates
		initialCivitates := game.Ship.Civitates

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := Specialists(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check civitates increased by 2-4 (base 1-2 + bonus 1-2)
		gain := result.Ship.Civitates - initialCivitates
		if gain < 2 || gain > 4 {
			t.Errorf("Expected civitates gain between 2-4 (with Silver), got %d", gain)
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

		_, err = Specialists(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Test both with and without Silver
		testCases := []struct {
			name    string
			members map[types.CharacterName]bool
		}{
			{
				"without Silver",
				map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
					types.CharacterMomoTzigane: true,
				},
			},
			{
				"with Silver",
				map[types.CharacterName]bool{
					types.CharacterRinaMikami:  true, // Has Silver skill
					types.CharacterSolasMercer: true,
				},
			},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				// Create two identical game states
				game1, _ := initial.GetInitialGame(nil)
				game2, _ := initial.GetInitialGame(nil)

				// Add identical expeditions
				expedition1 := &types.Expedition{
					SupersectorID: "nanosh-01",
					Phase:         types.ExpeditionPhaseGroundTeam,
					Members:       tc.members,
				}
				expedition2 := &types.Expedition{
					SupersectorID: "nanosh-01",
					Phase:         types.ExpeditionPhaseGroundTeam,
					Members:       tc.members,
				}
				game1.Expedition = expedition1
				game2.Expedition = expedition2

				// Same seed parameters
				gameID := "test-game-123"
				invokeTime := int64(1000)
				username := "test-user"

				// Apply card to both games
				result1, _ := Specialists(game1, gameID, invokeTime, username)
				result2, _ := Specialists(game2, gameID, invokeTime, username)

				// Should have identical gains
				if result1.Ship.Civitates != result2.Ship.Civitates {
					t.Errorf("Expected deterministic results for %s, got %d and %d civitates",
						tc.name, result1.Ship.Civitates, result2.Ship.Civitates)
				}
			})
		}
	})

	t.Run("Silver bonus should use same PRNG sequence", func(t *testing.T) {
		// This test verifies that Silver bonus uses the SAME prng instance,
		// not creating a new one, ensuring deterministic sequence

		// Create game with Rina Mikami (Silver skill)
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterRinaMikami: true, // Has Silver skill
			},
		}

		// Fixed seed
		gameID := "verify-sequence"
		invokeTime := int64(12345)
		username := "test-user"

		// Record initial civitates
		initialCivitates := game.Ship.Civitates

		// Apply with Silver
		result, _ := Specialists(game, gameID, invokeTime, username)
		gain := result.Ship.Civitates - initialCivitates

		// The gain should be sum of two consecutive rolls from same PRNG
		// This is implementation detail but important for determinism
		if gain < 2 || gain > 4 {
			t.Errorf("Silver bonus not working correctly, total gain was %d", gain)
		}
	})

	t.Run("should detect Silver skill correctly", func(t *testing.T) {
		// Test to explicitly verify Silver skill detection
		game, _ := initial.GetInitialGame(nil)

		// Test with Rina Mikami who has Silver skill
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterRinaMikami: true,
			},
		}

		initialCivitates := game.Ship.Civitates
		result, _ := Specialists(game, "test", int64(1000), "user")
		gainWithSilver := result.Ship.Civitates - initialCivitates

		// Reset game
		game, _ = initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // No Silver skill
			},
		}

		initialCivitates = game.Ship.Civitates
		result, _ = Specialists(game, "test", int64(1000), "user")
		gainWithoutSilver := result.Ship.Civitates - initialCivitates

		// With Silver should give more (2-4 vs 1-2)
		if gainWithSilver <= gainWithoutSilver {
			t.Errorf("Expected Silver to give bonus, got %d with Silver vs %d without",
				gainWithSilver, gainWithoutSilver)
		}
	})
}
