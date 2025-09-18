package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestPatrollingNanoshScout(t *testing.T) {
	t.Run("should add 1-2 ground threat", func(t *testing.T) {
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

		// Record initial ground threat
		initialThreat := game.Expedition.GroundThreat

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := PatrollingNanoshScout(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check ground threat increased by 1-2
		threatGain := result.Expedition.GroundThreat - initialThreat
		if threatGain < 1 || threatGain > 2 {
			t.Errorf("Expected ground threat to increase by 1-2, gained %d", threatGain)
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

		_, err = PatrollingNanoshScout(game, gameID, invokeTime, username)
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
			GroundThreat:  3, // Start with some threat
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}
		game1.Expedition = expedition
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  3,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := PatrollingNanoshScout(game1, gameID, invokeTime, username)
		result2, _ := PatrollingNanoshScout(game2, gameID, invokeTime, username)

		// Should have identical ground threat
		if result1.Expedition.GroundThreat != result2.Expedition.GroundThreat {
			t.Errorf("Expected deterministic results, got %d and %d ground threat",
				result1.Expedition.GroundThreat, result2.Expedition.GroundThreat)
		}
	})

	t.Run("should have varied results across range", func(t *testing.T) {
		// Track different results
		minSeen := 1000
		maxSeen := 0

		// Run multiple times with different seeds
		for i := range 30 {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				GroundThreat:  5, // Start with some threat
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialThreat := game.Expedition.GroundThreat
			gameID := "test-game-123"
			username := "test-user"

			result, _ := PatrollingNanoshScout(game, gameID, int64(i*1000), username)
			gain := result.Expedition.GroundThreat - initialThreat

			if gain < minSeen {
				minSeen = gain
			}
			if gain > maxSeen {
				maxSeen = gain
			}
		}

		// Should see both 1 and 2 in the range
		if minSeen > 1 || maxSeen < 2 {
			t.Errorf("Expected to see full range of results, got min=%d max=%d", minSeen, maxSeen)
		}
	})

	t.Run("should work with zero initial ground threat", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  0, // Start with zero
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := PatrollingNanoshScout(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Should have 1-2 threat now
		if result.Expedition.GroundThreat < 1 || result.Expedition.GroundThreat > 2 {
			t.Errorf("Expected 1-2 ground threat, got %d", result.Expedition.GroundThreat)
		}
	})

	t.Run("should stack with existing ground threat", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  10, // Start with high threat
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, _ := PatrollingNanoshScout(game, gameID, invokeTime, username)

		// Should have 11-12 threat now (10 + 1-2)
		if result.Expedition.GroundThreat < 11 || result.Expedition.GroundThreat > 12 {
			t.Errorf("Expected 11-12 ground threat, got %d", result.Expedition.GroundThreat)
		}
	})
}