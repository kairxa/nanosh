package random

import (
	"slices"
	"testing"
)

func TestCreateSeededPRNG(t *testing.T) {
	t.Run("should create deterministic PRNG from string components", func(t *testing.T) {
		gameID := "test-game-123"
		invokeTime := int64(1699564800)
		username := "alice"

		// Create two PRNGs with same seed
		prng1 := CreateSeededPRNG(gameID, invokeTime, username)
		prng2 := CreateSeededPRNG(gameID, invokeTime, username)

		// They should produce same sequence
		for range 10 {
			val1 := prng1.Float64()
			val2 := prng2.Float64()
			if val1 != val2 {
				t.Errorf("PRNGs with same seed produced different values: %f vs %f", val1, val2)
			}
		}
	})

	t.Run("should create different PRNG with different components", func(t *testing.T) {
		prng1 := CreateSeededPRNG("game1", 1000, "alice")
		prng2 := CreateSeededPRNG("game2", 1000, "alice")
		prng3 := CreateSeededPRNG("game1", 2000, "alice")
		prng4 := CreateSeededPRNG("game1", 1000, "bob")

		// All should produce different first value
		val1 := prng1.Float64()
		val2 := prng2.Float64()
		val3 := prng3.Float64()
		val4 := prng4.Float64()

		if val1 == val2 || val1 == val3 || val1 == val4 || val2 == val3 || val2 == val4 || val3 == val4 {
			t.Error("PRNGs with different seeds produced same values")
		}
	})
}

func TestGetRandomArray(t *testing.T) {
	prng := CreateSeededPRNG("test", 1000, "user")

	t.Run("should shuffle array and return requested elements", func(t *testing.T) {
		original := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

		// Get 5 random elements
		result := GetRandomArray(original, 5, prng)

		if len(result) != 5 {
			t.Errorf("Expected 5 elements, got %d", len(result))
		}

		// Check all elements are from original
		for _, val := range result {
			if !slices.Contains(original, val) {
				t.Errorf("Result contains element %d not in original array", val)
			}
		}
	})

	t.Run("should not modify original array", func(t *testing.T) {
		original := []int{1, 2, 3, 4, 5}
		originalCopy := make([]int, len(original))
		copy(originalCopy, original)

		_ = GetRandomArray(original, 3, prng)

		// Original should be unchanged
		for i, val := range original {
			if val != originalCopy[i] {
				t.Error("Original array was modified")
			}
		}
	})

	t.Run("should handle request for more elements than available", func(t *testing.T) {
		original := []int{1, 2, 3}
		result := GetRandomArray(original, 10, prng)

		if len(result) != 3 {
			t.Errorf("Expected 3 elements (all available), got %d", len(result))
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		prng1 := CreateSeededPRNG("test", 1000, "user")
		prng2 := CreateSeededPRNG("test", 1000, "user")

		original := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

		result1 := GetRandomArray(original, 5, prng1)
		result2 := GetRandomArray(original, 5, prng2)

		// Results should be identical
		for i := range result1 {
			if result1[i] != result2[i] {
				t.Error("Same seed produced different random arrays")
			}
		}
	})
}

func TestGetRandomSetString(t *testing.T) {
	prng := CreateSeededPRNG("test", 1000, "user")

	t.Run("should return random subset of requested size", func(t *testing.T) {
		original := map[string]bool{
			"a": true, "b": true, "c": true, "d": true, "e": true,
		}

		result := GetRandomSetString(original, 3, prng)

		if len(result) != 3 {
			t.Errorf("Expected 3 elements, got %d", len(result))
		}

		// All elements should be from original
		for key := range result {
			if !original[key] {
				t.Errorf("Result contains element %s not in original set", key)
			}
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		prng1 := CreateSeededPRNG("test", 2000, "user")
		prng2 := CreateSeededPRNG("test", 2000, "user")

		original := map[string]bool{
			"a": true, "b": true, "c": true, "d": true, "e": true,
		}

		result1 := GetRandomSetString(original, 3, prng1)
		result2 := GetRandomSetString(original, 3, prng2)

		t.Logf("result1: %v", result1)
		t.Logf("result2: %v", result2)

		// Results should be identical
		if len(result1) != len(result2) {
			t.Error("Same seed produced different sized sets")
		}

		for key := range result1 {
			if !result2[key] {
				t.Errorf("Same seed produced different random sets: missing %s", key)
			}
		}
	})
}

func TestGetRandomSetInt(t *testing.T) {
	prng := CreateSeededPRNG("test", 1000, "user")

	t.Run("should return random subset of requested size", func(t *testing.T) {
		original := map[int]bool{
			1: true, 2: true, 3: true, 4: true, 5: true,
		}

		result := GetRandomSetInt(original, 3, prng)

		if len(result) != 3 {
			t.Errorf("Expected 3 elements, got %d", len(result))
		}

		// All elements should be from original
		for key := range result {
			if !original[key] {
				t.Errorf("Result contains element %d not in original set", key)
			}
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		prng1 := CreateSeededPRNG("test", 3000, "user")
		prng2 := CreateSeededPRNG("test", 3000, "user")

		original := map[int]bool{
			1: true, 2: true, 3: true, 4: true, 5: true,
		}

		result1 := GetRandomSetInt(original, 3, prng1)
		result2 := GetRandomSetInt(original, 3, prng2)

		t.Logf("result1: %v", result1)
		t.Logf("result2: %v", result2)

		// Results should be identical
		if len(result1) != len(result2) {
			t.Error("Same seed produced different sized sets")
		}

		for key := range result1 {
			if !result2[key] {
				t.Errorf("Same seed produced different random sets: missing %d", key)
			}
		}
	})
}

func TestGetRandomString(t *testing.T) {
	prng := CreateSeededPRNG("test", 1000, "user")

	t.Run("should generate string of requested length", func(t *testing.T) {
		result := GetRandomString(10, prng)

		if len(result) != 10 {
			t.Errorf("Expected string of length 10, got %d", len(result))
		}
	})

	t.Run("should only contain a-zA-Z characters", func(t *testing.T) {
		result := GetRandomString(100, prng)

		for _, char := range result {
			if !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
				t.Errorf("String contains invalid character: %c", char)
			}
		}
	})

	t.Run("should be deterministic with same seed", func(t *testing.T) {
		prng1 := CreateSeededPRNG("test", 3000, "user")
		prng2 := CreateSeededPRNG("test", 3000, "user")

		result1 := GetRandomString(20, prng1)
		result2 := GetRandomString(20, prng2)

		if result1 != result2 {
			t.Errorf("Same seed produced different strings: %s vs %s", result1, result2)
		}
	})

	t.Run("should produce different strings with different seeds", func(t *testing.T) {
		prng1 := CreateSeededPRNG("test1", 1000, "user")
		prng2 := CreateSeededPRNG("test2", 1000, "user")

		result1 := GetRandomString(20, prng1)
		result2 := GetRandomString(20, prng2)

		if result1 == result2 {
			t.Error("Different seeds produced same string")
		}
	})

	t.Run("should show example output for debugging", func(t *testing.T) {
		testPrng := CreateSeededPRNG("game-123", 1699564800, "alice")

		t.Log("=== RANDOM STRING EXAMPLES ===")
		t.Logf("Seed: game-123-1699564800-alice")
		for i := range 5 {
			str := GetRandomString(12, testPrng)
			t.Logf("Random ID %d: %s", i+1, str)
		}
	})
}
