import React, {useLayoutEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Screen.module.css'
import Menu from '../Menu/Menu'

export default function Text({promptVisible, messages, currentInput, currentScroll, outputPaused}) {
  const outputRef = useRef()

  useLayoutEffect(() => {
    outputRef.current.scrollTop = currentScroll
  }, [currentScroll])

  return (
    <div className={styles.reflectedArea}>
      <Menu/>
      <div ref={outputRef} className={styles.output}>
        {messages.map((message, i) => {
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
      <div className={styles.input + (!promptVisible ? ' ' + styles.hidden : '')}>
        <input readOnly tabIndex="-1" value={currentInput}/>
      </div>
    </div>
  )
}
