package types

// ModifierShip represents ship-wide modifiers that affect gameplay.
//
// MODIFIER PROCESSING SYSTEM:
// In TypeScript, modifiers were processed dynamically using pattern matching:
//   - Find all modifiers starting with "ship.cycle.*"
//   - Extract room name from the pattern
//   - Dynamically require() the calculator file
//
// In Go, we use a Registry Pattern instead:
//  1. Each modifier maps to a processor function in a registry
//  2. During cycle/combat/day-change, iterate through modifiers
//  3. Look up and execute the processor function from registry
//
// Example Registry Implementation:
//
//	var ModifierRegistry = map[ModifierShip]ModifierProcessor{
//	    ModifierShipCycleLifeSupportBroken: ProcessLifeSupportBroken,
//	    ModifierShipCycleStorageBroken: ProcessStorageBroken,
//	    // ... etc
//	}
//
// NAMING CONVENTION:
// While ordering doesn't matter for the registry, we follow these patterns:
//   - ship.cycle.*    - Processed during cycle changes
//   - ship.combat.*   - Processed during combat
//   - ship.day-change.* - Processed at day change
//   - ship.persistent.* - Always active modifiers
//   - ship.griffin.*  - Griffin-specific room damage tracking
//
// SUFFIX PATTERN FOR ROOM MODIFIERS:
// Some rooms have special effects during specific phases. We use suffixes to indicate when:
//   - ship.griffin.[room].broken         - Generic room broken (no special timing)
//   - ship.griffin.[room].broken.cycle   - Room has cycle-specific effects
//   - ship.griffin.[room].broken.combat  - Room has combat-specific effects
//   - ship.griffin.[room].broken.unique  - Room has first-time-broken effects
//
// Examples:
//
//	ModifierShipGriffinLifeSupportSystemBrokenCycle - Life support breaks affect cycle changes
//	ModifierShipGriffinStorageRoomBrokenCycle       - Storage damage loses cargo each cycle
//	ModifierShipGriffinArmoryBrokenCombat           - Armory damage affects combat
//	ModifierShipGriffinDormsBrokenUnique            - Dorms have special first-time effect
//
// This avoids duplicate modifiers and clearly shows both WHAT is broken and WHEN it matters!
//
// ROOM DAMAGE TRACKING:
// Room damage uses ModifierTracker.Amount to track cumulative damage AND history:
//
// Modifier States:
//   - NOT IN MAP: Room has NEVER been broken (pristine condition)
//   - Amount = 0: Room WAS broken before but is now FIXED (history preserved)
//   - Amount = 1: First time broken (trigger unique effects)
//   - Amount > 1: Additional damage stacked (multiple hits)
//
// This distinction is important:
//   - "Never broken" rooms may trigger first-time events when damaged
//   - "Fixed" rooms (Amount=0) won't trigger first-time events again
//   - Each point of Amount needs separate repair
//
// Example:
//
//	if modifier, exists := ship.Modifiers[ModifierShipGriffinDormsBrokenUnique]; !exists {
//	    // Dorms never been broken - will trigger first-time effect
//	} else if modifier.Amount == 0 {
//	    // Dorms was broken before but fixed - no first-time effect
//	} else {
//	    // Dorms currently broken with Amount levels of damage
//	}
type ModifierShip string

const (
	// Day change modifiers
	ModifierShipDayChangeBridgeCommsMobilization ModifierShip = "ship.day-change.bridge.comms.mobilization"
	ModifierShipDayChangeBridgeCommsOnair        ModifierShip = "ship.day-change.bridge.comms.onair"
	ModifierShipDayChangeGardenForage            ModifierShip = "ship.day-change.garden.forage"
	ModifierShipDayChangeGardenGrow              ModifierShip = "ship.day-change.garden.grow"
	ModifierShipDayChangeGeneralOvercrowded      ModifierShip = "ship.day-change.general.overcrowded"
	ModifierShipDayChangeGeneralRallied          ModifierShip = "ship.day-change.general.rallied"
	ModifierShipDayChangeSupersectorHearthbeat   ModifierShip = "ship.day-change.supersector.hearthbeat"

	// Persistent modifiers
	ModifierShipPersistentGardenBountiful  ModifierShip = "ship.persistent.garden.bountiful"
	ModifierShipPersistentGardenSapped     ModifierShip = "ship.persistent.garden.sapped"
	ModifierShipPersistentBuzzardOptimized ModifierShip = "ship.persistent.buzzard.optimized"
	ModifierShipPersistentEngineOptimized  ModifierShip = "ship.persistent.engine.optimized"
	ModifierShipPersistentWeaponOptimized  ModifierShip = "ship.persistent.weapon.optimized"

	// Combat modifiers
	ModifierShipCombatBuzzardCloseAirSupport    ModifierShip = "ship.combat.buzzard.close-air-support"
	ModifierShipCombatBridgeCommandCannonPrimed ModifierShip = "ship.combat.bridge.command.cannon-primed"

	// Griffin ship room breaking modifiers
	ModifierShipGriffinBridgeBroken                 ModifierShip = "ship.griffin.bridge.broken"
	ModifierShipGriffinHydroponicGardenBroken       ModifierShip = "ship.griffin.hydroponic-garden.broken"
	ModifierShipGriffinRefectoryBroken              ModifierShip = "ship.griffin.refectory.broken"
	ModifierShipGriffinRndBroken                    ModifierShip = "ship.griffin.rnd.broken"
	ModifierShipGriffinMedicalLabBroken             ModifierShip = "ship.griffin.medical-lab.broken"
	ModifierShipGriffinLifeSupportSystemBrokenCycle ModifierShip = "ship.griffin.life-support-system.broken.cycle"
	ModifierShipGriffinStorageRoomBrokenCycle       ModifierShip = "ship.griffin.storage-room.broken.cycle"
	ModifierShipGriffinPrivateQuartersBroken        ModifierShip = "ship.griffin.private-quarters.broken"
	ModifierShipGriffinCommonAreaBroken             ModifierShip = "ship.griffin.common-area.broken"
	ModifierShipGriffinDormsBrokenUnique            ModifierShip = "ship.griffin.dorms.broken.unique"
	ModifierShipGriffinBarracksBrokenUnique         ModifierShip = "ship.griffin.barracks.broken.unique"
	ModifierShipGriffinWeaponSystemsBroken          ModifierShip = "ship.griffin.weapon-systems.broken"
	ModifierShipGriffinBuzzardsBayBroken            ModifierShip = "ship.griffin.buzzards-bay.broken"
	ModifierShipGriffinBlitzhoppersBayBroken        ModifierShip = "ship.griffin.blitzhoppers-bay.broken"
	ModifierShipGriffinFrontFlakTurretBroken        ModifierShip = "ship.griffin.front-flak-turret.broken"
	ModifierShipGriffinRearLaserTurretBroken        ModifierShip = "ship.griffin.rear-laser-turret.broken"
	ModifierShipGriffinArmoryBrokenCombat           ModifierShip = "ship.griffin.armory.broken.combat"
	ModifierShipGriffinEngineRoomBroken             ModifierShip = "ship.griffin.engine-room.broken"
	ModifierShipGriffinFrontCorridorBroken          ModifierShip = "ship.griffin.front-corridor.broken"
	ModifierShipGriffinFrontHallwayBroken           ModifierShip = "ship.griffin.front-hallway.broken"
	ModifierShipGriffinRearCorridorBroken           ModifierShip = "ship.griffin.rear-corridor.broken"
	ModifierShipGriffinRearHallwayBroken            ModifierShip = "ship.griffin.rear-hallway.broken"
	ModifierShipGriffinPlating1Broken               ModifierShip = "ship.griffin.plating-1.broken"
	ModifierShipGriffinPlating2Broken               ModifierShip = "ship.griffin.plating-2.broken"
	ModifierShipGriffinPlating3Broken               ModifierShip = "ship.griffin.plating-3.broken"
	ModifierShipGriffinPlating4Broken               ModifierShip = "ship.griffin.plating-4.broken"
	ModifierShipGriffinPlating5Broken               ModifierShip = "ship.griffin.plating-5.broken"
	ModifierShipGriffinPlating6Broken               ModifierShip = "ship.griffin.plating-6.broken"
	ModifierShipGriffinPlating7Broken               ModifierShip = "ship.griffin.plating-7.broken"
	ModifierShipGriffinPlating8Broken               ModifierShip = "ship.griffin.plating-8.broken"

	// Research project modifiers
	ModifierShipPersistentOperationalSurge          ModifierShip = "ship.persistent.operational-surge"
	ModifierShipPersistentSoloComfort               ModifierShip = "ship.persistent.solo-comfort"
	ModifierShipPersistentBiogenicAimAssist         ModifierShip = "ship.persistent.biogenic-aim-assist"
	ModifierShipPersistentKabutoBoost               ModifierShip = "ship.persistent.kabuto-boost"
	ModifierShipPersistentBuzzardStrikeOptimization ModifierShip = "ship.persistent.buzzard-strike-optimization"
)

type ModifierCharacter string

const (
	// Cycle modifiers - affect character during cycles
	ModifierCharacterCycleDeprived   ModifierCharacter = "character.cycle.deprived"
	ModifierCharacterCycleDirty      ModifierCharacter = "character.cycle.dirty"
	ModifierCharacterCycleFrustrated ModifierCharacter = "character.cycle.frustrated"
	ModifierCharacterCycleHungry     ModifierCharacter = "character.cycle.hungry"
	ModifierCharacterCycleTired      ModifierCharacter = "character.cycle.tired"

	// Day change modifiers - processed at day change
	ModifierCharacterDayChangeEat      ModifierCharacter = "character.day-change.eat"
	ModifierCharacterDayChangeSleep    ModifierCharacter = "character.day-change.sleep"
	ModifierCharacterDayChangeUplifted ModifierCharacter = "character.day-change.uplifted"

	// Persistent modifiers - last until removed
	ModifierCharacterPersistentSeggs     ModifierCharacter = "character.persistent.seggs"
	ModifierCharacterPersistentSocialize ModifierCharacter = "character.persistent.socialize"
	ModifierCharacterPersistentDrunk     ModifierCharacter = "character.persistent.drunk"
	ModifierCharacterPersistentSick      ModifierCharacter = "character.persistent.sick"
	ModifierCharacterPersistentAttrition ModifierCharacter = "character.persistent.attrition"

	// Wound modifiers
	ModifierCharacterWoundLight              ModifierCharacter = "character.wound.light"
	ModifierCharacterWoundCritical           ModifierCharacter = "character.wound.critical"
	ModifierCharacterWoundStabilizedLight    ModifierCharacter = "character.wound.stabilized.light"
	ModifierCharacterWoundStabilizedCritical ModifierCharacter = "character.wound.stabilized.critical"
)

type ModifierTracker struct {
	Amount     int  `json:"amount"`
	Persistent bool `json:"persistent"`
}
