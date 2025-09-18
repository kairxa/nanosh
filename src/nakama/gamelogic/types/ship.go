package types

type FighterCraftType string

const (
	FighterCraftBuzzard FighterCraftType = "buzzard"
)

type ExpoCraftType string

const (
	ExpoCraftBlitzhopper ExpoCraftType = "blitzhopper"
	ExpoCraftForthopper  ExpoCraftType = "forthopper"
)

var AircraftNames = map[string]string{
	"buzzard":     "M-22 \"Buzzard\"",
	"blitzhopper": "S-11 \"Blitzhopper\"",
	"forthopper":  "S-09 \"Forthopper\"",
}

type FighterCraft struct {
	Type   FighterCraftType `json:"type"`
	Broken bool             `json:"broken"`
}

type ExpoCraft struct {
	Type      ExpoCraftType `json:"type"`
	Health    int           `json:"health"`
	MaxHealth int           `json:"maxHealth"`
}

type RoomType string

const (
	RoomBridge           RoomType = "bridge"
	RoomGarden           RoomType = "garden"
	RoomRefectory        RoomType = "refectory"
	RoomRND              RoomType = "rnd"
	RoomMedlab           RoomType = "medlab"
	RoomLifeSupport      RoomType = "life-support"
	RoomStorage          RoomType = "storage"
	RoomPrivateQuarters  RoomType = "private-quarters"
	RoomCommonArea       RoomType = "common-area"
	RoomDorms            RoomType = "dorms"
	RoomBarracks         RoomType = "barracks"
	RoomWeaponSystems    RoomType = "weapon-systems"
	RoomFighterCraftsBay RoomType = "fightercrafts-bay"
	RoomExpoCraftsBay    RoomType = "expocrafts-bay"
	RoomFlakTurret       RoomType = "flak-turret"
	RoomLaserTurret      RoomType = "laser-turret"
	RoomArmory           RoomType = "armory"
	RoomEngineRoom       RoomType = "engine-room"
	RoomCorridor         RoomType = "corridor"
	RoomHallway          RoomType = "hallway"
	RoomPlating          RoomType = "plating"
)

type Room struct {
	Type RoomType `json:"type"`
	Name string   `json:"name"`
}

type ShipModifierDetail struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

type ShipType string

const (
	ShipGriffin ShipType = "griffin"
)

var ShipNames = map[ShipType]string{
	ShipGriffin: "GX-03 \"Griffin Guardian\"",
}

type ShipCargo struct {
	ID       string   `json:"id"`
	ItemName ItemName `json:"itemName"`
	Broken   bool     `json:"broken"`
}

type Expo struct {
	Members map[CharacterName]bool `json:"members"`
}

type ProjectPool struct {
	Queued map[ProjectName]*ProjectProgress `json:"queued"`
	Done   map[ProjectName]bool             `json:"done"`
	Pool   map[ProjectName]bool             `json:"pool"`
}

type Ship struct {
	Type          ShipType                          `json:"type"`
	Health        int                               `json:"health"`
	MaxHealth     int                               `json:"maxHealth"`
	Shield        int                               `json:"shield"`
	MaxShield     int                               `json:"maxShield"`
	Cargo         map[string]*ShipCargo             `json:"cargo"` // item ID -> ShipCargo
	MaxCargoSize  int                               `json:"maxCargoSize"`
	ECells        int                               `json:"eCells"`
	Supplies      int                               `json:"supplies"`
	Rations       int                               `json:"rations"`
	Civitates     int                               `json:"civitates"`
	Praetorians   int                               `json:"praetorians"`
	Rooms         map[string]*Room                  `json:"rooms"`
	FighterCrafts map[int]*FighterCraft             `json:"fighterCrafts"`
	ExpoCrafts    map[int]*ExpoCraft                `json:"expoCrafts"`
	Expo          Expo                              `json:"expo"`
	Modifiers     map[ModifierShip]*ModifierTracker `json:"modifiers"`
	Damage        map[Action]*MinMaxStruct          `json:"damage"`
	Projects      ProjectPool                       `json:"projects"`
}
