package ally

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/dice"
	"nanosh/nakama-modules/gamelogic/utils/random"
)

// Specialists - Gain 1-2 civitates, +1-2 more if expedition has character with Silver skill
func Specialists(game *types.Game, gameID string, invokeTime int64, username string) (*types.Game, error) {
	// Check expedition exists
	if game.Expedition == nil {
		return nil, expeditionErrors.ErrNoActiveExpedition
	}

	// Check if any expedition member has Silver skill
	hasSilver := false
	for charName := range game.Expedition.Members {
		if char, exists := game.Characters[charName]; exists {
			if char.Skills != nil {
				if char.Skills[types.SkillSilver] {
					hasSilver = true
					break
				}
			}
		}
	}

	// Create deterministic PRNG using standard pattern
	prng := random.CreateSeededPRNG(gameID, invokeTime, username)

	// Base gain: 1-2 civitates
	civitatesGain := dice.RollRange(prng, 1, 2)

	// If has Silver skill, gain additional 1-2 civitates using SAME prng
	if hasSilver {
		bonusGain := dice.RollRange(prng, 1, 2)
		civitatesGain += bonusGain
	}

	// Add civitates to ship
	game.Ship.Civitates += civitatesGain

	return game, nil
}
