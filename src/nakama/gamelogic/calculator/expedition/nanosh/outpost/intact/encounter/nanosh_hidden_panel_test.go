package encounter

import (
	expeditionErrors "nanosh/nakama-modules/gamelogic/calculator/expedition"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/initial"
	"testing"
)

func TestNanoshHiddenPanel(t *testing.T) {
	t.Run("should add 1-2 ground threat without engineer/technician", func(t *testing.T) {
		// Create initial game state
		game, err := initial.GetInitialGame(nil)
		if err != nil {
			t.Fatalf("Failed to create initial game: %v", err)
		}

		// Add expedition with members who don't have engineer/technician skills
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  5, // Start with some threat
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // Has Triarii, Tactician, etc. but not Engineer/Technician
				types.CharacterMomoTzigane: true, // Has Infantry, Protector, etc. but not Engineer/Technician
			},
		}

		// Record initial ground threat
		initialThreat := game.Expedition.GroundThreat

		// Apply card effect
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, err := NanoshHiddenPanel(game, gameID, invokeTime, username)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		// Check ground threat increased by 1-2
		threatGain := result.Expedition.GroundThreat - initialThreat
		if threatGain < 1 || threatGain > 2 {
			t.Errorf("Expected ground threat to increase by 1-2, gained %d", threatGain)
		}
	})

	t.Run("should halve threat and remove from existing with engineer skill", func(t *testing.T) {
		// Test with Val who has Engineer skill
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  10, // Start with significant threat
			Members: map[types.CharacterName]bool{
				types.CharacterVal: true, // Has Engineer skill
			},
		}

		initialThreat := game.Expedition.GroundThreat

		// Apply card with fixed seed that would normally add 2 threat
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		result, _ := NanoshHiddenPanel(game, gameID, invokeTime, username)

		// With engineer: threat would be halved and then removed from existing
		// Roll 1->0 (no change), Roll 2->1 (decrease by 1)
		// So final threat should be <= initial (could be same if roll was 1)
		if result.Expedition.GroundThreat > initialThreat {
			t.Errorf("Expected threat to not increase with engineer, was %d now %d",
				initialThreat, result.Expedition.GroundThreat)
		}
	})

	t.Run("should work with technician skill", func(t *testing.T) {
		// Test with Zedius who has Technician skill
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  8, // Start with some threat
			Members: map[types.CharacterName]bool{
				types.CharacterZediusWindsor: true, // Has Technician skill
			},
		}

		initialThreat := game.Expedition.GroundThreat

		// Apply card
		gameID := "test-tech"
		invokeTime := int64(1000)
		username := "test-user"

		result, _ := NanoshHiddenPanel(game, gameID, invokeTime, username)

		// With technician: threat should not increase (same logic as engineer)
		if result.Expedition.GroundThreat > initialThreat {
			t.Errorf("Expected threat to not increase with technician, was %d now %d",
				initialThreat, result.Expedition.GroundThreat)
		}
	})

	t.Run("should handle threat reduction to zero", func(t *testing.T) {
		// Test when threat goes to 0
		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  1, // Low threat
			Members: map[types.CharacterName]bool{
				types.CharacterVal: true, // Has Engineer skill
			},
		}

		// Apply card
		gameID := "test-zero"
		invokeTime := int64(1000)
		username := "test-user"

		result, _ := NanoshHiddenPanel(game, gameID, invokeTime, username)

		// Threat should never go below 0
		if result.Expedition.GroundThreat < 0 {
			t.Errorf("Ground threat should not go below 0, got %d", result.Expedition.GroundThreat)
		}
	})

	t.Run("should return error when no expedition active", func(t *testing.T) {
		// Create game without expedition
		game, _ := initial.GetInitialGame(nil)

		// Try to apply card without expedition
		gameID := "test-game-123"
		invokeTime := int64(1000)
		username := "test-user"

		_, err := NanoshHiddenPanel(game, gameID, invokeTime, username)
		if err != expeditionErrors.ErrNoActiveExpedition {
			t.Errorf("Expected ErrNoActiveExpedition, got %v", err)
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		// Test both with and without engineer/technician
		testCases := []struct {
			name    string
			members map[types.CharacterName]bool
		}{
			{
				"without Engineer/Technician",
				map[types.CharacterName]bool{
					types.CharacterSolasMercer: true,
					types.CharacterMomoTzigane: true,
				},
			},
			{
				"with Engineer",
				map[types.CharacterName]bool{
					types.CharacterVal:         true, // Has Engineer skill
					types.CharacterSolasMercer: true,
				},
			},
		}

		for _, tc := range testCases {
			t.Run(tc.name, func(t *testing.T) {
				// Create two identical games
				game1, _ := initial.GetInitialGame(nil)
				game2, _ := initial.GetInitialGame(nil)

				expedition1 := &types.Expedition{
					SupersectorID: "nanosh-01",
					Phase:         types.ExpeditionPhaseGroundTeam,
					GroundThreat:  5,
					Members:       tc.members,
				}
				expedition2 := &types.Expedition{
					SupersectorID: "nanosh-01",
					Phase:         types.ExpeditionPhaseGroundTeam,
					GroundThreat:  5,
					Members:       tc.members,
				}

				game1.Expedition = expedition1
				game2.Expedition = expedition2

				// Same seed parameters
				gameID := "test-game-123"
				invokeTime := int64(1000)
				username := "test-user"

				// Apply card to both games
				result1, _ := NanoshHiddenPanel(game1, gameID, invokeTime, username)
				result2, _ := NanoshHiddenPanel(game2, gameID, invokeTime, username)

				// Should have identical ground threat
				if result1.Expedition.GroundThreat != result2.Expedition.GroundThreat {
					t.Errorf("Expected deterministic results for %s, got %d and %d ground threat",
						tc.name, result1.Expedition.GroundThreat, result2.Expedition.GroundThreat)
				}
			})
		}
	})

	t.Run("should detect engineer/technician skills correctly", func(t *testing.T) {
		// Test explicit skill detection

		// Test 1: With engineer (should reduce threat)
		game1, _ := initial.GetInitialGame(nil)
		game1.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  10,
			Members: map[types.CharacterName]bool{
				types.CharacterVal: true, // Has Engineer
			},
		}

		initialThreat1 := game1.Expedition.GroundThreat
		result1, _ := NanoshHiddenPanel(game1, "test", int64(1000), "user")
		threatChange1 := result1.Expedition.GroundThreat - initialThreat1

		// Test 2: Without engineer/technician (should increase threat)
		game2, _ := initial.GetInitialGame(nil)
		game2.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  10,
			Members: map[types.CharacterName]bool{
				types.CharacterSolasMercer: true, // No Engineer/Technician
			},
		}

		initialThreat2 := game2.Expedition.GroundThreat
		result2, _ := NanoshHiddenPanel(game2, "test", int64(1000), "user")
		threatChange2 := result2.Expedition.GroundThreat - initialThreat2

		// With engineer should decrease threat by 1 (both roll 1 and 2 become 1), without should increase
		if threatChange1 != -1 {
			t.Errorf("Expected threat to decrease by 1 with engineer, got change %d", threatChange1)
		}
		if threatChange2 <= 0 {
			t.Errorf("Expected threat to increase without engineer, got change %d", threatChange2)
		}
	})

	t.Run("should test halving logic explicitly", func(t *testing.T) {
		// Test with known seed to verify halving math

		// Case 1: If random roll would be 2, with engineer it becomes 1 (ceil(2/2)), remove 1 from existing
		// Case 2: If random roll would be 1, with engineer it becomes 1 (ceil(1/2)), remove 1 from existing

		game, _ := initial.GetInitialGame(nil)
		game.Expedition = &types.Expedition{
			SupersectorID: "nanosh-01",
			Phase:         types.ExpeditionPhaseGroundTeam,
			GroundThreat:  5,
			Members: map[types.CharacterName]bool{
				types.CharacterVal: true, // Has Engineer
			},
		}

		initialThreat := game.Expedition.GroundThreat

		// Apply multiple times with different seeds to see halving in action
		threatReductions := make([]int, 0)
		for i := 0; i < 20; i++ {
			gameCopy, _ := initial.GetInitialGame(nil)
			gameCopy.Expedition = &types.Expedition{
				SupersectorID: "nanosh-01",
				Phase:         types.ExpeditionPhaseGroundTeam,
				GroundThreat:  5,
				Members: map[types.CharacterName]bool{
					types.CharacterVal: true,
				},
			}

			result, _ := NanoshHiddenPanel(gameCopy, "test", int64(i*1000), "user")
			reduction := initialThreat - result.Expedition.GroundThreat
			threatReductions = append(threatReductions, reduction)
		}

		// Should see only reductions of 1
		// When roll=1: ceil(1/2)=1, remove 1 from existing
		// When roll=2: ceil(2/2)=1, remove 1 from existing
		hasOneReduction := false
		for _, reduction := range threatReductions {
			if reduction == 1 {
				hasOneReduction = true
			} else if reduction != 1 {
				t.Errorf("Expected all reductions to be 1, but got %d", reduction)
			}
		}

		if !hasOneReduction {
			t.Errorf("Expected to see threat reductions of 1, got: %v", threatReductions)
		}
	})
}
