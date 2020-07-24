import React, {useRef, useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown'
import styles from './App.module.css';

function App({onCommand, game}) {
  const inputRef = useRef()
  const playAreaRef = useRef()
  const [state, setState] = useState({})
  const messages = state.messages || []

  function onSubmit(ev) {
    if(ev) ev.preventDefault();

    if(!inputRef.current?.value.trim())
      return;

    if(inputRef.current){
      onCommand(inputRef.current.value)
      inputRef.current.value = ''
    }

    if(playAreaRef.current) {
      const viewArea = playAreaRef.current.firstChild;
      setImmediate(() => viewArea.scrollTop = viewArea.scrollHeight)
    }
  }

  useEffect(() => {
    if(!playAreaRef.current) return;

    const playArea = playAreaRef.current

    function onClick() {
      inputRef.current.focus()
    }

    playArea.addEventListener('click', onClick)
    return () => playArea.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    game.onChange(setState)
    game.getState()
    game.saveDraft()
  }, [game])

  const {directions, ...printedState} = state

  return (
    <div className={styles.app}>
      <div ref={playAreaRef} className={styles.playArea}>
        <div className={styles.output}>
          {messages.map((message, i) => {
            if(message.type === 'message')
              return <ReactMarkdown key={i}>{message.message}</ReactMarkdown>

            if(message.type === 'command')
              return <p key={i} className={styles.command}>{message.command}</p>

            return null
          })}
        </div>
        <form className={styles.input} onSubmit={onSubmit}>
          <input ref={inputRef}/>
        </form>
      </div>
      <div className={styles.infoArea}>
        <pre>
          {JSON.stringify(printedState, jsonReplacer, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;

function jsonReplacer(key, value) {
  if(value instanceof Set)
    return Array.from(value)

  if(value instanceof Map)
    return Array.from(value).reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {});

  if(key === 'messages' && Array.isArray(value) && value.length)
    return ['...']

  return value
}
