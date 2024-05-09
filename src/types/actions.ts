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
  | 'action.medlab.compound'
  | 'action.medlab.firstaid'
  | 'action.medlab.surgery'
  | 'action.garden.forage'
  | 'action.garden.grow'
  | 'action.garden.harvest'
  | 'action.rnd.review'
  | 'action.rnd.research'
  | 'action.rnd.build'
  | 'action.rnd.repair'
  | 'action.private-quarters.sleep'
  | 'action.private-quarters.seggs'
  | 'action.private-quarters.shower'

export interface ActionDamage {
  min: number
  max: number
}
