export function useTheme() {
  const isDark = useState('theme-is-dark', () => false)

  function toggleTheme() {
    const next = !isDark.value
    isDark.value = next
    localStorage.setItem('theme', next ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', next)
  }

  return {
    isDark,
    toggleTheme,
  }
}
