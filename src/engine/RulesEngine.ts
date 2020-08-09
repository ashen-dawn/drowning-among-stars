import { ValidCommandDetails } from "./types/ParsedCommand";
import Game from "./Game";
import { EventEmitter } from "events";
import {printLocDescription, printLocItems} from "../utils/printArea"

// This class allows for hooking up "global events" for things such as checking
// victory conditions, acting when play begins, or other such things.  These
// event types are different from player actions, which are all considered
// "command" events
export default class RulesEngine extends EventEmitter{
  private game : Game

  private lastLocation : string = ''

  constructor(game : Game) {
    super()

    this.setMaxListeners(40)
    this.game = game
    this.on('beforeCommand', () => {this.lastLocation = game.getState().player.location})
    this.on('afterCommand', () => {
      if(this.lastLocation !== game.getState().player.location)
        this.emit('locationChange')
    })

    this.on('locationChange', () => {
      this.printArea()
    })
  }

  printArea() : void {
    try {
      this.emit('beforePrintArea')
      printLocDescription(this.game)
    } catch (err) {
      this.game.say(err.message)
    }

    try {
      this.emit('beforePrintItems')
      printLocItems(this.game)
    } catch (err) {
      this.game.say(err.message)
    }
  }

  gameStart() {
    this.emit('gameStart', this.game)
    this.emit('locationChange')
  }

  // TODO: Potentially refactor to not use EventEmitter
  // since that would maybe allow us to _cancel_ actions?
  runCommand(action: ValidCommandDetails) {
    this.emit('beforeCommand', action, this.game)
    this.emit('command', action)
    this.emit('afterCommand', action, this.game)
  }

  onGameStart = (cb : (game : Game) => void) =>  this.on('gameStart', cb)
  onBeforeCommand = (cb : (command : ValidCommandDetails, game : Game) => void) =>  this.on('beforeCommand', cb)
  onAfterCommand = (cb : (command : ValidCommandDetails, game : Game) => void) => this.on('afterCommand', cb)
  onLocationChange = (cb : (game : Game) => void) => this.on('locationChange', cb)


  onCommand = (type : string, cb : (command : ValidCommandDetails) => void ) => this.on('command', (command : ValidCommandDetails) => {
    if(command.verb.name === type)
      cb(command)
  })
}
