/**
 * ponytail: hotkey routing self-check (pure decision table, no DOM)
 * Run: node app/composables/useGameHotkeys.check.ts
 */
import assert from 'node:assert/strict'

function route(state, key, code = key) {
  if (key === 'Escape') return 'closeOverlays'
  if (state.typing || state.searchOpen) {
    return key === 'Escape' ? 'closeOverlays' : null
  }
  if (key === '/' || key === '?') return 'openSearch'
  if (state.complete) {
    if (key === 'Enter' || code === 'Space') return 'playAgain'
    return null
  }
  if (!state.roundVisible || state.advancing) return null
  if (!state.revealed) {
    if (code === 'Space' || key === 'Enter') return 'reveal'
    return null
  }
  if (state.challengeScoring) {
    if (key === 'y' || key === 'Y' || key === '1' || key === 'ArrowLeft') return 'scoreGotIt'
    if (key === 'n' || key === 'N' || key === '2' || key === 'ArrowRight') return 'scoreMissed'
    if (code === 'Space') return null
    return null
  }
  if (code === 'Space' || key === 'Enter') return 'next'
  return null
}

const freeHidden = { revealed: false, roundVisible: true, advancing: false, complete: false, challengeScoring: false, searchOpen: false, typing: false }
const freeShown = { ...freeHidden, revealed: true }
const challengeShown = { ...freeShown, challengeScoring: true }
const done = { ...freeHidden, complete: true }

assert.equal(route(freeHidden, ' ', 'Space'), 'reveal')
assert.equal(route(freeShown, ' ', 'Space'), 'next')
assert.equal(route(challengeShown, 'y'), 'scoreGotIt')
assert.equal(route(challengeShown, 'n'), 'scoreMissed')
assert.equal(route(challengeShown, '1'), 'scoreGotIt')
assert.equal(route(challengeShown, 'ArrowRight'), 'scoreMissed')
assert.equal(route(challengeShown, ' ', 'Space'), null)
assert.equal(route(done, 'Enter'), 'playAgain')
assert.equal(route(freeHidden, '/'), 'openSearch')
assert.equal(route({ ...freeHidden, typing: true }, 'y'), null)
assert.equal(route(freeHidden, 'Escape'), 'closeOverlays')

console.log('useGameHotkeys.check: ok')
