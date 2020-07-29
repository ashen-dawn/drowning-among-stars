import React from 'react'

import styles from './Setup.module.css'

export default function Setup() {
  return (
    <div className={styles.options}>
      <h1>Setup</h1>
      <p>
        This game has visual effects which could be problematic for players
        with photosensitive epilepsy or impaired vision, including:
      </p>
      <ul>
        <li>Rapid pulsing text glow</li>
        <li>Screen flickering</li>
        <li>Moving and repeating screen overlays</li>
        <li>An image background that may lower visual contrast in reading text</li>
      </ul>
      <p>
        These effects are <strong><em>entirely optional</em></strong>, and do not affect
        the gameplay in any way.  Do you wish to start with these effects turned
        on?
      </p>
      <p style={{textAlign: 'center'}}>
        <button onClick={startWithEffects}>Start with effects</button>
        <button onClick={startWithoutEffects}>Start without effects</button>
      </p>
      <p style={{opacity: .6}}>
        <strong>Note:</strong> Each of these options can be enabled or disabled
        later via the in-game video options menu.
      </p>
    </div>
  )
}

function startWithEffects() {
  window.localStorage.setItem('video', JSON.stringify({
    fuzzing: true,
    flickering: true,
    scanLines: true,
    imageBackground: true
  }))

  window.location.reload()
}

function startWithoutEffects() {
  window.localStorage.setItem('video', JSON.stringify({
    fuzzing: false,
    flickering: false,
    scanLines: false,
    imageBackground: false
  }))

  window.location.reload()
}
