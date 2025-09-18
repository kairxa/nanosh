package initial

import "nanosh/nakama-modules/gamelogic/types"

// GetInitialShipParams defines parameters for getting initial ship
type GetInitialShipParams struct {
	Type types.ShipType `json:"type"`
}

// GetInitialShip creates and returns initial ship state for a given ship type
// Defaults to griffin if no ship type provided
func GetInitialShip(params *GetInitialShipParams) *types.Ship {
	// Default to griffin if no params provided
	if params == nil {
		params = &GetInitialShipParams{Type: types.ShipGriffin}
	}

	// Initialize ship with zero values
	ship := &types.Ship{
		Type:          params.Type,
		Health:        0,
		MaxHealth:     0,
		Shield:        0,
		MaxShield:     0,
		Cargo:         make(map[string]*types.ShipCargo), // Empty cargo map
		MaxCargoSize:  0,
		ECells:        0,
		Supplies:      0,
		Rations:       0,
		Civitates:     0,
		Praetorians:   0,
		Rooms:         GetInitialShipRooms(&GetInitialShipRoomsParams{ShipType: params.Type}),
		FighterCrafts: GetInitialFighterCrafts(&GetInitialAircraftsParams{ShipType: params.Type}),
		ExpoCrafts:    GetInitialExpoCrafts(&GetInitialAircraftsParams{ShipType: params.Type}),
		Expo: types.Expo{
			Members: make(map[types.CharacterName]bool), // Empty members set
		},
		Modifiers: make(map[types.ModifierShip]*types.ModifierTracker), // Empty modifiers
		Projects: types.ProjectPool{
			Queued: make(map[types.ProjectName]*types.ProjectProgress), // Empty queued projects
			Done:   make(map[types.ProjectName]bool),                   // Empty done projects set
			Pool:   make(map[types.ProjectName]bool),                   // Will be filled below
		},
		Damage: make(map[types.Action]*types.MinMaxStruct), // Will be filled below
	}

	// Initialize project pool with all available projects
	projectPool := []types.ProjectName{
		types.ProjectFileG11ApexBioEnhancement,
		types.ProjectFile128FinesseProtocol,
		types.ProjectFile129EquilibriumDrive,
		types.ProjectFile252HyperHealAmpoule,
		types.ProjectFile253LifesaverInitiative,
		types.ProjectFile254OperationalSurgeParadigm,
		types.ProjectFile311ProvisioningOverhaul,
		types.ProjectFileE120SoloComfortInitiative,
		types.ProjectFile100SupportBlueprintsRecoveryA,
		types.ProjectFile101SupportBlueprintsRecoveryB,
		types.ProjectFile112EisenSchlagModul,
		types.ProjectFile113BiogenicAimAssist,
		types.ProjectFile456KabutoBoost,
		types.ProjectFile010BuzzardPrecisionUpgrade,
		types.ProjectFile011BuzzardStrikeOptimization,
		types.ProjectFile012BuzzardDefensiveRetrofit,
		types.ProjectFile055HoppersSpaceOptimization,
		types.ProjectFile711PraetoriansSuitForceDistribution,
		types.ProjectFile712YsarasSnare,
		types.ProjectFileNAPNanoshAssimilationProtocol,
	}

	// Add all projects to pool
	for _, project := range projectPool {
		ship.Projects.Pool[project] = true
	}

	// Initialize cannon damage
	ship.Damage[types.ActionBridgeCommandCannon] = &types.MinMaxStruct{
		Min: types.CANNON_DEFAULT_MIN_DAMAGE,
		Max: types.CANNON_DEFAULT_MAX_DAMAGE,
	}

	// Set ship-specific values
	switch params.Type {
	case types.ShipGriffin:
		ship.Health = 200
		ship.MaxHealth = 300
		ship.MaxShield = 50
		ship.MaxCargoSize = 800
		ship.ECells = 120
		ship.Supplies = 240
		ship.Rations = 100
		ship.Civitates = 10
		ship.Praetorians = 5
	}

	return ship
}
