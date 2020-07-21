import autoBind from 'auto-bind'

export default class RuleEngine {
  constructor() {
    this.rules = []

    autoBind(this)
  }

  defineRule({location, verb, subject, object, filter, hooks}) {
    this.rules.push({
      location, verb, subject, object, filter, hooks
    })
  }

  run(action, state) {
    if(!this.rules.length)
      throw new Error('Rules engine has no rules')

    const applicableRules = this.rules.filter(rule => {
      if(rule.location && !testLocation(state, action, rule)) return false;
      if(rule.verb &&     !testVerb(state, action, rule))     return false;
      if(rule.subject &&  !testSubject(state, action, rule))  return false;
      if(rule.object &&   !testObject(state, action, rule))   return false;
      if(rule.filter &&   !rule.filter(state, action))  return false;

      return true;
    })

    let messages = []

    try {
      console.log('executing before hooks')
      const beforeHooks = applicableRules.map(rule => rule.hooks.before).filter(a => a !== undefined)
      runHooks(beforeHooks, messages, state, action)

      console.log('executing during hooks')
      const duringHooks = applicableRules.map(rule => rule.hooks.during).filter(a => a !== undefined)
      runHooks(duringHooks, messages, state, action)

      console.log('executing after hooks')
      const afterHooks = applicableRules.map(rule => rule.hooks.after).filter(a => a !== undefined)
      runHooks(afterHooks, messages, state, action)
    } catch (err) {
      console.error('Rules stopped')
      console.error(err.message)
      return {messages, resultCode: RuleEngine.FAILURE}
    }

    return {messages, resultCode: RuleEngine.SUCCESS}
  }
}

RuleEngine.SUCCESS = 'success'
RuleEngine.FAILURE = 'failure'

// TODO: Apply rules conditionally depending on state, location, verb, etc
function testLocation(state, action, rule) { return true }
function testVerb(state, action, rule) { return true }
function testSubject(state, action, rule) { return true }
function testObject(state, action, rule) { return true }

function runHooks(hooks, messages, state, action) {
  for(const hook of hooks){
    try {
      // Hook gets state, action, and "say" function
      hook(state, action, messages.push.bind(messages))

    } catch (err) {
      // If error has messages property append that as well
      if(err.message)
        messages.push(err.message)
      throw err
    }
  }
}
