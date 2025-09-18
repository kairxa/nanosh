package wounds

import (
	"nanosh/nakama-modules/gamelogic/types"
)

// ConvertLightWoundsToCritical checks if a character has 3+ light wounds
// and converts them to critical wounds (3 light = 1 critical)
func ConvertLightWoundsToCritical(char *types.Character) {
	if char == nil || char.Modifiers == nil {
		return
	}

	// Check if character has light wounds
	lightWoundMod, hasLight := char.Modifiers[types.ModifierCharacterWoundLight]
	if !hasLight || lightWoundMod.Amount < 3 {
		return // Not enough light wounds to convert
	}

	// Calculate conversion: 3 light wounds = 1 critical wound
	criticalToAdd := lightWoundMod.Amount / 3
	remainingLight := lightWoundMod.Amount % 3

	// Add or update critical wounds
	if criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]; hasCritical {
		criticalMod.Amount += criticalToAdd
	} else {
		char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
			Amount:     criticalToAdd,
			Persistent: false,
		}
	}

	// Update or remove light wounds
	if remainingLight > 0 {
		lightWoundMod.Amount = remainingLight
	} else {
		// Remove light wound modifier if none remain
		delete(char.Modifiers, types.ModifierCharacterWoundLight)
	}
}

// ConvertLightWoundsToCriticalWithDeath same as ConvertLightWoundsToCritical but checks for death
func ConvertLightWoundsToCriticalWithDeath(game *types.Game, charName types.CharacterName) {
	char, exists := game.Characters[charName]
	if !exists {
		return
	}

	ConvertLightWoundsToCritical(char)
	CheckCharacterDeath(game, charName)
}

// ApplyLightWound adds a light wound to a character and auto-converts if needed
// Use this when you don't have access to game state (for simple wound application)
func ApplyLightWound(char *types.Character, amount int) {
	if char == nil {
		return
	}

	// Initialize modifiers map if nil
	if char.Modifiers == nil {
		char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
	}

	// Add or stack light wound
	if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundLight]; hasWound {
		modifier.Amount += amount
	} else {
		char.Modifiers[types.ModifierCharacterWoundLight] = &types.ModifierTracker{
			Amount:     amount,
			Persistent: false,
		}
	}

	// Auto-convert if we have 3+ light wounds
	ConvertLightWoundsToCritical(char)
}

// ApplyLightWoundWithDeath adds a light wound and handles death properly
func ApplyLightWoundWithDeath(game *types.Game, charName types.CharacterName, amount int) {
	char, exists := game.Characters[charName]
	if !exists {
		return
	}

	ApplyLightWound(char, amount)
	CheckCharacterDeath(game, charName)
}

// CheckCharacterDeath checks if character should be dead and handles removal
// Death occurs when total of critical + stabilized critical wounds >= 3
func CheckCharacterDeath(game *types.Game, charName types.CharacterName) {
	if game == nil {
		return
	}

	char, exists := game.Characters[charName]
	if !exists || char == nil || char.Modifiers == nil {
		return
	}

	totalCritical := 0

	// Count critical wounds
	if criticalMod, hasCritical := char.Modifiers[types.ModifierCharacterWoundCritical]; hasCritical {
		totalCritical += criticalMod.Amount
	}

	// Count stabilized critical wounds
	if stabilizedMod, hasStabilized := char.Modifiers[types.ModifierCharacterWoundStabilizedCritical]; hasStabilized {
		totalCritical += stabilizedMod.Amount
	}

	// If total critical wounds >= 3, character is dead
	if totalCritical >= 3 {
		// Add to dead characters list
		if game.CharactersDead == nil {
			game.CharactersDead = make(map[types.CharacterName]bool)
		}
		game.CharactersDead[charName] = true

		// Remove from active characters
		delete(game.Characters, charName)

		// Remove from expedition if present
		if game.Expedition != nil && game.Expedition.Members != nil {
			delete(game.Expedition.Members, charName)
		}
	}
}

// ApplyCriticalWound adds a critical wound to a character and checks for death
func ApplyCriticalWound(char *types.Character, amount int) {
	if char == nil {
		return
	}

	// Initialize modifiers map if nil
	if char.Modifiers == nil {
		char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
	}

	// Add or stack critical wound
	if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundCritical]; hasWound {
		modifier.Amount += amount
	} else {
		char.Modifiers[types.ModifierCharacterWoundCritical] = &types.ModifierTracker{
			Amount:     amount,
			Persistent: false,
		}
	}
}

// ApplyCriticalWoundWithDeath adds critical wound and handles death properly
func ApplyCriticalWoundWithDeath(game *types.Game, charName types.CharacterName, amount int) {
	char, exists := game.Characters[charName]
	if !exists {
		return
	}

	ApplyCriticalWound(char, amount)
	CheckCharacterDeath(game, charName)
}

// ApplyStabilizedCriticalWound adds a stabilized critical wound
func ApplyStabilizedCriticalWound(char *types.Character, amount int) {
	if char == nil {
		return
	}

	// Initialize modifiers map if nil
	if char.Modifiers == nil {
		char.Modifiers = make(map[types.ModifierCharacter]*types.ModifierTracker)
	}

	// Add or stack stabilized critical wound
	if modifier, hasWound := char.Modifiers[types.ModifierCharacterWoundStabilizedCritical]; hasWound {
		modifier.Amount += amount
	} else {
		char.Modifiers[types.ModifierCharacterWoundStabilizedCritical] = &types.ModifierTracker{
			Amount:     amount,
			Persistent: false,
		}
	}
}

// ApplyStabilizedCriticalWoundWithDeath adds stabilized critical wound and handles death
func ApplyStabilizedCriticalWoundWithDeath(game *types.Game, charName types.CharacterName, amount int) {
	char, exists := game.Characters[charName]
	if !exists {
		return
	}

	ApplyStabilizedCriticalWound(char, amount)
	CheckCharacterDeath(game, charName)
}
