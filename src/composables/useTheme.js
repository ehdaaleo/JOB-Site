import { ref } from 'vue'

// Use a shared state so multiple components can use it
const isDark = ref(false)

export function useTheme() {
  const initTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else if (typeof window !== 'undefined') {
      // Fallback to system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (typeof document === 'undefined') return
    
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
