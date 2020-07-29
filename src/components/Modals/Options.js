import React from 'react'
import useGameState from '../../hooks/useGameState'
import useLocalStorage from '../../hooks/useLocalStorage'

import styles from './Options.module.css'
import useSharedState from '../../hooks/useSharedState'

export default function () {
  const [currentTab, setCurrentTab] = useSharedState('optionsTab', 'video')

  const gameState = useGameState()
  const saveFile1 = useLocalStorage('save1', null)
  const saveFile2 = useLocalStorage('save2', null)
  const saveFile3 = useLocalStorage('save3', null)

  const [videoOptions, setVideoOptions] = useLocalStorage('video')
  console.log(videoOptions)

  function OptionButton({name}) {
    return (
      <button
        className={styles.optionMenuButton + (currentTab === name ? ' ' + styles.selected : '')}
        onClick={ev => setCurrentTab(name)}
      >
        {name}
      </button>
    )
  }

  function OptionSetting({name, label}){
    return (
      <div className={styles.optionContainer}>
        <input
          name={name}
          type="checkbox"
          checked={videoOptions[name]}
          onChange={ev => setVideoOptions(current => ({
            ...current,
            [name]: ev.target.checked
          }))}
        />
        <label htmlFor={name}>{label}</label>
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <OptionButton name="video"/>
          <OptionButton name="save / load"/>
        </div>
        <div className={styles.settings}>
          {currentTab === 'video' && (
            <>
              <h3>Video Options</h3>
              <p>Feel free to tweak these to your liking - they have no effect on gameplay.</p>
              <OptionSetting name="fuzzing" label="Text Glow"/>
              <OptionSetting name="flickering" label="Screen Flickering"/>
              <OptionSetting name="scanLines" label="Scan Lines"/>
              <OptionSetting name="imageBackground" label="Image Background"/>
            </>
          )}
          {currentTab === 'save / load' && (
            <p>Save / load</p>
          )}
        </div>
      </div>
    </>
  )
}
