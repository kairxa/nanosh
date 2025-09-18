package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestHopefulRefugees(t *testing.T) {
	t.Run("should gain 3-6 civitates", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition to game (required for card to work)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
		}

		// Record initial civitates
		initialCivitates := game.Ship.Civitates

		// Apply card effect with fixed seed for deterministic testing
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HopefulRefugees(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check civitates increased by 3-6
		gain := result.Ship.Civitates - initialCivitates
		if gain < 3 || gain > 6 {
			t.Errorf("Expected civitates gain between 3-6, got %d", gain)
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

		_, err = HopefulRefugees(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical game states
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		// Add identical expeditions
		expedition := &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
		}
		game1.Expedition = expedition
		game2.Expedition = expedition

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := HopefulRefugees(game1, gameID, invokeTime, username)
		result2, _ := HopefulRefugees(game2, gameID, invokeTime, username)

		// Should have identical gains
		if result1.Ship.Civitates != result2.Ship.Civitates {
			t.Errorf("Expected deterministic results, got %d and %d civitates",
				result1.Ship.Civitates, result2.Ship.Civitates)
		}
	})

	t.Run("should have different results with different seeds", func(t *testing.T) {
		// Create two game states
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		// Add expeditions
		expedition := &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
		}
		game1.Expedition = expedition
		game2.Expedition = expedition

		// Different invoke times
		gameID := "test-game-123"
		username := "test-user"

		result1, _ := HopefulRefugees(game1, gameID, 1000, username)
		result2, _ := HopefulRefugees(game2, gameID, 2000, username) // Different time

		// Very likely to have different results
		// (Small chance of same result since range is only 3-6)
		if result1.Ship.Civitates == result2.Ship.Civitates {
			// Run multiple times to be sure
			differentCount := 0
			for i := int64(3000); i < 3010; i++ {
				game3, _ := initial.GetInitialGame(nil)
				game3.Expedition = expedition
				result3, _ := HopefulRefugees(game3, gameID, i, username)
				if result3.Ship.Civitates != result1.Ship.Civitates {
					differentCount++
				}
			}
			if differentCount == 0 {
				t.Error("Expected different results with different seeds across multiple runs")
			}
		}
	})
}
