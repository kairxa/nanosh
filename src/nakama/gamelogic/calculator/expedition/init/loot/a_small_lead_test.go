package loot

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestASmallLead(t *testing.T) {
	t.Run("should add 1 Basic Intel", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true,
			},
		}

		// Record initial intel
		initialIntel := game.Intel.Basic

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := ASmallLead(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check intel increased by 1
		if result.Intel.Basic != initialIntel+1 {
			t.Errorf("Expected Basic Intel to increase by 1, was %d now %d",
				initialIntel, result.Intel.Basic)
		}

		// Check critical intel unchanged
		if result.Intel.Critical != game.Intel.Critical {
			t.Error("Critical Intel should not change")
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

		_, err = ASmallLead(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic (no randomness)", func(t *testing.T) {
		// Since this card has no random element, test it always gives same result
		for i := 0; i < 5; i++ {
			game, _ := initial.GetInitialGame(nil)
			game.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				Members: map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
				},
			}

			initialIntel := game.Intel.Basic

			// Different seeds each time
			gameID := "different-game"
			invokeTime := int64(1000 + i*100)
			username := "different-user"

			result, _ := ASmallLead(game, gameID, invokeTime, username)

			gain := result.Intel.Basic - initialIntel
			if gain != 1 {
				t.Errorf("Iteration %d: Expected consistent gain of 1, got %d", i, gain)
			}
		}
	})
}
