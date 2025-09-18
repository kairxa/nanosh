package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestUsefulScraps(t *testing.T) {
	t.Run("should add 8-16 Supplies", func(t *testing.T) {
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

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := UsefulScraps(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check supplies increased by 8-16
		gain := result.Ship.Supplies - initialSupplies
		if gain < 8 || gain > 16 {
			t.Errorf("Expected Supplies to increase by 8-16, gained %d", gain)
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

		_, err = UsefulScraps(game, gameID, invokeTime, username)
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
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}
		game1.Expedition = expedition
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Same seed parameters
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		// Apply card to both games
		result1, _ := UsefulScraps(game1, gameID, invokeTime, username)
		result2, _ := UsefulScraps(game2, gameID, invokeTime, username)

		// Should have identical supply gains
		if result1.Ship.Supplies != result2.Ship.Supplies {
			t.Errorf("Expected deterministic results, got %d and %d Supplies",
				result1.Ship.Supplies, result2.Ship.Supplies)
		}
	})

	t.Run("should have varied results across range", func(t *testing.T) {
		// Track different results
		minSeen := 1000
		maxSeen := 0

		// Run multiple times with different seeds
		for i := range 50 {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialSupplies := game.Ship.Supplies
			gameID := "test-game-123"
			username := "test-user"

			result, _ := UsefulScraps(game, gameID, int64(i*1000), username)
			gain := result.Ship.Supplies - initialSupplies

			if gain < minSeen {
				minSeen = gain
			}
			if gain > maxSeen {
				maxSeen = gain
			}
		}

		// Should see reasonable spread across 8-16 range
		if minSeen > 10 || maxSeen < 14 {
			t.Errorf("Expected to see wider range of results, got min=%d max=%d", minSeen, maxSeen)
		}
	})
}
