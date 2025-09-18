package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestNanoshScraps(t *testing.T) {
	t.Run("should add 12-24 Supplies", func(t *testing.T) {
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

		// Record initial supplies
		initialSupplies := game.Ship.Supplies

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := NanoshScraps(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check supplies increased by 12-24
		suppliesGain := result.Ship.Supplies - initialSupplies
		if suppliesGain < 12 || suppliesGain > 24 {
			t.Errorf("Expected supplies gain between 12-24, got %d", suppliesGain)
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

		_, err = NanoshScraps(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical games
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		expedition1 := &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}
		expedition2 := &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		game1.Expedition = expedition1
		game2.Expedition = expedition2

		// Same seed parameters
		gameID := "test-deterministic"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := NanoshScraps(game1, gameID, invokeTime, username)
		result2, _ := NanoshScraps(game2, gameID, invokeTime, username)

		// Should have identical supplies gain
		if result1.Ship.Supplies != result2.Ship.Supplies {
			t.Errorf("Expected deterministic results, got %d and %d supplies",
				result1.Ship.Supplies, result2.Ship.Supplies)
		}
	})

	t.Run("should have varied results across range", func(t *testing.T) {
		// Test multiple times with different seeds to ensure we get different values
		suppliesResults := make(map[int]bool)

		for i := 0; i < 50; i++ {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialSupplies := game.Ship.Supplies
			gameID := "test-variety"
			invokeTime := int64(i * 1000) // Different invoke times for variety
			username := "test-user"

			result, _ := NanoshScraps(game, gameID, invokeTime, username)
			suppliesGain := result.Ship.Supplies - initialSupplies
			suppliesResults[suppliesGain] = true
		}

		// Should have at least some variety (not all the same value)
		if len(suppliesResults) < 3 {
			t.Errorf("Expected variety in supplies gain, only got values: %v", suppliesResults)
		}

		// All results should be within range
		for gain := range suppliesResults {
			if gain < 12 || gain > 24 {
				t.Errorf("Supplies gain %d outside expected range 12-24", gain)
			}
		}
	})

	t.Run("should stack with existing supplies", func(t *testing.T) {
		// Test that it adds to existing supplies rather than replacing
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Set initial supplies to non-zero value
		game.Ship.Supplies = 50
		initialSupplies := game.Ship.Supplies

		result, _ := NanoshScraps(game, "test", int64(1000), "user")

		// Final supplies should be initial + gain, not just gain
		if result.Ship.Supplies <= initialSupplies {
			t.Errorf("Expected supplies to increase from %d, got %d",
				initialSupplies, result.Ship.Supplies)
		}

		// The gain should still be in expected range
		gain := result.Ship.Supplies - initialSupplies
		if gain < 12 || gain > 24 {
			t.Errorf("Expected gain 12-24, got %d", gain)
		}
	})
}