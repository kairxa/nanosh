export type Actions =
  // action.command.advance
  //   ship.eCells -= 20 * distance
  //   character.ap -= 2
  | 'action.bridge.command.advance'
  | 'action.bridge.command.cannon'
  | 'action.bridge.command.prime'
  | 'action.bridge.command.mobilize'
  | 'action.bridge.command.reinforce'
  | 'action.bridge.command.liberate'
  | 'action.bridge.command.analyze'
  | 'action.private-quarters.sleep'
  | 'action.private-quarters.seggs'
  | 'action.private-quarters.shower'
