package random

import (
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"math/rand"
	"sort"
)

// CreateSeededPRNG creates a deterministic PRNG from string components.
// This allows for reproducible random sequences based on game state and user actions.
// The seed string format is: "gameID-invokeTime-username"
func CreateSeededPRNG(gameID string, invokeTime int64, username string) *rand.Rand {
	// Combine into seed string like TypeScript version
	seedStr := fmt.Sprintf("%s-%d-%s", gameID, invokeTime, username)
	
	// Hash the string to get a deterministic int64
	hash := sha256.Sum256([]byte(seedStr))
	// Take first 8 bytes of hash as int64
	seed := int64(binary.BigEndian.Uint64(hash[:8]))
	
	// Create and return the seeded PRNG
	return rand.New(rand.NewSource(seed))
}

// GetRandomArray shuffles an array and returns the first N elements.
// Uses Fisher-Yates shuffle algorithm.
func GetRandomArray[T any](array []T, retrievedTotal int, prng *rand.Rand) []T {
	// Make a copy to avoid modifying original
	arr := make([]T, len(array))
	copy(arr, array)
	
	// Fisher-Yates shuffle
	currentIndex := len(arr)
	for currentIndex > 0 {
		randomIndex := prng.Intn(currentIndex)
		currentIndex--
		// Swap elements
		arr[currentIndex], arr[randomIndex] = arr[randomIndex], arr[currentIndex]
	}
	
	// Return only the requested number of elements
	if retrievedTotal > len(arr) {
		retrievedTotal = len(arr)
	}
	return arr[:retrievedTotal]
}

// GetRandomSetString shuffles a string set's elements and returns a new set with N elements.
// Specialized for string sets to ensure deterministic ordering.
func GetRandomSetString(set map[string]bool, retrievedTotal int, prng *rand.Rand) map[string]bool {
	// Convert set to array with sorted keys for deterministic behavior
	arr := make([]string, 0, len(set))
	for item := range set {
		arr = append(arr, item)
	}
	// Sort to ensure deterministic ordering regardless of map iteration
	sort.Strings(arr)
	
	// Get random subset
	randomArr := GetRandomArray(arr, retrievedTotal, prng)
	
	// Convert back to set
	result := make(map[string]bool)
	for _, item := range randomArr {
		result[item] = true
	}
	
	return result
}

// GetRandomSetInt shuffles an int set's elements and returns a new set with N elements.
// Specialized for int sets to ensure deterministic ordering.
func GetRandomSetInt(set map[int]bool, retrievedTotal int, prng *rand.Rand) map[int]bool {
	// Convert set to array with sorted keys for deterministic behavior
	arr := make([]int, 0, len(set))
	for item := range set {
		arr = append(arr, item)
	}
	// Sort to ensure deterministic ordering regardless of map iteration
	sort.Ints(arr)
	
	// Get random subset
	randomArr := GetRandomArray(arr, retrievedTotal, prng)
	
	// Convert back to set
	result := make(map[int]bool)
	for _, item := range randomArr {
		result[item] = true
	}
	
	return result
}

// GetRandomString generates a random string of specified length using a-zA-Z characters.
func GetRandomString(length int, prng *rand.Rand) string {
	const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
	// Convert string to byte slice for random selection
	letterBytes := []byte(letters)
	
	// Generate random string
	result := make([]byte, length)
	for i := range length {
		result[i] = letterBytes[prng.Intn(len(letterBytes))]
	}
	
	return string(result)
}