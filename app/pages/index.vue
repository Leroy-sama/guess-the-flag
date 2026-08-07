<template>
  <main class="relative min-h-[100dvh] overflow-x-hidden bg-paper text-ink dark:bg-ink dark:text-paper">
    <!-- Atmosphere -->
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,118,110,0.08),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_50%)]"
      aria-hidden="true"
    />

    <!-- Top chrome -->
    <header class="relative z-30 flex items-start justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-5">
      <div class="flex items-center gap-2">
        <Transition
          mode="out-in"
          enter-active-class="transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <button
            v-if="settingsLocked"
            key="quit"
            type="button"
            class="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/8 bg-white/80 px-3.5 text-sm font-medium text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            aria-label="Quit challenge"
            @click="onQuitChallenge"
          >
            <Icon name="heroicons:x-mark-20-solid" class="size-4 shrink-0 opacity-60" />
            Quit
          </button>
          <button
            v-else-if="!challengeChromeHidden"
            key="search"
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full border border-ink/8 bg-white/80 text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            aria-label="Search countries"
            @click="openSearch"
          >
            <Icon name="heroicons:magnifying-glass-20-solid" class="size-5" />
          </button>
        </Transition>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <Transition
          enter-active-class="transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="!challengeChromeHidden"
            class="flex flex-wrap items-center justify-end gap-2"
          >
            <!-- Regions -->
            <div class="relative">
              <button
                type="button"
                class="inline-flex h-10 max-w-[10.5rem] items-center gap-1.5 rounded-full border border-ink/8 bg-white/80 px-3.5 text-sm font-medium text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:max-w-[14rem]"
                :aria-expanded="openMenu === 'regions'"
                aria-haspopup="listbox"
                @click="toggleMenu('regions')"
              >
                <span class="truncate">{{ regionsLabel }}</span>
                <Icon name="heroicons:chevron-down-20-solid" class="size-4 shrink-0 opacity-50" />
              </button>

              <Transition
                enter-active-class="transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-[opacity,transform] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)]"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="openMenu === 'regions'"
                  class="absolute right-0 z-40 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-ink/8 bg-white/95 p-1.5 shadow-[0_18px_50px_rgba(12,18,34,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-soft/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  role="listbox"
                  aria-label="Continents"
                >
                  <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150"
                    :class="isAllActive ? 'bg-accent/10 text-accent dark:bg-accent-bright/15 dark:text-accent-bright' : 'text-ink hover:bg-mist/70 dark:text-paper dark:hover:bg-white/5'"
                    @click="onSelectAll"
                  >
                    All continents
                    <Icon v-if="isAllActive" name="heroicons:check-20-solid" class="size-4" />
                  </button>
                  <button
                    v-for="region in CONTINENTS"
                    :key="region"
                    type="button"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150"
                    :class="isRegionActive(region) ? 'bg-accent/10 text-accent dark:bg-accent-bright/15 dark:text-accent-bright' : 'text-ink hover:bg-mist/70 dark:text-paper dark:hover:bg-white/5'"
                    @click="onToggleRegion(region)"
                  >
                    {{ region }}
                    <Icon v-if="isRegionActive(region)" name="heroicons:check-20-solid" class="size-4" />
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Quiz -->
            <div class="relative">
              <button
                type="button"
                class="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/8 bg-white/80 px-3.5 text-sm font-medium text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                :aria-expanded="openMenu === 'quiz'"
                aria-haspopup="listbox"
                @click="toggleMenu('quiz')"
              >
                <span>{{ quizLabel }}</span>
                <Icon name="heroicons:chevron-down-20-solid" class="size-4 shrink-0 opacity-50" />
              </button>

              <Transition
                enter-active-class="transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-[opacity,transform] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)]"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="openMenu === 'quiz'"
                  class="absolute right-0 z-40 mt-2 w-44 origin-top-right overflow-hidden rounded-2xl border border-ink/8 bg-white/95 p-1.5 shadow-[0_18px_50px_rgba(12,18,34,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-soft/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  role="listbox"
                  aria-label="Quiz type"
                >
                  <button
                    v-for="q in QUIZ_MODES"
                    :key="q.id"
                    type="button"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150"
                    :class="quizMode === q.id ? 'bg-accent/10 text-accent dark:bg-accent-bright/15 dark:text-accent-bright' : 'text-ink hover:bg-mist/70 dark:text-paper dark:hover:bg-white/5'"
                    @click="onSetQuiz(q.id)"
                  >
                    {{ q.label }}
                    <Icon v-if="quizMode === q.id" name="heroicons:check-20-solid" class="size-4" />
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Session -->
            <div class="relative">
              <button
                type="button"
                class="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/8 bg-white/80 px-3.5 text-sm font-medium text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
                :aria-expanded="openMenu === 'session'"
                aria-haspopup="listbox"
                @click="toggleMenu('session')"
              >
                <span>{{ sessionLabel }}</span>
                <Icon name="heroicons:chevron-down-20-solid" class="size-4 shrink-0 opacity-50" />
              </button>

              <Transition
                enter-active-class="transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition-[opacity,transform] duration-120 ease-[cubic-bezier(0.23,1,0.32,1)]"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="openMenu === 'session'"
                  class="absolute right-0 z-40 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-ink/8 bg-white/95 p-1.5 shadow-[0_18px_50px_rgba(12,18,34,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-soft/95 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                  role="listbox"
                  aria-label="Play mode"
                >
                  <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150"
                    :class="session === 'free' && !isActive && !isComplete ? 'bg-accent/10 text-accent dark:bg-accent-bright/15 dark:text-accent-bright' : 'text-ink hover:bg-mist/70 dark:text-paper dark:hover:bg-white/5'"
                    @click="onSetSession('free')"
                  >
                    Free play
                    <Icon v-if="session === 'free' && !isActive && !isComplete" name="heroicons:check-20-solid" class="size-4" />
                  </button>

                  <div class="my-1.5 border-t border-ink/6 dark:border-white/8" />

                  <p class="px-3 pt-1 pb-2 font-mono text-[10px] tracking-[0.12em] text-fog uppercase">
                    Challenge length · max {{ maxChallengeGoal }}
                  </p>

                  <div class="mb-2 flex flex-wrap gap-1.5 px-2">
                    <button
                      v-for="n in availableGoalPresets"
                      :key="n"
                      type="button"
                      class="min-w-10 rounded-lg px-2.5 py-1.5 text-sm font-medium tabular-nums transition-colors duration-150"
                      :class="roundGoal === n
                        ? 'bg-accent text-white dark:bg-accent-bright dark:text-ink'
                        : 'bg-mist/80 text-ink hover:bg-mist dark:bg-white/5 dark:text-paper dark:hover:bg-white/10'"
                      @click="onPickGoal(n)"
                    >
                      {{ n }}
                    </button>
                  </div>

                  <div class="mb-2 flex items-center gap-2 px-2">
                    <label class="sr-only" for="challenge-goal-input">Custom rounds</label>
                    <input
                      id="challenge-goal-input"
                      v-model.number="goalDraft"
                      type="number"
                      :min="MIN_ROUND_GOAL"
                      :max="maxChallengeGoal"
                      class="h-9 w-full rounded-xl border border-ink/8 bg-paper px-3 text-sm tabular-nums text-ink focus:border-accent focus:outline-none dark:border-white/10 dark:bg-ink dark:text-paper dark:focus:border-accent-bright"
                      @keydown.enter.prevent="onStartCustomChallenge"
                    >
                    <button
                      type="button"
                      class="h-9 shrink-0 rounded-xl bg-ink px-3 text-sm font-medium text-paper transition-[transform,background-color] duration-150 active:scale-[0.97] dark:bg-paper dark:text-ink"
                      @click="onStartCustomChallenge"
                    >
                      Start
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>

        <button
          type="button"
          class="inline-flex size-10 items-center justify-center rounded-full border border-ink/8 bg-white/80 text-ink shadow-[0_8px_30px_rgba(12,18,34,0.06)] backdrop-blur-md transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft/80 dark:text-paper dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'" class="size-5" />
        </button>
      </div>
    </header>

    <!-- Click-away for menus -->
    <button
      v-if="openMenu"
      type="button"
      class="fixed inset-0 z-20 cursor-default"
      aria-label="Close menu"
      @click="openMenu = null"
    />

    <!-- Play surface -->
    <section class="relative z-10 mx-auto flex min-h-[calc(100dvh-5.5rem)] w-full max-w-[40rem] flex-col items-center justify-center px-4 pb-10 pt-4 sm:px-6">
      <p class="mb-5 font-mono text-[11px] tracking-[0.14em] text-fog uppercase dark:text-fog/80">
        {{ statusLine }}
      </p>

      <!-- End screen -->
      <div
        v-if="isComplete"
        class="flex w-full flex-col items-center gap-8"
      >
        <div class="text-center">
          <p class="font-mono text-[11px] tracking-[0.16em] text-fog uppercase">
            Challenge complete
          </p>
          <p class="mt-3 text-6xl font-semibold tracking-tight text-ink tabular-nums dark:text-paper">
            {{ score }}<span class="text-fog">/{{ roundGoal }}</span>
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:bg-paper dark:text-ink"
            @click="onPlayAgain"
          >
            Play again
            <kbd class="ml-2 hidden rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] font-medium dark:bg-ink/10 sm:inline">Enter</kbd>
          </button>
          <button
            type="button"
            class="inline-flex h-11 items-center rounded-full border border-ink/10 bg-white/70 px-6 text-sm font-medium text-ink transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] dark:border-white/10 dark:bg-ink-soft dark:text-paper"
            @click="onChangeSettings"
          >
            Change settings
          </button>
        </div>
      </div>

      <!-- Round -->
      <div
        v-else
        class="flex w-full flex-col items-center gap-7"
      >
        <Transition
          enter-active-class="transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="!revealed && roundVisible"
            class="h-1 w-full max-w-md overflow-hidden rounded-full bg-mist dark:bg-white/10"
            role="progressbar"
            :aria-valuenow="timeLeft"
            :aria-valuemin="0"
            :aria-valuemax="ROUND_SECONDS"
            aria-label="Time remaining"
          >
            <div
              class="h-full rounded-full transition-[width] duration-1000 ease-linear"
              :class="timeLeft > 3 ? 'bg-accent dark:bg-accent-bright' : 'bg-rose-500'"
              :style="{ width: `${(timeLeft / ROUND_SECONDS) * 100}%` }"
            />
          </div>
        </Transition>

        <Transition
          mode="out-in"
          enter-active-class="transition-[opacity,transform] duration-220 ease-[cubic-bezier(0.23,1,0.32,1)]"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
          @after-leave="onRoundAfterLeave"
        >
          <div
            v-if="roundVisible"
            :key="`${currentCountry.name}-${quizMode}`"
            class="flex w-full flex-col items-center gap-6"
          >
            <!-- Flag frame -->
            <button
              type="button"
              class="group w-full max-w-md rounded-[1.75rem] bg-mist/80 p-1.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99] dark:bg-white/5"
              aria-label="Reveal answer"
              @click="reveal"
            >
              <div class="overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-ink-soft dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <img
                  :src="currentCountry.flags.svg"
                  :alt="revealed || showCountryName ? `${currentCountry.name} flag` : 'Country flag'"
                  class="aspect-[3/2] w-full object-contain"
                  draggable="false"
                >
              </div>
            </button>

            <p
              v-if="showCountryName"
              class="max-w-md px-2 text-center text-base font-medium tracking-tight text-fog"
            >
              {{ currentCountry.name }}
            </p>

            <!--
              ponytail: never keep filter when revealed — blur(0) still creates a
              filter containing block that clips multi-line glyphs.
            -->
            <div class="flex w-full max-w-md justify-center overflow-visible px-2 py-4">
              <button
                type="button"
                class="w-full text-center font-semibold tracking-tight text-balance break-words text-ink uppercase transition-[filter,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] dark:text-paper"
                :class="[
                  answerSizeClass,
                  revealed ? 'cursor-default' : 'cursor-pointer select-none blur-[18px] active:scale-[0.99]',
                ]"
                @click="reveal"
              >
                {{ answerText(currentCountry) }}
              </button>
            </div>
          </div>
        </Transition>

        <Transition
          enter-active-class="transition-[opacity,transform] duration-[180ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-opacity duration-120 ease-[cubic-bezier(0.23,1,0.32,1)]"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="revealed && roundVisible"
            key="actions"
            class="flex flex-col items-center gap-3"
          >
            <div class="flex flex-wrap items-center justify-center gap-3">
              <template v-if="session === 'challenge' && isActive">
                <button
                  type="button"
                  class="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50 dark:bg-accent-bright dark:text-ink"
                  :disabled="isAdvancingRound"
                  @click="handleScore(true)"
                >
                  Got it
                  <kbd class="ml-2 hidden rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px] font-medium sm:inline">Y</kbd>
                </button>
                <button
                  type="button"
                  class="inline-flex h-11 items-center rounded-full border border-ink/10 bg-white/70 px-6 text-sm font-medium text-ink transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50 dark:border-white/10 dark:bg-ink-soft dark:text-paper"
                  :disabled="isAdvancingRound"
                  @click="handleScore(false)"
                >
                  Missed
                  <kbd class="ml-2 hidden rounded bg-ink/8 px-1.5 py-0.5 font-mono text-[10px] font-medium dark:bg-white/10 sm:inline">N</kbd>
                </button>
              </template>
              <button
                v-else
                type="button"
                class="inline-flex h-11 items-center rounded-full bg-ink px-6 text-sm font-medium text-paper transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50 dark:bg-paper dark:text-ink"
                :disabled="isAdvancingRound"
                @click="handleNext"
              >
                Next country
                <kbd class="ml-2 hidden rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px] font-medium dark:bg-ink/10 sm:inline">Space</kbd>
              </button>
            </div>
          </div>
          <p
            v-else-if="!revealed && roundVisible"
            key="hint"
            class="hidden font-mono text-[11px] tracking-wide text-fog sm:block"
          >
            Space to reveal
          </p>
        </Transition>
      </div>
    </section>

    <!-- Search -->
    <Teleport to="body">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-20 backdrop-blur-sm sm:pt-24"
        @click.self="closeSearch"
      >
        <div
          class="flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[0_24px_80px_rgba(12,18,34,0.25)] dark:border-white/10 dark:bg-ink-soft"
          role="dialog"
          aria-modal="true"
          aria-label="Country search"
        >
          <div class="flex items-center justify-between border-b border-ink/6 px-5 py-4 dark:border-white/8">
            <h2 class="text-sm font-semibold text-ink dark:text-paper">
              {{ previewCountry ? previewCountry.name : 'Find a country' }}
            </h2>
            <button
              type="button"
              class="inline-flex size-8 items-center justify-center rounded-full text-fog transition-[transform,background-color] duration-150 active:scale-[0.97] hover:bg-mist dark:hover:bg-white/5"
              aria-label="Close search"
              @click="closeSearch"
            >
              <Icon name="heroicons:x-mark-20-solid" class="size-5" />
            </button>
          </div>

          <div v-if="previewCountry" class="flex flex-col items-center gap-4 p-6">
            <div class="w-full max-w-sm rounded-2xl bg-mist/80 p-1.5 dark:bg-white/5">
              <img
                :src="previewCountry.flags.svg"
                :alt="`${previewCountry.name} flag`"
                class="aspect-[3/2] w-full rounded-[calc(1rem-2px)] bg-white object-contain dark:bg-ink"
              >
            </div>
            <p class="px-2 text-center text-2xl leading-snug font-semibold text-balance break-words text-ink dark:text-paper">
              {{ previewCountry.name }}
            </p>
            <button
              type="button"
              class="text-sm font-medium text-fog transition-colors hover:text-ink dark:hover:text-paper"
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
              class="w-full rounded-2xl border border-ink/8 bg-paper px-4 py-3 text-ink placeholder:text-fog focus:border-accent focus:outline-none dark:border-white/10 dark:bg-ink dark:text-paper dark:focus:border-accent-bright"
            >

            <ul v-if="searchQuery.trim() && filteredCountries.length" class="flex flex-col gap-1">
              <li v-for="country in filteredCountries" :key="country.name">
                <button
                  type="button"
                  class="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-mist/80 dark:hover:bg-white/5"
                  @click="selectCountry(country)"
                >
                  <img
                    :src="country.flags.svg"
                    :alt="`${country.name} flag`"
                    class="h-6 w-9 shrink-0 rounded border border-ink/8 bg-white object-cover dark:border-white/10 dark:bg-ink"
                  >
                  <span class="text-sm font-medium text-ink dark:text-paper">
                    {{ country.name }}
                  </span>
                </button>
              </li>
            </ul>

            <p
              v-else-if="searchQuery.trim()"
              class="px-1 py-2 text-sm text-fog"
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
import { CONTINENTS } from '~/composables/useCountryPool'
import type { Continent, QuizMode } from '~/composables/useCountryPool'
import { QUIZ_MODES } from '~/composables/useQuizMode'
import {
  MIN_ROUND_GOAL,
  MAX_ROUND_GOAL,
  ROUND_GOAL_PRESETS,
} from '~/composables/useGameSession'
import type { SessionType } from '~/composables/useGameSession'

useSeoMeta({
  title: 'Play',
  description:
    'Guess the country from its flag, capital, or language. Pick continents, free play, or a scored challenge.',
})

type MenuId = 'regions' | 'quiz' | 'session'

const {
  currentCountry,
  revealed,
  timeLeft,
  next,
  reveal,
  pauseTimer,
  resumeTimer,
  resetSeen,
  beginChallenge,
  beginPlayAgain,
} = useFlagGame()

const {
  pool,
  selectedRegions,
  isAllActive,
  selectAll,
  toggleRegion,
  isRegionActive,
} = useCountryPool()

const {
  quizMode,
  promptLabel,
  showCountryName,
  answerText,
  setMode,
} = useQuizMode()

const {
  session,
  roundGoal,
  score,
  answered,
  isActive,
  isComplete,
  settingsLocked,
  setSession,
  setRoundGoal,
  record,
  changeSettings,
} = useGameSession()

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
const openMenu = ref<MenuId | null>(null)
const goalDraft = ref(roundGoal.value)

// Cap challenge length to unique countries in the current pool
const maxChallengeGoal = computed(() =>
  Math.min(MAX_ROUND_GOAL, Math.max(MIN_ROUND_GOAL, pool.value.length || MIN_ROUND_GOAL)),
)

const availableGoalPresets = computed(() =>
  ROUND_GOAL_PRESETS.filter(n => n <= maxChallengeGoal.value),
)

watch(roundGoal, (n) => {
  goalDraft.value = n
})

watch(maxChallengeGoal, (max) => {
  if (goalDraft.value > max) goalDraft.value = max
})

const regionsLabel = computed(() => {
  if (isAllActive.value) return 'All continents'
  if (selectedRegions.value.length === 1) return selectedRegions.value[0]!
  return `${selectedRegions.value.length} continents`
})

const quizLabel = computed(() =>
  QUIZ_MODES.find(q => q.id === quizMode.value)?.label ?? 'Flag',
)

const sessionLabel = computed(() =>
  session.value === 'challenge' ? `Challenge · ${roundGoal.value}` : 'Free play',
)

// Hide settings + search for the whole challenge run (active + end screen)
const challengeChromeHidden = computed(
  () => session.value === 'challenge' && (isActive.value || isComplete.value),
)

const statusLine = computed(() => {
  const base = `${promptLabel.value} · ${pool.value.length}`
  if (session.value === 'challenge' && (isActive.value || isComplete.value)) {
    return `${base} · ${Math.min(answered.value + 1, roundGoal.value)}/${roundGoal.value} · ${score.value} pts`
  }
  return base
})

const answerSizeClass = computed(() => {
  const len = answerText(currentCountry.value).length
  if (len > 36) return 'text-xl leading-snug sm:text-2xl'
  if (len > 24) return 'text-2xl leading-snug sm:text-3xl'
  return 'text-3xl leading-snug sm:text-4xl'
})

function toggleMenu(id: MenuId) {
  if (settingsLocked.value) return
  openMenu.value = openMenu.value === id ? null : id
}

function closeMenus() {
  openMenu.value = null
}

function advanceRound() {
  if (isAdvancingRound.value) return
  isAdvancingRound.value = true
  roundVisible.value = false
}

function handleNext() {
  advanceRound()
}

function handleScore(gotIt: boolean) {
  if (isAdvancingRound.value) return
  const finished = record(gotIt)
  if (finished) return
  advanceRound()
}

function onRoundAfterLeave() {
  if (!isAdvancingRound.value) return
  next()
  roundVisible.value = true
  isAdvancingRound.value = false
}

function refreshRound() {
  if (settingsLocked.value || isComplete.value) return
  resetSeen()
  if (roundVisible.value) advanceRound()
  else {
    next()
    roundVisible.value = true
    isAdvancingRound.value = false
  }
}

function onSelectAll() {
  if (settingsLocked.value) return
  selectAll()
  closeMenus()
  if (session.value === 'free') refreshRound()
}

function onToggleRegion(region: Continent) {
  if (settingsLocked.value) return
  toggleRegion(region)
  if (session.value === 'free') refreshRound()
}

function onSetQuiz(mode: QuizMode) {
  if (settingsLocked.value) return
  setMode(mode)
  closeMenus()
  if (session.value === 'free') refreshRound()
}

function onSetSession(nextSession: SessionType) {
  if (settingsLocked.value) return
  if (nextSession === 'free') {
    setSession('free')
    resetSeen()
    closeMenus()
    refreshRound()
  }
}

function onStartChallenge(goal?: number) {
  if (settingsLocked.value) return
  beginChallenge(goal)
  closeMenus()
  roundVisible.value = true
  isAdvancingRound.value = false
}

function onPickGoal(n: number) {
  if (settingsLocked.value) return
  setRoundGoal(n)
  onStartChallenge(n)
}

function onStartCustomChallenge() {
  if (settingsLocked.value) return
  const n = Number(goalDraft.value)
  onStartChallenge(n)
}

function onPlayAgain() {
  beginPlayAgain()
  roundVisible.value = true
  isAdvancingRound.value = false
}

function onChangeSettings() {
  changeSettings()
  resetSeen()
  refreshRound()
}

function onQuitChallenge() {
  if (!settingsLocked.value) return
  closeMenus()
  closeSearch()
  onChangeSettings()
}

const isChallengeScoring = computed(
  () => session.value === 'challenge' && isActive.value && revealed.value,
)

useGameHotkeys(
  {
    revealed,
    roundVisible,
    isAdvancing: isAdvancingRound,
    isComplete,
    isChallengeScoring,
    isSearchOpen,
    canOpenSearch: computed(() => !challengeChromeHidden.value),
  },
  {
    reveal,
    next: handleNext,
    scoreGotIt: () => handleScore(true),
    scoreMissed: () => handleScore(false),
    playAgain: onPlayAgain,
    openSearch: () => {
      if (challengeChromeHidden.value) return
      closeMenus()
      openSearch()
    },
    closeOverlays: () => {
      if (isSearchOpen.value) closeSearch()
      closeMenus()
    },
  },
)

watch(challengeChromeHidden, (hidden) => {
  if (!hidden) return
  closeMenus()
  closeSearch()
})

watch(isSearchOpen, (open) => {
  if (open) {
    closeMenus()
    pauseTimer()
  }
  else resumeTimer()
})

watch(openMenu, (menu) => {
  if (menu) pauseTimer()
  else if (!isSearchOpen.value) resumeTimer()
})
</script>
