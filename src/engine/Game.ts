import {enableMapSet, createDraft, finishDraft, Draft} from 'immer'
import GameState, { GameObject, Room, Door, Item, ObjectType } from './types/GameState'
import ParsedCommand, { ValidCommandDetails, InvalidCommandDetails } from './types/ParsedCommand'
import { GameEventMessage, GameEventCommand } from './types/GameEvent'

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
    messages: []
  }

  private draft : Draft<GameState> | null = null
  private onChangeListeners : ChangeListener [] = []

  constructor() {
    console.log('adding directions')
    let state = this.getState()
    state.directions.set('north', {type: ObjectType.Direction, name: 'north', printableName: 'north', aliases: ['n']})
    state.directions.set('east', {type: ObjectType.Direction, name: 'east', printableName: 'east', aliases: ['e']})
    state.directions.set('south', {type: ObjectType.Direction, name: 'south', printableName: 'south', aliases: ['s']})
    state.directions.set('west', {type: ObjectType.Direction, name: 'west', printableName: 'west', aliases: ['w']})
    state.directions.set('up', {type: ObjectType.Direction, name: 'up', printableName: 'up', aliases: ['u']})
    state.directions.set('down', {type: ObjectType.Direction, name: 'down', printableName: 'down', aliases: ['d']})
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

  addRoom(room : Room) {
    let state = this.getState()
    state.rooms.set(room.name, room)
  }

  addDoor(door: Door) {
    let state = this.getState()
    state.doors.set(door.name, door)
  }

  addItem(item: Item) {
    let state = this.getState()
    state.items.set(item.name, item)
  }

  findObjectByName(name : string | undefined | null, type : ObjectType) : GameObject | null {
    if(!name) return null;

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

    const exactMatch = objects.find((object) => name === object.name)
    if(exactMatch)
      return exactMatch

    const aliasMatch = objects.find(({aliases}) => aliases.includes(name))
    if(aliasMatch)
      return aliasMatch

    return null
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
