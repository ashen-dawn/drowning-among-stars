import React from 'react'
import ReactDOM from 'react-dom'
import '../index.css';
import App from '../components/App/App';

import Game from "./Game";
import Parser from "./Parser";
import GameEvent, { GameEventCommand } from './types/GameEvent'


export default class Renderer {
  private parser : Parser
  private game : Game
  private output : GameEvent[] = []

  constructor(parser : Parser, game : Game) {
    this.parser = parser
    this.game = game
  }

  start() {
    this.render()
  }

  private handleCommand(command : string) {
    this.output.push(new GameEventCommand(command))
    this.render()

    this.parser.handleCommand(command)
  }

  private render() {
    ReactDOM.render(
      <React.StrictMode>
        <App messages={this.output} game={this.game} onCommand={this.handleCommand.bind(this)}/>
      </React.StrictMode>,
      document.getElementById('root')
    )
  }
}
