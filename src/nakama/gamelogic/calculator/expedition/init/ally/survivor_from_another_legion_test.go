package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestSurvivorFromAnotherLegion(t *testing.T) {
	t.Run("should gain exactly 1 Praetorian", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
		}

		// Record initial Praetorians
		initialPraetorians := game.Ship.Praetorians

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SurvivorFromAnotherLegion(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check Praetorians increased by exactly 1
		gain := result.Ship.Praetorians - initialPraetorians
		if gain != 1 {
			t.Errorf("Expected Praetorians gain of 1, got %d", gain)
		}
	})

	t.Run("should not affect civitates", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
		}

		// Record initial resources
		initialCivitates := game.Ship.Civitates

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SurvivorFromAnotherLegion(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check civitates unchanged
		if result.Ship.Civitates != initialCivitates {
			t.Errorf("Civitates should not change, was %d now %d",
				initialCivitates, result.Ship.Civitates)
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

		_, err = SurvivorFromAnotherLegion(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should always give same result (no randomness)", func(t *testing.T) {
		// Since this card has no random element, test it always gives 1
		for i := 0; i < 10; i++ {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
			}

			initialPraetorians := game.Ship.Praetorians

			// Different seeds each time
			gameID := "different-game"
			invokeTime := int64(1000 + i*100)
			username := "different-user"

			result, _ := SurvivorFromAnotherLegion(game, gameID, invokeTime, username)

			gain := result.Ship.Praetorians - initialPraetorians
			if gain != 1 {
				t.Errorf("Iteration %d: Expected consistent gain of 1, got %d", i, gain)
			}
		}
	})
}
