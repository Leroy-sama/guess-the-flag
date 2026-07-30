import type { Country, QuizMode } from '~/composables/useCountryPool'

export const QUIZ_MODES: { id: QuizMode, label: string }[] = [
  { id: 'flag', label: 'Flag' },
  { id: 'capital', label: 'Capital' },
  { id: 'language', label: 'Language' },
]

const QUIZ_STORAGE_KEY = 'quiz-mode'

export function useQuizMode() {
  const { quizMode } = useCountryPool()

  const promptLabel = computed(() => {
    if (quizMode.value === 'capital') return 'Guess the capital'
    if (quizMode.value === 'language') return 'Guess the language'
    return 'Guess the country'
  })

  const showCountryName = computed(() => quizMode.value !== 'flag')

  function answerText(country: Country): string {
    if (quizMode.value === 'capital') return country.capital?.trim() || '—'
    if (quizMode.value === 'language') {
      const names = (country.languages ?? []).map(l => l.name).filter(Boolean)
      return names.length ? names.join(', ') : '—'
    }
    return country.name
  }

  function setMode(mode: QuizMode) {
    quizMode.value = mode
    if (import.meta.client) {
      localStorage.setItem(QUIZ_STORAGE_KEY, mode)
    }
  }

  function loadPersisted() {
    if (!import.meta.client) return
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (raw === 'flag' || raw === 'capital' || raw === 'language') {
      quizMode.value = raw
    }
  }

  return {
    quizMode,
    promptLabel,
    showCountryName,
    answerText,
    setMode,
    loadPersisted,
  }
}
