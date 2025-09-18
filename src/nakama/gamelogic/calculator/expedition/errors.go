package expedition

import "errors"

// Common errors for expedition cards
var (
	// ErrNoActiveExpedition when no expedition is active
	ErrNoActiveExpedition = errors.New("no active expedition")

	// ErrNoExpeditionMembers when expedition has no members
	ErrNoExpeditionMembers = errors.New("expedition has no members")
)
