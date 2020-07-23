import { ObjectType } from "./GameState"
import NounPosition from "./NounPosition"
import Verb from "./Verb"

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

export default class ParsedCommand {
  readonly verb : Verb
  private tokens : ParsedToken[] = []

  constructor(verb : Verb) {
    this.verb = verb
  }

  prepend(token : ParsedToken) {
    const newCommand = new ParsedCommand(this.verb)
    newCommand.tokens = [token, ...this.tokens]
    return newCommand
  }
}
