package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestTargetedOrder(t *testing.T) {
	t.Run("should damage blitzhopper by 1 without Mechpilot skill", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with members who don't have Mechpilot skill
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // Has Triarii, Tactician, etc. but not Mechpilot
				types.CharacterMomoTzigane: true, // Has Infantry, Protector, etc. but not Mechpilot
			},
		}

		// Get blitzhopper initial health
		var initialHealth int
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				initialHealth = craft.Health
				break
			}
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := TargetedOrder(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check blitzhopper took 1 damage
		var finalHealth int
		for _, craft := range result.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				finalHealth = craft.Health
				break
			}
		}

		expectedHealth := initialHealth - 1
		if finalHealth != expectedHealth {
			t.Errorf("Expected blitzhopper health to be %d, got %d", expectedHealth, finalHealth)
		}
	})

	t.Run("should negate damage with Mechpilot skill", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with Brianne Cheeseworth (who has Mechpilot skill)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterBrianneCheeseworth: true, // Has Mechpilot skill
				types.CharacterSolasMercer:        true, // Regular member
			},
		}

		// Get blitzhopper initial health
		var initialHealth int
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				initialHealth = craft.Health
				break
			}
		}

		// Apply card
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := TargetedOrder(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check blitzhopper health unchanged (negated)
		var finalHealth int
		for _, craft := range result.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				finalHealth = craft.Health
				break
			}
		}

		if finalHealth != initialHealth {
			t.Errorf("Expected blitzhopper health to remain %d with Mechpilot, got %d",
				initialHealth, finalHealth)
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

		_, err = TargetedOrder(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic (no randomness)", func(t *testing.T) {
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
		result1, _ := TargetedOrder(game1, gameID, invokeTime, username)
		result2, _ := TargetedOrder(game2, gameID, invokeTime, username)

		// Should have identical blitzhopper health
		var health1, health2 int
		for _, craft := range result1.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				health1 = craft.Health
				break
			}
		}
		for _, craft := range result2.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				health2 = craft.Health
				break
			}
		}

		if health1 != health2 {
			t.Errorf("Expected deterministic results, got %d and %d blitzhopper health",
				health1, health2)
		}
	})

	t.Run("should detect Mechpilot skill correctly", func(t *testing.T) {
		// Test 1: With Mechpilot (should negate damage)
		game1, _ := initial.GetInitialGame(nil)
		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterBrianneCheeseworth: true, // Has Mechpilot
			},
		}

		var initialHealth1 int
		for _, craft := range game1.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				initialHealth1 = craft.Health
				break
			}
		}

		result1, _ := TargetedOrder(game1, "test", int64(1000), "user")

		// Test 2: Without Mechpilot (should take damage)
		game2, _ := initial.GetInitialGame(nil)
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // No Mechpilot
			},
		}

		var initialHealth2 int
		for _, craft := range game2.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				initialHealth2 = craft.Health
				break
			}
		}

		result2, _ := TargetedOrder(game2, "test", int64(1000), "user")

		// Get final health values
		var finalHealth1, finalHealth2 int
		for _, craft := range result1.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				finalHealth1 = craft.Health
				break
			}
		}
		for _, craft := range result2.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				finalHealth2 = craft.Health
				break
			}
		}

		// With Mechpilot should have no damage, without should have damage
		if finalHealth1 != initialHealth1 {
			t.Errorf("Expected no damage with Mechpilot, health changed from %d to %d",
				initialHealth1, finalHealth1)
		}
		if finalHealth2 >= initialHealth2 {
			t.Errorf("Expected damage without Mechpilot, health unchanged at %d",
				finalHealth2)
		}
	})

	t.Run("should handle blitzhopper at minimum health", func(t *testing.T) {
		// Test when blitzhopper already at 0 health
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // No Mechpilot
			},
		}

		// Set blitzhopper to 0 health
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				craft.Health = 0
				break
			}
		}

		result, _ := TargetedOrder(game, "test", int64(1000), "user")

		// Should not go below 0 (if there's a minimum)
		for _, craft := range result.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				if craft.Health < 0 {
					t.Errorf("Blitzhopper health should not go below 0, got %d", craft.Health)
				}
				break
			}
		}
	})
}