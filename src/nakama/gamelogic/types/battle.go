package types

type BattlePhase string

const (
	BattlePhaseDraw BattlePhase = "draw"
	BattlePhasePlay BattlePhase = "play"
	BattlePhaseEnd  BattlePhase = "end"
)

type BattleTurn string

const (
	BattleTurnPlayer BattleTurn = "player"
	BattleTurnEnemy  BattleTurn = "enemy"
)

type BattleType string

const (
	BattleTypeGround    BattleType = "ground"
	BattleTypeAerial    BattleType = "aerial"
	BattleTypeDefensive BattleType = "defensive"
)

type BattleStatus string

const (
	BattleStatusOngoing BattleStatus = "ongoing"
	BattleStatusVictory BattleStatus = "victory"
	BattleStatusDefeat  BattleStatus = "defeat"
)

type ParticipantStatus string

const (
	ParticipantStatusActive    ParticipantStatus = "active"
	ParticipantStatusWounded   ParticipantStatus = "wounded"
	ParticipantStatusRetreated ParticipantStatus = "retreated"
)

type BattleModifierType string

const (
	BattleModifierArmor        BattleModifierType = "armor"
	BattleModifierDamage       BattleModifierType = "damage"
	BattleModifierEnergy       BattleModifierType = "energy"
	BattleModifierDraw         BattleModifierType = "draw"
	BattleModifierArcusCharges BattleModifierType = "arcus-charges"
)

type BattleState struct {
	// Core mechanics
	PlayerDeck    []BattleCard `json:"playerDeck"`
	PlayerHand    []BattleCard `json:"playerHand"`
	PlayerDiscard []BattleCard `json:"playerDiscard"`

	EnemyDeck    []BattleCard `json:"enemyDeck"`
	EnemyHand    []BattleCard `json:"enemyHand"`
	EnemyDiscard []BattleCard `json:"enemyDiscard"`

	// Battle flow
	CurrentTurn BattleTurn  `json:"currentTurn"`
	TurnNumber  int         `json:"turnNumber"`
	Phase       BattlePhase `json:"phase"`

	// Critical mechanic
	Pressure int `json:"pressure"` // 0-10, lose at 10

	// Participants
	PlayerTeam []BattleParticipant `json:"playerTeam"`
	EnemyTeam  []BattleParticipant `json:"enemyTeam"`

	// Resources
	PlayerEnergy int `json:"playerEnergy"`
	EnemyEnergy  int `json:"enemyEnergy"`

	// Battle context
	BattleType BattleType `json:"battleType"`
	Location   string     `json:"location"` // Subsector where battle occurs

	// Battle outcome
	Status BattleStatus  `json:"status"`
	Result *BattleResult `json:"result,omitempty"`

	// Battle identification for deterministic RNG
	BattleID string `json:"battleID"`
}

type BattleParticipant struct {
	CharacterName string            `json:"characterName"`
	CurrentHP     int               `json:"currentHP"`
	MaxHP         int               `json:"maxHP"`
	Status        ParticipantStatus `json:"status"`
	Modifiers     []BattleModifier  `json:"modifiers"`
}

type BattleModifier struct {
	Type     BattleModifierType `json:"type"`
	Value    int                `json:"value"`
	Duration any                `json:"duration"` // "battle", "turn", or number (turns remaining)
}

type BattleCardType string

const (
	BattleCardAttack  BattleCardType = "attack"
	BattleCardDefense BattleCardType = "defense"
	BattleCardSkill   BattleCardType = "skill"
	BattleCardEvent   BattleCardType = "event"
)

type BattleCard struct {
	ID          string         `json:"id"`
	Name        string         `json:"name"`
	Type        BattleCardType `json:"type"`
	EnergyCost  int            `json:"energyCost"`
	Damage      int            `json:"damage"`
	Defense     int            `json:"defense"`
	Description string         `json:"description"`
	Effects     []CardEffect   `json:"effects"`
}

type CardEffect struct {
	Type   string `json:"type"`
	Target string `json:"target"` // "self", "enemy", "all_enemies", "all_allies"
	Value  any    `json:"value"`
}

type BattleResult struct {
	Winner      BattleTurn      `json:"winner"`
	Casualties  []CharacterName `json:"casualties"`
	Rewards     BattleRewards   `json:"rewards"`
	TurnsPlayed int             `json:"turnsPlayed"`
}

type BattleRewards struct {
	Intel     int        `json:"intel"`
	Supplies  int        `json:"supplies"`
	ECells    int        `json:"eCells"`
	Items     []ItemName `json:"items"`
	Civitates int        `json:"civitates"`
}
