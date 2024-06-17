export type Actions =
  | 'action.bridge.command.advance'
  | 'action.bridge.command.cannon'
  | 'action.bridge.command.prime'
  | 'action.bridge.command.mobilize'
  | 'action.bridge.command.reinforce'
  | 'action.bridge.command.liberate'
  | 'action.bridge.command.analyze'
  | 'action.bridge.comms.propa'
  | 'action.bridge.comms.music'
  | 'action.bridge.comms.onair'
  | 'action.bridge.comms.rally'
  | 'action.bridge.comms.hail'
  | 'action.bridge.comms.interceptsignal'
  | 'action.common-area.socialize'
  | 'action.engine-room.calibrate'
  | 'action.engine-room.shield'
  | 'action.expocrafts-bay.ready'
  | 'action.expocrafts-bay.unready'
  | 'action.expocrafts-bay.repair'
  | 'action.fightercrafts-bay.calibrate'
  | 'action.fightercrafts-bay.dogfight'
  | 'action.fightercrafts-bay.patrolrun'
  | 'action.fightercrafts-bay.repair'
  | 'action.flak-turret.shoot'
  | 'action.laser-turret.shoot'
  | 'action.medlab.compound'
  | 'action.medlab.firstaid'
  | 'action.medlab.surgery'
  | 'action.garden.forage'
  | 'action.garden.grow'
  | 'action.garden.harvest'
  | 'action.generic.shower'
  | 'action.refectory.provision'
  | 'action.refectory.consume'
  | 'action.rnd.review'
  | 'action.rnd.research'
  | 'action.rnd.build'
  | 'action.rnd.repair'
  | 'action.private-quarters.sleep'
  | 'action.private-quarters.seggs'
  | 'action.weapon-system.calibrate'

export interface ActionDamage {
  min: number
  max: number
}
