<template>
  <main class="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-white p-6 dark:bg-slate-950">
    <button
      type="button"
      class="absolute top-6 left-6 rounded-lg border border-gray-200 bg-white p-2.5 text-slate-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Search countries"
      @click="openSearch"
    >
      <Icon name="heroicons:magnifying-glass-20-solid" class="size-5" />
    </button>

    <button
      type="button"
      class="absolute top-6 right-6 rounded-lg border border-gray-200 bg-white p-2.5 text-slate-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      @click="toggleTheme"
    >
      <Icon :name="isDark ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'" class="size-5" />
    </button>

    <div class="flex w-full max-w-[min(100%,37.5rem)] flex-col items-center gap-6">
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!revealed && roundVisible"
          class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          role="progressbar"
          :aria-valuenow="timeLeft"
          :aria-valuemin="0"
          :aria-valuemax="ROUND_SECONDS"
          aria-label="Time remaining"
        >
          <div
            class="h-full rounded-full transition-[width] duration-1000 ease-linear"
            :class="timeLeft > 3 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-red-500 dark:bg-red-400'"
            :style="{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }"
          />
        </div>
      </Transition>

      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-3"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-3"
        @after-leave="onRoundAfterLeave"
      >
        <div
          v-if="roundVisible"
          :key="currentCountry.name"
          class="flex w-full flex-col items-center gap-6"
        >
          <img
            :src="currentCountry.flags.svg"
            :alt="revealed ? `${currentCountry.name} flag` : 'Country flag'"
            class="w-full max-w-[min(100%,37.5rem)] cursor-pointer rounded-xl border border-gray-200 bg-white object-contain shadow-lg dark:border-gray-700 dark:bg-slate-900"
            @click="reveal"
          >

          <button
            type="button"
            class="text-center text-4xl font-bold tracking-tight text-slate-900 uppercase sm:text-5xl dark:text-slate-100"
            :class="revealed ? 'cursor-default blur-0' : 'cursor-pointer blur-xl select-none'"
            @click="reveal"
          >
            {{ currentCountry.name }}
          </button>
        </div>
      </Transition>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <button
          v-if="revealed && roundVisible"
          type="button"
          class="rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          :disabled="isAdvancingRound"
          @click="handleNext"
        >
          Next country
        </button>
      </Transition>
    </div>

    <Teleport to="body">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 sm:pt-24"
        @click.self="closeSearch"
      >
        <div
          class="flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-slate-900"
          role="dialog"
          aria-modal="true"
          aria-label="Country search"
        >
          <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
            <h2 class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ previewCountry ? previewCountry.name : 'Find a country' }}
            </h2>
            <button
              type="button"
              class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-gray-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close search"
              @click="closeSearch"
            >
              <Icon name="heroicons:x-mark-20-solid" class="size-5" />
            </button>
          </div>

          <div v-if="previewCountry" class="flex flex-col items-center gap-4 p-6">
            <img
              :src="previewCountry.flags.svg"
              :alt="`${previewCountry.name} flag`"
              class="w-full max-w-sm rounded-xl border border-gray-200 bg-white object-contain shadow-lg dark:border-gray-700 dark:bg-slate-950"
            >
            <p class="text-center text-2xl font-bold text-slate-900 uppercase dark:text-slate-100">
              {{ previewCountry.name }}
            </p>
            <button
              type="button"
              class="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              @click="backToSearch"
            >
              Search again
            </button>
          </div>

          <div v-else class="flex flex-col gap-3 p-4">
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="search"
              placeholder="Search by country name…"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none dark:border-gray-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-500"
            >

            <ul v-if="searchQuery.trim() && filteredCountries.length" class="flex flex-col gap-1">
              <li v-for="country in filteredCountries" :key="country.name">
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                  @click="selectCountry(country)"
                >
                  <img
                    :src="country.flags.svg"
                    :alt="`${country.name} flag`"
                    class="h-6 w-8 shrink-0 rounded border border-gray-200 bg-white object-cover dark:border-gray-700 dark:bg-slate-950"
                  >
                  <span class="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {{ country.name }}
                  </span>
                </button>
              </li>
            </ul>

            <p
              v-else-if="searchQuery.trim()"
              class="px-1 py-2 text-sm text-slate-500 dark:text-slate-400"
            >
              No countries found.
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ROUND_SECONDS } from '~/composables/useFlagGame'

const { currentCountry, revealed, timeLeft, next, reveal, pauseTimer, resumeTimer } = useFlagGame()
const { isDark, toggleTheme } = useTheme()
const {
  isOpen: isSearchOpen,
  query: searchQuery,
  previewCountry,
  searchInput,
  filteredCountries,
  open: openSearch,
  close: closeSearch,
  selectCountry,
  backToSearch,
} = useCountrySearch()

const roundVisible = ref(true)
const isAdvancingRound = ref(false)

function handleNext() {
  if (isAdvancingRound.value) return
  isAdvancingRound.value = true
  roundVisible.value = false
}

function onRoundAfterLeave() {
  if (!isAdvancingRound.value) return
  next()
  roundVisible.value = true
  isAdvancingRound.value = false
}

watch(isSearchOpen, (open) => {
  if (open) pauseTimer()
  else resumeTimer()
})
</script>
