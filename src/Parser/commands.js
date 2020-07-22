const commands = []
export default commands
function defineCommand(verb, template) {
  commands.push({verb, template})
}

defineCommand('look', 'look')
defineCommand('look', 'describe')

defineCommand('lookDirection', 'look [direction]')

defineCommand('go', 'go [direction]')
defineCommand('go', '[direction]')

defineCommand('take', 'take [item]')
defineCommand('take', 'get [item]')
defineCommand('take', 'pick up [item]')
defineCommand('take', 'grab [item]')
defineCommand('take', 'snatch [item]')
defineCommand('take', 'steal [item]')

defineCommand('unlockDoor', 'unlock [door|subject] with [item|object]')
defineCommand('unlockDoor', 'unlock [door]')

defineCommand('openDoor', 'open [door]')
defineCommand('openDoor', 'open [door|subject] with [item|object]')
