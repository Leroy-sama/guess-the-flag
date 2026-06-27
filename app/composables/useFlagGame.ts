import countries from '~/assets/data/countries.json'

export const ROUND_SECONDS = 10

export interface Country {
  name: string
  flags: {
    svg: string
  }
}

export function useFlagGame() {
  const currentCountry = ref<Country>(countries[0] as Country)
  const revealed = ref(false)
  const timeLeft = ref(ROUND_SECONDS)
  const running = ref(false)

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

  function next() {
    const pool = countries as Country[]
    currentCountry.value = pool[Math.floor(Math.random() * pool.length)]!
    revealed.value = false
    startTimer()
  }

  function pauseTimer() {
    if (paused || revealed.value || !running.value) return
    paused = true
    clearTimer()
  }

  function resumeTimer() {
    if (!paused || revealed.value || timeLeft.value <= 0) return
    paused = false
    running.value = true
    intervalId = setInterval(tick, 1000)
  }

  next()

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
  }
}
