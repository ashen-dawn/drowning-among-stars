import {enableMapSet, createDraft, finishDraft, Draft} from 'immer'
import GameState, { Room, Door, Item, ObjectType } from './types/GameState'

enableMapSet()

type ChangeListener = (state : GameState) => void

export default class Game {
  private gameState : GameState = {directions: new Map(), rooms: new Map(), doors: new Map(), items: new Map()}
  private draft : Draft<GameState> | null = null
  private onChangeListeners : ChangeListener [] = []

  constructor() {
    console.log('adding directions')
    let state = this.getState()
    state.directions.set('north', {type: ObjectType.Direction, name: 'north', aliases: ['n']})
    state.directions.set('east', {type: ObjectType.Direction, name: 'east', aliases: ['e']})
    state.directions.set('south', {type: ObjectType.Direction, name: 'south', aliases: ['s']})
    state.directions.set('west', {type: ObjectType.Direction, name: 'west', aliases: ['w']})
    state.directions.set('up', {type: ObjectType.Direction, name: 'up', aliases: ['u']})
    state.directions.set('down', {type: ObjectType.Direction, name: 'down', aliases: ['d']})
    this.saveDraft()
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
}
