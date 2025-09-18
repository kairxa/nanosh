package initial

import (
	"nanosh/nakama-modules/gamelogic/types"
	"testing"
)

func TestGridSectors(t *testing.T) {
	t.Run("should define valid grid coordinates", func(t *testing.T) {
		// Test specific grid sectors
		if GridSector1.X != 0 || GridSector1.Y != 0 {
			t.Errorf("GridSector1 expected {0, 0}, got {%d, %d}", GridSector1.X, GridSector1.Y)
		}
		if GridSector2.X != 1 || GridSector2.Y != 0 {
			t.Errorf("GridSector2 expected {1, 0}, got {%d, %d}", GridSector2.X, GridSector2.Y)
		}
		if GridSector12.X != 3 || GridSector12.Y != 2 {
			t.Errorf("GridSector12 expected {3, 2}, got {%d, %d}", GridSector12.X, GridSector12.Y)
		}
	})

	t.Run("should have all 12 grid sectors defined", func(t *testing.T) {
		sectors := []types.Point{
			GridSector1, GridSector2, GridSector3, GridSector4,
			GridSector5, GridSector6, GridSector7, GridSector8,
			GridSector9, GridSector10, GridSector11, GridSector12,
		}

		if len(sectors) != 12 {
			t.Errorf("Expected 12 sectors, got %d", len(sectors))
		}

		for i, sector := range sectors {
			if sector.X < 0 || sector.Y < 0 {
				t.Errorf("Sector %d has invalid coordinates: {%d, %d}", i+1, sector.X, sector.Y)
			}
			if sector.X > 3 || sector.Y > 2 {
				t.Errorf("Sector %d has out of bounds coordinates: {%d, %d}", i+1, sector.X, sector.Y)
			}
		}
	})
}

func TestAdjacencies(t *testing.T) {
	t.Run("should define adjacencies for all grid sectors", func(t *testing.T) {
		if len(Adjacencies) == 0 {
			t.Error("Adjacencies map is empty")
		}

		// Check that all 12 sectors have adjacencies defined
		expectedSectors := []types.Point{
			GridSector1, GridSector2, GridSector3, GridSector4,
			GridSector5, GridSector6, GridSector7, GridSector8,
			GridSector9, GridSector10, GridSector11, GridSector12,
		}

		for _, sector := range expectedSectors {
			if adjacents, exists := Adjacencies[sector]; !exists {
				t.Errorf("No adjacencies defined for sector at {%d, %d}", sector.X, sector.Y)
			} else if len(adjacents) == 0 {
				t.Errorf("Empty adjacencies for sector at {%d, %d}", sector.X, sector.Y)
			}
		}
	})

	t.Run("should have valid adjacency structure", func(t *testing.T) {
		for sector, adjacents := range Adjacencies {
			// Check that the sector has valid coordinates
			if sector.X < 0 || sector.Y < 0 || sector.X > 3 || sector.Y > 2 {
				t.Errorf("Invalid sector coordinates: {%d, %d}", sector.X, sector.Y)
			}

			// Check each adjacent sector
			for _, adj := range adjacents {
				if adj.X < 0 || adj.Y < 0 || adj.X > 3 || adj.Y > 2 {
					t.Errorf("Invalid adjacent coordinates: {%d, %d} for sector {%d, %d}",
						adj.X, adj.Y, sector.X, sector.Y)
				}
			}
		}
	})

	t.Run("should have correct number of adjacents", func(t *testing.T) {
		// Corner sectors (1,4,9,12) should have 5 adjacents
		corners := []types.Point{GridSector1, GridSector4, GridSector9, GridSector12}
		for _, corner := range corners {
			if len(Adjacencies[corner]) != 5 {
				t.Errorf("Corner sector at {%d, %d} should have 5 adjacents, got %d",
					corner.X, corner.Y, len(Adjacencies[corner]))
			}
		}

		// Middle sectors (5,6,7,8) should have 8 adjacents
		middles := []types.Point{GridSector5, GridSector6, GridSector7, GridSector8}
		for _, middle := range middles {
			if len(Adjacencies[middle]) != 8 {
				t.Errorf("Middle sector at {%d, %d} should have 8 adjacents, got %d",
					middle.X, middle.Y, len(Adjacencies[middle]))
			}
		}
	})
}

func TestGetSectors(t *testing.T) {
	t.Run("should create sectors map with proper structure", func(t *testing.T) {
		sectors := GetSectors()

		if len(sectors) == 0 {
			t.Error("GetSectors returned empty map")
		}

		// Count supersectors and subsectors
		supersectorCount := 0
		subsectorCount := 0

		for name, sector := range sectors {
			if name == "" {
				t.Error("Found sector with empty name")
			}

			// Check if it's a supersector or subsector
			switch s := sector.(type) {
			case *types.Supersector:
				supersectorCount++
				if s.HP != 0 {
					t.Errorf("Supersector %s should have HP of 0, got %d", name, s.HP)
				}
				if s.Grid.X < 0 || s.Grid.Y < 0 {
					t.Errorf("Supersector %s has invalid grid coordinates", name)
				}
				if len(s.Adjacents) == 0 {
					t.Errorf("Supersector %s has no adjacents", name)
				}
				if len(s.Subsectors) == 0 {
					t.Errorf("Supersector %s has no subsectors", name)
				}
			case *types.Subsector:
				subsectorCount++
				if s.HP != 0 {
					t.Errorf("Subsector %s should have HP of 0, got %d", name, s.HP)
				}
				if s.Supersector == "" {
					t.Errorf("Subsector %s has no supersector assigned", name)
				}
			default:
				t.Errorf("Unknown sector type for %s", name)
			}
		}

		// Verify counts
		if supersectorCount != 12 {
			t.Errorf("Expected 12 supersectors, got %d", supersectorCount)
		}
		if subsectorCount != 114 { // 10*11 + 4 for Antarctic
			t.Errorf("Expected 114 subsectors, got %d", subsectorCount)
		}
	})
}

func TestSectorCollections(t *testing.T) {
	t.Run("should have supersector names collection", func(t *testing.T) {
		if len(SupersectorNamesCollection) == 0 {
			t.Error("SupersectorNamesCollection is empty")
		}

		if len(SupersectorNamesCollection) != 12 {
			t.Errorf("Expected 12 supersectors, got %d", len(SupersectorNamesCollection))
		}

		for i, name := range SupersectorNamesCollection {
			if name == "" {
				t.Errorf("Supersector at index %d has empty name", i)
			}
		}
	})

	t.Run("should have subsector names collection", func(t *testing.T) {
		if len(SubsectorNamesCollection) == 0 {
			t.Error("SubsectorNamesCollection is empty")
		}

		expectedCount := 114 // 10*11 + 4 for Antarctic
		if len(SubsectorNamesCollection) != expectedCount {
			t.Errorf("Expected %d subsectors, got %d", expectedCount, len(SubsectorNamesCollection))
		}

		for i, name := range SubsectorNamesCollection {
			if name == "" {
				t.Errorf("Subsector at index %d has empty name", i)
			}
		}
	})

	t.Run("should have more subsectors than supersectors", func(t *testing.T) {
		if len(SubsectorNamesCollection) <= len(SupersectorNamesCollection) {
			t.Errorf("Expected more subsectors (%d) than supersectors (%d)",
				len(SubsectorNamesCollection), len(SupersectorNamesCollection))
		}
	})

	t.Run("should correctly map subsectors to supersectors", func(t *testing.T) {
		sectors := GetSectors()

		// Check each subsector is correctly assigned
		for idx, subsectorName := range SubsectorNamesCollection {
			sector, exists := sectors[string(subsectorName)]
			if !exists {
				t.Errorf("Subsector %s not found in sectors map", subsectorName)
				continue
			}

			subsector, ok := sector.(*types.Subsector)
			if !ok {
				t.Errorf("%s is not a Subsector type", subsectorName)
				continue
			}

			// Calculate expected supersector
			expectedSupersectorIdx := idx / 10
			if expectedSupersectorIdx >= len(SupersectorNamesCollection) {
				expectedSupersectorIdx = len(SupersectorNamesCollection) - 1
			}
			expectedSupersector := SupersectorNamesCollection[expectedSupersectorIdx]

			if subsector.Supersector != expectedSupersector {
				t.Errorf("Subsector %s expected to belong to %s, got %s",
					subsectorName, expectedSupersector, subsector.Supersector)
			}
		}
	})
}
