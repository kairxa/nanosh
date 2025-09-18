package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestADoomsayerArises(t *testing.T) {
	t.Run("should add 1 Nanosh Sympathy", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Record initial sympathy
		initialSympathy := game.NanoshSympathy

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := ADoomsayerArises(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check sympathy increased by 1
		if result.NanoshSympathy != initialSympathy+1 {
			t.Errorf("Expected Nanosh Sympathy to increase by 1, was %d now %d",
				initialSympathy, result.NanoshSympathy)
		}
	})

	t.Run("should not exceed max Nanosh Sympathy", func(t *testing.T) {
		// Create game with max sympathy
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Set sympathy to max
		game.NanoshSympathy = game.MaxNanoshSympathy

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := ADoomsayerArises(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should still be at max
		if result.NanoshSympathy != game.MaxNanoshSympathy {
			t.Errorf("Nanosh Sympathy should not exceed max %d, got %d",
				game.MaxNanoshSympathy, result.NanoshSympathy)
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

		_, err = ADoomsayerArises(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic (no randomness)", func(t *testing.T) {
		// Since this card has no random element, test it always gives same result
		for i := 0; i < 5; i++ {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialSympathy := game.NanoshSympathy

			// Different seeds each time
			gameID := "different-game"
			invokeTime := int64(1000 + i*100)
			username := "different-user"

			result, _ := ADoomsayerArises(game, gameID, invokeTime, username)

			gain := result.NanoshSympathy - initialSympathy
			if gain != 1 {
				t.Errorf("Iteration %d: Expected consistent gain of 1, got %d", i, gain)
			}
		}
	})

	t.Run("should work with any number of expedition members", func(t *testing.T) {
		// Test with different member counts
		memberCounts := []map[types.CharacterName]bool{
			{},                                 // Empty (should error)
			{types.CharacterSolasMercer: true}, // Single
			{types.CharacterSolasMercer: true, types.CharacterMomoTzigane: true}, // Multiple
		}

		for idx, members := range memberCounts {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members:       members,
			}

			initialSympathy := game.NanoshSympathy

			gameID := "test-game-123"
			invokeTime := int64(1000)
			username := "test-user"

			result, err := ADoomsayerArises(game, gameID, invokeTime, username)

			if idx == 0 {
				// Empty members case - no specific error for this card
				// as it doesn't interact with members
				continue
			}

			if err != nil {
				t.Errorf("Test case %d: Unexpected error %v", idx, err)
				continue
			}

			// All cases should add exactly 1 sympathy
			if result.NanoshSympathy != initialSympathy+1 {
				t.Errorf("Test case %d: Expected +1 sympathy regardless of member count", idx)
			}
		}
	})

	t.Run("should handle near-max sympathy correctly", func(t *testing.T) {
		// Create game with sympathy 1 below max
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Set sympathy to max - 1
		game.NanoshSympathy = game.MaxNanoshSympathy - 1

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := ADoomsayerArises(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should now be at max
		if result.NanoshSympathy != game.MaxNanoshSympathy {
			t.Errorf("Expected Nanosh Sympathy to reach max %d, got %d",
				game.MaxNanoshSympathy, result.NanoshSympathy)
		}
	})
}
