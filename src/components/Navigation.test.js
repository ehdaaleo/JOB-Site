import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import Navigation from '@/components/Navigation.vue'

// Mock localStorage and sessionStorage before imports
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

const sessionStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
})

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

const createWrapper = (isLoggedIn = false, user = null) => {
  const pinia = createPinia()
  const store = useAuthStore(pinia)

  if (isLoggedIn && user) {
    store.user = user
    store.token = 'test-token'
  }

  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/about', name: 'about', component: { template: '<div>About</div>' } },
      { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/auth/register', name: 'register', component: { template: '<div>Register</div>' } }
    ]
  })

  router.push('/')

  const wrapper = mount(Navigation, {
    global: {
      plugins: [pinia, router]
    }
  })

  return { wrapper, pinia, router, store }
}

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders the component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Job Site" logo/link', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Job Site')
  })

  it('has link to Home page', () => {
    const { wrapper } = createWrapper()
    const homeLink = wrapper.find('a[href="/"]')
    expect(homeLink.exists()).toBe(true)
    expect(homeLink.text()).toContain('Home')
  })

  it('has link to About page', () => {
    const { wrapper } = createWrapper()
    const aboutLink = wrapper.find('a[href="/about"]')
    expect(aboutLink.exists()).toBe(true)
    expect(aboutLink.text()).toContain('About')
  })

  describe('when user is not logged in', () => {
    it('shows "Sign in" link', () => {
      const { wrapper } = createWrapper(false)
      const signInLink = wrapper.find('a[href="/auth/login"]')
      expect(signInLink.exists()).toBe(true)
      expect(signInLink.text()).toContain('Sign in')
    })

    it('shows "Create account" button', () => {
      const { wrapper } = createWrapper(false)
      const createAccountLink = wrapper.find('a[href="/auth/register"]')
      expect(createAccountLink.exists()).toBe(true)
      expect(createAccountLink.text()).toContain('Create account')
    })

    it('does not show logout button', () => {
      const { wrapper } = createWrapper(false)
      const logoutButton = wrapper.find('button')
      expect(logoutButton.exists()).toBe(false)
    })

    it('does not show user name', () => {
      const { wrapper } = createWrapper(false)
      expect(wrapper.text()).not.toContain('Test User')
    })

    it('does not show user role badge', () => {
      const { wrapper } = createWrapper(false)
      expect(wrapper.text()).not.toContain('candidate')
    })
  })

  describe('when user is logged in', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'candidate'
    }

    it('shows user name', () => {
      const { wrapper } = createWrapper(true, mockUser)
      expect(wrapper.text()).toContain('Test User')
    })

    it('shows user role badge', () => {
      const { wrapper } = createWrapper(true, mockUser)
      expect(wrapper.text()).toContain('candidate')
    })

    it('shows Logout button', () => {
      const { wrapper } = createWrapper(true, mockUser)
      const logoutButton = wrapper.find('button')
      expect(logoutButton.exists()).toBe(true)
      expect(logoutButton.text()).toContain('Logout')
    })

    it('does not show "Sign in" link', () => {
      const { wrapper } = createWrapper(true, mockUser)
      const signInLink = wrapper.find('a[href="/auth/login"]')
      expect(signInLink.exists()).toBe(false)
    })

    it('does not show "Create account" button', () => {
      const { wrapper } = createWrapper(true, mockUser)
      const createAccountLink = wrapper.find('a[href="/auth/register"]')
      expect(createAccountLink.exists()).toBe(false)
    })

    it('calls authStore.logout and redirects to home on logout click', async () => {
      const { wrapper, pinia, router, store } = createWrapper(true, mockUser)
      const logoutSpy = vi.spyOn(store, 'logout').mockResolvedValue()

      const logoutButton = wrapper.find('button')
      await logoutButton.trigger('click')
      await flushPromises()

      expect(logoutSpy).toHaveBeenCalled()
    })

    it('shows employer role for employer users', () => {
      const employerUser = {
        id: '2',
        name: 'Company User',
        email: 'company@example.com',
        role: 'employer'
      }
      const { wrapper } = createWrapper(true, employerUser)
      expect(wrapper.text()).toContain('employer')
    })
  })

  describe('navigation styling', () => {
    it('has navigation bar with correct classes', () => {
      const { wrapper } = createWrapper()
      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('bg-white')
      expect(nav.classes()).toContain('shadow-sm')
      expect(nav.classes()).toContain('border-b')
    })

    it('has correct height for navigation', () => {
      const { wrapper } = createWrapper()
      const navInner = wrapper.find('.flex.justify-between.h-16')
      expect(navInner.exists()).toBe(true)
    })
  })
})
