import React, {useEffect} from 'react'
import ReactMarkdown from 'react-markdown'
import useGameState from '../../hooks/useGameState'

import map from './map.png'
import {ReactComponent as PlayerIcon} from './mapPerson.svg'
import styles from './Map.module.css'
import useSharedState from '../../hooks/useSharedState'

export default function Map() {
  const gameState = useGameState()

  const playerLocation = gameState?.player?.location
  const isOnLower = ['engine', 'docking', 'mainframe', 'stairlower'].includes(playerLocation)

  const [currentFloor, setFloor] = useSharedState('mapFloor', isOnLower ? 'lower' : 'upper')
  const [roomName, setRoom] = useSharedState('mapRoom')

  // On first render, update room
  useEffect(() => {
    setRoom(playerLocation)
  }, []) // eslint-disable-line

  const currentRoom = (roomName && gameState.rooms.get(roomName)) || null
  const itemsInRoom = Array.from(gameState.items.values()).filter(({lastKnownLocation, location}) => lastKnownLocation === roomName && location !== 'inventory')

  return (
    <div className={styles.map}>
      <img alt="" src={map}/>

      <Floor name="upper" currentSelected={currentFloor} setCurrentFloor={setFloor}>
        <Room name="bridge"     top={15} left={25} width={20} height={15} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="comms"    top={35} left={25} width={20} height={30} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="cabin"      top={35} left={50} width={10} height={20} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="bathroom"   top={60} left={50} width={10} height={10} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="medbay"     top={35} left={10} width={10} height={20} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="stairupper" top={60} left={10} width={10} height={10} currentSelected={roomName} setSelected={setRoom}/>
      </Floor>

      <Floor name="lower" currentSelected={currentFloor} setCurrentFloor={setFloor}>
        <Room name="engine"     top={35} left={25} width={20} height={30} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="docking"    top={35} left={50} width={10} height={35} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="mainframe"  top={35} left={10} width={10} height={20} currentSelected={roomName} setSelected={setRoom}/>
        <Room name="stairlower" top={60} left={10} width={10} height={10} currentSelected={roomName} setSelected={setRoom}/>
      </Floor>

      <div className={styles.floorSelector}>
        <button className={currentFloor === 'upper' ? styles.selectedFloor : ''} onClick={()=>setFloor('upper')}>Upper</button>
        <button className={currentFloor === 'lower' ? styles.selectedFloor : ''} onClick={()=>setFloor('lower')}>Lower</button>
      </div>

      <div className={styles.description}>
        {currentRoom ? (
          <>
            <h3>{currentRoom.printableName}</h3>
            {currentRoom.visited
              ? (<>
                <ReactMarkdown escapeHtml={false}>{currentRoom.description}</ReactMarkdown>
                {itemsInRoom.length > 0 && (<>
                  <p>You {(playerLocation === roomName) ? 'see' : 'recall seeing'} the following items here:</p>
                  <ul>
                    {itemsInRoom.map(({name, printableName}) => <li><ReactMarkdown escapeHtml={false}>{printableName || name}</ReactMarkdown></li>)}
                  </ul>
                </>)}
              </>)
              : <p>Visit this room to unlock its description</p>}
          </>
        ) : (
          <h3 style={{marginTop: '45%', textAlign: 'center'}}>Select a Room</h3>
        )}
      </div>
    </div>
  )
}

function Floor({name, currentSelected, children}) {
  // Do not render if not selected
  if(name !== currentSelected)
    return null;

  return (
    <div className={styles.rooms}>
      {children}
    </div>
  )
}

function Room({name, top, left, width, height, setSelected, currentSelected}) {
  const gameState = useGameState()
  const current = gameState?.player?.location === name

  return (
    <div
      onClick={() => setSelected(name)}
      className={styles.room + (currentSelected === name ? ' ' + styles.selectedRoom : '')}
      style={{top, left, width, height}}
    >
      {current && <PlayerIcon/>}
    </div>
  )
}
