import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import Parser from './Parser'
import RulesEngine from './RuleEngine'
import GameState from './GameState';

// Rules and Parser
const parser = new Parser()
const engine = new RulesEngine()
const gameState = new GameState()
let messages = []

parser.setGameState(gameState)
parser.setEngine(engine);
parser.afterCommand(afterCommand);
parser.start()

function onCommand(command) {
  messages = [...messages, {type: 'command', command}]
  parser.handleCommand(command)
}

function afterCommand(newMessages) {
  messages = [...messages, ...newMessages.map(message => ({type: 'message', message}))]
  render()
}

function render() {
  // Set up UI
  ReactDOM.render(
    <React.StrictMode>
      <App messages={messages} state={gameState.getState()} onCommand={onCommand}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

render()
