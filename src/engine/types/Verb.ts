import ParsedCommand, {TokenType, ParsedTokenLiteral, ParsedTokenExpression, ValidCommandDetails} from './ParsedCommand'
import NounPosition from './NounPosition'
import { ObjectType } from './GameState'
import Game from "../Game"

export type VerbAction = (action : ValidCommandDetails, game : Game) => void

export default class Verb {
  static expressionRegex = /^\[([a-z|]+)\]$/
  private templates : Template[] = []

  readonly name : string

  private hooks : {before: VerbAction[], after : VerbAction[], carryOut: VerbAction[]} = {
    before: [],
    after: [],
    carryOut: []
  }

  constructor(name : string) {
    this.name = name
  }

  on(type : 'before' | 'after' | 'carryOut', action : VerbAction) {
    this.hooks[type].push(action)
  }

  understand(templateString : string) {
    const words : string[] = templateString.split(' ')
    const tokens : TemplateToken[] = words.map((word : string) => {
      if(!word.includes('[') && !word.includes(']'))
        return new TemplateTokenLiteral(word)

      if(!Verb.expressionRegex.test(word))
        throw new Error(`Invalid template token "${word}"`)

      const expressionString = (word.match(Verb.expressionRegex) || [])[1]

      const compoundExpression = expressionString.includes('|')

      const typeExpression = compoundExpression ? expressionString.split('|')[0] : expressionString
      const positionExpression = compoundExpression ? expressionString.split('|')[1] : 'subject'

      let type : ObjectType
      if(typeExpression === 'item')
        type = ObjectType.Item
      else if(typeExpression === 'door')
        type = ObjectType.Door
      else if(typeExpression === 'room')
        type = ObjectType.Room
      else if(typeExpression === 'direction')
        type = ObjectType.Direction
      else
        throw new Error(`Unknown object type "${typeExpression}"`)

      let position : NounPosition
      if(positionExpression === 'subject')
        position = NounPosition.Subject
      else if (positionExpression === 'object')
        position = NounPosition.Object
      else
        throw new Error(`Unknown noun position "${positionExpression}"`)

      return new TemplateTokenExpression(type, position)
    })

    // Check that we do not have two object expressions with the same position
    const nounPositions = new Set<NounPosition>()
    for(const token of tokens.filter(token => token.type === TokenType.Expression)){
      const expression = token as TemplateTokenExpression

      if(nounPositions.has(expression.nounPosition))
        throw new Error(`Error parsing command template "${templateString}" - more than one ${expression.nounPosition} expression`)

      nounPositions.add(expression.nounPosition)
    }

    this.templates.push(new Template(this, tokens))
  }

  attemptParse(words : string[]) : ParsedCommand[] {
    let parsings : ParsedCommand[] = []

    for(const template of this.templates){
      parsings = [...parsings, ...template.parse(words)]
    }

    return parsings
  }
}

class TemplateToken {
  readonly type : TokenType

  constructor(type : TokenType) {
    this.type = type
  }
}

class TemplateTokenLiteral extends TemplateToken {
  readonly word : string

  constructor(word : string) {
    super(TokenType.Literal)
    this.word = word
  }
}

class TemplateTokenExpression extends TemplateToken {
  readonly nounPosition : NounPosition
  readonly itemType : ObjectType

  constructor(type: ObjectType, position: NounPosition) {
    super(TokenType.Expression)

    this.nounPosition = position
    this.itemType = type
  }
}

class Template {
  readonly verb : Verb
  readonly tokens : TemplateToken[]

  constructor(verb : Verb, tokens : TemplateToken[]) {
    this.verb = verb
    this.tokens = tokens
  }

  parse(words: string[]): ParsedCommand[] {
    return this.attemptParse(this.tokens, words)
  }

  private attemptParse(tokens : TemplateToken[], words : string[]) : ParsedCommand[] {
    // Base case: we matched every token and every word
    if(tokens.length < 1 && words.length < 1)
      return [new ParsedCommand(this.verb)]

    // Base case: we have unmatched tokens or words
    if(tokens.length < 1 || words.length < 1)
      return []

    // If we reached this point we still have tokens AND words to match
    const nextToken = tokens[0]
    if(nextToken.type === TokenType.Literal) {
      const token = nextToken as TemplateTokenLiteral
      let nextWord = words[0]

      // If it doesn't match, no valid parsings
      if(nextWord !== token.word)
        return []

      const thisToken = new ParsedTokenLiteral(nextWord)
      return this.attemptParse(tokens.slice(1), words.slice(1)).map(parsing => parsing.prepend(thisToken))

    } else if(nextToken.type === TokenType.Expression) {
      const token = nextToken as TemplateTokenExpression
      let parsings : ParsedCommand[] = []

      // For all possible lengths of words we could capture in this expression
      for(let n = 1; n <= words.length; n++) {
        // Figure out what would be in the expression
        const thisToken = new ParsedTokenExpression(token.itemType, token.nounPosition, words.slice(0, n).join(' '))
        const potentialParsings = this.attemptParse(tokens.slice(1), words.slice(n)).map(parsing => parsing.prepend(thisToken))

        // Add command parsings to the array we've been building
        parsings = [...parsings, ...potentialParsings]
      }

      return parsings

    } else {
      throw new Error(`Unknown token type "${nextToken.type}"`)
    }

  }
}
