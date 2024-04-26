import type { Point } from '@nanosh/types/generic'
import {
  type SectorNames,
  type Subsector,
  type SubsectorNames,
  type Supersector,
  type SupersectorNames,
} from '../../types/sectors'

export const GridSector1: Point = { x: 0, y: 0 }
export const GridSector2: Point = { x: 1, y: 0 }
export const GridSector3: Point = { x: 2, y: 0 }
export const GridSector4: Point = { x: 3, y: 0 }
export const GridSector5: Point = { x: 0, y: 1 }
export const GridSector6: Point = { x: 1, y: 1 }
export const GridSector7: Point = { x: 2, y: 1 }
export const GridSector8: Point = { x: 3, y: 1 }
export const GridSector9: Point = { x: 0, y: 2 }
export const GridSector10: Point = { x: 1, y: 2 }
export const GridSector11: Point = { x: 2, y: 2 }
export const GridSector12: Point = { x: 3, y: 2 }

export const Adjacencies: Map<Point, Point[]> = new Map([
  [
    GridSector1,
    [GridSector2, GridSector4, GridSector5, GridSector6, GridSector8],
  ],
  [
    GridSector2,
    [GridSector1, GridSector3, GridSector5, GridSector6, GridSector7],
  ],
  [
    GridSector3,
    [GridSector2, GridSector4, GridSector6, GridSector7, GridSector8],
  ],
  [
    GridSector4,
    [GridSector1, GridSector3, GridSector5, GridSector7, GridSector8],
  ],
  [
    GridSector5,
    [
      GridSector1,
      GridSector2,
      GridSector4,
      GridSector6,
      GridSector8,
      GridSector9,
      GridSector10,
      GridSector12,
    ],
  ],
  [
    GridSector6,
    [
      GridSector1,
      GridSector2,
      GridSector3,
      GridSector5,
      GridSector7,
      GridSector9,
      GridSector10,
      GridSector11,
    ],
  ],
  [
    GridSector7,
    [
      GridSector2,
      GridSector3,
      GridSector4,
      GridSector6,
      GridSector8,
      GridSector10,
      GridSector11,
      GridSector12,
    ],
  ],
  [
    GridSector8,
    [
      GridSector1,
      GridSector3,
      GridSector4,
      GridSector5,
      GridSector7,
      GridSector9,
      GridSector11,
      GridSector12,
    ],
  ],
  [
    GridSector9,
    [GridSector5, GridSector6, GridSector8, GridSector10, GridSector12],
  ],
  [
    GridSector10,
    [GridSector5, GridSector6, GridSector7, GridSector9, GridSector11],
  ],
  [
    GridSector11,
    [GridSector6, GridSector7, GridSector8, GridSector10, GridSector12],
  ],
  [
    GridSector12,
    [GridSector5, GridSector7, GridSector8, GridSector9, GridSector11],
  ],
])

export const SupersectorNamesCollection: SupersectorNames[] = [
  'Arctic Circle',
  'European Federation',
  'RUSSE-CAN',
  'East Asia Enclave',
  'North American Union',
  'MENA Coalition',
  'South Asian Network',
  'SEA Bloc',
  'South American Alliance',
  'South African Confederation',
  'Oceanian Front',
  'Antarctic Pole',
]

export const SubsectorNamesCollection: SubsectorNames[] = [
  // Default: ArcticAlliance
  'Anchorage, United States (Alaska)',
  'Minneapolis, United States',
  'Nuuk, Greenland',
  'Oslo, Norway',
  'Quebec City, Canada',
  'Reykjavik, Iceland',
  'Seattle, United States',
  'Stavanger, Norway',
  'Toronto, Canada',
  'Vancouver, Canada',
  // Default: EUFed
  'Amsterdam, Netherlands',
  'Berlin, Germany',
  'Birmingham, United Kingdom',
  'Dublin, Ireland',
  'London, United Kingdom',
  'Madrid, Spain',
  'Paris, France',
  'Rome, Italy',
  'Stockholm, Sweden',
  'Warsaw, Poland',
  // Default: RUSSE_CAN
  'Almaty, Kazakhstan',
  'Astana, Kazakhstan',
  'Bishkek, Kyrgyzstan',
  'Moscow, Russia',
  'Novosibirsk, Russia',
  'Omsk, Russia',
  'Saint Petersburg, Russia',
  'Samara, Russia',
  'Tashkent, Uzbekistan',
  'Yekaterinburg, Russia',
  // Default: EAE
  'Beijing, China',
  'Incheon, South Korea',
  'Osaka, Japan',
  'Pyongyang, North Korea',
  'Sapporo, Japan',
  'Seoul, South Korea',
  'Shanghai, China',
  'Taipei, Taiwan',
  'Tokyo, Japan',
  'Ulaanbaatar, Mongolia',
  // Default: NAU
  'Chicago, United States',
  'Havana, Cuba',
  'Houston, United States',
  'Los Angeles, United States',
  'Mexico City, Mexico',
  'Miami, United States',
  'Montreal, Canada',
  'New York City, United States',
  'San Francisco, United States',
  'Toronto, Canada',
  // Default: MEDA_Coalition
  'Abu Dhabi, United Arab Emirates',
  'Amman, Jordan',
  'Baghdad, Iraq',
  'Beirut, Lebanon',
  'Cairo, Egypt',
  'Doha, Qatar',
  'Dubai, United Arab Emirates',
  'Jerusalem, Israel',
  'Riyadh, Saudi Arabia',
  'Tehran, Iran',
  // Default: SouthAsianNetwork
  'Chennai, India',
  'Colombo, Sri Lanka',
  'Delhi, India',
  'Dhaka, Bangladesh',
  'Islamabad, Pakistan',
  'Karachi, Pakistan',
  'Kathmandu, Nepal',
  'Kolkata, India',
  'Lahore, Pakistan',
  'Mumbai, India',
  // Default: SEA_Bloc
  'Bali, Indonesia',
  'Bangkok, Thailand',
  'Hanoi, Vietnam',
  'Ho Chi Minh City, Vietnam',
  'Jakarta, Indonesia',
  'Kuala Lumpur, Malaysia',
  'Manila, Philippines',
  'Phnom Penh, Cambodia',
  'Pontianak, Indonesia',
  'Singapore, Singapore',
  // Default: SAA
  'Bogotá, Colombia',
  'Buenos Aires, Argentina',
  'Caracas, Venezuela',
  'Lima, Peru',
  'Medellín, Colombia',
  'Montevideo, Uruguay',
  'Quito, Ecuador',
  'Rio de Janeiro, Brazil',
  'Santiago, Chile',
  'São Paulo, Brazil',
  // Default: SAC
  'Accra, Ghana',
  'Addis Ababa, Ethiopia',
  'Cape Town, South Africa',
  'Dar es Salaam, Tanzania',
  'Johannesburg, South Africa',
  'Kampala, Uganda',
  'Kinshasa, Democratic Republic of the Congo',
  'Lagos, Nigeria',
  'Luanda, Angola',
  'Nairobi, Kenya',
  // Default: OceanianFront
  'Adelaide, Australia',
  'Auckland, New Zealand',
  'Brisbane, Australia',
  'Christchurch, New Zealand',
  'Melbourne, Australia',
  'Perth, Australia',
  'Port Moresby, Papua New Guinea',
  'Suva, Fiji',
  'Sydney, Australia',
  'Wellington, New Zealand',
  // Default: AntarcticPole
  'Amundsen-Scott South Pole Station (USA)',
  'McMurdo Station (USA)',
  'Rothera Research Station (UK)',
  'Scott Base (New Zealand)',
]

export const GetSectors = (): Map<SectorNames, Supersector | Subsector> => {
  const sectors = new Map<SectorNames, Supersector | Subsector>()
  const grids = Adjacencies.keys()
  const adjacents = Adjacencies.values()

  SupersectorNamesCollection.forEach((supersectorName, idx) => {
    sectors.set(supersectorName, {
      hp: 0,
      grid: grids.next().value,
      adjacents: adjacents.next().value,
      subsectors: new Set<SubsectorNames>(
        SubsectorNamesCollection.slice(
          10 * idx,
          Math.min(10 * (idx + 1), SubsectorNamesCollection.length + 1),
        ),
      ),
    })
  })

  SubsectorNamesCollection.forEach((subsectorName, idx) => {
    sectors.set(subsectorName, {
      hp: 0,
      supersector: SupersectorNamesCollection[Math.floor(idx / 10)],
    })
  })

  return sectors
}
