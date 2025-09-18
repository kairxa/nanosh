package dice

import (
	"math/rand"
)

// Roll rolls multiple dice of given type and returns total
// Example: Roll(prng, 3, 6) rolls 3d6
func Roll(prng *rand.Rand, count int, diceType int) int {
	total := 0
	for range count {
		total += prng.Intn(diceType) + 1 // +1 because Intn gives 0 to n-1
	}
	return total
}

// RollWithModifier rolls dice and adds modifier
// Example: RollWithModifier(prng, 2, 6, 3) rolls 2d6+3
func RollWithModifier(prng *rand.Rand, count int, diceType int, modifier int) int {
	return Roll(prng, count, diceType) + modifier
}

// RollSingle rolls a single die
// Example: RollSingle(prng, 20) rolls 1d20
func RollSingle(prng *rand.Rand, diceType int) int {
	return prng.Intn(diceType) + 1
}

// RollRange generates number between min and max (inclusive)
// Similar to MinMaxStruct but as function
func RollRange(prng *rand.Rand, min int, max int) int {
	if min >= max {
		return min
	}
	return prng.Intn(max-min+1) + min
}

// RollMultiple rolls dice and returns individual results
// Useful when you need to know each die result, not just total
func RollMultiple(prng *rand.Rand, count int, diceType int) []int {
	results := make([]int, count)
	for i := range count {
		results[i] = prng.Intn(diceType) + 1
	}
	return results
}

// Common dice types as constants for convenience
const (
	D4   = 4
	D6   = 6
	D8   = 8
	D10  = 10
	D12  = 12
	D20  = 20
	D100 = 100
)