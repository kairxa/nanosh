package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestSalvageableNanoshDevices(t *testing.T) {
	t.Run("should add 3-9 eCells", func(t *testing.T) {
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

		// Record initial eCells
		initialECells := game.Ship.ECells

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := SalvageableNanoshDevices(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check eCells increased by 3-9
		eCellsGain := result.Ship.ECells - initialECells
		if eCellsGain < 3 || eCellsGain > 9 {
			t.Errorf("Expected eCells gain between 3-9, got %d", eCellsGain)
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

		_, err = SalvageableNanoshDevices(game, gameID, invokeTime, username)
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
		result1, _ := SalvageableNanoshDevices(game1, gameID, invokeTime, username)
		result2, _ := SalvageableNanoshDevices(game2, gameID, invokeTime, username)

		// Should have identical eCells gain
		if result1.Ship.ECells != result2.Ship.ECells {
			t.Errorf("Expected deterministic results, got %d and %d eCells",
				result1.Ship.ECells, result2.Ship.ECells)
		}
	})

	t.Run("should have varied results across range", func(t *testing.T) {
		// Test multiple times with different seeds to ensure we get different values
		eCellsResults := make(map[int]bool)

		for i := 0; i < 50; i++ {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialECells := game.Ship.ECells
			gameID := "test-variety"
			invokeTime := int64(i * 1000) // Different invoke times for variety
			username := "test-user"

			result, _ := SalvageableNanoshDevices(game, gameID, invokeTime, username)
			eCellsGain := result.Ship.ECells - initialECells
			eCellsResults[eCellsGain] = true
		}

		// Should have at least some variety (not all the same value)
		if len(eCellsResults) < 3 {
			t.Errorf("Expected variety in eCells gain, only got values: %v", eCellsResults)
		}

		// All results should be within range
		for gain := range eCellsResults {
			if gain < 3 || gain > 9 {
				t.Errorf("ECells gain %d outside expected range 3-9", gain)
			}
		}
	})

	t.Run("should stack with existing eCells", func(t *testing.T) {
		// Test that it adds to existing eCells rather than replacing
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Set initial eCells to non-zero value
		game.Ship.ECells = 15
		initialECells := game.Ship.ECells

		result, _ := SalvageableNanoshDevices(game, "test", int64(1000), "user")

		// Final eCells should be initial + gain, not just gain
		if result.Ship.ECells <= initialECells {
			t.Errorf("Expected eCells to increase from %d, got %d",
				initialECells, result.Ship.ECells)
		}

		// The gain should still be in expected range
		gain := result.Ship.ECells - initialECells
		if gain < 3 || gain > 9 {
			t.Errorf("Expected gain 3-9, got %d", gain)
		}
	})

	t.Run("should work with zero initial eCells", func(t *testing.T) {
		// Test when starting with 0 eCells
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Set eCells to 0
		game.Ship.ECells = 0

		result, _ := SalvageableNanoshDevices(game, "test", int64(1000), "user")

		// Should gain 3-9 eCells from 0
		if result.Ship.ECells < 3 || result.Ship.ECells > 9 {
			t.Errorf("Expected final eCells between 3-9, got %d", result.Ship.ECells)
		}
	})
}