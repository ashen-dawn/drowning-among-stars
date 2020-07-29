import React, {useEffect, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize'
import styles from './App.module.css';
import Screen from '../Screen/Screen';
import {Provider as StateProvider} from '../../hooks/useGameState'
import {Provider as LoadProvider} from '../../hooks/useLoadGame'
import useLocalStorage from '../../hooks/useLocalStorage'

import backgroundURL from './background.png'

function App({promptVisible, onCommand, game}) {
  const [state, setState] = useState({messages: []})

  const {width, height} = useWindowSize()
  const scaleX = width / 600
  const scaleY = height / 400
  const scale = 0 || Math.min(scaleX, scaleY)

  const [{fuzzing, flickering, scanLines, imageBackground}] = useLocalStorage('video')

  useEffect(() => {
    game.onChange(setState)
    game.getState()
    game.saveDraft()
  }, [game])

  return (
    <StateProvider value={state}>
      <LoadProvider value={game.loadGame.bind(game)}>
        <div style={{transform: `scale(${scale})`, overflow: 'hidden'}} className={styles.screen + `${(flickering && ' flickering') || ''}${(fuzzing && ' fuzzing') || ''}`}>
          <Screen promptVisible={promptVisible} handleCommand={onCommand} showReflection={imageBackground}/>
          {imageBackground && <div className={styles.overlay}>
            <img alt="" src={backgroundURL}/>
          </div>}
          {scanLines && <div className="scan"></div>}
        </div>
      </LoadProvider>
    </StateProvider>
  );
}

export default App;

