import React, {useLayoutEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Text.module.css'

export default function Text({messages, currentInput, currentScroll}) {
  const outputRef = useRef()

  useLayoutEffect(() => {
    outputRef.current.scrollTop = currentScroll
  }, [currentScroll])

  return (
    <div className={styles.reflectedArea}>
      <div ref={outputRef} className={styles.output}>
        {messages.map((message, i) => {
          if(message.type === 'message')
            return <ReactMarkdown key={i}>{message.message}</ReactMarkdown>

          if(message.type === 'command')
            return <p key={i} className={styles.command}>{message.command}</p>

          return null
        })}
      </div>
      <div className={styles.input}>
        <input tabIndex="-1" value={currentInput}/>
      </div>
    </div>
  )
}
