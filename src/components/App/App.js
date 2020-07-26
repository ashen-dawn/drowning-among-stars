import React, {useEffect, useState} from 'react';
import useWindowSize from '../../hooks/useWindowSize'
import styles from './App.module.css';
import Text from '../Text/Text';

import backgroundURL from './background.png'

function App({onCommand, game}) {
  const [state, setState] = useState({})
  const messages = state.messages || []

  const {width, height} = useWindowSize()
  const scaleX = width / 600
  const scaleY = height / 400
  // const scale = 0 || Math.min(scaleX, scaleY)

  useEffect(() => {
    game.onChange(setState)
    game.getState()
    game.saveDraft()
  }, [game])

  return (
    <div style={{transform: `scale(${scaleX}, ${scaleY})`, overflow: 'hidden'}} className={styles.screen}>
      <Text messages={messages} handleCommand={onCommand}/>
      <div className={styles.overlay}>
        <img alt="" src={backgroundURL}/>
      </div>
    </div>
  );
}

export default App;

