import React, {useState, useEffect, useRef} from 'react'
import ReactMarkdown from 'react-markdown'
import styles from './Text.module.css'
import Reflection from './ReflectedText'

export default function Text({messages, handleCommand}) {
  const inputRef = useRef()
  const outputRef = useRef()
  const textRef = useRef()

  const [currentInput, setCurrentInput] = useState('')
  const [currentScroll, setCurrentScroll] = useState(0)

  function onSubmit(ev) {
    if(ev) ev.preventDefault()

    if(!inputRef.current?.value.trim())
      return;

    if(inputRef.current){
      handleCommand(inputRef.current.value)
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

    function onClick() {
      inputRef.current.focus()
    }

    playArea.addEventListener('click', onClick)
    return () => playArea.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <div ref={textRef} className={styles.playArea}>
        <div ref={outputRef} onScroll={() => setCurrentScroll(outputRef.current?.scrollTop)} className={styles.output}>
          {messages.map((message, i) => {
            if(message.type === 'message')
              return <ReactMarkdown key={i}>{message.message}</ReactMarkdown>

            if(message.type === 'command')
              return <p key={i} className={styles.command}>{message.command}</p>

            return null
          })}
        </div>
        <form className={styles.input} onSubmit={onSubmit}>
          <input ref={inputRef} onChange={ev => setCurrentInput(ev.target.value)} id="gameInput"/>
        </form>
      </div>
      <Reflection messages={messages} currentInput={currentInput} currentScroll={currentScroll}/>
    </>
  )
}
