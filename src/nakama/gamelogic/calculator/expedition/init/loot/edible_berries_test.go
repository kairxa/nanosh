package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestEdibleBerries(t *testing.T) {
	t.Run("should add 3-6 Rations", func(t *testing.T) {
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

		// Record initial rations
		initialRations := game.Ship.Rations

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := EdibleBerries(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check rations increased by 3-6
		gain := result.Ship.Rations - initialRations
		if gain < 3 || gain > 6 {
			t.Errorf("Expected Rations to increase by 3-6, gained %d", gain)
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

		_, err = EdibleBerries(game, gameID, invokeTime, username)
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
		result1, _ := EdibleBerries(game1, gameID, invokeTime, username)
		result2, _ := EdibleBerries(game2, gameID, invokeTime, username)

		// Should have identical ration gains
		if result1.Ship.Rations != result2.Ship.Rations {
			t.Errorf("Expected deterministic results, got %d and %d Rations",
				result1.Ship.Rations, result2.Ship.Rations)
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
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialRations := game.Ship.Rations
			gameID := "test-game-123"
			username := "test-user"

			result, _ := EdibleBerries(game, gameID, int64(i*1000), username)
			gain := result.Ship.Rations - initialRations

			if gain < minSeen {
				minSeen = gain
			}
			if gain > maxSeen {
				maxSeen = gain
			}
		}

		// Should see reasonable spread across 3-6 range
		if minSeen > 3 || maxSeen < 6 {
			t.Errorf("Expected to see full range of results, got min=%d max=%d", minSeen, maxSeen)
		}
	})
}
