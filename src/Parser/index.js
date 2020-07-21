export default class Parser {
  constructor() {
    this.callbacks = {}
  }

  setEngine(engine) {
    this.engine = engine;
  }

  afterCommand(callback) {
    this.callbacks.afterCommand = callback
  }

  onCommand(commandString) {
    console.log(commandString)
  }
}
