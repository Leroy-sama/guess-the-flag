/**
 * ponytail: challenge scoring self-check
 * Run: node app/composables/useGameSession.check.ts
 */
import assert from 'node:assert/strict'

const ROUND_GOAL = 10

function createSession() {
  let session = 'free'
  let score = 0
  let answered = 0
  let isActive = false
  let isComplete = false

  const settingsLocked = () => session === 'challenge' && isActive && !isComplete

  function startChallenge() {
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
    if (answered >= ROUND_GOAL) {
      isComplete = true
      isActive = false
      return true
    }
    return false
  }

  return {
    get state() {
      return { session, score, answered, isActive, isComplete, locked: settingsLocked() }
    },
    startChallenge,
    record,
  }
}

const s = createSession()
s.startChallenge()
assert.equal(s.state.locked, true)
assert.equal(s.state.score, 0)

for (let i = 0; i < 7; i++) assert.equal(s.record(true), false)
for (let i = 0; i < 2; i++) assert.equal(s.record(false), false)
assert.equal(s.state.score, 7)
assert.equal(s.state.answered, 9)
assert.equal(s.record(true), true)
assert.equal(s.state.score, 8)
assert.equal(s.state.isComplete, true)
assert.equal(s.state.locked, false)
assert.equal(s.record(true), false) // no-op after complete

console.log('useGameSession.check: ok')
