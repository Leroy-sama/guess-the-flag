/**
 * ponytail: challenge scoring self-check with flexible goal
 * Run: node app/composables/useGameSession.check.ts
 */
import assert from 'node:assert/strict'

function createSession(goal = 10) {
  let session = 'free'
  let roundGoal = goal
  let score = 0
  let answered = 0
  let isActive = false
  let isComplete = false

  const settingsLocked = () => session === 'challenge' && isActive && !isComplete

  function startChallenge(nextGoal) {
    if (nextGoal != null) roundGoal = nextGoal
    session = 'challenge'
    score = 0
    answered = 0
    isActive = true
    isComplete = false
  }

  function record(gotIt) {
    if (session !== 'challenge' || !isActive || isComplete) return false
    if (gotIt) score++
    answered++
    if (answered >= roundGoal) {
      isComplete = true
      isActive = false
      return true
    }
    return false
  }

  return {
    get state() {
      return { session, roundGoal, score, answered, isActive, isComplete, locked: settingsLocked() }
    },
    startChallenge,
    record,
  }
}

const s = createSession(10)
s.startChallenge()
assert.equal(s.state.locked, true)

for (let i = 0; i < 7; i++) assert.equal(s.record(true), false)
for (let i = 0; i < 2; i++) assert.equal(s.record(false), false)
assert.equal(s.state.score, 7)
assert.equal(s.state.answered, 9)
assert.equal(s.record(true), true)
assert.equal(s.state.score, 8)
assert.equal(s.state.isComplete, true)

const short = createSession()
short.startChallenge(3)
assert.equal(short.record(true), false)
assert.equal(short.record(false), false)
assert.equal(short.record(true), true)
assert.equal(short.state.score, 2)
assert.equal(short.state.roundGoal, 3)

console.log('useGameSession.check: ok')
