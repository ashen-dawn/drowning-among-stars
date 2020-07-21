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

// TODO: Split rules into their own file
engine.defineRule({hooks: {
  before: (state, action, say) => say('before hook 1'),
  during: (state, action, say) => say('during hook 1'),
  after: (state, action, say) => say('after hook 1')
}})

engine.defineRule({hooks: {
  // before: (state, action, say) => { say('before hook 2'); throw new Error('Precondition failed') },
  during: (state, action, say) => say('during hook 2'),
  after: (state, action, say) => say('after hook 2')
}})

engine.defineRule({hooks: {
  before: (state, action, say) => say('before hook 3'),
  during: (state, action, say) => say('during hook 3'),
  after: (state, action, say) => say('after hook 3')
}})

parser.setGameState(gameState)
parser.setEngine(engine);

// TODO: Display messages (and command history)
// parser.afterCommand(render);
parser.afterCommand(console.log)
render()

function render() {
  // Set up UI
  ReactDOM.render(
    <React.StrictMode>
      <App onCommand={parser.onCommand}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
