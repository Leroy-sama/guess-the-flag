function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT'
    || tag === 'TEXTAREA'
    || tag === 'SELECT'
    || target.isContentEditable
  )
}

export interface GameHotkeyHandlers {
  reveal: () => void
  next: () => void
  scoreGotIt: () => void
  scoreMissed: () => void
  playAgain: () => void
  openSearch: () => void
  closeOverlays: () => void
}

export interface GameHotkeyState {
  revealed: Ref<boolean>
  roundVisible: Ref<boolean>
  isAdvancing: Ref<boolean>
  isComplete: Ref<boolean>
  isChallengeScoring: Ref<boolean>
  isSearchOpen: Ref<boolean>
}

/**
 * Desktop play loop hotkeys.
 * Space reveal / next · Y/N (or 1/2, arrows) score · / search · Esc dismiss · Enter replay
 */
export function useGameHotkeys(
  state: GameHotkeyState,
  handlers: GameHotkeyHandlers,
) {
  function onKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) return

    // Esc always wins for overlays, even from the search input
    if (event.key === 'Escape') {
      event.preventDefault()
      handlers.closeOverlays()
      return
    }

    if (isTypingTarget(event.target)) return
    if (state.isSearchOpen.value) return

    const key = event.key
    const code = event.code

    // Open search
    if (key === '/' || key === '?') {
      event.preventDefault()
      handlers.openSearch()
      return
    }

    // End screen
    if (state.isComplete.value) {
      if (key === 'Enter' || code === 'Space') {
        event.preventDefault()
        handlers.playAgain()
      }
      return
    }

    if (!state.roundVisible.value || state.isAdvancing.value) return

    // Hidden answer → reveal
    if (!state.revealed.value) {
      if (code === 'Space' || key === 'Enter') {
        event.preventDefault()
        handlers.reveal()
      }
      return
    }

    // Challenge scoring — Space does nothing (deliberate Y/N)
    if (state.isChallengeScoring.value) {
      const gotIt = key === 'y' || key === 'Y' || key === '1' || key === 'ArrowLeft'
      const missed = key === 'n' || key === 'N' || key === '2' || key === 'ArrowRight'
      if (gotIt) {
        event.preventDefault()
        handlers.scoreGotIt()
      }
      else if (missed) {
        event.preventDefault()
        handlers.scoreMissed()
      }
      return
    }

    // Free play next
    if (code === 'Space' || key === 'Enter') {
      event.preventDefault()
      handlers.next()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onScopeDispose(() => {
    if (import.meta.client) {
      window.removeEventListener('keydown', onKeydown)
    }
  })
}
