package event

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
)

// TargetedOrder - Blitzhopper suffers 1 dmg. If expedition has Mechpilot skill, this is negated
func TargetedOrder(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check if any expedition member has Mechpilot skill
	hasMechpilot := false
	for charName := range game.Expedition.Members {
		if char, exists := game.Characters[charName]; exists {
			if char.Skills != nil {
				if char.Skills[types.SkillMechpilot] {
					hasMechpilot = true
					break
				}
			}
		}
	}

	// If no Mechpilot skill, damage blitzhopper by 1
	if !hasMechpilot {
		// Find and damage blitzhopper
		for _, craft := range game.Ship.ExpoCrafts {
			if craft.Type == types.ExpoCraftBlitzhopper {
				craft.Health -= 1
				// Ensure health doesn't go below 0
				if craft.Health < 0 {
					craft.Health = 0
				}
				break
			}
		}
	}
	// If has Mechpilot skill, effect is negated (do nothing)

	return game, nil
}