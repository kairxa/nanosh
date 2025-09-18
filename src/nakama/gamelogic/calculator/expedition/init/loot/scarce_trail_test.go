package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestScarceTrail(t *testing.T) {
	t.Run("should add 0-1 Basic Intel", func(t *testing.T) {
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

		// Record initial intel
		initialIntel := game.Intel.Basic

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := ScarceTrail(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check intel increased by 0 or 1
		gain := result.Intel.Basic - initialIntel
		if gain < 0 || gain > 1 {
			t.Errorf("Expected Basic Intel to increase by 0-1, gained %d", gain)
		}

		// Check critical intel unchanged
		if result.Intel.Critical != game.Intel.Critical {
			t.Error("Critical Intel should not change")
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

		_, err = ScarceTrail(game, gameID, invokeTime, username)
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
		result1, _ := ScarceTrail(game1, gameID, invokeTime, username)
		result2, _ := ScarceTrail(game2, gameID, invokeTime, username)

		// Should have identical intel gains
		if result1.Intel.Basic != result2.Intel.Basic {
			t.Errorf("Expected deterministic results, got %d and %d Basic Intel",
				result1.Intel.Basic, result2.Intel.Basic)
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
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialIntel := game.Intel.Basic
			gameID := "test-game-123"
			username := "test-user"

			result, _ := ScarceTrail(game, gameID, int64(i*1000), username)
			gain := result.Intel.Basic - initialIntel
			results[gain] = true
		}

		// Should have both 0 and 1 in results (only two possible values)
		if len(results) < 2 {
			t.Error("Expected to see both 0 and 1 intel gain across different seeds")
		}
	})
}
