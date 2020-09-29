import React from 'react'
import ReactDOM from 'react-dom'
import '../index.css';
import App from '../components/App/App';
import Setup from '../components/Setup/Setup';

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
  private promptVisible : boolean = true
  private videoSettingsSet : boolean = !!window.localStorage.getItem('video')
  private gameEnded : boolean = false

  constructor(parser : Parser, game : Game, rules : RulesEngine) {
    this.parser = parser
    this.game = game
    this.rules = rules
  }

  endGame() {
    this.gameEnded = true
    this.promptVisible = false
    this.render()
  }

  start(target : HTMLElement | null) {
    this.target = target
    this.rules.gameStart()
    this.render()
  }

  public hidePrompt() {
    this.promptVisible = false;
    this.render()
  }

  public showPrompt() {
    if(!this.gameEnded)
      this.promptVisible = true;
    this.render()
  }

  private async handleCommand(command : string) {
    this.output.push(new GameEventCommand(command))
    await this.parser.handlePlayerCommand(command, this)
    this.render()
  }

  private render() {
    if(!this.target)
      throw new Error("Renderer error: target is null")

    if(!this.videoSettingsSet) {
      ReactDOM.render(
        <React.StrictMode>
          <Setup/>
        </React.StrictMode>,
        this.target
      )
    } else {
      ReactDOM.render(
        <React.StrictMode>
          <App promptVisible={this.promptVisible} game={this.game} onCommand={this.handleCommand.bind(this)}/>
        </React.StrictMode>,
        this.target
      )
    }
  }
}
