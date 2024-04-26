import type { Room, ShipTypes } from '../../types/ship'

export interface GetInitialShipRoomsParams {
  shipType: ShipTypes
}
export const GetInitialShipRooms = (
  { shipType }: GetInitialShipRoomsParams = { shipType: 'griffin' },
): Map<string, Room> => {
  const rooms = new Map<string, Room>()

  switch (shipType) {
    case 'griffin':
      rooms.set('room-1', { type: 'bridge', name: 'Bridge', broken: [] })
      rooms.set('room-2', {
        type: 'garden',
        name: 'Hydroponic Garden',
        broken: [],
      })
      rooms.set('room-3', { type: 'refectory', name: 'Refectory', broken: [] })
      rooms.set('room-4', { type: 'rnd', name: 'R&D', broken: [] })
      rooms.set('room-5', { type: 'medlab', name: 'Medical Lab', broken: [] })
      rooms.set('room-6', {
        type: 'life-support',
        name: 'Life Support System',
        broken: [],
      })
      rooms.set('room-7', { type: 'storage', name: 'Storage Room', broken: [] })
      rooms.set('room-8', {
        type: 'private-quarters',
        name: 'Private Quarters',
        broken: [],
      })
      rooms.set('room-9', {
        type: 'common-area',
        name: 'Common Area',
        broken: [],
      })
      rooms.set('room-10', { type: 'dorms', name: 'Dorms', broken: [] })
      rooms.set('room-11', { type: 'barracks', name: 'Barracks', broken: [] })
      rooms.set('room-12', {
        type: 'weapon-systems',
        name: 'Weapon Systems',
        broken: [],
      })
      rooms.set('room-13', {
        type: 'fightercrafts-bay',
        name: 'Buzzards Bay',
        broken: [],
      })
      rooms.set('room-14', {
        type: 'expocrafts-bay',
        name: 'Blitzhoppers Bay',
        broken: [],
      })
      rooms.set('room-15', {
        type: 'flak-turret',
        name: 'Front Flak Turret',
        broken: [],
      })
      rooms.set('room-16', {
        type: 'laser-turret',
        name: 'Rear Laser Turret',
        broken: [],
      })
      rooms.set('room-17', { type: 'armory', name: 'Armory', broken: [] })
      rooms.set('room-18', {
        type: 'engine-room',
        name: 'Engine Room',
        broken: [],
      })
      rooms.set('room-19', {
        type: 'corridor',
        name: 'Front Corridor',
        broken: [],
      })
      rooms.set('room-20', {
        type: 'hallway',
        name: 'Front Hallway',
        broken: [],
      })
      rooms.set('room-21', {
        type: 'corridor',
        name: 'Rear Corridor',
        broken: [],
      })
      rooms.set('room-22', {
        type: 'hallway',
        name: 'Rear Hallway',
        broken: [],
      })
      rooms.set('room-23', {
        type: 'plating',
        name: "Griffin's Plating 1",
        broken: [],
      })
      rooms.set('room-24', {
        type: 'plating',
        name: "Griffin's Plating 2",
        broken: [],
      })
      rooms.set('room-25', {
        type: 'plating',
        name: "Griffin's Plating 3",
        broken: [],
      })
      rooms.set('room-26', {
        type: 'plating',
        name: "Griffin's Plating 4",
        broken: [],
      })
      rooms.set('room-27', {
        type: 'plating',
        name: "Griffin's Plating 5",
        broken: [],
      })
      rooms.set('room-28', {
        type: 'plating',
        name: "Griffin's Plating 6",
        broken: [],
      })
      rooms.set('room-29', {
        type: 'plating',
        name: "Griffin's Plating 7",
        broken: [],
      })
      rooms.set('room-30', {
        type: 'plating',
        name: "Griffin's Plating 8",
        broken: [],
      })
      break
  }

  return rooms
}
