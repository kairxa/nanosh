package types

type TraderResource string

const (
	TraderResourceSupplies TraderResource = "supplies"
	TraderResourceRations  TraderResource = "rations"
	TraderResourceECells   TraderResource = "eCells"
)

type TraderItem struct {
	MinGiven int      `json:"minGiven"`
	MaxGiven int      `json:"maxGiven"`
	ItemName ItemName `json:"itemName"`
}

type Trader struct {
	Name     string                 `json:"name"`
	Given    TraderResource         `json:"given"`
	Taken    TraderResource         `json:"taken"`
	MinTaken int                    `json:"minTaken"`
	MaxTaken int                    `json:"maxTaken"`
	MinGiven int                    `json:"minGiven"`
	MaxGiven int                    `json:"maxGiven"`
	Items    map[string]*TraderItem `json:"items,omitempty"` // Using map for Set-like behavior
}

type TraderShowGiveTake struct {
	Resource TraderResource `json:"resource"`
	Amount   int            `json:"amount"`
}

type TraderShowItem struct {
	ItemName ItemName `json:"itemName"`
	Given    int      `json:"given"`
}

type TraderShow struct {
	Name  string                     `json:"name"`
	Given TraderShowGiveTake         `json:"given"`
	Taken TraderShowGiveTake         `json:"taken"`
	Items map[string]*TraderShowItem `json:"items"` // Using map for Set-like behavior
}
