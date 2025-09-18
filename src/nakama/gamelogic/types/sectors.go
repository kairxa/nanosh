package types

type SubsectorName string

// Supersector 01: Arctic Alliance
const (
	SubsectorAnchorage   SubsectorName = "Anchorage, United States (Alaska)"
	SubsectorMinneapolis SubsectorName = "Minneapolis, United States"
	SubsectorNuuk        SubsectorName = "Nuuk, Greenland"
	SubsectorOslo        SubsectorName = "Oslo, Norway"
	SubsectorQuebecCity  SubsectorName = "Quebec City, Canada"
	SubsectorReykjavik   SubsectorName = "Reykjavik, Iceland"
	SubsectorSeattle     SubsectorName = "Seattle, United States"
	SubsectorStavanger   SubsectorName = "Stavanger, Norway"
	SubsectorToronto     SubsectorName = "Toronto, Canada"
	SubsectorVancouver   SubsectorName = "Vancouver, Canada"
)

// Supersector 02: EUFed
const (
	SubsectorAmsterdam  SubsectorName = "Amsterdam, Netherlands"
	SubsectorBerlin     SubsectorName = "Berlin, Germany"
	SubsectorBirmingham SubsectorName = "Birmingham, United Kingdom"
	SubsectorDublin     SubsectorName = "Dublin, Ireland"
	SubsectorLondon     SubsectorName = "London, United Kingdom"
	SubsectorMadrid     SubsectorName = "Madrid, Spain"
	SubsectorRome       SubsectorName = "Rome, Italy"
	SubsectorParis      SubsectorName = "Paris, France"
	SubsectorStockholm  SubsectorName = "Stockholm, Sweden"
	SubsectorWarsaw     SubsectorName = "Warsaw, Poland"
)

// Continue with all other subsectors...
// (truncated for brevity - would include all 130 subsectors)

type SupersectorName string

const (
	SupersectorArcticCircle              SupersectorName = "Arctic Circle"
	SupersectorEuropeanFederation        SupersectorName = "European Federation"
	SupersectorRUSSECAN                  SupersectorName = "RUSSE-CAN"
	SupersectorEastAsiaEnclave           SupersectorName = "East Asia Enclave"
	SupersectorNorthAmericanUnion        SupersectorName = "North American Union"
	SupersectorMENACoalition             SupersectorName = "MENA Coalition"
	SupersectorSouthAsianNetwork         SupersectorName = "South Asian Network"
	SupersectorSEABloc                   SupersectorName = "SEA Bloc"
	SupersectorSouthAmericanAlliance     SupersectorName = "South American Alliance"
	SupersectorSouthAfricanConfederation SupersectorName = "South African Confederation"
	SupersectorOceanianFront             SupersectorName = "Oceanian Front"
	SupersectorAntarcticPole             SupersectorName = "Antarctic Pole"
)

type SectorName string // Can be either SupersectorName or SubsectorName

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Subsector struct {
	HP          int             `json:"hp"` // Advance: up to 3, Outpost: 6, Liberation Point: 3
	Supersector SupersectorName `json:"supersector"`
}

// Grid layout:
// 01 | 02 | 03 | 04
// 05 | 06 | 07 | 08
// 09 | 10 | 11 | 12
// This is a 4x3 grid representative of a tube. 1 to 4 is wrappable, thus making it adjacent.
// 1 to 6 is also adjacent, since diagonal is also counted as such.
type Supersector struct {
	HP         int                    `json:"hp"` // aux: 25 HP, main: 50 HP
	Grid       Point                  `json:"grid"`
	Adjacents  []Point                `json:"adjacents"`
	Subsectors map[SubsectorName]bool `json:"subsectors"`
}
