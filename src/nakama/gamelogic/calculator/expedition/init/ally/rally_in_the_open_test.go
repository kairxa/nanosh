package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestRallyInTheOpen(t *testing.T) {
	t.Run("should gain 1 Praetorian without Silver", func(t *testing.T) {
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
		initialPraetorians := game.Ship.Praetorians
		initialCivitates := game.Ship.Civitates

		// Apply card without Silver skill
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"
		hasSilver := false

		result, err := RallyInTheOpen(game, gameID, invokeTime, username, hasSilver)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check Praetorians increased by 1
		praetorianGain := result.Ship.Praetorians - initialPraetorians
		if praetorianGain != 1 {
			t.Errorf("Expected Praetorians gain of 1, got %d", praetorianGain)
		}

		// Check civitates unchanged
		if result.Ship.Civitates != initialCivitates {
			t.Errorf("Civitates should not change without Silver, was %d now %d",
				initialCivitates, result.Ship.Civitates)
		}
	})

	t.Run("should gain 1 Praetorian and 1-2 civitates with Silver", func(t *testing.T) {
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
		initialPraetorians := game.Ship.Praetorians
		initialCivitates := game.Ship.Civitates

		// Apply card WITH Silver skill
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"
		hasSilver := true

		result, err := RallyInTheOpen(game, gameID, invokeTime, username, hasSilver)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check Praetorians increased by 1
		praetorianGain := result.Ship.Praetorians - initialPraetorians
		if praetorianGain != 1 {
			t.Errorf("Expected Praetorians gain of 1, got %d", praetorianGain)
		}

		// Check civitates increased by 1-2
		civitatesGain := result.Ship.Civitates - initialCivitates
		if civitatesGain < 1 || civitatesGain > 2 {
			t.Errorf("Expected civitates gain between 1-2 (with Silver), got %d", civitatesGain)
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
		hasSilver := false

		_, err = RallyInTheOpen(game, gameID, invokeTime, username, hasSilver)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with Silver bonus", func(t *testing.T) {
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
		hasSilver := true

		// Apply card to both games
		result1, _ := RallyInTheOpen(game1, gameID, invokeTime, username, hasSilver)
		result2, _ := RallyInTheOpen(game2, gameID, invokeTime, username, hasSilver)

		// Should have identical gains for both resources
		if result1.Ship.Praetorians != result2.Ship.Praetorians {
			t.Errorf("Praetorians not deterministic, got %d and %d",
				result1.Ship.Praetorians, result2.Ship.Praetorians)
		}
		if result1.Ship.Civitates != result2.Ship.Civitates {
			t.Errorf("Civitates not deterministic, got %d and %d",
				result1.Ship.Civitates, result2.Ship.Civitates)
		}
	})

	t.Run("Praetorian gain should be consistent regardless of Silver", func(t *testing.T) {
		// Test that Praetorian gain is always 1, whether Silver or not
		testCases := []struct {
			name      string
			hasSilver bool
		}{
			{"without Silver", false},
			{"with Silver", true},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				game, _ := initial.GetInitialGame(nil)
				game.Expedition = &types.Expedition{
					SupersectorID: "nanosh-01",
					Phase:         types.ExpeditionPhaseGroundTeam,
				}

				initialPraetorians := game.Ship.Praetorians

				gameID := "test-game-123"
				invokeTime := int64(1000)
				username := "test-user"

				result, _ := RallyInTheOpen(game, gameID, invokeTime, username, tc.hasSilver)

				gain := result.Ship.Praetorians - initialPraetorians
				if gain != 1 {
					t.Errorf("Expected Praetorian gain of 1 %s, got %d", tc.name, gain)
				}
			})
		}
	})
}
