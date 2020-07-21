import RuleEngine from "../RuleEngine";
import autoBind from 'auto-bind'

export default class Parser {
  constructor() {
    this.callbacks = {}
    this.gameState = null
    this.engine = null

    autoBind(this)
  }

  setEngine(engine) {
    this.engine = engine;
  }

  afterCommand(callback) {
    this.callbacks.afterCommand = callback
  }

  handleCommand(commandString) {
    if(!this.engine)
      throw new Error('Parser has no command engine')

    if(!this.gameState)
      throw new Error('Parser has no state container')

    // TODO: Parse command - at this layer ensure subject, object, and verb are defined
    const action = {type: 'player'};
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

  setGameState(gameState) {
    this.gameState = gameState
  }
}
