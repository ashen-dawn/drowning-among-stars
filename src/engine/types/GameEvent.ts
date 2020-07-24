export enum GameEventType {
  Message = 'message',
  Command = 'command'
}

export default class GameEvent {
  readonly type : GameEventType

  constructor(type : GameEventType) {
    this.type = type
  }
}

export class GameEventMessage extends GameEvent {
  readonly message : string

  constructor(message : string) {
    super(GameEventType.Message)
    this.message = message
  }
}

export class GameEventCommand extends GameEvent {
  readonly command : string

  constructor(command : string) {
    super(GameEventType.Command)
    this.command = command
  }
}
