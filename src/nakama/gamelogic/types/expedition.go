package types

type ExpeditionPhase string

const (
	ExpeditionPhaseGroundTeam ExpeditionPhase = "ground-team"
	ExpeditionPhaseBattle     ExpeditionPhase = "battle"
	ExpeditionPhaseCompleted  ExpeditionPhase = "completed"
)

type Expedition struct {
	SupersectorID    string                 `json:"supersectorID"`
	CraftType        ExpoCraftType          `json:"craftType"`
	Members          map[CharacterName]bool `json:"members"`
	DrawsRemaining   int                    `json:"drawsRemaining"`
	GroundThreat     int                    `json:"groundThreat"`
	Phase            ExpeditionPhase        `json:"phase"`
	Leader           *CharacterName         `json:"leader"`
	Deck             map[string]bool        `json:"deck"`                       // Expedition card IDs
	BlitzhopperState *BlitzhopperState      `json:"blitzhopperState,omitempty"` // Only for blitzhopper expeditions
}

// BlitzhopperState would be defined when battle system is implemented
type BlitzhopperState struct {
	Health int `json:"health"`
}
