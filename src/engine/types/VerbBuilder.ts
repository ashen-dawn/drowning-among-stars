import Verb, { VerbAction } from "./Verb"

export default class VerbBuilder {
  private verb : Verb

  constructor(verb : Verb) {
    this.verb = verb
  }

  as(template : string) : VerbBuilder {
    this.verb.understand(template)
    return this
  }

  before(callback : VerbAction) : VerbBuilder {
    this.verb.on('before', callback)
    return this
  }

  carryOut(callback : VerbAction) : VerbBuilder {
    this.verb.on('carryOut', callback)
    return this
  }

  after(callback : VerbAction) : VerbBuilder {
    this.verb.on('after', callback)
    return this
  }
}
