import type { Country } from '~/composables/useCountryPool'
import { allCountries } from '~/composables/useCountryPool'
import { MIN_ROUND_GOAL } from '~/composables/useGameSession'

export const ROUND_SECONDS = 10

/** Fisher–Yates copy — challenge session playlist */
export function shuffleCountries(list: Country[]): Country[] {
  const out = list.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = out[i]!
    out[i] = out[j]!
    out[j] = tmp
  }
  return out
}

export function clampGoalToPool(goal: number, poolSize: number): number {
  const cap = Math.max(MIN_ROUND_GOAL, poolSize)
  if (!Number.isFinite(goal)) return Math.min(MIN_ROUND_GOAL, cap)
  return Math.min(Math.max(MIN_ROUND_GOAL, Math.round(goal)), cap)
}

export function useFlagGame() {
  const { pool, loadPersisted: loadPool } = useCountryPool()
  const { loadPersisted: loadQuiz } = useQuizMode()
  const {
    session,
    roundGoal,
    isActive,
    isComplete,
    startChallenge,
    playAgain,
    setRoundGoal,
    loadPersistedGoal,
  } = useGameSession()

  const currentCountry = ref<Country>(allCountries[0]!)
  const revealed = ref(false)
  const timeLeft = ref(ROUND_SECONDS)
  const running = ref(false)

  // ponytail: Spotify-style session deck — no repeats until Play again / new challenge
  const deck = ref<Country[]>([])

  let intervalId: ReturnType<typeof setInterval> | null = null
  let paused = false

  function activeList(): Country[] {
    return pool.value.length ? pool.value : allCountries
  }

  function clearTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    running.value = false
  }

  function tick() {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      timeLeft.value = 0
      reveal()
    }
  }

  function startTimer() {
    clearTimer()
    paused = false
    timeLeft.value = ROUND_SECONDS
    running.value = true
    intervalId = setInterval(tick, 1000)
  }

  function reveal() {
    if (revealed.value) return
    clearTimer()
    revealed.value = true
  }

  function reshuffleDeck() {
    deck.value = shuffleCountries(activeList())
  }

  function pickFromPool(): Country {
    const list = activeList()
    if (session.value === 'challenge' && isActive.value) {
      const nextCountry = deck.value[0]
      if (nextCountry) {
        deck.value = deck.value.slice(1)
        return nextCountry
      }
      // ponytail: deck empty despite capped goal — shouldn't happen; last resort unique-ish pick
      return list[Math.floor(Math.random() * list.length)]!
    }
    return list[Math.floor(Math.random() * list.length)]!
  }

  function next() {
    if (!pool.value.length && !allCountries.length) return
    currentCountry.value = pickFromPool()
    revealed.value = false
    startTimer()
  }

  function resetSeen() {
    deck.value = []
  }

  function beginChallenge(goal?: number) {
    const capped = clampGoalToPool(goal ?? roundGoal.value, activeList().length)
    reshuffleDeck()
    startChallenge(capped)
    next()
  }

  function beginPlayAgain() {
    const capped = clampGoalToPool(roundGoal.value, activeList().length)
    if (capped !== roundGoal.value) setRoundGoal(capped)
    reshuffleDeck()
    playAgain()
    next()
  }

  function pauseTimer() {
    if (paused || revealed.value || !running.value) return
    paused = true
    clearTimer()
  }

  function resumeTimer() {
    if (paused === false || revealed.value || timeLeft.value <= 0) return
    if (isComplete.value) return
    paused = false
    running.value = true
    intervalId = setInterval(tick, 1000)
  }

  // ponytail: timer must not run during SSR — Nuxt throws on setInterval server-side
  onMounted(() => {
    loadPool()
    loadQuiz()
    loadPersistedGoal()
    next()
  })

  onScopeDispose(() => {
    clearTimer()
  })

  return {
    currentCountry,
    revealed,
    timeLeft,
    running,
    next,
    reveal,
    pauseTimer,
    resumeTimer,
    resetSeen,
    beginChallenge,
    beginPlayAgain,
  }
}
