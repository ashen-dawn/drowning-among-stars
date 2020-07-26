import capitalize from "./capitalize"

export default function printArea(location, say) {
  say(`**${capitalize(location.printableName)}**`)
  say(location.description)
}
