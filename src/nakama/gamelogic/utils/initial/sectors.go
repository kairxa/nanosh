package initial

import "nanosh/nakama-modules/gamelogic/types"

// Grid sector points representing the 4x3 tube layout
// 01 | 02 | 03 | 04
// 05 | 06 | 07 | 08
// 09 | 10 | 11 | 12
var (
	GridSector1  = types.Point{X: 0, Y: 0}
	GridSector2  = types.Point{X: 1, Y: 0}
	GridSector3  = types.Point{X: 2, Y: 0}
	GridSector4  = types.Point{X: 3, Y: 0}
	GridSector5  = types.Point{X: 0, Y: 1}
	GridSector6  = types.Point{X: 1, Y: 1}
	GridSector7  = types.Point{X: 2, Y: 1}
	GridSector8  = types.Point{X: 3, Y: 1}
	GridSector9  = types.Point{X: 0, Y: 2}
	GridSector10 = types.Point{X: 1, Y: 2}
	GridSector11 = types.Point{X: 2, Y: 2}
	GridSector12 = types.Point{X: 3, Y: 2}
)

// Adjacencies defines which sectors are adjacent to each other
// The tube wraps around, so sectors 1 and 4 are adjacent
var Adjacencies = map[types.Point][]types.Point{
	GridSector1: {GridSector2, GridSector4, GridSector5, GridSector6, GridSector8},
	GridSector2: {GridSector1, GridSector3, GridSector5, GridSector6, GridSector7},
	GridSector3: {GridSector2, GridSector4, GridSector6, GridSector7, GridSector8},
	GridSector4: {GridSector1, GridSector3, GridSector5, GridSector7, GridSector8},
	GridSector5: {
		GridSector1, GridSector2, GridSector4, GridSector6, GridSector8,
		GridSector9, GridSector10, GridSector12,
	},
	GridSector6: {
		GridSector1, GridSector2, GridSector3, GridSector5, GridSector7,
		GridSector9, GridSector10, GridSector11,
	},
	GridSector7: {
		GridSector2, GridSector3, GridSector4, GridSector6, GridSector8,
		GridSector10, GridSector11, GridSector12,
	},
	GridSector8: {
		GridSector1, GridSector3, GridSector4, GridSector5, GridSector7,
		GridSector9, GridSector11, GridSector12,
	},
	GridSector9:  {GridSector5, GridSector6, GridSector8, GridSector10, GridSector12},
	GridSector10: {GridSector5, GridSector6, GridSector7, GridSector9, GridSector11},
	GridSector11: {GridSector6, GridSector7, GridSector8, GridSector10, GridSector12},
	GridSector12: {GridSector5, GridSector7, GridSector8, GridSector9, GridSector11},
}

// SupersectorNamesCollection contains all supersector names in order
var SupersectorNamesCollection = []types.SupersectorName{
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

// SubsectorNamesCollection contains all subsector names in order
// Each group of 10 (or 4 for Antarctic) belongs to the corresponding supersector
var SubsectorNamesCollection = []types.SubsectorName{
	// Arctic Circle (index 0-9)
	"Anchorage, United States (Alaska)",
	"Minneapolis, United States",
	"Nuuk, Greenland",
	"Oslo, Norway",
	"Quebec City, Canada",
	"Reykjavik, Iceland",
	"Seattle, United States",
	"Stavanger, Norway",
	"Toronto, Canada",
	"Vancouver, Canada",
	// European Federation (index 10-19)
	"Amsterdam, Netherlands",
	"Berlin, Germany",
	"Birmingham, United Kingdom",
	"Dublin, Ireland",
	"London, United Kingdom",
	"Madrid, Spain",
	"Paris, France",
	"Rome, Italy",
	"Stockholm, Sweden",
	"Warsaw, Poland",
	// RUSSE-CAN (index 20-29)
	"Almaty, Kazakhstan",
	"Astana, Kazakhstan",
	"Bishkek, Kyrgyzstan",
	"Moscow, Russia",
	"Novosibirsk, Russia",
	"Omsk, Russia",
	"Saint Petersburg, Russia",
	"Samara, Russia",
	"Tashkent, Uzbekistan",
	"Yekaterinburg, Russia",
	// East Asia Enclave (index 30-39)
	"Beijing, China",
	"Incheon, South Korea",
	"Osaka, Japan",
	"Pyongyang, North Korea",
	"Sapporo, Japan",
	"Seoul, South Korea",
	"Shanghai, China",
	"Taipei, Taiwan",
	"Tokyo, Japan",
	"Ulaanbaatar, Mongolia",
	// North American Union (index 40-49)
	"Chicago, United States",
	"Havana, Cuba",
	"Houston, United States",
	"Los Angeles, United States",
	"Mexico City, Mexico",
	"Miami, United States",
	"Montreal, Canada",
	"New York City, United States",
	"San Francisco, United States",
	"Washington D.C., United States",
	// MENA Coalition (index 50-59)
	"Abu Dhabi, United Arab Emirates",
	"Amman, Jordan",
	"Baghdad, Iraq",
	"Beirut, Lebanon",
	"Cairo, Egypt",
	"Doha, Qatar",
	"Dubai, United Arab Emirates",
	"Jerusalem, Israel",
	"Riyadh, Saudi Arabia",
	"Tehran, Iran",
	// South Asian Network (index 60-69)
	"Chennai, India",
	"Colombo, Sri Lanka",
	"Delhi, India",
	"Dhaka, Bangladesh",
	"Islamabad, Pakistan",
	"Karachi, Pakistan",
	"Kathmandu, Nepal",
	"Kolkata, India",
	"Lahore, Pakistan",
	"Mumbai, India",
	// SEA Bloc (index 70-79)
	"Bali, Indonesia",
	"Bangkok, Thailand",
	"Hanoi, Vietnam",
	"Ho Chi Minh City, Vietnam",
	"Jakarta, Indonesia",
	"Kuala Lumpur, Malaysia",
	"Manila, Philippines",
	"Phnom Penh, Cambodia",
	"Pontianak, Indonesia",
	"Singapore, Singapore",
	// South American Alliance (index 80-89)
	"Bogotá, Colombia",
	"Buenos Aires, Argentina",
	"Caracas, Venezuela",
	"Lima, Peru",
	"Medellín, Colombia",
	"Montevideo, Uruguay",
	"Quito, Ecuador",
	"Rio de Janeiro, Brazil",
	"Santiago, Chile",
	"São Paulo, Brazil",
	// South African Confederation (index 90-99)
	"Accra, Ghana",
	"Addis Ababa, Ethiopia",
	"Cape Town, South Africa",
	"Dar es Salaam, Tanzania",
	"Johannesburg, South Africa",
	"Kampala, Uganda",
	"Kinshasa, Democratic Republic of the Congo",
	"Lagos, Nigeria",
	"Luanda, Angola",
	"Nairobi, Kenya",
	// Oceanian Front (index 100-109)
	"Adelaide, Australia",
	"Auckland, New Zealand",
	"Brisbane, Australia",
	"Christchurch, New Zealand",
	"Melbourne, Australia",
	"Perth, Australia",
	"Port Moresby, Papua New Guinea",
	"Suva, Fiji",
	"Sydney, Australia",
	"Wellington, New Zealand",
	// Antarctic Pole (index 110-113) - only 4 subsectors
	"Amundsen-Scott South Pole Station (USA)",
	"McMurdo Station (USA)",
	"Rothera Research Station (UK)",
	"Scott Base (New Zealand)",
}

// GetSectors creates and returns a map of all sectors (both super and sub)
func GetSectors() map[string]any {
	sectors := make(map[string]any)

	// Create grid iterator
	gridIndex := 0
	grids := []types.Point{
		GridSector1, GridSector2, GridSector3, GridSector4,
		GridSector5, GridSector6, GridSector7, GridSector8,
		GridSector9, GridSector10, GridSector11, GridSector12,
	}

	// Add supersectors
	for idx, supersectorName := range SupersectorNamesCollection {
		// Calculate subsector range for this supersector
		startIdx := idx * 10
		endIdx := startIdx + 10
		if idx == 11 { // Antarctic Pole has only 4 subsectors
			endIdx = startIdx + 4
		}
		if endIdx > len(SubsectorNamesCollection) {
			endIdx = len(SubsectorNamesCollection)
		}

		// Create subsectors set
		subsectors := make(map[types.SubsectorName]bool)
		for i := startIdx; i < endIdx; i++ {
			subsectors[SubsectorNamesCollection[i]] = true
		}

		sectors[string(supersectorName)] = &types.Supersector{
			HP:         0,
			Grid:       grids[gridIndex],
			Adjacents:  Adjacencies[grids[gridIndex]],
			Subsectors: subsectors,
		}
		gridIndex++
	}

	// Add subsectors
	for idx, subsectorName := range SubsectorNamesCollection {
		supersectorIdx := idx / 10
		if supersectorIdx >= len(SupersectorNamesCollection) {
			supersectorIdx = len(SupersectorNamesCollection) - 1
		}

		sectors[string(subsectorName)] = &types.Subsector{
			HP:          0,
			Supersector: SupersectorNamesCollection[supersectorIdx],
		}
	}

	return sectors
}
