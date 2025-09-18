package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestNanoshTech(t *testing.T) {
	t.Run("should add 1 Nanosh Datapad to ship cargo", func(t *testing.T) {
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

		// Count initial Nanosh Datapads
		initialCount := 0
		for _, cargo := range game.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				initialCount++
			}
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := NanoshTech(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Count final Nanosh Datapads
		finalCount := 0
		for _, cargo := range result.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				finalCount++
			}
		}

		// Should have exactly 1 more Nanosh Datapad
		expectedCount := initialCount + 1
		if finalCount != expectedCount {
			t.Errorf("Expected %d Nanosh Datapads, got %d", expectedCount, finalCount)
		}
	})

	t.Run("should return error when cargo is full", func(t *testing.T) {
		// Create game with full cargo
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Fill cargo to max capacity
		for i := 0; i < game.Ship.MaxCargoSize; i++ {
			game.Ship.Cargo[string(rune('a'+i))] = &types.ShipCargo{
				ID:       string(rune('a' + i)),
				ItemName: types.ItemFoodFrisbread,
				Broken:   false,
			}
		}

		// Try to add Nanosh Datapad when cargo is full
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err := NanoshTech(game, gameID, invokeTime, username)
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

		_, err = NanoshTech(game, gameID, invokeTime, username)
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
		result1, _ := NanoshTech(game1, gameID, invokeTime, username)
		result2, _ := NanoshTech(game2, gameID, invokeTime, username)

		// Should have identical results - find the added datapad IDs
		var id1, id2 string
		for id, cargo := range result1.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				id1 = id
				break
			}
		}
		for id, cargo := range result2.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				id2 = id
				break
			}
		}

		// IDs should be identical with same seed
		if id1 != id2 {
			t.Errorf("Expected deterministic item IDs, got %s and %s", id1, id2)
		}
	})

	t.Run("should generate unique item ID", func(t *testing.T) {
		// Create game
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Apply card
		result, _ := NanoshTech(game, "test", int64(1000), "user")

		// Find the added Nanosh Datapad
		var addedItem *types.ShipCargo
		for _, cargo := range result.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				addedItem = cargo
				break
			}
		}

		if addedItem == nil {
			t.Fatal("Expected to find added Nanosh Datapad")
		}

		// Item should have valid ID and not be broken
		if addedItem.ID == "" {
			t.Error("Expected non-empty item ID")
		}
		if addedItem.Broken {
			t.Error("Expected item to not be broken")
		}
		if addedItem.ItemName != types.ItemMiscNanoshDatapad {
			t.Errorf("Expected ItemMiscNanoshDatapad, got %s", addedItem.ItemName)
		}
	})

	t.Run("should work with partially filled cargo", func(t *testing.T) {
		// Create game with some existing cargo
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Add some existing cargo
		game.Ship.Cargo["existing1"] = &types.ShipCargo{
			ID:       "existing1",
			ItemName: types.ItemFoodFrisbread,
			Broken:   false,
		}

		initialCargoSize := len(game.Ship.Cargo)

		// Apply card
		result, _ := NanoshTech(game, "test", int64(1000), "user")

		// Should have one more item
		finalCargoSize := len(result.Ship.Cargo)
		if finalCargoSize != initialCargoSize+1 {
			t.Errorf("Expected cargo size to increase by 1, was %d now %d",
				initialCargoSize, finalCargoSize)
		}

		// Should contain the new Nanosh Datapad
		foundDatapad := false
		for _, cargo := range result.Ship.Cargo {
			if cargo.ItemName == types.ItemMiscNanoshDatapad {
				foundDatapad = true
				break
			}
		}

		if !foundDatapad {
			t.Error("Expected to find added Nanosh Datapad in cargo")
		}
	})
}
