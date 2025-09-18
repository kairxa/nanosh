package initial

import (
	"fmt"
	"nanosh/nakama-modules/gamelogic/types"
	"nanosh/nakama-modules/gamelogic/utils/random"
	"time"

	"github.com/google/uuid"
)

// GetInitialGameParams defines parameters for getting initial game state
type GetInitialGameParams struct {
	GameID     string `json:"gameID"`
	InvokeTime int64  `json:"invokeTime"`
	Username   string `json:"username"`
}

// GetInitialGame creates and returns initial game state
// Returns either a new game state or an error
func GetInitialGame(params *GetInitialGameParams) (*types.Game, error) {
	// Set defaults if not provided
	if params == nil {
		params = &GetInitialGameParams{}
	}
	
	if params.GameID == "" {
		// Generate UUIDv7 for time-ordered, sortable game IDs
		gameUUID, err := uuid.NewV7()
		if err != nil {
			return nil, fmt.Errorf("failed to generate game ID: %w", err)
		}
		params.GameID = gameUUID.String()
	}
	
	if params.InvokeTime == 0 {
		params.InvokeTime = time.Now().UnixMilli()
	}
	
	if params.Username == "" {
		params.Username = "system"
	}
	
	// TODO: LOG GAME INIT
	
	// Create deterministic PRNG for sector randomization
	prng := random.CreateSeededPRNG(params.GameID, params.InvokeTime, params.Username)
	
	// Get all sectors
	sectors := GetSectors()
	
	// Get all supersector names
	supersectorNames := []types.SupersectorName{
		types.SupersectorArcticCircle,
		types.SupersectorEuropeanFederation,
		types.SupersectorRUSSECAN,
		types.SupersectorEastAsiaEnclave,
		types.SupersectorNorthAmericanUnion,
		types.SupersectorMENACoalition,
		types.SupersectorSouthAsianNetwork,
		types.SupersectorSEABloc,
		types.SupersectorSouthAmericanAlliance,
		types.SupersectorSouthAfricanConfederation,
		types.SupersectorOceanianFront,
		types.SupersectorAntarcticPole,
	}
	
	// Get sample of subsector names (just need some for randomization)
	subsectorNames := []types.SubsectorName{
		types.SubsectorAnchorage, types.SubsectorMinneapolis, types.SubsectorNuuk,
		types.SubsectorOslo, types.SubsectorQuebecCity, types.SubsectorReykjavik,
		types.SubsectorSeattle, types.SubsectorStavanger, types.SubsectorToronto,
		types.SubsectorVancouver, types.SubsectorAmsterdam, types.SubsectorBerlin,
		types.SubsectorBirmingham, types.SubsectorDublin, types.SubsectorLondon,
		// Add more as needed...
	}
	
	randomizedSupersectorNames := random.GetRandomArray(supersectorNames, len(supersectorNames), prng)
	randomizedSubsectorNames := random.GetRandomArray(subsectorNames, len(subsectorNames), prng)
	
	// Create empty subsector names set
	emptySubsectorNames := make(map[types.SubsectorName]bool)
	for _, name := range randomizedSubsectorNames {
		emptySubsectorNames[name] = true
	}
	
	// Select Nanosh locations
	nanoshMainBase := random.GetRandomArray(supersectorNames, 1, prng)[0]
	nanoshAuxBaseInitial := randomizedSupersectorNames[2]
	nanoshOutpostSupersectors := random.GetRandomArray(supersectorNames, 3, prng)
	
	nanoshOutposts := make([]types.SubsectorName, 0, 3)
	for range nanoshOutpostSupersectors {
		// For now, just pick some random subsectors since we can't easily traverse the sector structure
		// In real implementation, would need proper sector traversal
		if len(subsectorNames) > 0 {
			outpostSubsector := random.GetRandomArray(subsectorNames, 1, prng)[0]
			nanoshOutposts = append(nanoshOutposts, outpostSubsector)
		}
	}
	
	// Set HP for Nanosh bases (sectors map[string]any so need type assertion)
	if supersectorAny, exists := sectors[string(nanoshMainBase)]; exists {
		if supersector, ok := supersectorAny.(*types.Supersector); ok {
			supersector.HP = types.HP_NANOSH_MAIN_BASE
		}
	}
	if supersectorAny, exists := sectors[string(nanoshAuxBaseInitial)]; exists {
		if supersector, ok := supersectorAny.(*types.Supersector); ok {
			supersector.HP = types.HP_NANOSH_AUX_BASE
		}
	}
	
	// Set HP for outposts and remove from empty subsectors
	for _, outpostName := range nanoshOutposts {
		if subsectorAny, exists := sectors[string(outpostName)]; exists {
			if subsector, ok := subsectorAny.(*types.Subsector); ok {
				subsector.HP = types.HP_NANOSH_OUTPOST
			}
		}
		delete(emptySubsectorNames, outpostName)
	}
	
	// Create initial game state
	initialGame := &types.Game{
		ID:     params.GameID,
		Day:    0,
		Cycle:  0,
		Ship:   *GetInitialShip(&GetInitialShipParams{Type: types.ShipGriffin}),
		Morale: types.INITIAL_MORALE,
		MaxMorale: types.MAX_MORALE,
		NanoshSympathy: types.INITIAL_NANOSH_SYMPATHY,
		MaxNanoshSympathy: types.MAX_NANOSH_SYMPATHY,
		Intel: types.Intel{
			Basic:    0,
			Critical: 0,
		},
		Characters:     GetInitialCharacters(params.GameID, params.InvokeTime, params.Username),
		CharactersDead: make(map[types.CharacterName]bool),
		ShipLocation:   randomizedSupersectorNames[0],
		Nanosh: types.Nanosh{
			MainBase: &nanoshMainBase,
			AuxBase: map[types.SupersectorName]bool{
				nanoshAuxBaseInitial: true,
			},
			Outposts: func() map[types.SubsectorName]bool {
				outpostSet := make(map[types.SubsectorName]bool)
				for _, outpost := range nanoshOutposts {
					outpostSet[outpost] = true
				}
				return outpostSet
			}(),
			Advances:          make(map[types.SubsectorName]bool),
			LiberationPoints:  make(map[types.SubsectorName]bool),
			Destroyed: types.NanoshDestroyed{
				Outposts: make(map[types.SubsectorName]bool),
				AuxBase:  make(map[types.SupersectorName]bool),
			},
			AssimilateEnabled: false,
			AerialUnits: types.AerialUnits{
				Hornets: 0,
				Talons:  0,
			},
		},
		Subsectors: types.SubsectorsInfo{
			Empty: emptySubsectorNames,
		},
		Sectors:     sectors,
		Craftable:   make(map[types.ItemName]bool),
		Expedition:  nil,
		BattleState: nil,
		AnyMap:      make(map[string]interface{}),
	}
	
	return initialGame, nil
}