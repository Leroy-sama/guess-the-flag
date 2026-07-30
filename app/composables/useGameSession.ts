export const ROUND_GOAL = 10

export type SessionType = 'free' | 'challenge'

export function useGameSession() {
  const session = useState<SessionType>('game-session', () => 'free')
  const score = useState('challenge-score', () => 0)
  // how many rounds have been answered (0..ROUND_GOAL)
  const answered = useState('challenge-answered', () => 0)
  const isActive = useState('challenge-active', () => false)
  const isComplete = useState('challenge-complete', () => false)

  const settingsLocked = computed(
    () => session.value === 'challenge' && isActive.value && !isComplete.value,
  )

  const roundDisplay = computed(() => {
    // current round number while playing (1-based), capped at ROUND_GOAL
    const n = Math.min(answered.value + 1, ROUND_GOAL)
    return n
  })

  function setSession(next: SessionType) {
    if (settingsLocked.value) return
    session.value = next
    if (next === 'free') {
      isActive.value = false
      isComplete.value = false
      score.value = 0
      answered.value = 0
    }
  }

  function startChallenge() {
    session.value = 'challenge'
    score.value = 0
    answered.value = 0
    isActive.value = true
    isComplete.value = false
  }

  /** Record Got it / Missed; returns whether the challenge just finished */
  function record(gotIt: boolean): boolean {
    if (session.value !== 'challenge' || !isActive.value || isComplete.value) {
      return false
    }
    if (gotIt) score.value++
    answered.value++
    if (answered.value >= ROUND_GOAL) {
      isComplete.value = true
      isActive.value = false
      return true
    }
    return false
  }

  function playAgain() {
    score.value = 0
    answered.value = 0
    isActive.value = true
    isComplete.value = false
    session.value = 'challenge'
  }

  function changeSettings() {
    session.value = 'free'
    isActive.value = false
    isComplete.value = false
    score.value = 0
    answered.value = 0
  }

  return {
    session,
    score,
    answered,
    isActive,
    isComplete,
    settingsLocked,
    roundDisplay,
    setSession,
    startChallenge,
    record,
    playAgain,
    changeSettings,
  }
}
