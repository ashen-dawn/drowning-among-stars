export enum GameEventType {
  Message = 'message',
  Command = 'command'
}

export default interface GameEvent {
  getType() : GameEventType;
}

export class GameEventMessage implements GameEvent {
  private message : string

  getType() : GameEventType { return GameEventType.Message }
  constructor(message : string) {
    this.message = message
  }
}

export class GameEventCommand implements GameEvent {
  private rawCommand : string

  getType() : GameEventType { return GameEventType.Command }
  constructor(rawCommand : string) {
    this.rawCommand = rawCommand
  }
}
