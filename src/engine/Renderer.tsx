import React from 'react'
import ReactDOM from 'react-dom'
import '../index.css';
import App from '../components/App/App';

import Game from "./Game";
import Parser from "./Parser";
import GameEvent, { GameEventCommand } from './types/GameEvent'
import RulesEngine from './RulesEngine';


export default class Renderer {
  private parser : Parser
  private game : Game
  private rules : RulesEngine
  private output : GameEvent[] = []
  private target : HTMLElement | null = null

  constructor(parser : Parser, game : Game, rules : RulesEngine) {
    this.parser = parser
    this.game = game
    this.rules = rules
  }

  start(target : HTMLElement | null) {
    this.target = target
    this.rules.gameStart()
    this.render()
  }

  private handleCommand(command : string) {
    this.output.push(new GameEventCommand(command))
    this.render()

    this.parser.handlePlayerCommand(command)
  }

  private render() {
    if(!this.target)
      throw new Error("Renderer error: target is null")

    ReactDOM.render(
      <React.StrictMode>
        <App game={this.game} onCommand={this.handleCommand.bind(this)}/>
      </React.StrictMode>,
      this.target
    )
  }
}
