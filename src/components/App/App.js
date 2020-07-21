import React, {useRef, useEffect} from 'react';
import styles from './App.module.css';

function App({onCommand, messages, state}) {
  const inputRef = useRef()
  const playAreaRef = useRef()

  function onSubmit(ev) {
    if(ev) ev.preventDefault();

    if(inputRef.current){
      onCommand(inputRef.current.value)
      inputRef.current.value = ''
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

  return (
    <div className={styles.app}>
      <div ref={playAreaRef} className={styles.playArea}>
        <div className={styles.output}>
          {messages.map((message) => {
            if(message.type === 'message')
              return <p>{message.message}</p>

            if(message.type === 'command')
              return <p className={styles.command}>{message.command}</p>

            return null
          })}
        </div>
        <form className={styles.input} onSubmit={onSubmit}>
          <input ref={inputRef}/>
        </form>
      </div>
      <div className={styles.infoArea}>
        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;
