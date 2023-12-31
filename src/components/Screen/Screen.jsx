import React, {useState, useEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Screen.module.css'
import Reflection from './Reflected'
import Menu from '../Menu/Menu'
import useGameState from '../../hooks/useGameState'
import useSharedState from '../../hooks/useSharedState'

import {game} from '../../engine'

export const ScreenContext = React.createContext()

export default function Text({promptVisible: promptEnabled, handleCommand, showReflection}) {
  const inputRef = useRef()
  const outputRef = useRef()
  const textRef = useRef()
  const menuRef = useRef()
  const {messages} = useGameState()
  const [currentMenu] = useSharedState('currentMenu')
  const [_, updateArbitrary] = useState(0) // eslint-disable-line no-unused-vars
  const forceRender = () => updateArbitrary(arbitrary => arbitrary + 1)

  const [currentInput, setCurrentInput] = useState('')
  const [currentScroll, setCurrentScroll] = useState(0)

  const currentPause = messages.findIndex(message => (message.type === 'pause' && message.resolved === false))
  const outputPaused = currentPause > -1

  const printedMessages = !outputPaused ? messages : messages.slice(0, currentPause)
  const promptVisible = promptEnabled && !outputPaused

  const currentClear = [...printedMessages].reverse().find(message => message.type === 'clear')
  const clearedIndex = printedMessages.indexOf(currentClear)
  const finalMessages = (clearedIndex < 0) ? printedMessages : printedMessages.slice(clearedIndex)

  async function onSubmit(ev) {
    if(ev) ev.preventDefault()

    if(!promptVisible)
      return;

    if(!inputRef.current?.value.trim())
      return;

    if(inputRef.current){
      await handleCommand(inputRef.current.value)
      inputRef.current.value = ''
      setCurrentInput('')
    }

    if(outputRef.current) {
      setTimeout(() => outputRef.current.scrollTop = outputRef.current.scrollHeight, 0)
      setCurrentScroll(outputRef.current.scrollHeight)
    }
  }

  useEffect(() => {
    const playArea = textRef.current

    function onClick(ev) {
      // Don't focus if click was in menu area
      if(menuRef.current && menuRef.current.contains(ev.target))
        return;

      // If we have a menu open, don't focus
      if(currentMenu)
        return;

      inputRef.current.focus()
    }

    playArea.addEventListener('click', onClick)
    return () => playArea.removeEventListener('click', onClick)
  }, [currentMenu])

  useEffect(() => {
    if(!currentMenu)
      inputRef.current.focus()
  }, [currentMenu])

  // Unpause output on space or return
  useEffect(() => {
    if(!outputPaused) return;

    function handleKey(ev) {
      if(currentMenu) return;
      if(ev.key !== ' ' && ev.key !== 'Enter') return;
      ev.preventDefault()

      inputRef.current.value = ''
      setCurrentInput('')
      game.getState().messages[currentPause].resolved = true
      game.saveDraft()
      forceRender()
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [currentPause, outputPaused, messages, currentMenu])

  // Scroll after unpaused
  useEffect(() => {
    setTimeout(() => outputRef.current.scrollTop = outputRef.current.scrollHeight, 0)
    setCurrentScroll(outputRef.current.scrollHeight)
  }, [currentPause])

  return (
    <>
      <div ref={textRef} className={styles.playArea}>
        <ScreenContext.Provider value="primary">
          <Menu containerRef={menuRef}/>
          <div ref={outputRef} onScroll={() => setCurrentScroll(outputRef.current?.scrollTop)} className={styles.output + (!!currentMenu ? ' ' + styles.noMouse : '')}>
            {finalMessages.map((message, i) => {
              if(message.type === 'message')
                return <ReactMarkdown escapeHtml={false} key={i}>{message.message}</ReactMarkdown>

              if(message.type === 'command')
                return <p key={i} className={styles.command}>{message.command}</p>

              return null
            })}
            {outputPaused && (
              <p className={styles.pausePrompt}>
                (Press [RETURN] to continue)
              </p>
            )}
          </div>
          <form style={{pointerEvents: currentMenu ? 'none' : 'initial'}} className={styles.input + (!promptVisible ? ' ' + styles.hidden : '')} onSubmit={onSubmit}>
            <input autoComplete="off" autoFocus ref={inputRef} readOnly={(promptVisible && !currentMenu) ? undefined : ''} onChange={ev => setCurrentInput(ev.target.value)} id="gameInput"/>
          </form>
        </ScreenContext.Provider>
      </div>
      {showReflection && (
        <ScreenContext.Provider value="secondary">
          <Reflection outputPaused={outputPaused} promptVisible={promptVisible} messages={finalMessages} currentInput={currentInput} currentScroll={currentScroll}/>
        </ScreenContext.Provider>
      )}
    </>
  )
}
