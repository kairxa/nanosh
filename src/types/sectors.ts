import type { Point } from './generic'

export type SubsectorNames =
  // Supersector 01: Arctic Alliance
  | 'Anchorage, United States (Alaska)'
  | 'Minneapolis, United States'
  | 'Nuuk, Greenland'
  | 'Oslo, Norway'
  | 'Quebec City, Canada'
  | 'Reykjavik, Iceland'
  | 'Seattle, United States'
  | 'Stavanger, Norway'
  | 'Toronto, Canada'
  | 'Vancouver, Canada'
  // Supersector 02: EUFed
  | 'Amsterdam, Netherlands'
  | 'Berlin, Germany'
  | 'Birmingham, United Kingdom'
  | 'Dublin, Ireland'
  | 'London, United Kingdom'
  | 'Madrid, Spain'
  | 'Rome, Italy'
  | 'Paris, France'
  | 'Stockholm, Sweden'
  | 'Warsaw, Poland'
  // Supersector 03: RUSSE_CAN
  | 'Almaty, Kazakhstan'
  | 'Astana, Kazakhstan'
  | 'Bishkek, Kyrgyzstan'
  | 'Moscow, Russia'
  | 'Novosibirsk, Russia'
  | 'Omsk, Russia'
  | 'Saint Petersburg, Russia'
  | 'Samara, Russia'
  | 'Tashkent, Uzbekistan'
  | 'Yekaterinburg, Russia'
  // Supersector 04: EAE
  | 'Beijing, China'
  | 'Incheon, South Korea'
  | 'Osaka, Japan'
  | 'Pyongyang, North Korea'
  | 'Sapporo, Japan'
  | 'Seoul, South Korea'
  | 'Shanghai, China'
  | 'Taipei, Taiwan'
  | 'Tokyo, Japan'
  | 'Ulaanbaatar, Mongolia'
  // Supersector 05: NAU
  | 'Chicago, United States'
  | 'Havana, Cuba'
  | 'Houston, United States'
  | 'Los Angeles, United States'
  | 'Mexico City, Mexico'
  | 'Miami, United States'
  | 'Montreal, Canada'
  | 'New York City, United States'
  | 'San Francisco, United States'
  | 'Toronto, Canada'
  // Supersector 06: MEDA_Coalition
  | 'Abu Dhabi, United Arab Emirates'
  | 'Amman, Jordan'
  | 'Baghdad, Iraq'
  | 'Beirut, Lebanon'
  | 'Cairo, Egypt'
  | 'Doha, Qatar'
  | 'Dubai, United Arab Emirates'
  | 'Jerusalem, Israel'
  | 'Riyadh, Saudi Arabia'
  | 'Tehran, Iran'
  // Supersector 07: South Asian Network
  | 'Chennai, India'
  | 'Colombo, Sri Lanka'
  | 'Delhi, India'
  | 'Dhaka, Bangladesh'
  | 'Islamabad, Pakistan'
  | 'Karachi, Pakistan'
  | 'Kathmandu, Nepal'
  | 'Kolkata, India'
  | 'Lahore, Pakistan'
  | 'Mumbai, India'
  // Supersector 08: SEA Bloc
  | 'Bali, Indonesia'
  | 'Bangkok, Thailand'
  | 'Hanoi, Vietnam'
  | 'Ho Chi Minh City, Vietnam'
  | 'Jakarta, Indonesia'
  | 'Kuala Lumpur, Malaysia'
  | 'Manila, Philippines'
  | 'Phnom Penh, Cambodia'
  | 'Pontianak, Indonesia'
  | 'Singapore, Singapore'
  // Supersector 09: SAA
  | 'Bogotá, Colombia'
  | 'Buenos Aires, Argentina'
  | 'Caracas, Venezuela'
  | 'Lima, Peru'
  | 'Medellín, Colombia'
  | 'Montevideo, Uruguay'
  | 'Quito, Ecuador'
  | 'Rio de Janeiro, Brazil'
  | 'Santiago, Chile'
  | 'São Paulo, Brazil'
  // Supersector 10: SAC
  | 'Accra, Ghana'
  | 'Addis Ababa, Ethiopia'
  | 'Cape Town, South Africa'
  | 'Dar es Salaam, Tanzania'
  | 'Johannesburg, South Africa'
  | 'Kampala, Uganda'
  | 'Kinshasa, Democratic Republic of the Congo'
  | 'Lagos, Nigeria'
  | 'Luanda, Angola'
  | 'Nairobi, Kenya'
  // Supersector 11: Oceanian Front
  | 'Adelaide, Australia'
  | 'Auckland, New Zealand'
  | 'Brisbane, Australia'
  | 'Christchurch, New Zealand'
  | 'Melbourne, Australia'
  | 'Perth, Australia'
  | 'Port Moresby, Papua New Guinea'
  | 'Suva, Fiji'
  | 'Sydney, Australia'
  | 'Wellington, New Zealand'
  // Supersector 12: Antarctic Pole
  | 'Amundsen-Scott South Pole Station (USA)'
  | 'McMurdo Station (USA)'
  | 'Rothera Research Station (UK)'
  | 'Scott Base (New Zealand)'

export interface Subsector {
  hp: number // Advance: up to 3, Outpost: 6, Liberation Point: 3,
  supersector: SupersectorNames
}

export type SupersectorNames =
  | 'Arctic Circle'
  | 'European Federation'
  | 'RUSSE-CAN'
  | 'East Asia Enclave'
  | 'North American Union'
  | 'MENA Coalition'
  | 'South Asian Network'
  | 'SEA Bloc'
  | 'South American Alliance'
  | 'South African Confederation'
  | 'Oceanian Front'
  | 'Antarctic Pole'

export type SectorNames = SupersectorNames | SubsectorNames

// 01 | 02 | 03 | 04
// 05 | 06 | 07 | 08
// 09 | 10 | 11 | 12
// This is a 4x3 grid representative of a tube. That means 1 to 4 is wrappable, thus making it adjacent.
// 1 to 6 is also adjacent, since diagonal is also counted as such.
export interface Supersector {
  hp: number // aux: 25 HP, main: 50 HP
  grid: Point
  adjacents: Point[] // See adjacency note above.
  subsectors: Set<SubsectorNames>
}
