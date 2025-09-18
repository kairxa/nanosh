package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// GetInitialCharacters creates and returns all 13 initial characters for the game
func GetInitialCharacters(gameID string, invokeTime int64, username string) map[types.CharacterName]*types.Character {
	// Create deterministic PRNG for item IDs
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	characters := make(map[types.CharacterName]*types.Character)

	// Solas Mercer - Leader
	characters[types.CharacterSolasMercer] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitLegatusLegionis: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillTriarii:              true,
			types.SkillTactician:            true,
			types.SkillExperiencedCommander: true,
			types.SkillGunsFundamental:      true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponUniqueGunsP2075,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Momo Tzigane - Tank
	characters[types.CharacterMomoTzigane] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitDefender: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillInfantry:  true,
			types.SkillProtector: true,
			types.SkillTriarii:   true,
			types.SkillStalwart:  true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsPrincipes,
				Broken:   false,
			},
			types.EquipmentSlotBody: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemBodyHeavyLorica,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Val - Engineer
	characters[types.CharacterVal] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitHardworking: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillTechnician: true,
			types.SkillEngineer:   true,
			types.SkillArtisan:    true,
			types.SkillDiligent:   true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponUniqueVigiles45,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccOmniConverter,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Brianne "Bree" Cheeseworth - Pilot
	characters[types.CharacterBrianneCheeseworth] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitGungHo: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillPirate:          true,
			types.SkillAgile:           true,
			types.SkillMechpilot:       true,
			types.SkillGunsFundamental: true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsRondel,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Niral Pierce - Doctor
	characters[types.CharacterNiralPierce] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitMeticulous: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillSurgeon:        true,
			types.SkillPhysician:      true,
			types.SkillPharmacologist: true,
			types.SkillSavant:         true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory: map[string]*types.ShipCargo{
			random.GetRandomString(types.ITEM_ID_LENGTH, prng): {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemMedsVigorisk,
				Broken:   false,
			},
		},
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Tee'elise "Teal" Qing - Combat Medic
	characters[types.CharacterTealQing] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitAmorous: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillCombatMedic: true,
			types.SkillPhysician:   true,
			types.SkillAgile:       true,
			types.SkillInfantry:    true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory: map[string]*types.ShipCargo{
			random.GetRandomString(types.ITEM_ID_LENGTH, prng): {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemMedsSomnoxa,
				Broken:   false,
			},
		},
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsRondel,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// X7-Gastronia "Gass" Petalnova - Droid Chef
	characters[types.CharacterGassPetalnova] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitDroid: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillBotanist:   true,
			types.SkillCook:       true,
			types.SkillEngineer:   true,
			types.SkillDemolition: true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Ysara Mercer - Ace Pilot
	characters[types.CharacterYsaraMercer] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitDriven: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillProdigyLeader:   true,
			types.SkillAviator:         true,
			types.SkillGunsFundamental: true,
			types.SkillTactician:       true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsPugio,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Zedius Windsor - Support
	characters[types.CharacterZediusWindsor] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitCalm: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillTechnician: true,
			types.SkillProtector:  true,
			types.SkillMechpilot:  true,
			types.SkillStalwart:   true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Viero Alden - Ace
	characters[types.CharacterVieroAlden] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitAce: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillAviator:         true,
			types.SkillGunsFundamental: true,
			types.SkillStalwart:        true,
			types.SkillVisionary:       true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsPugio,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Soren Koda - Sniper
	characters[types.CharacterSorenKoda] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitDutiful: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillSniper:          true,
			types.SkillGunsFundamental: true,
			types.SkillDiligent:        true,
			types.SkillAdaptable:       true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotWeapon: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemWeaponGunsPugio,
				Broken:   false,
			},
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Alisa Huang - Diplomat
	characters[types.CharacterAlisaHuang] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitPopular: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillCommsSavvy:  true,
			types.SkillPersuasion:  true,
			types.SkillLogistician: true,
			types.SkillCook:        true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	// Rina Mikami - Silver
	characters[types.CharacterRinaMikami] = &types.Character{
		AP:    0,
		MaxAP: types.MAX_AP,
		Trait: map[types.Trait]bool{
			types.TraitRegenesis: true,
		},
		Skills: map[types.Skill]bool{
			types.SkillSilver:    true,
			types.SkillAdaptable: true,
			types.SkillSavant:    true,
			types.SkillVisionary: true,
		},
		Modifiers:    make(map[types.ModifierCharacter]*types.ModifierTracker),
		PlayerID:     "",
		CycleActions: make(map[int]types.Action),
		Inventory:    make(map[string]*types.ShipCargo),
		Equipment: map[types.CharacterEquipmentSlot]*types.ShipCargo{
			types.EquipmentSlotAcc1: {
				ID:       random.GetRandomString(types.ITEM_ID_LENGTH, prng),
				ItemName: types.ItemAccVoxlink,
				Broken:   false,
			},
		},
		Location: types.RoomDorms,
	}

	return characters
}
