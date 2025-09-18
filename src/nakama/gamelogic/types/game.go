package types

type AerialUnits struct {
	Hornets int `json:"hornets"`
	Talons  int `json:"talons"`
}

type Intel struct {
	Basic    int `json:"basic"`
	Critical int `json:"critical"`
}

type NanoshDestroyed struct {
	Outposts map[SubsectorName]bool   `json:"outposts"`
	AuxBase  map[SupersectorName]bool `json:"auxBase"`
}

type Nanosh struct {
	MainBase          *SupersectorName         `json:"mainBase"`
	AuxBase           map[SupersectorName]bool `json:"auxBase"`
	Outposts          map[SubsectorName]bool   `json:"outposts"`
	Advances          map[SubsectorName]bool   `json:"advances"`
	LiberationPoints  map[SubsectorName]bool   `json:"liberationPoints"`
	Destroyed         NanoshDestroyed          `json:"destroyed"`
	AssimilateEnabled bool                     `json:"assimilateEnabled"`
	AerialUnits       AerialUnits              `json:"aerialUnits"`
}

type SubsectorsInfo struct {
	Empty map[SubsectorName]bool `json:"empty"`
}

type Game struct {
	ID                string                       `json:"id"`
	Day               int                          `json:"day"`
	Cycle             int                          `json:"cycle"`
	Ship              Ship                         `json:"ship"`
	Morale            int                          `json:"morale"`
	MaxMorale         int                          `json:"maxMorale"`
	NanoshSympathy    int                          `json:"nanoshSympathy"`
	MaxNanoshSympathy int                          `json:"maxNanoshSympathy"`
	Intel             Intel                        `json:"intel"`
	Characters        map[CharacterName]*Character `json:"characters"`
	CharactersDead    map[CharacterName]bool       `json:"charactersDead"`
	ShipLocation      SupersectorName              `json:"shipLocation"`
	Nanosh            Nanosh                       `json:"nanosh"`
	Subsectors        SubsectorsInfo               `json:"subsectors"`
	Sectors           map[string]any               `json:"sectors"` // Can be Supersector or Subsector
	Craftable         map[ItemName]bool            `json:"craftable"`
	Expedition        *Expedition                  `json:"expedition"`
	BattleState       *BattleState                 `json:"battleState"`
	AnyMap            map[string]any               `json:"anyMap"` // For temporary storage
}
