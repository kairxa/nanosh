package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"testing"
)

func TestGetInitialFighterCrafts(t *testing.T) {
	t.Run("should create fighter crafts with default griffin ship type", func(t *testing.T) {
		fighterCrafts := GetInitialFighterCrafts(nil)

		if len(fighterCrafts) == 0 {
			t.Error("GetInitialFighterCrafts returned empty map")
		}

		// Griffin should have 5 Buzzards
		expectedCount := 5
		if len(fighterCrafts) != expectedCount {
			t.Errorf("Expected %d fighter crafts, got %d", expectedCount, len(fighterCrafts))
		}

		// Check each fighter craft
		for i := 1; i <= expectedCount; i++ {
			craft, exists := fighterCrafts[i]
			if !exists {
				t.Errorf("Fighter craft %d not found", i)
				continue
			}

			if craft.Type != types.FighterCraftBuzzard {
				t.Errorf("Fighter craft %d expected type 'buzzard', got '%s'", i, craft.Type)
			}

			if craft.Broken {
				t.Errorf("Fighter craft %d should not be broken initially", i)
			}
		}
	})

	t.Run("should create fighter crafts with explicit griffin ship type", func(t *testing.T) {
		params := &GetInitialAircraftsParams{ShipType: types.ShipGriffin}
		fighterCrafts := GetInitialFighterCrafts(params)

		if len(fighterCrafts) != 5 {
			t.Errorf("Expected 5 fighter crafts for griffin, got %d", len(fighterCrafts))
		}
	})

	t.Run("should print fighter crafts layout", func(t *testing.T) {
		fighterCrafts := GetInitialFighterCrafts(nil)

		t.Log("=== GRIFFIN FIGHTER CRAFTS ===")
		for id, craft := range fighterCrafts {
			status := "Operational"
			if craft.Broken {
				status = "Broken"
			}
			aircraftName := types.AircraftNames[string(craft.Type)]
			t.Logf("Fighter #%d: %s - Status: %s", id, aircraftName, status)
		}
		t.Logf("Total Fighter Crafts: %d", len(fighterCrafts))
	})
}

func TestGetInitialExpoCrafts(t *testing.T) {
	t.Run("should create expo crafts with default griffin ship type", func(t *testing.T) {
		expoCrafts := GetInitialExpoCrafts(nil)

		if len(expoCrafts) == 0 {
			t.Error("GetInitialExpoCrafts returned empty map")
		}

		// Griffin should have 2 expo crafts
		expectedCount := 2
		if len(expoCrafts) != expectedCount {
			t.Errorf("Expected %d expo crafts, got %d", expectedCount, len(expoCrafts))
		}

		// Check Blitzhopper (craft 1)
		blitzhopper, exists := expoCrafts[1]
		if !exists {
			t.Error("Blitzhopper (expo craft 1) not found")
		} else {
			if blitzhopper.Type != types.ExpoCraftBlitzhopper {
				t.Errorf("Expo craft 1 expected type 'blitzhopper', got '%s'", blitzhopper.Type)
			}
			if blitzhopper.Health != BLITZHOPPER_MAX_HEALTH {
				t.Errorf("Blitzhopper health expected %d, got %d", BLITZHOPPER_MAX_HEALTH, blitzhopper.Health)
			}
			if blitzhopper.MaxHealth != BLITZHOPPER_MAX_HEALTH {
				t.Errorf("Blitzhopper max health expected %d, got %d", BLITZHOPPER_MAX_HEALTH, blitzhopper.MaxHealth)
			}
		}

		// Check Forthopper (craft 2)
		forthopper, exists := expoCrafts[2]
		if !exists {
			t.Error("Forthopper (expo craft 2) not found")
		} else {
			if forthopper.Type != types.ExpoCraftForthopper {
				t.Errorf("Expo craft 2 expected type 'forthopper', got '%s'", forthopper.Type)
			}
			if forthopper.Health != BLITZHOPPER_MAX_HEALTH {
				t.Errorf("Forthopper health expected %d, got %d", BLITZHOPPER_MAX_HEALTH, forthopper.Health)
			}
			if forthopper.MaxHealth != BLITZHOPPER_MAX_HEALTH {
				t.Errorf("Forthopper max health expected %d, got %d", BLITZHOPPER_MAX_HEALTH, forthopper.MaxHealth)
			}
		}
	})

	t.Run("should create expo crafts with explicit griffin ship type", func(t *testing.T) {
		params := &GetInitialAircraftsParams{ShipType: types.ShipGriffin}
		expoCrafts := GetInitialExpoCrafts(params)

		if len(expoCrafts) != 2 {
			t.Errorf("Expected 2 expo crafts for griffin, got %d", len(expoCrafts))
		}
	})

	t.Run("should print expo crafts layout", func(t *testing.T) {
		expoCrafts := GetInitialExpoCrafts(nil)

		t.Log("=== GRIFFIN EXPEDITION CRAFTS ===")
		for id, craft := range expoCrafts {
			aircraftName := types.AircraftNames[string(craft.Type)]
			t.Logf("Expo Craft #%d: %s - Health: %d/%d", id, aircraftName, craft.Health, craft.MaxHealth)
		}
		t.Logf("Total Expedition Crafts: %d", len(expoCrafts))
	})
}

func TestAircraftSummary(t *testing.T) {
	t.Run("should show complete aircraft inventory for Griffin", func(t *testing.T) {
		fighterCrafts := GetInitialFighterCrafts(nil)
		expoCrafts := GetInitialExpoCrafts(nil)

		t.Log("=== GRIFFIN GUARDIAN AIRCRAFT INVENTORY ===")
		
		t.Log("\n🚁 FIGHTER CRAFTS:")
		for id, craft := range fighterCrafts {
			status := "✅ Operational"
			if craft.Broken {
				status = "❌ Broken"
			}
			t.Logf("   Fighter #%d: M-22 \"Buzzard\" - %s", id, status)
		}

		t.Log("\n🚀 EXPEDITION CRAFTS:")
		for id, craft := range expoCrafts {
			name := ""
			switch craft.Type {
			case types.ExpoCraftBlitzhopper:
				name = "S-11 \"Blitzhopper\""
			case types.ExpoCraftForthopper:
				name = "S-09 \"Forthopper\""
			}
			healthBar := ""
			for i := 0; i < craft.MaxHealth; i++ {
				if i < craft.Health {
					healthBar += "█"
				} else {
					healthBar += "░"
				}
			}
			t.Logf("   Expo #%d: %s - HP: [%s] %d/%d", id, name, healthBar, craft.Health, craft.MaxHealth)
		}

		t.Logf("\n📊 TOTAL AIRCRAFT: %d", len(fighterCrafts)+len(expoCrafts))
	})
}