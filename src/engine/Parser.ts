import Game from "./Game";
import RulesEngine from './RulesEngine'
import ParsedCommand, { InvalidCommandDetails } from "./types/ParsedCommand";
import Verb from './types/Verb';
import VerbBuilder from "./types/VerbBuilder";
import { game } from ".";
import delay from "../utils/delay";
import Renderer from "./Renderer";

export default class Parser {
  private game : Game
  private engine : RulesEngine
  private verbs : Verb [] = []

  constructor(gameState : Game, engine : RulesEngine) {
    this.game = gameState
    this.engine = engine
  }

  async handlePlayerCommand(rawCommand : string, renderer : Renderer) {
    this.game.outputCommand(rawCommand)
    this.game.saveDraft()

    const timer = delay(200)

    try {
      renderer.hidePrompt()
      await this.runCommand(rawCommand)
      await timer
    } catch (err) {
      await timer
      if(typeof err === 'string')
        game.say(err)
      else if(err.message)
        game.say(err.message)
      else{
        game.say('An unknown error occured')
        console.error(err)
      }
    } finally {
      renderer.showPrompt()
    }
    this.game.saveDraft()
  }

  runCommand(rawCommand : string) {
    // Parse command for syntactical validity
    // (according to known verb templates)
    const grammaticalParsings : ParsedCommand[] = this.parseCommandString(rawCommand)

    // Ask the game state container to filter commands for object validity
    // (nouns refer to valid objects, all objects are visible, etc)
    const validationResult = this.game.filterValidCommands(grammaticalParsings)

    if(validationResult.validCommands.length < 1) {
      this.handleError(validationResult.invalidCommands)
    } else {
      this.engine.runCommand(validationResult.validCommands[0])
    }
  }

  parseCommandString(rawCommand: string): ParsedCommand[] {
    const words = rawCommand.toLocaleLowerCase().split(' ').filter(chunk => chunk !== '')

    let parsings : ParsedCommand[] = []
    for(const verb of this.verbs) {
      parsings = [...parsings, ...verb.attemptParse(words)]
    }

    return parsings
  }

  handleError(invalidCommands: InvalidCommandDetails []) {
    if(!invalidCommands.length){
      throw new Error("I'm unsure what you're trying to do")
    }

    const mostValid = invalidCommands[0]

    if(mostValid.command.verb.name === 'go'){
      throw new Error("I'm unsure what you're trying to do")
    }

    this.game.say(mostValid.reason)
  }

  understand(name : string) : VerbBuilder {
    const verb = new Verb(name)
    this.verbs.push(verb)
    return new VerbBuilder(verb)
  }
}
