import { allCountries } from '~/composables/useCountryPool'
import type { Country } from '~/composables/useCountryPool'

const MAX_RESULTS = 8

export function useCountrySearch() {
  const isOpen = ref(false)
  const query = ref('')
  const previewCountry = ref<Country | null>(null)
  const searchInput = ref<HTMLInputElement | null>(null)

  const filteredCountries = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return []

    return allCountries
      .filter(country => country.name.toLowerCase().includes(term))
      .slice(0, MAX_RESULTS)
  })

  function open() {
    isOpen.value = true
    query.value = ''
    previewCountry.value = null
    nextTick(() => searchInput.value?.focus())
  }

  function close() {
    isOpen.value = false
    query.value = ''
    previewCountry.value = null
  }

  function selectCountry(country: Country) {
    previewCountry.value = country
    query.value = ''
  }

  function backToSearch() {
    previewCountry.value = null
    nextTick(() => searchInput.value?.focus())
  }

  function onEscape(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen.value) {
      close()
    }
  }

  watch(isOpen, (open) => {
    if (!import.meta.client) return

    if (open) {
      window.addEventListener('keydown', onEscape)
    }
    else {
      window.removeEventListener('keydown', onEscape)
    }
  })

  onScopeDispose(() => {
    if (import.meta.client) {
      window.removeEventListener('keydown', onEscape)
    }
  })

  return {
    isOpen,
    query,
    previewCountry,
    searchInput,
    filteredCountries,
    open,
    close,
    selectCountry,
    backToSearch,
  }
}
