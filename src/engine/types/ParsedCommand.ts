import { ObjectType, GameObject } from "./GameState"
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

export type ValidCommandDetails = {isValid: true, command: ParsedCommand, subject: GameObject | null, object: GameObject | null}
export type InvalidCommandDetails = {isValid: false, command: ParsedCommand, reason: string, severity: ParsingErrorSeverity}

export default class ParsedCommand {
  readonly verb : Verb
  private tokens : ParsedToken[] = []

  constructor(verb : Verb) {
    this.verb = verb
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
      let gameObject = game.findObjectByName(noun.name, noun.itemType)
      if(!gameObject)
        return {
          isValid: false,
          command: this,
          reason: `You used the word ${noun.name} as if it was a ${noun.itemType}, but there is no such object`,
          severity: ParsingErrorSeverity.NoSuchObject
        }

      // TODO: Optionally print "the" depending on if the original
      // command name had one at the beginning (don't print the the book)
      // (but also don't do "you cannot see heart of the cards")
      if(!game.isVisible(gameObject))
        return {
          isValid: false,
          command: this,
          reason: `You cannot see the ${noun.name}`,
          severity: ParsingErrorSeverity.NotVisible
        }

      if(noun.sentencePosition === NounPosition.Subject)
        subject = gameObject
      else
        object = gameObject
    }

    return {
      isValid: true,
      command: this,
      subject,
      object
    }
  }
}
