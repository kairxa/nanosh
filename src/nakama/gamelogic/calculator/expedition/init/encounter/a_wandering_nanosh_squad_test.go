package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestAWanderingNanoshSquad(t *testing.T) {
	t.Run("should add 4-5 ground threat", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with initial ground threat
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  10, // Start with some threat
		}

		// Record initial ground threat
		initialThreat := game.Expedition.GroundThreat

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := AWanderingNanoshSquad(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check ground threat increased by 4-5
		gain := result.Expedition.GroundThreat - initialThreat
		if gain < 4 || gain > 5 {
			t.Errorf("Expected ground threat increase of 4-5, got %d", gain)
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

		result, err := AWanderingNanoshSquad(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should have 4-5 threat now
		if result.Expedition.GroundThreat < 4 || result.Expedition.GroundThreat > 5 {
			t.Errorf("Expected ground threat of 4-5, got %d", result.Expedition.GroundThreat)
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

		_, err = AWanderingNanoshSquad(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Create two identical game states
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		// Add identical expeditions
		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0,
		}
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
		result1, _ := AWanderingNanoshSquad(game1, gameID, invokeTime, username)
		result2, _ := AWanderingNanoshSquad(game2, gameID, invokeTime, username)

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

			result, _ := AWanderingNanoshSquad(game, gameID, int64(i*1000), username)
			results[result.Expedition.GroundThreat] = true
		}

		// Should have both 4 and 5 in results (only two possible values)
		if len(results) < 2 {
			t.Error("Expected to see both 4 and 5 ground threat across different seeds")
		}
	})

	t.Run("threat should be higher than Some Nanosh Scouts", func(t *testing.T) {
		// This card should always add more threat than Scouts
		game1, _ := initial.GetInitialGame(nil)
		game2, _ := initial.GetInitialGame(nil)

		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0,
		}
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0,
		}

		// Same seeds for fair comparison
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply both cards
		scoutsResult, _ := SomeNanoshScouts(game1, gameID, invokeTime, username)
		squadResult, _ := AWanderingNanoshSquad(game2, gameID, invokeTime, username)

		// Squad should always add more threat (min 4 vs max 3)
		if squadResult.Expedition.GroundThreat <= scoutsResult.Expedition.GroundThreat {
			t.Errorf("Squad threat (%d) should be higher than Scouts threat (%d)",
				squadResult.Expedition.GroundThreat, scoutsResult.Expedition.GroundThreat)
		}
	})
}
