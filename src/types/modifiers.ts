export type ModifiersShip =
  // ship.day-change.general.mobilization
  //  +1 self: action.bridge.comms.mobilize
  //  day change: +4-8 ship.civitates
  //  remove: day change
  | 'ship.day-change.bridge.comms.mobilization'
  // ship.day-change.bridge.comms.onair
  //   +1 self: action.bridge.comms.onair
  //   day change: 0.5x crew morale loss from supersector.state.aux
  //   remove: day change
  | 'ship.day-change.bridge.comms.onair'
  // ship.day-change.garden.forage
  //   +1 self: action.garden.forage
  //   day change: +1 ship.persistent.garden.sapped
  //   remove: day change
  | 'ship.day-change.garden.forage'
  // ship.day-change.garden.grow
  //   +1 self: action.garden.grow
  //   day change: +1 ship.persistent.garden.bountiful
  //   remove: day change
  | 'ship.day-change.garden.grow'
  // ship.day-change.general.overcrowded
  //   +1 self: cycle change population > max population
  //   day change: -1 crew morale
  //   remove: cycle change population <= max population
  | 'ship.day-change.general.overcrowded'
  // ship.day-change.general.rallied
  //   +1 self: action.bridge.comms.rally
  //   day change: +4-8 Civitates
  //   remove: day change
  | 'ship.day-change.general.rallied'
  // ship.day-change.supersector.hearthbeat
  //   +1 self: trigger.supersector.event.utadazoey-live-jazz-bar
  //   remove: day change
  //   day change: +1 AP for 1 random character
  | 'ship.day-change.supersector.hearthbeat'
  // ship.persistent.garden.bountiful
  //   +1 self: day change if ship.day-change.garden.grow == 1
  //   remove: action.garden.harvest
  //   action.garden.harvest: 150% rations harvest
  | 'ship.persistent.garden.bountiful'
  // ship.persistent.garden.sapped
  //   +1 self: day change if ship.day-change.garden.forage == 1
  //   remove: action.garden.harvest
  //   action.garden.harvest: 50% rations harvest
  | 'ship.persistent.garden.sapped'
  // ship.persistent.buzzard.optimized
  //   +1 self: action.buzzard.calibrate
  //   remove: day change
  //   action.buzzard.command[any]: 50% eCells usage
  | 'ship.persistent.buzzard.optimized'
  // ship.persistent.engine.optimized
  //   +1 self: action.engine.calibrate
  //   remove: day change
  //   action.bridge.command[any]: 50% eCells usage
  | 'ship.persistent.engine.optimized'
  // ship.persistent.weapon.optimized
  //   +1 self: action.weapon.calibrate
  //   remove: day change
  //   action.flak-turret.shoot: 50% eCells usage
  //   action.laser-turret.shoot: 50% eCells usage
  | 'ship.persistent.weapon.optimized'
  // ship.cycle.life-support.broken
  //   +1 self: trigger.ship.room.life-support.broken
  //   remove: trigger.ship.room.life-support.fix
  //   cycle change: -10% (ship.civitates | ship.praetorian) or -1 random ship.character
  | 'ship.cycle.life-support.broken'
  // ship.cycle.storage.broken
  //   +1 self: trigger.ship.room.storage.broken
  //   remove: trigger.ship.room.storage.fix
  //   trigger: 50% max cargo cap, lose all over cap cargo
  //   cycle change: -10% cargo
  | 'ship.cycle.storage.broken'
  // ship.combat.armory.broken
  //   +1 self: trigger.ship.room.broken
  //   remove: trigger.ship.room.fix
  //   combat: 50% ground combat strength
  | 'ship.combat.armory.broken'
  // ship.combat.buzzard.close-air-support
  //   +1 self: action.buzzard.command.close-air-support
  //   remove: assault.init
  //   assault.init: -(9 to 11) ground threats
  | 'ship.combat.buzzard.close-air-support'
  // ship.combat.bridge.command.cannon-primed
  //   +1 self: action.bridge.command.prime
  //   remove:
  //     action.bridge.command.cannon
  //     assault.init
  //   action.bridge.command.cannon: No eCells and AP usage
  //   assault.init: Math.floor(prng() * 20) + 11
  | 'ship.combat.bridge.command.cannon-primed'

export type ModifiersCharacter =
  // character.cycle.deprived
  //   +1 self: cycle change
  //   cycle change: if >= 12 -1 AP
  //   remove:
  //     consumable.meds.blissbloom
  //     consumable.meds.somnoxa
  //     action.private-quarters.seggs
  //   remove partial:
  //     -3 action.common-room.socialize
  //     -4 action.expocrafts-bay.launch
  //     -6 consumable.drink.islanders-coffee
  //     -7 consumable.drink.blackmoon
  | 'character.cycle.deprived'
  // character.cycle.dirty
  //   +1 self 20% chance:
  //     action.expocrafts-bay.launch
  //     action.expocrafts-bay.repair
  //     action.fightercrafts-bay.repair
  //     action.engine.calibrate
  //     action.garden.forage
  //     action.garden.grow
  //     action.garden.harvest
  //     action.private-quarters.seggs
  //     action.refectory.breakfast
  //     action.refectory.lunch
  //     action.refectory.dinner
  //     action.weapon.calibrate
  //   cycle change: 5% chance +1 character.persistent.sick
  //   remove:
  //     action.common-room.shower
  //     action.private-quarters.shower
  //   -1 crew morale penalty:
  //     action.common-room.socialize
  //     action.private-quarters.seggs
  //   blocking:
  //     action.refectory.provision
  //     action.rnd.research
  //   150% supplies consumption:
  //     action.medlab.compound
  //     action.medlab.firstaid
  //     action.medlab.surgery
  | 'character.cycle.dirty'
  // character.cycle.frustrated
  //   +1 self: character.cycle.deprived >= 12
  // remove:
  //   action.private-quarters.seggs
  //   character.cycle.deprived amount < 12
  | 'character.cycle.frustrated'
  // character.cycle.hungry
  //   +1 self day change: if character.day-change.eat == 0
  //   cycle change: 5% chance +1 character.persistent.sick
  //   remove:
  //     action.refectory.breakfast
  //     action.refectory.lunch
  //     action.refectory.dinner
  //     consumable.food.gourmet-pack
  //   remove partial:
  //     -1 consumable.food.astrotato-fries
  //     -1 consumable.food.frisbread
  //     -2 consumable.food.lightspeed-ramen
  | 'character.cycle.hungry'
  // character.cycle.tired
  //   +1 self: consumable.meds.vigorisk
  //   +1 self day change: if character.day-change.sleep == 0
  //   +2 self: consumable.meds.somnoxa
  //   cycle change: 5% chance +1 character.persistent.sick
  //   remove: action.private-quarters.sleep
  | 'character.cycle.tired'
  // character.day-change.eat
  //   +1 self:
  //     action.refectory.breakfast
  //     action.refectory.lunch
  //     action.refectory.dinner
  //     action.inventory.eat
  //   day change: +1 character.cycle.hungry
  | 'character.day-change.eat'
  // character.day-change.sleep
  //   +1 self: action.private-quarters.sleep
  //   day change:
  //     +1 character.cycle.tired
  //     -1 40% character.persistent.sick
  | 'character.day-change.sleep'
  // character.day-change.uplifted
  //   +1 self: consumable.food.gourmet-pack
  //   day change: +1 AP
  //   does not stack
  //   remove: day change
  | 'character.day-change.uplifted'
  // character.persistent.seggs
  //   +1 self: action.private-quarters.seggs
  //   remove: day change
  //   blocking: action.private-quarters.seggs
  //   character.cycle.deprived: remove
  | 'character.persistent.seggs'
  // character.persistent.socialize
  //   +1 self: action.common-room.socialize
  //   remove: day change
  | 'character.persistent.socialize'
  // character.persistent.drunk
  //   +2 self:
  //     consumable.meds.blissbloom
  //     consumable.drink.blackmoon
  //   chat:
  //     1 stack: insert random extra vowels
  //     2 stack: highlight random letters
  //     3 stack: jumble letters in words
  //   combat: TODO: +1 Aerial Threats per stack
  //   cap: 3
  //   over cap: +1 character.persistent.sick per over cap stack
  //   remove partial:
  //     -1 per 2 cycle change
  //     -2 consumable.meds.lucidix
  //   track: character.track add [character.persistent.drunk, [4, 1]] (key, [day, cycle])
  | 'character.persistent.drunk'
  // character.persistent.sick
  //   +1 self:
  //     if > 3 character.persistent.drunk
  //   +1 self 5% chance, cycle change:
  //     character.cycle.tired
  //   +1 self 5% * total stacks, cycle change:
  //     character.cycle.hungry
  //   +1 random character 20% chance:
  //     expedition.supersector.trade.street-food-vendors
  //   +1 1-5 characters 10% chance:
  //     expedition.supersector.event.barrier-reef-maze
  //   remove: consumable.food.voidplum
  //   remove partial:
  //     -1 40% character.day-change.sleep
  //     -1 consumable.meds.solacil
  //     -2 consumable.meds.duarin
  //     -3 consumable.meds.trivagex
  //   battle:
  //     TODO: add fatigue card to character battle deck, 1 per stack
  | 'character.persistent.sick'
  | 'character.persistent.attrition'
  | 'character.wound.light'
  | 'character.wound.critical'
  | 'character.wound.stabilized.light'
  | 'character.wound.stabilized.critical'

export interface ModifierTimeDetail {
  day: number
  cycle: number
}

export interface ModifierTracker {
  amount: number
  start: ModifierTimeDetail
  expiry: ModifierTimeDetail
}
