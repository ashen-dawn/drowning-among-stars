import React from 'react'
import useGameState from '../../hooks/useGameState'
import useLoadGame from '../../hooks/useLoadGame'
import useLocalStorage from '../../hooks/useLocalStorage'
import {DateTime} from 'luxon'

import styles from './Options.module.css'
import useSharedState from '../../hooks/useSharedState'

export default function () {
  const [currentTab, setCurrentTab] = useSharedState('optionsTab', 'data')
  const [, setCurrentMenu] = useSharedState('currentMenu')

  const gameState = useGameState()
  const saveFile1 = useLocalStorage('save1', null)
  const saveFile2 = useLocalStorage('save2', null)
  const saveFile3 = useLocalStorage('save3', null)
  const loadGame = useLoadGame()

  const [videoOptions, setVideoOptions] = useLocalStorage('video')

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

  function SaveFile({slot: [data, saveData], name}){
    function save() {
      if(data) {
        const proceed = window.confirm(`Save over ${name}?`)
        if(!proceed) return;
      }

      saveData(serializeState(gameState))

      setTimeout(() => setCurrentMenu(null), 200)
    }

    function load() {
      const newData = deserializeState(data)
      const proceed = window.confirm("Load save from " + name + "?")

      if(!proceed) return;

      loadGame(newData)

      setCurrentMenu(null)
    }

    return (
      <div className={styles.saveFile}>
        <div className={styles.saveInfo}>
          <p><u>{name}:</u></p>
          {data ? (
            <p>{DateTime.fromISO(data.saved).toLocal().toLocaleString(DateTime.DATETIME_SHORT)}</p>
          ) : (
            <p>No data</p>
          )}
        </div>
        <button onClick={save} className={styles.saveButton}>Save</button>
        <button disabled={!data} onClick={load} className={styles.saveButton}>Load</button>
      </div>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <OptionButton name="data"/>
          <OptionButton name="video"/>
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
          {currentTab === 'data' && (
            <>
              <h3>Data Files</h3>
              <SaveFile slot={saveFile1} name="File 1"/>
              <SaveFile slot={saveFile2} name="File 2"/>
              <SaveFile slot={saveFile3} name="File 3"/>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function serializeState(state) {
  return JSON.parse(JSON.stringify({...state, saved: DateTime.local().toISO()}, (key, value) => {
    if(value instanceof Map)
      return Array.from(value).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {_serializedType: 'map'});

    if(value instanceof Set)
      throw new Error("Do not know how to safely serialize sets")

    return value
  }))
}

function deserializeState(state) {
  return JSON.parse(JSON.stringify(state), (key, value) => {
    if(value._serializedType === 'map') {
      const map = new Map()
      for(const item in value)
        if(item !== '_serializedType')
          map.set(item, value[item])
      return map
    }

    return value
  })
}
