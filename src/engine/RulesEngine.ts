import { ValidCommandDetails } from "./types/ParsedCommand";

// This class allows for hooking up "global events" for things such as checking
// victory conditions, acting when play begins, or other such things.  These
// event types are different from player actions, which are all considered
// "command" events
export default class RulesEngine {

  runCommand(action: ValidCommandDetails) {

  }
}
