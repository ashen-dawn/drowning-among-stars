import React, {useEffect, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize'
import styles from './App.module.css';
import Screen from '../Screen/Screen';
import {Provider} from '../../hooks/useGameState'

import backgroundURL from './background.png'

function App({onCommand, game}) {
  const [state, setState] = useState({messages: []})

  const {width, height} = useWindowSize()
  const scaleX = width / 600
  const scaleY = height / 400
  const scale = 0 || Math.min(scaleX, scaleY)

  useEffect(() => {
    game.onChange(setState)
    game.getState()
    game.saveDraft()
  }, [game])

  return (
    <Provider value={state}>
      <div style={{transform: `scale(${scale})`, overflow: 'hidden'}} className={styles.screen}>
        <Screen handleCommand={onCommand}/>
        <div className={styles.overlay}>
          <img alt="" src={backgroundURL}/>
        </div>
      </div>
    </Provider>
  );
}

export default App;

