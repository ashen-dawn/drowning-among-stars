import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import Parser from './Parser'
import RulesEngine from './RuleEngine'

// Rules and Parser
const parser = new Parser()
const engine = new RulesEngine()

parser.setEngine(engine);
parser.afterCommand(render);
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
