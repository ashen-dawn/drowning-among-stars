import React from 'react'

import styles from './Help.module.css'

export default function Help({parentRef}) {
  // useSyncScroll(parentRef, 'helpScroll')

  return <>
    <h3>How do I play?</h3>
    <p>
      When the command prompt <Cmd>&gt;&nbsp;</Cmd> is shown,
      enter commands by typing what you want to do, and pressing [RETURN]
    </p>
    <p>
      The game will then print the result of your action.
    </p>

    <h3>What can I do?</h3>

    <h4>Navigation</h4>
    <p>
      Typing <Cmd>go [direction]</Cmd>, where [direction] is up, down, or any of the
      four ship directions (fore, aft, starboard, and port) will navigate you around the ship.
      For your convenience these ship directions have also been aliased to north, south,
      east, and west respectively.
    </p>

    <h4>Seeing Things</h4>
    <p>
      Upon entering a room, the game will print that room's description.  If for
      whatever reason you ever need this printed again, you can simply type&nbsp;
      <Cmd>look</Cmd>.
    </p>
    <p>
      To examine a particular item more closely, use <Cmd>look at [thing]</Cmd> or&nbsp;
      <Cmd>examine [thing]</Cmd>, where [thing] is the name of the item.
    </p>
    <p>
      If you forget what rooms are around you and need some help orienting yourself,
      you can use the <Cmd>look [direction]</Cmd> command to print what room or door
      is in that direction.
    </p>

    <h4>Other Commands</h4>
    <p>
      Explore using the following commands, and keep in mind that not every command
      will work with every item in the game.
    </p>
    <ul className={styles.list}>
      <li>take [thing]</li>
      <li>drop [thing]</li>
      <li>open [thing]</li>
      <li>turn on [thing]</li>
      <li>take apart [thing]</li>
    </ul>
  </>
}

function Cmd({children}){
  return <span className={styles.cmd}>{children}</span>
}
