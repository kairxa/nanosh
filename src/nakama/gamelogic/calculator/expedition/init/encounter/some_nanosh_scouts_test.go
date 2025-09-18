package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestSomeNanoshScouts(t *testing.T) {
	t.Run("should add 2-3 ground threat", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with initial ground threat
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  5, // Start with some threat
		}

		// Record initial ground threat
		initialThreat := game.Expedition.GroundThreat

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SomeNanoshScouts(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check ground threat increased by 2-3
		gain := result.Expedition.GroundThreat - initialThreat
		if gain < 2 || gain > 3 {
			t.Errorf("Expected ground threat increase of 2-3, got %d", gain)
		}
	})

	t.Run("should work with zero initial ground threat", func(t *testing.T) {
		// Create game with expedition at 0 threat
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0,
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SomeNanoshScouts(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should have 2-3 threat now
		if result.Expedition.GroundThreat < 2 || result.Expedition.GroundThreat > 3 {
			t.Errorf("Expected ground threat of 2-3, got %d", result.Expedition.GroundThreat)
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

		_, err = SomeNanoshScouts(game, gameID, invokeTime, username)
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
			GroundThreat:  0,
		}
		game1.Expedition = expedition
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0,
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := SomeNanoshScouts(game1, gameID, invokeTime, username)
		result2, _ := SomeNanoshScouts(game2, gameID, invokeTime, username)

		// Should have identical threat increases
		if result1.Expedition.GroundThreat != result2.Expedition.GroundThreat {
			t.Errorf("Expected deterministic results, got %d and %d ground threat",
				result1.Expedition.GroundThreat, result2.Expedition.GroundThreat)
		}
	})

	t.Run("should have different results with different seeds", func(t *testing.T) {
		// Track different results
		results := make(map[int]bool)

		// Run multiple times with different seeds
		for i := range 20 {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				GroundThreat:  0,
			}

			gameID := "test-game-123"
			username := "test-user"

			result, _ := SomeNanoshScouts(game, gameID, int64(i*1000), username)
			results[result.Expedition.GroundThreat] = true
		}

		// Should have both 2 and 3 in results (only two possible values)
		if len(results) < 2 {
			t.Error("Expected to see both 2 and 3 ground threat across different seeds")
		}
	})
}
