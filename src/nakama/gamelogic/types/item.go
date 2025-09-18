package types

type ItemName string

const (
	// Drinks
	ItemDrinkUniqueBahariCoffee    ItemName = "drink.unique.bahari-coffee"
	ItemDrinkUniqueMysteriousGreen ItemName = "drink.unique.mysterious-green"
	ItemDrinkBlackmoon             ItemName = "drink.blackmoon"
	ItemDrinkHydrocell             ItemName = "drink.hydrocell"

	// Food
	ItemFoodAstrotatoFries  ItemName = "food.astrotato-fries"
	ItemFoodFrisbread       ItemName = "food.frisbread"
	ItemFoodFrostberry      ItemName = "food.frostberry"
	ItemFoodGlownana        ItemName = "food.glownana"
	ItemFoodGourmetPack     ItemName = "food.gourmet-pack"
	ItemFoodLightspeedRamen ItemName = "food.lightspeed-ramen"
	ItemFoodVoidplum        ItemName = "food.voidplum"
	ItemFoodZinglime        ItemName = "food.zinglime"

	// Meds
	ItemMedsSolacil    ItemName = "meds.solacil"
	ItemMedsDuarin     ItemName = "meds.duarin"
	ItemMedsTrivagex   ItemName = "meds.trivagex"
	ItemMedsVigorisk   ItemName = "meds.vigorisk"
	ItemMedsBlissbloom ItemName = "meds.blissbloom"
	ItemMedsSomnoxa    ItemName = "meds.somnoxa"
	ItemMedsLucidix    ItemName = "meds.lucidix"

	// Accessories
	ItemAccForceDeflectorShield ItemName = "acc.force-deflector-shield"
	ItemAccLifewaterLocket      ItemName = "acc.lifewater-locket"
	ItemAccOmniConverter        ItemName = "acc.omni-converter"
	ItemAccVoxlink              ItemName = "acc.voxlink"

	// Body Armor
	ItemBodyHeavyLorica ItemName = "body.heavy.lorica"
	ItemBodySwiftmesh   ItemName = "body.swiftmesh"

	// Items
	ItemGrenade                ItemName = "item.grenade"
	ItemHyperhealAmpoule       ItemName = "item.hyperheal-ampoule"
	ItemMadsegarVanillaEssence ItemName = "item.madsegar-vanilla-essence"

	// Weapons
	ItemWeaponGunsHeavyCyclone ItemName = "weapon.guns.heavy.cyclone"
	ItemWeaponGunsPugio        ItemName = "weapon.guns.pugio"
	ItemWeaponGunsPrincipes    ItemName = "weapon.guns.principes"
	ItemWeaponUniqueGunsP2075  ItemName = "weapon.unique.guns.p2075"
	ItemWeaponGunsRondel       ItemName = "weapon.guns.rondel"
	ItemWeaponHeavyArcusDriver ItemName = "weapon.heavy.arcus-driver"
	ItemWeaponUniqueVigiles45  ItemName = "weapon.unique.vigiles-45"

	// Misc
	ItemMiscNanoshDatapad ItemName = "misc.nanosh-datapad"
)

type ConsumableEffects struct {
	Modifiers map[ModifierCharacter]ModifierAmount `json:"modifiers"`
	AP        int                                  `json:"ap"`
}

type ModifierAmount struct {
	Amount int `json:"amount"`
}

type ItemBuildResources struct {
	ECells   int `json:"eCells"`
	Supplies int `json:"supplies"`
	Rations  int `json:"rations"`
}

type ItemBreakableData struct {
	BreakChance int `json:"breakChance"` // percentage
}
