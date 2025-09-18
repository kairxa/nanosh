package types

type Wound string

const (
	WoundLW  Wound = "LW"  // Light
	WoundCW  Wound = "CW"  // Critical
	WoundSLW Wound = "SLW" // Stabilized Light
	WoundSCW Wound = "SCW" // Stabilized Critical
)

type CharacterName string

const (
	CharacterSolasMercer        CharacterName = "Solas Mercer"
	CharacterMomoTzigane        CharacterName = "Momo Tzigane"
	CharacterVal                CharacterName = "Val"
	CharacterBrianneCheeseworth CharacterName = "Brianne \"Bree\" Cheeseworth"
	CharacterNiralPierce        CharacterName = "Niral Pierce"
	CharacterTealQing           CharacterName = "Tee'elise \"Teal\" Qing"
	CharacterGassPetalnova      CharacterName = "X7-Gastronia \"Gass\" Petalnova"
	CharacterYsaraMercer        CharacterName = "Ysara Mercer"
	CharacterZediusWindsor      CharacterName = "Zedius Windsor"
	CharacterVieroAlden         CharacterName = "Viero Alden"
	CharacterSorenKoda          CharacterName = "Soren Koda"
	CharacterAlisaHuang         CharacterName = "Alisa Huang"
	CharacterRinaMikami         CharacterName = "Rina Mikami"
)

type CharacterEquipmentSlot string

const (
	EquipmentSlotWeapon CharacterEquipmentSlot = "weapon"
	EquipmentSlotBody   CharacterEquipmentSlot = "body"
	EquipmentSlotAcc1   CharacterEquipmentSlot = "acc-1"
	EquipmentSlotAcc2   CharacterEquipmentSlot = "acc-2"
)

type Character struct {
	PlayerID     string                                 `json:"playerID"`
	AP           int                                    `json:"ap"`
	MaxAP        int                                    `json:"maxAP"`
	Modifiers    map[ModifierCharacter]*ModifierTracker `json:"modifiers"`
	Skills       map[Skill]bool                         `json:"skills"`
	Trait        map[Trait]bool                         `json:"trait"`
	CycleActions map[int]Action                         `json:"cycleActions"` // invokeTime -> Action
	Inventory    map[string]*ShipCargo                  `json:"inventory"`    // item ID -> ShipCargo
	Equipment    map[CharacterEquipmentSlot]*ShipCargo  `json:"equipment"`
	Location     RoomType                               `json:"location"`
}
