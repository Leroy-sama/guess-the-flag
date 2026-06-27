export default defineNuxtPlugin(() => {
  const saved = localStorage.getItem('theme')
  const dark = saved === 'dark'
    || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', dark)

  const isDark = useState('theme-is-dark', () => dark)
  isDark.value = dark
})
