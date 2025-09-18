package initial

import (
	"fmt"
	"nanosh/nakama-modules/gamelogic/types"
	"testing"
)

func TestGetInitialShipRooms(t *testing.T) {
	t.Run("should create rooms with default griffin ship type", func(t *testing.T) {
		rooms := GetInitialShipRooms(nil)

		if len(rooms) == 0 {
			t.Error("GetInitialShipRooms returned empty map")
		}

		expectedRoomCount := 30
		if len(rooms) != expectedRoomCount {
			t.Errorf("Expected %d rooms, got %d", expectedRoomCount, len(rooms))
		}

		// Check that all rooms have proper structure
		for roomID, room := range rooms {
			if roomID == "" {
				t.Error("Found room with empty ID")
			}
			if room.Name == "" {
				t.Errorf("Room %s has empty name", roomID)
			}
		}
	})

	t.Run("should create rooms with explicit griffin ship type", func(t *testing.T) {
		params := &GetInitialShipRoomsParams{ShipType: types.ShipGriffin}
		rooms := GetInitialShipRooms(params)

		if len(rooms) != 30 {
			t.Errorf("Expected 30 rooms for griffin, got %d", len(rooms))
		}
	})

	t.Run("should create specific rooms with correct properties", func(t *testing.T) {
		rooms := GetInitialShipRooms(nil)

		// Test bridge room
		bridge, exists := rooms["room-1"]
		if !exists {
			t.Error("Bridge room (room-1) not found")
		} else {
			if bridge.Type != types.RoomBridge {
				t.Errorf("Bridge room expected type %s, got %s", types.RoomBridge, bridge.Type)
			}
			if bridge.Name != "Bridge" {
				t.Errorf("Bridge room expected name 'Bridge', got '%s'", bridge.Name)
			}
		}

		// Test garden room
		garden, exists := rooms["room-2"]
		if !exists {
			t.Error("Garden room (room-2) not found")
		} else {
			if garden.Type != types.RoomGarden {
				t.Errorf("Garden room expected type %s, got %s", types.RoomGarden, garden.Type)
			}
			if garden.Name != "Hydroponic Garden" {
				t.Errorf("Garden room expected name 'Hydroponic Garden', got '%s'", garden.Name)
			}
		}

		// Test armory room
		armory, exists := rooms["room-17"]
		if !exists {
			t.Error("Armory room (room-17) not found")
		} else {
			if armory.Type != types.RoomArmory {
				t.Errorf("Armory room expected type %s, got %s", types.RoomArmory, armory.Type)
			}
			if armory.Name != "Armory" {
				t.Errorf("Armory room expected name 'Armory', got '%s'", armory.Name)
			}
		}

		// Test plating rooms (room-23 through room-30)
		for i := 1; i <= 8; i++ {
			roomNum := 22 + i // 23 through 30
			roomID := fmt.Sprintf("room-%d", roomNum)
			expectedName := fmt.Sprintf("Griffin's Plating %d", i)
			
			plating, exists := rooms[roomID]
			if !exists {
				t.Errorf("Plating room (%s) not found", roomID)
				continue
			}
			if plating.Type != types.RoomPlating {
				t.Errorf("Plating room %s expected type %s, got %s", roomID, types.RoomPlating, plating.Type)
			}
			if plating.Name != expectedName {
				t.Errorf("Plating room %s expected name '%s', got '%s'", roomID, expectedName, plating.Name)
			}
		}
	})

	t.Run("should print full room layout for visualization", func(t *testing.T) {
		rooms := GetInitialShipRooms(nil)

		t.Log("=== GRIFFIN SHIP ROOM LAYOUT ===")
		
		// Group rooms by type for better visualization
		roomsByType := make(map[types.RoomType][]*RoomInfo)
		
		for roomID, room := range rooms {
			roomInfo := &RoomInfo{ID: roomID, Room: room}
			roomsByType[room.Type] = append(roomsByType[room.Type], roomInfo)
		}
		
		// Print rooms grouped by type
		for roomType, roomList := range roomsByType {
			t.Logf("\n🏠 %s ROOMS (%d):", roomType, len(roomList))
			for _, roomInfo := range roomList {
				t.Logf("   %s: %s", roomInfo.ID, roomInfo.Room.Name)
			}
		}
		
		t.Logf("\n📊 TOTAL ROOMS: %d", len(rooms))
		
		// Verify we have all expected room types
		expectedRoomTypes := []types.RoomType{
			types.RoomBridge, types.RoomGarden, types.RoomRefectory, types.RoomRND,
			types.RoomMedlab, types.RoomLifeSupport, types.RoomStorage, types.RoomPrivateQuarters,
			types.RoomCommonArea, types.RoomDorms, types.RoomBarracks, types.RoomWeaponSystems,
			types.RoomFighterCraftsBay, types.RoomExpoCraftsBay, types.RoomFlakTurret, types.RoomLaserTurret,
			types.RoomArmory, types.RoomEngineRoom, types.RoomCorridor, types.RoomHallway, types.RoomPlating,
		}
		
		t.Log("\n🔍 ROOM TYPE VERIFICATION:")
		for _, expectedType := range expectedRoomTypes {
			if roomList, exists := roomsByType[expectedType]; exists {
				t.Logf("   ✅ %s: %d rooms", expectedType, len(roomList))
			} else {
				t.Errorf("   ❌ %s: MISSING", expectedType)
			}
		}
	})
}

// Helper struct for room visualization
type RoomInfo struct {
	ID   string
	Room *types.Room
}