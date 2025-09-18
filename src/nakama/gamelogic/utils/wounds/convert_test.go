package wounds

import (
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestConvertLightWoundsToCritical(t *testing.T) {
	t.Run("should convert 3 light wounds to 1 critical", func(t *testing.T) {
		char := &types.Character{
			Modifiers: map[types.ModifierCharacter]*types.ModifierTracker{
				types.ModifierCharacterWoundLight: {
					Amount:     3,
					Persistent: false,
				},
			},
		}

		ConvertLightWoundsToCritical(char)

		// Should have 0 light wounds
		if lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]; hasLight {
			t.Errorf("Expected no light wounds, got %d", lightMod.Amount)
		}

		// Should have 1 critical wound
		criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]
		if !hasCritical {
			t.Fatal("Expected critical wound modifier")
		}
		if criticalMod.Amount != 1 {
			t.Errorf("Expected 1 critical wound, got %d", criticalMod.Amount)
		}
	})

	t.Run("should convert 7 light wounds to 2 critical and 1 light", func(t *testing.T) {
		char := &types.Character{
			Modifiers: map[types.ModifierCharacter]*types.ModifierTracker{
				types.ModifierCharacterWoundLight: {
					Amount:     7,
					Persistent: false,
				},
			},
		}

		ConvertLightWoundsToCritical(char)

		// Should have 1 light wound remaining
		lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]
		if !hasLight {
			t.Fatal("Expected light wound modifier")
		}
		if lightMod.Amount != 1 {
			t.Errorf("Expected 1 light wound remaining, got %d", lightMod.Amount)
		}

		// Should have 2 critical wounds
		criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]
		if !hasCritical {
			t.Fatal("Expected critical wound modifier")
		}
		if criticalMod.Amount != 2 {
			t.Errorf("Expected 2 critical wounds, got %d", criticalMod.Amount)
		}
	})

	t.Run("should add to existing critical wounds", func(t *testing.T) {
		char := &types.Character{
			Modifiers: map[types.ModifierCharacter]*types.ModifierTracker{
				types.ModifierCharacterWoundLight: {
					Amount:     6,
					Persistent: false,
				},
				types.ModifierCharacterWoundCritical: {
					Amount:     1,
					Persistent: false,
				},
			},
		}

		ConvertLightWoundsToCritical(char)

		// Should have no light wounds
		if lightMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]; hasLight {
			t.Errorf("Expected no light wounds, got %d", lightMod.Amount)
		}

		// Should have 3 critical wounds (1 existing + 2 converted)
		criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]
		if !hasCritical {
			t.Fatal("Expected critical wound modifier")
		}
		if criticalMod.Amount != 3 {
			t.Errorf("Expected 3 critical wounds, got %d", criticalMod.Amount)
		}
	})
}

func TestCheckCharacterDeath(t *testing.T) {
	t.Run("should remove character from game when 3 critical wounds", func(t *testing.T) {
		// Create game with a character
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterSolasMercer

		// Give character 3 critical wounds
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     3,
				Persistent: false,
			}
		}

		// Check death
		CheckCharacterDeath(game, charName)

		// Character should be removed from active characters
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}

		// Character should be in dead list
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})

	t.Run("should remove from expedition when character dies", func(t *testing.T) {
		// Create game with expedition
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterSolasMercer

		// Add character to expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				charName:                   true,
				types.CharacterMomoTzigane: true,
			},
		}

		// Give character 2 stabilized + 1 critical (total 3)
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundStabilizedCritical] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Apply critical wound (should trigger death)
		ApplyCriticalWoundWithDeath(game, charName, 1)

		// Should be removed from expedition
		if game.Expedition.Members[charName] {
			t.Error("Dead character should be removed from expedition")
		}

		// Other member should still be there
		if !game.Expedition.Members[types.CharacterMomoTzigane] {
			t.Error("Other expedition member should remain")
		}

		// Should be in dead list
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})

	t.Run("should handle mixed critical and stabilized wounds totaling 3", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterVal

		// 1 critical + 1 stabilized critical
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     1,
				Persistent: false,
			}
			char.Modifiers[types.ModifierCharacterWoundStabilizedCritical] = &types.ModifierTracker{
				Amount:     1,
				Persistent: false,
			}
		}

		// Add 1 more critical (total 3)
		ApplyCriticalWoundWithDeath(game, charName, 1)

		// Should be dead
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})

	t.Run("should not kill when total less than 3", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterNiralPierce

		// 1 critical + 1 stabilized (total 2)
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     1,
				Persistent: false,
			}
			char.Modifiers[types.ModifierCharacterWoundStabilizedCritical] = &types.ModifierTracker{
				Amount:     1,
				Persistent: false,
			}
		}

		CheckCharacterDeath(game, charName)

		// Should NOT be dead
		if _, exists := game.Characters[charName]; !exists {
			t.Error("Character should still be alive")
		}
		if game.CharactersDead[charName] {
			t.Error("Character should not be in dead list")
		}
	})
}

func TestApplyLightWoundWithDeath(t *testing.T) {
	t.Run("should kill character when light wounds convert to 3 critical", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterSolasMercer

		// Give character 8 light wounds
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
				Amount:     8,
				Persistent: false,
			}
		}

		// Apply 1 more light wound (total 9 = 3 critical)
		ApplyLightWoundWithDeath(game, charName, 1)

		// Should be dead
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})

	t.Run("should handle conversion with existing critical wounds", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterMomoTzigane

		// 2 critical + 2 light wounds
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
			char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Add 1 light wound (converts to 3rd critical)
		ApplyLightWoundWithDeath(game, charName, 1)

		// Should be dead
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})
}

func TestApplyCriticalWoundWithDeath(t *testing.T) {
	t.Run("should kill when reaching 3 critical wounds", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterVal

		// Give 2 critical wounds
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Apply 1 more critical
		ApplyCriticalWoundWithDeath(game, charName, 1)

		// Should be dead
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})
}

func TestApplyStabilizedCriticalWoundWithDeath(t *testing.T) {
	t.Run("should kill when total critical wounds reaches 3", func(t *testing.T) {
		game, _ := initial.GetInitialGame(nil)
		charName := types.CharacterNiralPierce

		// 2 stabilized critical wounds
		if char, exists := game.Characters[charName]; exists {
			if char.Modifiers == nil {
				char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
			}
			char.Modifiers[types.ModifierCharacterWoundStabilizedCritical] = &types.ModifierTracker{
				Amount:     2,
				Persistent: false,
			}
		}

		// Add 1 more stabilized critical
		ApplyStabilizedCriticalWoundWithDeath(game, charName, 1)

		// Should be dead
		if _, exists := game.Characters[charName]; exists {
			t.Error("Character should be removed from active characters")
		}
		if !game.CharactersDead[charName] {
			t.Error("Character should be in dead list")
		}
	})
}
