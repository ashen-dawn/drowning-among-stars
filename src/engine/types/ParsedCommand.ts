import { ObjectType, GameObject, Item } from "./GameState"
import NounPosition from "./NounPosition"
import Verb from "./Verb"
import Game from "../Game"

export enum TokenType {
  Expression = 'expression',
  Literal = 'literal'
}

export class ParsedToken {
  readonly type : TokenType

  constructor(type : TokenType) {
    this.type = type
  }
}

export class ParsedTokenLiteral extends ParsedToken {
  readonly word : string

  constructor(word : string) {
    super(TokenType.Literal)
    this.word = word
  }
}

export class ParsedTokenExpression extends ParsedToken {
  readonly itemType : ObjectType
  readonly sentencePosition : NounPosition
  readonly name : string

  constructor(type : ObjectType, position : NounPosition, name : string) {
    super(TokenType.Expression)
    this.itemType = type
    this.sentencePosition = position
    this.name = name
  }
}

export enum ParsingErrorSeverity {
  NotVisible = 0,
  NoSuchObject = 1
}

export type ValidCommandDetails = {isValid: true, parsed: ParsedCommand, verb: Verb, subject: GameObject | null, object: GameObject | null}
export type InvalidCommandDetails = {isValid: false, command: ParsedCommand, reason: string, severity: ParsingErrorSeverity}

export default class ParsedCommand {
  readonly verb : Verb
  private tokens : ParsedToken[] = []

  constructor(verb : Verb) {
    this.verb = verb
  }

  getTokens() {
    return [...this.tokens]
  }

  getNumTokens() : number {
    return this.tokens.length
  }

  prepend(token : ParsedToken) {
    const newCommand = new ParsedCommand(this.verb)
    newCommand.tokens = [token, ...this.tokens]
    return newCommand
  }

  areNounsValid(game : Game) : ValidCommandDetails | InvalidCommandDetails {
    const nouns = this.tokens.filter(({type}) => type === TokenType.Expression).map(token => token as ParsedTokenExpression)

    let subject : GameObject | null = null
    let object : GameObject | null = null

    for(const noun of nouns) {
      let possibleObjects = game.findObjectsByName(noun.name, noun.itemType).filter(gameObject => (gameObject.type !== ObjectType.Item || ((gameObject as Item).seen)))
      if(possibleObjects.length < 1)
        return {
          isValid: false,
          command: this,
          reason: `You used the word ${noun.name} as if it was a ${noun.itemType}, but there is no such object`,
          severity: ParsingErrorSeverity.NoSuchObject
        }

      let visibleObjects = possibleObjects.filter(gameObject => game.isVisible(gameObject))
      if(visibleObjects.length < 1) {
        const gameObject = possibleObjects[0]

        return {
          isValid: false,
          command: this,
          reason: `You cannot see the ${noun.name}${(() => {
            if(gameObject.type === ObjectType.Item && (gameObject as Item).lastKnownLocation)
              return ` (last seen in the ${(gameObject as Item).lastKnownLocation})`
            return ''
          })()}`,
          severity: ParsingErrorSeverity.NotVisible
        }
      }

      const gameObject = visibleObjects[0]
      if(noun.sentencePosition === NounPosition.Subject)
        subject = gameObject
      else
        object = gameObject
    }

    return {
      isValid: true,
      parsed: this,
      verb: this.verb,
      subject,
      object
    }
  }
}
