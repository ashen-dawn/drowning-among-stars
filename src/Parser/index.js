import RuleEngine from "../RuleEngine";
import autoBind from 'auto-bind'
import commandTemplates from './commands'

/**
 * TODO:
 *  - Convert commands, templates, and object/door/room names to lower case for easier comparison
 */

export default class Parser {
  constructor() {
    this.callbacks = {}
    this.gameState = null
    this.engine = null
    this.commands = commandTemplates.map(this._convertCommandFromTemplate)

    autoBind(this)
  }

  setEngine(engine) {
    this.engine = engine;
  }

  setGameState(gameState) {
    this.gameState = gameState
  }

  afterCommand(callback) {
    this.callbacks.afterCommand = callback
  }

  handleCommand(commandString) {
    if(!this.engine)
      throw new Error('Parser has no command engine')

    if(!this.gameState)
      throw new Error('Parser has no state container')

    // Get all possible ways to fit the command string into our defined commands
    const potentialParsings = this._parseCommandString(commandString)

    // Filter out potential parsings that are invalid
    const validParsings = this.gameState.filterCommandParsingsByValidNouns(potentialParsings)
    console.log(validParsings)
    // (unknown objects, invalid directions, etc)

    if(validParsings.length > 1)
      throw new Error(`Multiple ways to parse command "${commandString}"`)

    if(validParsings.length < 1)
      throw new Error(`Unknown command`)

    const [command] = validParsings
    const {verb, tokens} = command
    const subject = tokens.filter(({type, position}) => (type === 'expression' && position === 'subject'))[0]?.value
    const object =  tokens.filter(({type, position}) => (type === 'expression' && position === 'object' ))[0]?.value

    const action = {type: 'player', verb, subject, object};
    console.log(action)
    this._processAction(action)
  }

  start() {
    this._processAction({type: 'internal', verb: 'playStarted'})
  }

  _processAction(action) {
    // Pass to actions
    const draftState = this.gameState.getDraft()
    const {messages, resultCode} = this.engine.run(action, draftState)

    if(resultCode === RuleEngine.SUCCESS) {
      this.gameState.sealState(draftState)
    }

    if(this.callbacks.afterCommand)
      this.callbacks.afterCommand(messages)
    else
      console.error('Parser has no afterCommand callback registered')

  }

  _convertCommandFromTemplate({verb, template}) {
    const expressionRegex = /^\[([a-z|]+)\]$/

    const tokens = template.split(' ').map(token => {
      if(!token.includes('[') && !token.includes(']'))
        return {type: 'literal', word: token}

      if(expressionRegex.test(token)) {
        let expressionType = token.match(expressionRegex)[1]
        let expressionPosition = 'subject'

        if(expressionType.includes('|')) {
          const parts = expressionType.split('|')
          if(parts.length !== 2)
            throw new Error(`Error parsing expression token "${token}": Too many | symbols`)

          expressionType = parts[0];
          expressionPosition = parts[1];
        }
        return {type: 'expression', name: expressionType, position: expressionPosition}
      }

      throw new Error(`Unknown token "${token}"`)
    })

    // Check that we do not have two object expressions with the same position
    const nounPositions = {}
    for(const expression of tokens.filter(token => token.type === 'expression')){
      if(nounPositions[expression.position])
        throw new Error(`Error parsing command template "${template}" - more than one ${expression.position} expression`)
      nounPositions[expression.position] = expression.position
    }

    return {verb, tokens}
  }

  _parseCommandString(commandString) {
    const words = commandString.split(' ').filter(chunk => chunk !== '')

    let parsings = []
    for(const command of this.commands){
      let potentialParsings = this._attemptParseForCommand(command.tokens, words)
      parsings = [...parsings, ...potentialParsings.map(parsing => ({
        verb: command.verb,
        tokens: parsing
      }))]
    }

    return parsings
  }

  // Returns array of parsings
  _attemptParseForCommand(commandTokens, words) {
    // The only way to "parse" no words into no tokens is to have an empty array
    if(commandTokens.length < 1 && words.length < 1)
      return [ [] ]

    // If we reached the end of one but not the other, we have no possible parsings
    if(commandTokens.length < 1 || words.length < 1)
      return []

    let nextToken = commandTokens[0]

    if(nextToken.type === 'literal') {
      let nextWord = words[0]

      // If literal word match
      if(nextWord === nextToken.word) {
        // Try to parse the remaining sentence, and prepend this to the front
        // of all possible parsings of the rest of the sentence
        const parsingsOfRemainder = this._attemptParseForCommand(commandTokens.slice(1), words.slice(1))

        const parsingsOfCommand = parsingsOfRemainder.map(remainderParsing => [
          {type: 'literal', word: nextWord},
          ...remainderParsing
        ])

        return parsingsOfCommand
      }
      // If the word doesn't match, we have no way to parse this, we have no possible
      // parsings.  Return empty array
      else
        return []

    } else if (nextToken.type === 'expression') {
      let parsings = []

      // For all possible lengths of words we could capture in this expression
      for(let n = 1; n <= words.length; n++) {
        // Figure out what would be in the expression
        const potentialExpressionParse = words.slice(0, n).join(' ')
        const remainingWords = words.slice(n)

        // Attempt to parse the remainder of the command
        const parsingsOfRemainder = this._attemptParseForCommand(commandTokens.slice(1), remainingWords)
        const parsingsOfCommand = parsingsOfRemainder.map(remainderParsing => [
          {type: 'expression', name: nextToken.name, position: nextToken.position, value: potentialExpressionParse},
          ...remainderParsing
        ])

        // Add command parsings to the array we've been building
        parsings = [...parsings, ...parsingsOfCommand]
      }

      return parsings
    } else {
      throw new Error(`Unknown token type "${nextToken.type}"`)
    }
  }
}
