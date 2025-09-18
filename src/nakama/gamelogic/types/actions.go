package types

type Action string

const (
	// Bridge Command actions
	ActionBridgeCommandAdvance   Action = "action.bridge.command.advance"
	ActionBridgeCommandCannon    Action = "action.bridge.command.cannon"
	ActionBridgeCommandPrime     Action = "action.bridge.command.prime"
	ActionBridgeCommandMobilize  Action = "action.bridge.command.mobilize"
	ActionBridgeCommandReinforce Action = "action.bridge.command.reinforce"
	ActionBridgeCommandLiberate  Action = "action.bridge.command.liberate"
	ActionBridgeCommandAnalyze   Action = "action.bridge.command.analyze"

	// Bridge Comms actions
	ActionBridgeCommsPropa           Action = "action.bridge.comms.propa"
	ActionBridgeCommsMusic           Action = "action.bridge.comms.music"
	ActionBridgeCommsOnair           Action = "action.bridge.comms.onair"
	ActionBridgeCommsRally           Action = "action.bridge.comms.rally"
	ActionBridgeCommsHail            Action = "action.bridge.comms.hail"
	ActionBridgeCommsInterceptsignal Action = "action.bridge.comms.interceptsignal"

	// Common Area actions
	ActionCommonAreaSocialize Action = "action.common-area.socialize"

	// Engine Room actions
	ActionEngineRoomCalibrate Action = "action.engine-room.calibrate"
	ActionEngineRoomShield    Action = "action.engine-room.shield"

	// ExpoCrafts Bay actions
	ActionExpoCraftsBayReady   Action = "action.expocrafts-bay.ready"
	ActionExpoCraftsBayUnready Action = "action.expocrafts-bay.unready"
	ActionExpoCraftsBayRepair  Action = "action.expocrafts-bay.repair"
	ActionExpoCraftsBayLaunch  Action = "action.expocrafts-bay.launch"

	// FighterCrafts Bay actions
	ActionFighterCraftsBayCalibrate Action = "action.fightercrafts-bay.calibrate"
	ActionFighterCraftsBayDogfight  Action = "action.fightercrafts-bay.dogfight"
	ActionFighterCraftsBayPatrolrun Action = "action.fightercrafts-bay.patrolrun"
	ActionFighterCraftsBayRepair    Action = "action.fightercrafts-bay.repair"
	ActionFighterCraftsBayCAS       Action = "action.fightercrafts-bay.cas"

	// Turret actions
	ActionFlakTurretShoot  Action = "action.flak-turret.shoot"
	ActionLaserTurretShoot Action = "action.laser-turret.shoot"

	// Medlab actions
	ActionMedlabCompound Action = "action.medlab.compound"
	ActionMedlabFirstaid Action = "action.medlab.firstaid"
	ActionMedlabSurgery  Action = "action.medlab.surgery"

	// Garden actions
	ActionGardenForage  Action = "action.garden.forage"
	ActionGardenGrow    Action = "action.garden.grow"
	ActionGardenHarvest Action = "action.garden.harvest"

	// Generic actions
	ActionGenericShower  Action = "action.generic.shower"
	ActionGenericEquip   Action = "action.generic.equip"
	ActionGenericUnequip Action = "action.generic.unequip"

	// Refectory actions
	ActionRefectoryProvision Action = "action.refectory.provision"
	ActionRefectoryConsume   Action = "action.refectory.consume"

	// RND actions
	ActionRndReview   Action = "action.rnd.review"
	ActionRndResearch Action = "action.rnd.research"
	ActionRndBuild    Action = "action.rnd.build"
	ActionRndRepair   Action = "action.rnd.repair"

	// Private Quarters actions
	ActionPrivateQuartersSleep Action = "action.private-quarters.sleep"
	ActionPrivateQuartersSeggs Action = "action.private-quarters.seggs"

	// Weapon System actions
	ActionWeaponSystemCalibrate Action = "action.weapon-system.calibrate"

	// Storage actions
	ActionStorageStash    Action = "action.storage.stash"
	ActionStorageRetrieve Action = "action.storage.retrieve"
)

