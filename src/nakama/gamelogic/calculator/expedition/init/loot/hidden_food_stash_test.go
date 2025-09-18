package loot

import (
	"fmt"
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestHiddenFoodStash(t *testing.T) {
	t.Run("should add 3-4 random food items to cargo", func(t *testing.T) {
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

		// Record initial cargo count
		initialCargoCount := len(game.Ship.Cargo)

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HiddenFoodStash(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check cargo increased by 3-4 items
		itemsAdded := len(result.Ship.Cargo) - initialCargoCount
		if itemsAdded < 3 || itemsAdded > 4 {
			t.Errorf("Expected 3-4 items added to cargo, got %d", itemsAdded)
		}

		// Log what was generated
		t.Logf("Generated %d food items:", itemsAdded)
		for id, cargo := range result.Ship.Cargo {
			t.Logf("  ID: %s, Item: %s", id, cargo.ItemName)
		}

		// Check all added items are food
		foodItems := map[types.ItemName]bool{
			types.ItemFoodAstrotatoFries:  true,
			types.ItemFoodFrisbread:       true,
			types.ItemFoodFrostberry:      true,
			types.ItemFoodGlownana:        true,
			types.ItemFoodGourmetPack:     true,
			types.ItemFoodLightspeedRamen: true,
			types.ItemFoodVoidplum:        true,
			types.ItemFoodZinglime:        true,
		}

		for _, cargo := range result.Ship.Cargo {
			if !foodItems[cargo.ItemName] {
				t.Errorf("Non-food item added to cargo: %s", cargo.ItemName)
			}
		}
	})

	t.Run("should return error when cargo is full", func(t *testing.T) {
		// Create game with full cargo
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

		// Fill cargo to max
		game.Ship.MaxCargoSize = 10
		for i := 0; i < 10; i++ {
			itemID := fmt.Sprintf("item-%d", i)
			game.Ship.Cargo[itemID] = &types.ShipCargo{
				ID:       itemID,
				ItemName: types.ItemFoodFrisbread,
				Broken:   false,
			}
		}

		// Try to apply card with full cargo
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err = HiddenFoodStash(game, gameID, invokeTime, username)
		if err == nil {
			t.Error("Expected error when cargo is full, got nil")
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

		_, err = HiddenFoodStash(game, gameID, invokeTime, username)
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
		result1, _ := HiddenFoodStash(game1, gameID, invokeTime, username)
		result2, _ := HiddenFoodStash(game2, gameID, invokeTime, username)

		// Log generated items for first run
		t.Logf("First run generated items:")
		for id, cargo := range result1.Ship.Cargo {
			t.Logf("  ID: %s, Item: %s", id, cargo.ItemName)
		}

		// Log generated items for second run
		t.Logf("Second run generated items:")
		for id, cargo := range result2.Ship.Cargo {
			t.Logf("  ID: %s, Item: %s", id, cargo.ItemName)
		}

		// Should have identical number of items added
		if len(result1.Ship.Cargo) != len(result2.Ship.Cargo) {
			t.Errorf("Expected deterministic results, got %d and %d items in cargo",
				len(result1.Ship.Cargo), len(result2.Ship.Cargo))
		}

		// Should have same items in same order
		for id, cargo1 := range result1.Ship.Cargo {
			cargo2, exists := result2.Ship.Cargo[id]
			if !exists {
				t.Errorf("Item ID %s exists in result1 but not result2", id)
				continue
			}
			if cargo1.ItemName != cargo2.ItemName {
				t.Errorf("Different items for ID %s: %s vs %s", id, cargo1.ItemName, cargo2.ItemName)
			}
		}
	})

	t.Run("should handle partial cargo space", func(t *testing.T) {
		// Create game with limited cargo space
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

		// Set cargo to have only 2 spaces left
		game.Ship.MaxCargoSize = 10
		for i := 0; i < 8; i++ {
			itemID := fmt.Sprintf("existing-%d", i)
			game.Ship.Cargo[itemID] = &types.ShipCargo{
				ID:       itemID,
				ItemName: types.ItemFoodFrisbread,
				Broken:   false,
			}
		}

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := HiddenFoodStash(game, gameID, invokeTime, username)

		// Should add only 2 items (filling cargo) and return partial success or error
		if err != nil {
			// If error returned, cargo should not be modified
			if len(game.Ship.Cargo) != 8 {
				t.Errorf("Cargo was modified despite error")
			}
		} else {
			// If success, should have added exactly 2 items (all available space)
			itemsAdded := len(result.Ship.Cargo) - 8
			if itemsAdded != 2 {
				t.Errorf("Expected 2 items added (filling available space), got %d", itemsAdded)
			}
		}
	})
}
