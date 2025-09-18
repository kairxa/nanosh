package initial

import "nanosh/nakama-modules/gamelogic/types"

// GetInitialShipRoomsParams defines parameters for getting initial ship rooms
type GetInitialShipRoomsParams struct {
	ShipType types.ShipType `json:"shipType"`
}

// GetInitialShipRooms creates and returns a map of all rooms for a given ship type
// Defaults to griffin if no ship type provided
func GetInitialShipRooms(params *GetInitialShipRoomsParams) map[string]*types.Room {
	// Default to griffin if no params provided
	if params == nil {
		params = &GetInitialShipRoomsParams{ShipType: types.ShipGriffin}
	}

	rooms := make(map[string]*types.Room)

	switch params.ShipType {
	case types.ShipGriffin:
		rooms["room-1"] = &types.Room{
			Type: types.RoomBridge,
			Name: "Bridge",
		}
		rooms["room-2"] = &types.Room{
			Type: types.RoomGarden,
			Name: "Hydroponic Garden",
		}
		rooms["room-3"] = &types.Room{
			Type: types.RoomRefectory,
			Name: "Refectory",
		}
		rooms["room-4"] = &types.Room{
			Type: types.RoomRND,
			Name: "R&D",
		}
		rooms["room-5"] = &types.Room{
			Type: types.RoomMedlab,
			Name: "Medical Lab",
		}
		rooms["room-6"] = &types.Room{
			Type: types.RoomLifeSupport,
			Name: "Life Support System",
		}
		rooms["room-7"] = &types.Room{
			Type: types.RoomStorage,
			Name: "Storage Room",
		}
		rooms["room-8"] = &types.Room{
			Type: types.RoomPrivateQuarters,
			Name: "Private Quarters",
		}
		rooms["room-9"] = &types.Room{
			Type: types.RoomCommonArea,
			Name: "Common Area",
		}
		rooms["room-10"] = &types.Room{
			Type: types.RoomDorms,
			Name: "Dorms",
		}
		rooms["room-11"] = &types.Room{
			Type: types.RoomBarracks,
			Name: "Barracks",
		}
		rooms["room-12"] = &types.Room{
			Type: types.RoomWeaponSystems,
			Name: "Weapon Systems",
		}
		rooms["room-13"] = &types.Room{
			Type: types.RoomFighterCraftsBay,
			Name: "Buzzards Bay",
		}
		rooms["room-14"] = &types.Room{
			Type: types.RoomExpoCraftsBay,
			Name: "Blitzhoppers Bay",
		}
		rooms["room-15"] = &types.Room{
			Type: types.RoomFlakTurret,
			Name: "Front Flak Turret",
		}
		rooms["room-16"] = &types.Room{
			Type: types.RoomLaserTurret,
			Name: "Rear Laser Turret",
		}
		rooms["room-17"] = &types.Room{
			Type: types.RoomArmory,
			Name: "Armory",
		}
		rooms["room-18"] = &types.Room{
			Type: types.RoomEngineRoom,
			Name: "Engine Room",
		}
		rooms["room-19"] = &types.Room{
			Type: types.RoomCorridor,
			Name: "Front Corridor",
		}
		rooms["room-20"] = &types.Room{
			Type: types.RoomHallway,
			Name: "Front Hallway",
		}
		rooms["room-21"] = &types.Room{
			Type: types.RoomCorridor,
			Name: "Rear Corridor",
		}
		rooms["room-22"] = &types.Room{
			Type: types.RoomHallway,
			Name: "Rear Hallway",
		}
		rooms["room-23"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 1",
		}
		rooms["room-24"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 2",
		}
		rooms["room-25"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 3",
		}
		rooms["room-26"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 4",
		}
		rooms["room-27"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 5",
		}
		rooms["room-28"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 6",
		}
		rooms["room-29"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 7",
		}
		rooms["room-30"] = &types.Room{
			Type: types.RoomPlating,
			Name: "Griffin's Plating 8",
		}
	}

	return rooms
}