import React, {useLayoutEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Screen.module.css'
import Menu from '../Menu/Menu'
import useGameState from '../../hooks/useGameState'

export default function Text({promptVisible, currentInput, currentScroll}) {
  const outputRef = useRef()
  const {messages} = useGameState()

  useLayoutEffect(() => {
    outputRef.current.scrollTop = currentScroll
  }, [currentScroll])

  return (
    <div className={styles.reflectedArea}>
      <Menu/>
      <div ref={outputRef} className={styles.output}>
        {messages.map((message, i) => {
          if(message.type === 'message')
            return <ReactMarkdown key={i}>{message.message}</ReactMarkdown>

          if(message.type === 'command')
            return <p key={i} className={styles.command}>{message.command}</p>

          return null
        })}
      </div>
      <div className={styles.input + (!promptVisible ? ' ' + styles.hidden : '')}>
        <input readOnly tabIndex="-1" value={currentInput}/>
      </div>
    </div>
  )
}
