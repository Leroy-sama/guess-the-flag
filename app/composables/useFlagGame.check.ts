/**
 * ponytail: challenge deck uniqueness self-check
 * Run: node app/composables/useFlagGame.check.ts
 */
import assert from 'node:assert/strict'

function shuffleCountries(list) {
  const out = list.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]
    out[i] = out[j]
    out[j] = tmp
  }
  return out
}

function clampGoalToPool(goal, poolSize) {
  const MIN = 1
  const cap = Math.max(MIN, poolSize)
  if (!Number.isFinite(goal)) return Math.min(MIN, cap)
  return Math.min(Math.max(MIN, Math.round(goal)), cap)
}

function dealSession(pool, requestedGoal) {
  const goal = clampGoalToPool(requestedGoal, pool.length)
  const deck = shuffleCountries(pool)
  const drawn = []
  for (let i = 0; i < goal; i++) drawn.push(deck.shift())
  return { goal, drawn }
}

const pool = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

assert.equal(clampGoalToPool(50, 10), 10)
assert.equal(clampGoalToPool(3, 10), 3)
assert.equal(clampGoalToPool(0, 10), 1)
assert.equal(clampGoalToPool(5, 3), 3)

const { goal, drawn } = dealSession(pool, 50)
assert.equal(goal, 10)
assert.equal(drawn.length, 10)
assert.equal(new Set(drawn).size, 10)

const short = dealSession(pool, 4)
assert.equal(short.goal, 4)
assert.equal(new Set(short.drawn).size, 4)

// Play again = fresh shuffle; may overlap prior session, never within
const again = dealSession(pool, 10)
assert.equal(new Set(again.drawn).size, 10)

console.log('useFlagGame.check: ok')
