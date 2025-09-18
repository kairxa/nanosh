package dice

import (
	"math/rand"
	"testing"
)

func TestRoll(t *testing.T) {
	prng := rand.New(rand.NewSource(42))

	t.Run("should roll dice within valid range", func(t *testing.T) {
		// Roll 3d6 many times
		for range 100 {
			result := Roll(prng, 3, 6)
			if result < 3 || result > 18 {
				t.Errorf("3d6 roll %d is out of range [3, 18]", result)
			}
		}
	})

	t.Run("should handle single die", func(t *testing.T) {
		result := Roll(prng, 1, 20)
		if result < 1 || result > 20 {
			t.Errorf("1d20 roll %d is out of range [1, 20]", result)
		}
	})

	t.Run("should handle zero dice", func(t *testing.T) {
		result := Roll(prng, 0, 6)
		if result != 0 {
			t.Errorf("0d6 should return 0, got %d", result)
		}
	})
}

func TestRollWithModifier(t *testing.T) {
	prng := rand.New(rand.NewSource(42))

	t.Run("should add positive modifier", func(t *testing.T) {
		// Roll 2d6+3, minimum should be 5 (2+3)
		for range 50 {
			result := RollWithModifier(prng, 2, 6, 3)
			if result < 5 || result > 15 {
				t.Errorf("2d6+3 roll %d is out of range [5, 15]", result)
			}
		}
	})

	t.Run("should handle negative modifier", func(t *testing.T) {
		// Roll 1d20-5
		result := RollWithModifier(prng, 1, 20, -5)
		if result < -4 || result > 15 {
			t.Errorf("1d20-5 roll %d is out of range [-4, 15]", result)
		}
	})
}

func TestRollSingle(t *testing.T) {
	prng := rand.New(rand.NewSource(42))

	t.Run("should roll single d20", func(t *testing.T) {
		for range 50 {
			result := RollSingle(prng, 20)
			if result < 1 || result > 20 {
				t.Errorf("d20 roll %d is out of range [1, 20]", result)
			}
		}
	})

	t.Run("should roll single d6", func(t *testing.T) {
		for range 50 {
			result := RollSingle(prng, 6)
			if result < 1 || result > 6 {
				t.Errorf("d6 roll %d is out of range [1, 6]", result)
			}
		}
	})
}

func TestRollRange(t *testing.T) {
	prng := rand.New(rand.NewSource(42))

	t.Run("should generate number in range", func(t *testing.T) {
		for range 100 {
			result := RollRange(prng, 5, 8)
			if result < 5 || result > 8 {
				t.Errorf("RollRange(5,8) gave %d, expected [5, 8]", result)
			}
		}
	})

	t.Run("should handle min equals max", func(t *testing.T) {
		result := RollRange(prng, 7, 7)
		if result != 7 {
			t.Errorf("RollRange(7,7) should always return 7, got %d", result)
		}
	})

	t.Run("should handle min greater than max", func(t *testing.T) {
		result := RollRange(prng, 10, 5)
		if result != 10 {
			t.Errorf("RollRange(10,5) should return min value 10, got %d", result)
		}
	})
}

func TestRollMultiple(t *testing.T) {
	prng := rand.New(rand.NewSource(42))

	t.Run("should return array of individual rolls", func(t *testing.T) {
		results := RollMultiple(prng, 4, 6)

		if len(results) != 4 {
			t.Errorf("Expected 4 results, got %d", len(results))
		}

		for i, roll := range results {
			if roll < 1 || roll > 6 {
				t.Errorf("Die %d rolled %d, out of range [1, 6]", i, roll)
			}
		}
	})

	t.Run("should handle zero dice", func(t *testing.T) {
		results := RollMultiple(prng, 0, 6)
		if len(results) != 0 {
			t.Errorf("Expected empty array for 0 dice, got %v", results)
		}
	})
}

func TestDeterminism(t *testing.T) {
	t.Run("should be deterministic with same seed", func(t *testing.T) {
		prng1 := rand.New(rand.NewSource(12345))
		prng2 := rand.New(rand.NewSource(12345))

		for range 10 {
			result1 := Roll(prng1, 3, 6)
			result2 := Roll(prng2, 3, 6)
			if result1 != result2 {
				t.Errorf("Same seed should give same results: %d != %d", result1, result2)
			}
		}
	})

	t.Run("should differ with different seeds", func(t *testing.T) {
		prng1 := rand.New(rand.NewSource(12345))
		prng2 := rand.New(rand.NewSource(54321))

		// Roll many times, should differ at least once
		allSame := true
		for range 10 {
			if Roll(prng1, 1, 20) != Roll(prng2, 1, 20) {
				allSame = false
				break
			}
		}

		if allSame {
			t.Error("Different seeds should produce different results")
		}
	})
}