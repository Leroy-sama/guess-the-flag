import countriesData from '~/assets/data/countries.json'

export const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'] as const
export type Continent = (typeof CONTINENTS)[number]

export interface Country {
  name: string
  region: string
  capital?: string
  languages?: { name: string }[]
  flags: {
    svg: string
  }
}

export const allCountries = countriesData as Country[]

const POOL_STORAGE_KEY = 'pool-regions'

export type QuizMode = 'flag' | 'capital' | 'language'

function isEligible(country: Country, quiz: QuizMode): boolean {
  if (quiz === 'capital') return Boolean(country.capital?.trim())
  if (quiz === 'language') return (country.languages?.length ?? 0) > 0
  return Boolean(country.flags?.svg)
}

export function useCountryPool() {
  const selectedRegions = useState<Continent[]>('pool-regions', () => [])
  const quizMode = useState<QuizMode>('quiz-mode', () => 'flag')

  const pool = computed(() => {
    const quiz = quizMode.value
    let list = allCountries.filter(c => isEligible(c, quiz))
    if (selectedRegions.value.length) {
      list = list.filter(c => selectedRegions.value.includes(c.region as Continent))
    }
    return list
  })

  function selectAll() {
    selectedRegions.value = []
    persistRegions()
  }

  function toggleRegion(region: Continent) {
    const current = selectedRegions.value
    if (current.includes(region)) {
      selectedRegions.value = current.filter(r => r !== region)
    }
    else {
      selectedRegions.value = [...current, region]
    }
    persistRegions()
  }

  function isRegionActive(region: Continent) {
    return selectedRegions.value.includes(region)
  }

  const isAllActive = computed(() => selectedRegions.value.length === 0)

  function persistRegions() {
    if (!import.meta.client) return
    localStorage.setItem(POOL_STORAGE_KEY, JSON.stringify(selectedRegions.value))
  }

  function loadPersisted() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(POOL_STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return
      selectedRegions.value = parsed.filter((r): r is Continent =>
        CONTINENTS.includes(r as Continent),
      )
    }
    catch {
      // ponytail: ignore bad localStorage
    }
  }

  return {
    selectedRegions,
    quizMode,
    pool,
    isAllActive,
    selectAll,
    toggleRegion,
    isRegionActive,
    loadPersisted,
  }
}
