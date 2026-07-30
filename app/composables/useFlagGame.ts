import type { Country } from '~/composables/useCountryPool'
import { allCountries } from '~/composables/useCountryPool'

export const ROUND_SECONDS = 10

export function useFlagGame() {
  const { pool, loadPersisted: loadPool } = useCountryPool()
  const { loadPersisted: loadQuiz } = useQuizMode()
  const {
    session,
    isActive,
    isComplete,
    startChallenge,
    playAgain,
    loadPersistedGoal,
  } = useGameSession()

  const currentCountry = ref<Country>(allCountries[0]!)
  const revealed = ref(false)
  const timeLeft = ref(ROUND_SECONDS)
  const running = ref(false)

  // ponytail: no-repeat within a challenge run; ceiling = pool size then allow repeats
  const seenNames = ref<Set<string>>(new Set())

  let intervalId: ReturnType<typeof setInterval> | null = null
  let paused = false

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

  function pickFromPool(): Country {
    const list = pool.value.length ? pool.value : allCountries
    const available = list.filter(c => !seenNames.value.has(c.name))
    const pickFrom = available.length ? available : list
    return pickFrom[Math.floor(Math.random() * pickFrom.length)]!
  }

  function next() {
    if (!pool.value.length && !allCountries.length) return
    currentCountry.value = pickFromPool()
    if (session.value === 'challenge' && isActive.value) {
      seenNames.value = new Set([...seenNames.value, currentCountry.value.name])
    }
    revealed.value = false
    startTimer()
  }

  function resetSeen() {
    seenNames.value = new Set()
  }

  function beginChallenge(goal?: number) {
    resetSeen()
    startChallenge(goal)
    next()
  }

  function beginPlayAgain() {
    resetSeen()
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
