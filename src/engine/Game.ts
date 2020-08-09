import {enableMapSet, createDraft, finishDraft, Draft} from 'immer'
import GameState, { GameObject, Room, Door, Item, ObjectType, ObjectID, Direction } from './types/GameState'
import ParsedCommand, { ValidCommandDetails, InvalidCommandDetails } from './types/ParsedCommand'
import { GameEventMessage, GameEventCommand, GameEventPause, GameEventClear } from './types/GameEvent'

enableMapSet()

type ChangeListener = (state : GameState) => void


export type CommandValidateResult = {
  validCommands: ValidCommandDetails [],
  invalidCommands: InvalidCommandDetails []
}

export default class Game {
  private gameState : GameState = {
    directions: new Map(),
    rooms: new Map(),
    doors: new Map(),
    items: new Map(),
    player: {location: ''},
    messages: [],
    properties: new Map()
  }

  private draft : Draft<GameState> | null = null
  private onChangeListeners : ChangeListener [] = []

  constructor() {
    let state = this.getState()
    state.directions.set('fore', {type: ObjectType.Direction, name: 'fore', printableName: 'fore', aliases: ['north', 'f', 'n'], opposite: 'aft'})
    state.directions.set('starboard', {type: ObjectType.Direction, name: 'starboard', printableName: 'starboard', aliases: ['east', 'sb', 'e'], opposite: 'port'})
    state.directions.set('aft', {type: ObjectType.Direction, name: 'aft', printableName: 'aft', aliases: ['south', 'a', 's'], opposite: 'fore'})
    state.directions.set('port', {type: ObjectType.Direction, name: 'port', printableName: 'port', aliases: ['west', 'p', 'w'], opposite: 'starboard'})
    state.directions.set('up', {type: ObjectType.Direction, name: 'up', printableName: 'up', aliases: ['u'], opposite: 'down'})
    state.directions.set('down', {type: ObjectType.Direction, name: 'down', printableName: 'down', aliases: ['d'], opposite: 'up'})
    this.saveDraft()
  }

  loadGame(newState : GameState) {
    this.gameState = newState

    // Just to confirm there's no drafts lying around, and to notify everything
    // of the change
    this.beginDraft()
    this.saveDraft()
  }

  outputCommand(commandString: string) {
    const state = this.getState()
    state.messages.push(new GameEventCommand(commandString))
  }

  say(message: string) {
    const state = this.getState()
    state.messages.push(new GameEventMessage(message))
  }

  pause() {
    this.getState().messages.push(new GameEventPause())
  }

  clear() {
    this.getState().messages.push(new GameEventClear())
  }

  filterValidCommands(commands: ParsedCommand[]) : CommandValidateResult {
    let validCommands : ValidCommandDetails[] = []
    let invalidCommands : InvalidCommandDetails[] = []

    for(const command of commands) {
      const commandValidationResult = command.areNounsValid(this)

      if(commandValidationResult.isValid){
        validCommands.push(commandValidationResult)
      } else {
        invalidCommands.push(commandValidationResult)
      }
    }

    invalidCommands.sort((a,b) => {
      if(a.severity !== b.severity)
        return a.severity - b.severity

      return b.command.getNumTokens() - a.command.getNumTokens()
    })

    return {validCommands, invalidCommands}
  }

  onChange(callback : ChangeListener) {
    this.onChangeListeners.push(callback)
  }

  beginDraft() {
    if(this.draft)
      console.warn('Destroying already created gamestate draft')

    this.draft = createDraft(this.gameState)
  }

  saveDraft() {
    if(!this.draft)
      throw new Error('Game has no open draft state')

    this.gameState = finishDraft(this.draft)
    this.draft = null

    for(const callback of this.onChangeListeners)
      callback(this.gameState)
  }

  getState() : Draft<GameState> {
    if(!this.draft)
      this.beginDraft()

    return this.draft!
  }

  getCurrentRoom() : Draft<Room> | null {
    const state = this.getState()
    return Array.from(state.rooms.values())
    .find(room => room.name === state.player.location) || null
  }

  createProperty(key : string, value : any) {
    let state = this.getState()

    if(this.hasProperty(key))
      throw new Error(`Game prop ${key} has already been defined`)

    state.properties.set(key, value)
  }

  hasProperty(key : string) : boolean {
    return this.getState().properties.has(key)
  }

  setProperty(key : string, value : any) {
    let state = this.getState()

    if(!state.properties.has(key))
      throw new Error(`Game prop ${key} has not been defined`)

    state.properties.set(key, value)
  }

  getProperty(key : string) : any {
    let state = this.getState()

    if(!state.properties.has(key))
      throw new Error(`Game prop ${key} has not been defined`)

    return state.properties.get(key)
  }

  addRoom(name : string, printableName : string | null, description : string) : Draft<Room> {
    let room : Room = {
      type: ObjectType.Room,
      name, aliases: [], printableName: printableName || name, description,
      neighbors: new Map(),
      visited: false
    }

    let state = this.getState()
    state.rooms.set(room.name, room)
    return room
  }

  addDoor(name : string, description : string) : Draft<Door> {
    let door : Door = {
      type: ObjectType.Door,
      name, aliases: [], printableName: name, description,
      neighbors: new Map(),
      locked: false,
      key: null,
      open: false
    }

    let state = this.getState()
    state.doors.set(door.name, door)

    return door
  }

  addItem(name : string, description : string, location : string, carryable : boolean = false) : Draft<Item> {
    let item : Draft<Item> = {
      type: ObjectType.Item,
      name, aliases: [], printableName: name, description,
      location,
      seen: false,
      carryable
    }

    if(location === this.getCurrentRoom()?.name){
      item.seen = true
      item.lastKnownLocation = location
    }

    let state = this.getState()
    state.items.set(item.name, item)

    return item
  }

  /**
   * Sets up a neighbor relationship such that Room B is [direction] of Room A,
   * and Room A is [opposite] of Room B
   *
   * @param roomA
   * @param direction
   * @param roomB
   */
  setNeighbor(roomA : ObjectID, direction: ObjectID, roomB : ObjectID) {
    let a = (this.findObjectByName(roomA, ObjectType.Room) || this.findObjectByName(roomA, ObjectType.Door)) as Room
    let b = (this.findObjectByName(roomB, ObjectType.Room) || this.findObjectByName(roomB, ObjectType.Door)) as Room
    let dir = this.findObjectByName(direction, ObjectType.Direction) as Direction

    if(!a) throw new Error(`No such room or door ${roomA}`)
    if(!b) throw new Error(`No such room or door ${roomB}`)
    if(!dir) throw new Error(`No such direction ${direction}`)

    const opposite = dir.opposite!

    a.neighbors.set(direction, b.name)
    b.neighbors.set(opposite, a.name)
  }

  findObjectByName(name : string | undefined | null, type : ObjectType) : GameObject | null {
    if(!name) return null;

    if(/^the /.test(name))
      return this.findObjectByName(name.replace(/^the /, ''), type)

    let lowerCaseName = name.toLocaleLowerCase()

    let collection
    switch(type) {
      case ObjectType.Door:
        collection = this.getState().doors
        break

      case ObjectType.Item:
        collection = this.getState().items
        break

      case ObjectType.Room:
        collection = this.getState().rooms
        break

      case ObjectType.Direction:
        collection = this.getState().directions
        break
    }

    const objects = [...collection!.values()]

    const exactMatch = objects.find((object) => lowerCaseName === object.name.toLocaleLowerCase())
    if(exactMatch)
      return exactMatch

    const aliasMatch = objects.find(({aliases}) => aliases.map(a => a.toLocaleLowerCase()).includes(lowerCaseName))
    if(aliasMatch)
      return aliasMatch

    return null
  }

  findObjectsInRoom(name : string | undefined) : Draft<Item> [] {
    let items : Item [] = []

    for(const item of this.getState().items.values())
      if(item.location === name)
        items.push(item)

    return items;
  }

  findDoorsInRoom(name : string | undefined) : Door [] {
    const room = this.findObjectByName(name, ObjectType.Room) as Room

    if(!room)
      return []

    return Array.from(room.neighbors.values())
      .map(name => this.findObjectByName(name, ObjectType.Door))
      .filter(door => door !== null) as Door []
  }

  isVisible(object : GameObject) : boolean {
    const state = this.getState()
    const currentRoom = this.getCurrentRoom()

    switch(object.type) {
      case ObjectType.Direction:
        return true

      case ObjectType.Room:
        return state.player.location === (object as Room).name

      case ObjectType.Door:
        if(!currentRoom)
          return false;

        const neighborIDs = Array.from(currentRoom.neighbors.values())

        let neighbors = neighborIDs.map(name => state.doors.get(name)).filter(object => object !== undefined).map(o => o!)
        for(const neighbor of neighbors)
          if(neighbor.name === object.name)
            return true;
        return false

      case ObjectType.Item:
        return state.player.location === (object as Item).location
          || (object as Item).location === 'inventory'

      default:
        return false
    }
  }
}
