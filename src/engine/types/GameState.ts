import GameEvent from './GameEvent'

type GameState = {
  readonly directions: Map<ObjectID, Direction>,
  readonly rooms: Map<ObjectID, Room>,
  readonly doors: Map<ObjectID, Door>,
  readonly items: Map<ObjectID, Item>,
  readonly player: {
    readonly location: ObjectID
  }
  readonly messages: GameEvent [],
  readonly properties: Map<string, any>
}

export default GameState

export enum ObjectType {
  Item = 'item',
  Room = 'room',
  Door = 'door',
  Direction = 'direction'
}

export type ObjectID = string

export type GameObject = {
  readonly type : ObjectType,
  readonly name : ObjectID,
  readonly aliases : string[],
  readonly printableName: string | undefined,
  readonly description?: string
}

export type Direction = GameObject & {
  readonly type : ObjectType.Direction,
  readonly opposite? : ObjectID
}

export type Room = GameObject & {
  readonly type : ObjectType.Room,
  readonly neighbors : Map<ObjectID, ObjectID>,
  readonly visited : boolean
}

export type Door = GameObject & {
  readonly type : ObjectType.Door,
  readonly neighbors : Map<ObjectID, ObjectID>,
  readonly locked : boolean,
  readonly key : ObjectID | null,
  readonly open: boolean
}

export type Item = GameObject & {
  readonly type : ObjectType.Item,
  readonly location: ObjectID | 'inventory',
  readonly seen : boolean,
  readonly lastKnownLocation? : string,
  readonly carryable : boolean
}
