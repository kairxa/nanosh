package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// NanoshHiddenPanel - Add 1-2 ground threat. If expedition has Engineer/Technician, halve threat and remove from existing
func NanoshHiddenPanel(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check if any expedition member has Engineer or Technician skill
	hasEngineerOrTech := false
	for charName := range game.Expedition.Members {
		if char, exists := game.Characters[charName]; exists {
			if char.Skills != nil {
				if char.Skills[types.SkillEngineer] || char.Skills[types.SkillTechnician] {
					hasEngineerOrTech = true
					break
				}
			}
		}
	}

	// Create deterministic PRNG
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Roll for base threat increase (1-2)
	baseThreatIncrease := dice.RollRange(prng, 1, 2)

	if hasEngineerOrTech {
		// Halve the threat and round UP: "2 become 1, 1 become 1, 3 become 2, 4 become 2"
		// Use ceiling division: (value + 1) / 2
		halvedThreat := (baseThreatIncrease + 1) / 2

		// Remove that amount from existing ground threat instead of adding
		game.Expedition.GroundThreat -= halvedThreat

		// Ensure threat doesn't go below 0
		if game.Expedition.GroundThreat < 0 {
			game.Expedition.GroundThreat = 0
		}
	} else {
		// No engineer/technician: add threat normally
		game.Expedition.GroundThreat += baseThreatIncrease
	}

	return game, nil
}