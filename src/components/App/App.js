import React, {useRef} from 'react';
import styles from './App.module.css';

function App({onCommand}) {
  const inputRef = useRef()

  function onSubmit(ev) {
    if(ev) ev.preventDefault();

    if(inputRef.current){
      onCommand(inputRef.current.value)
      inputRef.current.value = ''
    }
  }

  return (
    <div className={styles.app}>
      <p>Stuff</p>
      <form onSubmit={onSubmit}>
        <input ref={inputRef}/>
      </form>
    </div>
  );
}

export default App;
