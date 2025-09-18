package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"testing"
)

func TestGetInitialShip(t *testing.T) {
	t.Run("should create ship with default griffin type", func(t *testing.T) {
		ship := GetInitialShip(nil)

		if ship.Type != types.ShipGriffin {
			t.Errorf("Expected ship type 'griffin', got '%s'", ship.Type)
		}

		if ship.Cargo == nil {
			t.Error("Ship cargo should be initialized")
		}

		if ship.Rooms == nil {
			t.Error("Ship rooms should be initialized")
		}

		if ship.FighterCrafts == nil {
			t.Error("Ship fighter crafts should be initialized")
		}

		if ship.ExpoCrafts == nil {
			t.Error("Ship expo crafts should be initialized")
		}
	})

	t.Run("should initialize ship with required properties", func(t *testing.T) {
		ship := GetInitialShip(nil)

		// Check Griffin-specific values
		if ship.Health != 200 {
			t.Errorf("Expected health 200, got %d", ship.Health)
		}

		if ship.MaxHealth != 300 {
			t.Errorf("Expected max health 300, got %d", ship.MaxHealth)
		}

		if ship.Shield != 0 {
			t.Errorf("Expected shield 0, got %d", ship.Shield)
		}

		if ship.MaxShield != 50 {
			t.Errorf("Expected max shield 50, got %d", ship.MaxShield)
		}

		if ship.ECells != 120 {
			t.Errorf("Expected eCells 120, got %d", ship.ECells)
		}

		if ship.Supplies != 240 {
			t.Errorf("Expected supplies 240, got %d", ship.Supplies)
		}

		if ship.Rations != 100 {
			t.Errorf("Expected rations 100, got %d", ship.Rations)
		}

		if ship.Civitates != 10 {
			t.Errorf("Expected civitates 10, got %d", ship.Civitates)
		}

		if ship.Praetorians != 5 {
			t.Errorf("Expected praetorians 5, got %d", ship.Praetorians)
		}

		if ship.MaxCargoSize != 800 {
			t.Errorf("Expected max cargo size 800, got %d", ship.MaxCargoSize)
		}
	})

	t.Run("should initialize ship projects correctly", func(t *testing.T) {
		ship := GetInitialShip(nil)

		if ship.Projects.Queued == nil {
			t.Error("Ship projects queued should be initialized")
		}

		if ship.Projects.Done == nil {
			t.Error("Ship projects done should be initialized")
		}

		if ship.Projects.Pool == nil {
			t.Error("Ship projects pool should be initialized")
		}

		expectedPoolSize := 20 // Should have 20 projects in pool
		if len(ship.Projects.Pool) != expectedPoolSize {
			t.Errorf("Expected %d projects in pool, got %d", expectedPoolSize, len(ship.Projects.Pool))
		}

		// Check that all projects exist as expected
		expectedProjects := []types.ProjectName{
			types.ProjectFileG11ApexBioEnhancement,
			types.ProjectFile128FinesseProtocol,
			types.ProjectFile129EquilibriumDrive,
			types.ProjectFile252HyperHealAmpoule,
			types.ProjectFile253LifesaverInitiative,
			types.ProjectFile254OperationalSurgeParadigm,
			types.ProjectFile311ProvisioningOverhaul,
			types.ProjectFileE120SoloComfortInitiative,
			types.ProjectFile100SupportBlueprintsRecoveryA,
			types.ProjectFile101SupportBlueprintsRecoveryB,
			types.ProjectFile112EisenSchlagModul,
			types.ProjectFile113BiogenicAimAssist,
			types.ProjectFile456KabutoBoost,
			types.ProjectFile010BuzzardPrecisionUpgrade,
			types.ProjectFile011BuzzardStrikeOptimization,
			types.ProjectFile012BuzzardDefensiveRetrofit,
			types.ProjectFile055HoppersSpaceOptimization,
			types.ProjectFile711PraetoriansSuitForceDistribution,
			types.ProjectFile712YsarasSnare,
			types.ProjectFileNAPNanoshAssimilationProtocol,
		}

		for _, project := range expectedProjects {
			if !ship.Projects.Pool[project] {
				t.Errorf("Expected project '%s' to be in pool", project)
			}
		}
	})

	t.Run("should initialize ship modifiers and expo", func(t *testing.T) {
		ship := GetInitialShip(nil)

		if ship.Modifiers == nil {
			t.Error("Ship modifiers should be initialized")
		}

		if ship.Expo.Members == nil {
			t.Error("Ship expo members should be initialized")
		}

		// Should start empty
		if len(ship.Modifiers) != 0 {
			t.Errorf("Expected empty modifiers, got %d", len(ship.Modifiers))
		}

		if len(ship.Expo.Members) != 0 {
			t.Errorf("Expected empty expo members, got %d", len(ship.Expo.Members))
		}
	})

	t.Run("should initialize damage map correctly", func(t *testing.T) {
		ship := GetInitialShip(nil)

		if ship.Damage == nil {
			t.Error("Ship damage should be initialized")
		}

		// Should have cannon damage initialized
		cannonDamage, exists := ship.Damage[types.ActionBridgeCommandCannon]
		if !exists {
			t.Error("Expected cannon damage to be initialized")
		}

		if cannonDamage.Min != types.CANNON_DEFAULT_MIN_DAMAGE {
			t.Errorf("Expected cannon min damage %d, got %d", types.CANNON_DEFAULT_MIN_DAMAGE, cannonDamage.Min)
		}

		if cannonDamage.Max != types.CANNON_DEFAULT_MAX_DAMAGE {
			t.Errorf("Expected cannon max damage %d, got %d", types.CANNON_DEFAULT_MAX_DAMAGE, cannonDamage.Max)
		}
	})

	t.Run("should have consistent structure across calls", func(t *testing.T) {
		ship1 := GetInitialShip(nil)
		ship2 := GetInitialShip(nil)

		if ship1.Type != ship2.Type {
			t.Errorf("Ships should have same type: %s vs %s", ship1.Type, ship2.Type)
		}

		if len(ship1.Projects.Pool) != len(ship2.Projects.Pool) {
			t.Errorf("Ships should have same project pool size: %d vs %d", len(ship1.Projects.Pool), len(ship2.Projects.Pool))
		}

		if len(ship1.Rooms) != len(ship2.Rooms) {
			t.Errorf("Ships should have same room count: %d vs %d", len(ship1.Rooms), len(ship2.Rooms))
		}
	})

	t.Run("should print ship layout", func(t *testing.T) {
		ship := GetInitialShip(nil)

		t.Log("=== GRIFFIN GUARDIAN SHIP LAYOUT ===")
		t.Logf("Ship Type: %s", types.ShipNames[ship.Type])
		t.Logf("Health: %d/%d", ship.Health, ship.MaxHealth)
		t.Logf("Shield: %d/%d", ship.Shield, ship.MaxShield)
		t.Logf("Resources: eCells=%d, Supplies=%d, Rations=%d", ship.ECells, ship.Supplies, ship.Rations)
		t.Logf("Personnel: Civitates=%d, Praetorians=%d", ship.Civitates, ship.Praetorians)
		t.Logf("Cargo: 0/%d (empty)", ship.MaxCargoSize)
		t.Logf("Rooms: %d total", len(ship.Rooms))
		t.Logf("Fighter Crafts: %d", len(ship.FighterCrafts))
		t.Logf("Expedition Crafts: %d", len(ship.ExpoCrafts))
		t.Logf("Available Projects: %d", len(ship.Projects.Pool))
		t.Logf("Active Modifiers: %d", len(ship.Modifiers))
		t.Logf("Expedition Members: %d", len(ship.Expo.Members))
	})
}