package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"testing"
)

func TestGetInitialCharacters(t *testing.T) {
	t.Run("should create all 13 characters", func(t *testing.T) {
		characters := GetInitialCharacters("test-game", 1699564800, "alice")
		
		if len(characters) != 13 {
			t.Errorf("Expected 13 characters, got %d", len(characters))
		}
		
		// Check all characters exist
		expectedCharacters := []types.CharacterName{
			types.CharacterSolasMercer,
			types.CharacterMomoTzigane,
			types.CharacterVal,
			types.CharacterBrianneCheeseworth,
			types.CharacterNiralPierce,
			types.CharacterTealQing,
			types.CharacterGassPetalnova,
			types.CharacterYsaraMercer,
			types.CharacterZediusWindsor,
			types.CharacterVieroAlden,
			types.CharacterSorenKoda,
			types.CharacterAlisaHuang,
			types.CharacterRinaMikami,
		}
		
		for _, name := range expectedCharacters {
			if _, exists := characters[name]; !exists {
				t.Errorf("Character %s not found", name)
			}
		}
	})
	
	t.Run("should initialize characters with correct properties", func(t *testing.T) {
		characters := GetInitialCharacters("test-game", 1699564800, "alice")
		
		// Check Solas Mercer as example
		solas := characters[types.CharacterSolasMercer]
		
		if solas.AP != 0 {
			t.Errorf("Expected AP 0, got %d", solas.AP)
		}
		
		if solas.MaxAP != types.MAX_AP {
			t.Errorf("Expected MaxAP %d, got %d", types.MAX_AP, solas.MaxAP)
		}
		
		if !solas.Trait[types.TraitLegatusLegionis] {
			t.Error("Solas should have Legatus Legionis trait")
		}
		
		if len(solas.Skills) != 4 {
			t.Errorf("Solas should have 4 skills, got %d", len(solas.Skills))
		}
		
		if solas.Location != types.RoomDorms {
			t.Errorf("Solas should start in dorms, got %s", solas.Location)
		}
		
		// Check equipment
		weapon := solas.Equipment[types.EquipmentSlotWeapon]
		if weapon == nil {
			t.Error("Solas should have a weapon equipped")
		} else {
			if weapon.ItemName != types.ItemWeaponUniqueGunsP2075 {
				t.Errorf("Solas should have P2075, got %s", weapon.ItemName)
			}
			if len(weapon.ID) != types.ITEM_ID_LENGTH {
				t.Errorf("Weapon ID should be %d characters, got %d", types.ITEM_ID_LENGTH, len(weapon.ID))
			}
		}
	})
	
	t.Run("should be deterministic with same seed", func(t *testing.T) {
		characters1 := GetInitialCharacters("game-123", 1000, "bob")
		characters2 := GetInitialCharacters("game-123", 1000, "bob")
		
		// Check that item IDs are the same
		solas1 := characters1[types.CharacterSolasMercer]
		solas2 := characters2[types.CharacterSolasMercer]
		
		weapon1 := solas1.Equipment[types.EquipmentSlotWeapon]
		weapon2 := solas2.Equipment[types.EquipmentSlotWeapon]
		
		if weapon1.ID != weapon2.ID {
			t.Errorf("Same seed should produce same weapon ID: %s vs %s", weapon1.ID, weapon2.ID)
		}
		
		acc1 := solas1.Equipment[types.EquipmentSlotAcc1]
		acc2 := solas2.Equipment[types.EquipmentSlotAcc1]
		
		if acc1.ID != acc2.ID {
			t.Errorf("Same seed should produce same accessory ID: %s vs %s", acc1.ID, acc2.ID)
		}
	})
	
	t.Run("should produce different IDs with different seeds", func(t *testing.T) {
		characters1 := GetInitialCharacters("game-123", 1000, "alice")
		characters2 := GetInitialCharacters("game-456", 1000, "alice")
		
		solas1 := characters1[types.CharacterSolasMercer]
		solas2 := characters2[types.CharacterSolasMercer]
		
		weapon1 := solas1.Equipment[types.EquipmentSlotWeapon]
		weapon2 := solas2.Equipment[types.EquipmentSlotWeapon]
		
		if weapon1.ID == weapon2.ID {
			t.Error("Different seeds should produce different IDs")
		}
	})
	
	t.Run("should verify specific character loadouts", func(t *testing.T) {
		characters := GetInitialCharacters("test", 1000, "user")
		
		// Momo should have armor
		momo := characters[types.CharacterMomoTzigane]
		if momo.Equipment[types.EquipmentSlotBody] == nil {
			t.Error("Momo should have body armor")
		}
		if momo.Equipment[types.EquipmentSlotBody].ItemName != types.ItemBodyHeavyLorica {
			t.Error("Momo should have Lorica armor")
		}
		
		// Niral should have Vigorisk in inventory
		niral := characters[types.CharacterNiralPierce]
		hasVigorisk := false
		for _, item := range niral.Inventory {
			if item.ItemName == types.ItemMedsVigorisk {
				hasVigorisk = true
				break
			}
		}
		if !hasVigorisk {
			t.Error("Niral should have Vigorisk in inventory")
		}
		
		// Teal should have Somnoxa in inventory
		teal := characters[types.CharacterTealQing]
		hasSomnoxa := false
		for _, item := range teal.Inventory {
			if item.ItemName == types.ItemMedsSomnoxa {
				hasSomnoxa = true
				break
			}
		}
		if !hasSomnoxa {
			t.Error("Teal should have Somnoxa in inventory")
		}
		
		// X7-Gastronia should have droid trait
		gass := characters[types.CharacterGassPetalnova]
		if !gass.Trait[types.TraitDroid] {
			t.Error("X7-Gastronia should have Droid trait")
		}
		
		// Rina should have Silver skill
		rina := characters[types.CharacterRinaMikami]
		if !rina.Skills[types.SkillSilver] {
			t.Error("Rina should have Silver skill")
		}
	})
	
	t.Run("should print character roster", func(t *testing.T) {
		characters := GetInitialCharacters("demo", 1699564800, "player")
		
		t.Log("=== GRIFFIN GUARDIAN CREW ROSTER ===")
		t.Log("")
		
		// Order for display
		displayOrder := []types.CharacterName{
			types.CharacterSolasMercer,
			types.CharacterMomoTzigane,
			types.CharacterVal,
			types.CharacterBrianneCheeseworth,
			types.CharacterNiralPierce,
			types.CharacterTealQing,
			types.CharacterGassPetalnova,
			types.CharacterYsaraMercer,
			types.CharacterZediusWindsor,
			types.CharacterVieroAlden,
			types.CharacterSorenKoda,
			types.CharacterAlisaHuang,
			types.CharacterRinaMikami,
		}
		
		for i, name := range displayOrder {
			char := characters[name]
			t.Logf("%2d. %s", i+1, name)
			
			// Print traits
			t.Log("    Traits:")
			for trait := range char.Trait {
				t.Logf("      - %s", trait)
			}
			
			// Print skills
			t.Log("    Skills:")
			for skill := range char.Skills {
				t.Logf("      - %s", skill)
			}
			
			// Print equipment
			t.Log("    Equipment:")
			for slot, item := range char.Equipment {
				if item != nil {
					t.Logf("      %s: %s (ID: %s)", slot, item.ItemName, item.ID)
				}
			}
			
			// Print inventory
			if len(char.Inventory) > 0 {
				t.Log("    Inventory:")
				for _, item := range char.Inventory {
					t.Logf("      - %s (ID: %s)", item.ItemName, item.ID)
				}
			}
			
			t.Logf("    Location: %s", char.Location)
			t.Logf("    AP: %d/%d", char.AP, char.MaxAP)
			t.Log("")
		}
		
		t.Logf("Total Characters: %d", len(characters))
	})
}