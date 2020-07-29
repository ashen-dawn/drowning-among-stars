import React, {useState, useEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Screen.module.css'
import Reflection from './Reflected'
import Menu from '../Menu/Menu'
import useGameState from '../../hooks/useGameState'
import useSharedState from '../../hooks/useSharedState'

export default function Text({promptVisible, handleCommand, showReflection}) {
  const inputRef = useRef()
  const outputRef = useRef()
  const textRef = useRef()
  const menuRef = useRef()
  const {messages} = useGameState()
  const [currentMenu] = useSharedState('currentMenu')

  const [currentInput, setCurrentInput] = useState('')
  const [currentScroll, setCurrentScroll] = useState(0)

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
      setImmediate(() => outputRef.current.scrollTop = outputRef.current.scrollHeight)
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

  return (
    <>
      <div ref={textRef} className={styles.playArea}>
        <Menu containerRef={menuRef}/>
        <div ref={outputRef} onScroll={() => setCurrentScroll(outputRef.current?.scrollTop)} className={styles.output + (currentMenu !== null ? ' ' + styles.noMouse : '')}>
          {messages.map((message, i) => {
            if(message.type === 'message')
              return <ReactMarkdown key={i}>{message.message}</ReactMarkdown>

            if(message.type === 'command')
              return <p key={i} className={styles.command}>{message.command}</p>

            return null
          })}
        </div>
         <form style={{pointerEvents: currentMenu ? 'none' : 'initial'}} className={styles.input + (!promptVisible ? ' ' + styles.hidden : '')} onSubmit={onSubmit}>
          <input autoFocus ref={inputRef} onChange={ev => setCurrentInput(ev.target.value)} id="gameInput"/>
        </form>
      </div>
      {showReflection && <Reflection promptVisible={promptVisible} messages={messages} currentInput={currentInput} currentScroll={currentScroll}/>}
    </>
  )
}
