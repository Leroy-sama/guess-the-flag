export const DEFAULT_ROUND_GOAL = 10
export const MIN_ROUND_GOAL = 1
export const MAX_ROUND_GOAL = 50
export const ROUND_GOAL_PRESETS = [5, 10, 15, 20, 25] as const

export type SessionType = 'free' | 'challenge'

const GOAL_STORAGE_KEY = 'challenge-goal'

function clampGoal(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_ROUND_GOAL
  return Math.min(MAX_ROUND_GOAL, Math.max(MIN_ROUND_GOAL, Math.round(n)))
}

export function useGameSession() {
  const session = useState<SessionType>('game-session', () => 'free')
  const roundGoal = useState('challenge-goal', () => DEFAULT_ROUND_GOAL)
  const score = useState('challenge-score', () => 0)
  // how many rounds have been answered (0..roundGoal)
  const answered = useState('challenge-answered', () => 0)
  const isActive = useState('challenge-active', () => false)
  const isComplete = useState('challenge-complete', () => false)

  const settingsLocked = computed(
    () => session.value === 'challenge' && isActive.value && !isComplete.value,
  )

  const roundDisplay = computed(() => {
    const n = Math.min(answered.value + 1, roundGoal.value)
    return n
  })

  function persistGoal() {
    if (!import.meta.client) return
    localStorage.setItem(GOAL_STORAGE_KEY, String(roundGoal.value))
  }

  function loadPersistedGoal() {
    if (!import.meta.client) return
    const raw = localStorage.getItem(GOAL_STORAGE_KEY)
    if (raw == null) return
    const n = Number(raw)
    if (Number.isFinite(n)) roundGoal.value = clampGoal(n)
  }

  function setRoundGoal(n: number) {
    if (settingsLocked.value) return
    roundGoal.value = clampGoal(n)
    persistGoal()
  }

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

  function startChallenge(goal?: number) {
    if (goal != null) setRoundGoal(goal)
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
    if (answered.value >= roundGoal.value) {
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
    roundGoal,
    score,
    answered,
    isActive,
    isComplete,
    settingsLocked,
    roundDisplay,
    setRoundGoal,
    loadPersistedGoal,
    setSession,
    startChallenge,
    record,
    playAgain,
    changeSettings,
  }
}
