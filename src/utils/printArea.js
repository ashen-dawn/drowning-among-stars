import capitalize from "./capitalize"

export default function printArea(location, say) {
  say(`**${location.printableName || capitalize(location.name)}**`)
  say(location.description)
}
