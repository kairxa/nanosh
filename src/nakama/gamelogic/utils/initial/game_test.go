package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"strings"
	"testing"
	"time"
)

func TestGetInitialGame(t *testing.T) {
	t.Run("should create game with default parameters", func(t *testing.T) {
		game, err := GetInitialGame(nil)

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if game == nil {
			t.Fatal("Expected game to be created, got nil")
		}

		// Check basic game properties
		if game.ID == "" {
			t.Error("Game ID should be generated")
		}

		if game.Day != 0 {
			t.Errorf("Expected day 0, got %d", game.Day)
		}

		if game.Cycle != 0 {
			t.Errorf("Expected cycle 0, got %d", game.Cycle)
		}

		if game.Morale != types.INITIAL_MORALE {
			t.Errorf("Expected morale %d, got %d", types.INITIAL_MORALE, game.Morale)
		}

		if game.MaxMorale != types.MAX_MORALE {
			t.Errorf("Expected max morale %d, got %d", types.MAX_MORALE, game.MaxMorale)
		}
	})

	t.Run("should create game with specific parameters", func(t *testing.T) {
		params := &GetInitialGameParams{
			GameID:     "test-game-123",
			InvokeTime: 1699564800000,
			Username:   "alice",
		}

		game, err := GetInitialGame(params)

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if game.ID != "test-game-123" {
			t.Errorf("Expected game ID 'test-game-123', got %s", game.ID)
		}
	})

	t.Run("should initialize ship correctly", func(t *testing.T) {
		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:     "ship-test",
			InvokeTime: 1000,
			Username:   "user",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Ship is a value type, not pointer, so it should always exist

		if game.Ship.Type != types.ShipGriffin {
			t.Errorf("Expected Griffin ship, got %s", game.Ship.Type)
		}

		if game.Ship.Health != 200 {
			t.Errorf("Expected ship health 200, got %d", game.Ship.Health)
		}
	})

	t.Run("should initialize characters correctly", func(t *testing.T) {
		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:     "char-test",
			InvokeTime: 2000,
			Username:   "player",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(game.Characters) != 13 {
			t.Errorf("Expected 13 characters, got %d", len(game.Characters))
		}

		if len(game.CharactersDead) != 0 {
			t.Errorf("Expected 0 dead characters initially, got %d", len(game.CharactersDead))
		}

		// Check Solas exists
		if _, exists := game.Characters[types.CharacterSolasMercer]; !exists {
			t.Error("Solas Mercer should exist in characters")
		}
	})

	t.Run("should initialize sectors correctly", func(t *testing.T) {
		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:     "sector-test",
			InvokeTime: 3000,
			Username:   "admin",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if game.Sectors == nil {
			t.Fatal("Sectors should be initialized")
		}

		// Sectors is map[string]any, so check total entries
		// Should have supersectors + subsectors
		if len(game.Sectors) == 0 {
			t.Error("Sectors should not be empty")
		}

		// Should have ship location set
		if game.ShipLocation == "" {
			t.Error("Ship location should be set")
		}
	})

	t.Run("should initialize Nanosh bases correctly", func(t *testing.T) {
		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:     "nanosh-test",
			InvokeTime: 4000,
			Username:   "commander",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check Nanosh main base is set (it's a pointer)
		if game.Nanosh.MainBase == nil {
			t.Error("Nanosh main base should be set")
		}

		// Check aux base exists
		if len(game.Nanosh.AuxBase) != 1 {
			t.Errorf("Expected 1 aux base, got %d", len(game.Nanosh.AuxBase))
		}

		// Check outposts (should be 3 or less depending on randomization)
		if len(game.Nanosh.Outposts) > 3 {
			t.Errorf("Expected max 3 outposts, got %d", len(game.Nanosh.Outposts))
		}

		// Check initial aerial units
		if game.Nanosh.AerialUnits.Hornets != 0 {
			t.Errorf("Expected 0 initial hornets, got %d", game.Nanosh.AerialUnits.Hornets)
		}

		if game.Nanosh.AerialUnits.Talons != 0 {
			t.Errorf("Expected 0 initial talons, got %d", game.Nanosh.AerialUnits.Talons)
		}

		if game.Nanosh.AssimilateEnabled {
			t.Error("Assimilate should not be enabled initially")
		}
	})

	t.Run("should be deterministic with same parameters", func(t *testing.T) {
		params1 := &GetInitialGameParams{
			GameID:     "deterministic-test",
			InvokeTime: 5000,
			Username:   "test-user",
		}
		params2 := &GetInitialGameParams{
			GameID:     "deterministic-test",
			InvokeTime: 5000,
			Username:   "test-user",
		}

		game1, err1 := GetInitialGame(params1)
		game2, err2 := GetInitialGame(params2)

		if err1 != nil || err2 != nil {
			t.Fatalf("Expected no errors, got %v, %v", err1, err2)
		}

		// Same parameters should produce same results
		if game1.ShipLocation != game2.ShipLocation {
			t.Errorf("Same seed should produce same ship location: %s vs %s", game1.ShipLocation, game2.ShipLocation)
		}

		// Compare main base (both should be non-nil and equal)
		if game1.Nanosh.MainBase == nil || game2.Nanosh.MainBase == nil {
			t.Error("Main base should be set in both games")
		} else if *game1.Nanosh.MainBase != *game2.Nanosh.MainBase {
			t.Errorf("Same seed should produce same main base: %s vs %s", *game1.Nanosh.MainBase, *game2.Nanosh.MainBase)
		}
	})

	t.Run("should generate valid UUIDs", func(t *testing.T) {
		game, err := GetInitialGame(nil)

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// UUIDv7 should be 36 characters with hyphens
		if len(game.ID) != 36 {
			t.Errorf("Expected UUID length 36, got %d", len(game.ID))
		}

		// Should contain hyphens in UUID format
		if !strings.Contains(game.ID, "-") {
			t.Error("Game ID should be in UUID format with hyphens")
		}

		// Should be different each time (very high probability)
		game2, _ := GetInitialGame(nil)
		if game.ID == game2.ID {
			t.Error("Different games should have different UUIDs")
		}
	})

	t.Run("should handle time defaults correctly", func(t *testing.T) {
		before := time.Now().UnixMilli()

		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:   "time-test",
			Username: "user",
			// InvokeTime not set - should use current time
		})

		after := time.Now().UnixMilli()

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// The game should be created with current time (approximately)
		// We can't test exact time due to execution time, but can verify it's reasonable
		if game.ID == "" {
			t.Error("Game ID should be generated even without explicit invoke time")
		}

		// Time should be within reasonable range
		t.Logf("Game created between %d and %d", before, after)
	})

	t.Run("should print game summary", func(t *testing.T) {
		game, err := GetInitialGame(&GetInitialGameParams{
			GameID:     "summary-test",
			InvokeTime: 1699564800000,
			Username:   "captain",
		})

		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		t.Log("=== INITIAL GAME STATE SUMMARY ===")
		t.Logf("Game ID: %s", game.ID)
		t.Logf("Day/Cycle: %d/%d", game.Day, game.Cycle)
		t.Logf("Morale: %d/%d", game.Morale, game.MaxMorale)
		t.Logf("Nanosh Sympathy: %d/%d", game.NanoshSympathy, game.MaxNanoshSympathy)
		t.Logf("Intel: Basic=%d, Critical=%d", game.Intel.Basic, game.Intel.Critical)

		t.Log("\n🚢 SHIP:")
		t.Logf("   Type: %s", types.ShipNames[game.Ship.Type])
		t.Logf("   Health: %d/%d", game.Ship.Health, game.Ship.MaxHealth)
		t.Logf("   Shield: %d/%d", game.Ship.Shield, game.Ship.MaxShield)
		t.Logf("   Location: %s", game.ShipLocation)
		t.Logf("   Resources: eCells=%d, Supplies=%d, Rations=%d", game.Ship.ECells, game.Ship.Supplies, game.Ship.Rations)

		t.Log("\n👥 CHARACTERS:")
		t.Logf("   Total: %d alive, %d dead", len(game.Characters), len(game.CharactersDead))

		t.Log("\n🤖 NANOSH THREAT:")
		if game.Nanosh.MainBase != nil {
			t.Logf("   Main Base: %s", *game.Nanosh.MainBase)
		} else {
			t.Logf("   Main Base: <none>")
		}
		t.Logf("   Aux Bases: %d", len(game.Nanosh.AuxBase))
		t.Logf("   Outposts: %d", len(game.Nanosh.Outposts))
		t.Logf("   Advances: %d", len(game.Nanosh.Advances))
		t.Logf("   Liberation Points: %d", len(game.Nanosh.LiberationPoints))
		t.Logf("   Assimilate Enabled: %t", game.Nanosh.AssimilateEnabled)
		t.Logf("   Aerial Units: Hornets=%d, Talons=%d", game.Nanosh.AerialUnits.Hornets, game.Nanosh.AerialUnits.Talons)

		t.Log("\n🗺️  SECTORS:")
		t.Logf("   Total Sectors: %d", len(game.Sectors))
		t.Logf("   Empty Subsectors: %d", len(game.Subsectors.Empty))

		t.Log("\n🎒 OTHER:")
		t.Logf("   Craftable Items: %d", len(game.Craftable))
		t.Logf("   Expedition Active: %t", game.Expedition != nil)
		t.Logf("   Battle Active: %t", game.BattleState != nil)
	})
}
