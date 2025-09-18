package types

// Constants
const (
	ITEM_ID_LENGTH    = 8
	MAX_CYCLE_PER_DAY = 4

	TOTAL_SUPERSECTORS                = 12
	DEFAULT_ANTARCTICA_SUPERSECTOR_ID = 12
	DEFAULT_SUBSECTORS_SIZE           = 10
	ANTARCTICA_SUBSECTORS_SIZE        = 4

	MAX_ACTIONS_PER_CYCLE = 3
	MAX_AP                = 12
	MAX_MORALE            = 20
	MAX_NANOSH_SYMPATHY   = 10

	LW_CW_CONVERSION_AMOUNT       = 3
	FRUSTRATED_DEPRIVED_THRESHOLD = 12

	INITIAL_MORALE          = 12
	INITIAL_NANOSH_SYMPATHY = 0

	HP_NANOSH_MAIN_BASE = 50
	HP_NANOSH_AUX_BASE  = 25
	HP_NANOSH_OUTPOST   = 10

	CANNON_DEFAULT_MIN_DAMAGE = 5
	CANNON_DEFAULT_MAX_DAMAGE = 8

	PROJECT_QUEUE_MAX_SIZE = 3
)

type MinMaxStruct struct {
	Min int `json:"min"`
	Max int `json:"max"`
}

type GenericCalculatorParams struct {
	GameID      string        `json:"gameID"`
	State       *Game         `json:"state"`
	InvokeTime  int64         `json:"invokeTime"`
	PlayerID    string        `json:"playerID"`
	CharacterID CharacterName `json:"characterID"`
}

// DefaultCalculatorReturnType represents the standard return type for game actions
// Returns either a new game state or an error
type DefaultCalculatorReturnType struct {
	State *Game
	Error error
}
