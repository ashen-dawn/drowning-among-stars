type GameState = {
  readonly directions: Map<ObjectID, GameObject>,
  readonly rooms: Map<ObjectID, GameObject>,
  readonly doors: Map<ObjectID, GameObject>,
  readonly items: Map<ObjectID, GameObject>
}

export default GameState

export enum ObjectType {
  Item = 'item',
  Room = 'room',
  Door = 'door',
  Direction = 'direction'
}

type ObjectID = string

type GameObject = {
  readonly type : ObjectType,
  readonly name : ObjectID,
  readonly aliases : string[]
}

export type Room = GameObject & {
  readonly neighbors : Map<ObjectID, ObjectID>
}

export type Door = Room & {
  readonly locked : boolean,
  readonly key : ObjectID
}

export type Item = GameObject & {
  readonly location: ObjectID | 'inventory'
}
