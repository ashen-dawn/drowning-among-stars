import Game from "./Game";
import RulesEngine from './RulesEngine'
import ParsedCommand from "./types/ParsedCommand";
import Verb from './types/Verb';

export default class Parser {
  private game : Game
  private engine : RulesEngine
  private verbs : Verb [] = []

  constructor(gameState : Game, engine : RulesEngine) {
    this.game = gameState
    this.engine = engine
  }

  handleCommand(rawCommand : string) {
    const grammaticalParsings : ParsedCommand[] = this.parseCommandString(rawCommand)
    console.log(grammaticalParsings)

    // const validParsings : ParsedCommand[] = this.game.filterCommandsForValidity(grammaticalParsings)
  }

  parseCommandString(rawCommand: string): ParsedCommand[] {
    const words = rawCommand.toLocaleLowerCase().split(' ').filter(chunk => chunk !== '')

    let parsings : ParsedCommand[] = []
    for(const verb of this.verbs) {
      parsings = [...parsings, ...verb.attemptParse(words)]
    }

    return parsings
  }

  understand(name : string) : VerbBuilder {
    const verb = new Verb(name)
    this.verbs.push(verb)
    return new VerbBuilder(verb)
  }
}

class VerbBuilder {
  private verb : Verb

  constructor(verb : Verb) {
    this.verb = verb
  }

  as(template : string) : VerbBuilder {
    this.verb.understand(template)
    return this
  }
}
