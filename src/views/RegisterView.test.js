import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import RegisterView from '@/views/RegisterView.vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import RegisterForm from '@/components/auth/register/RegisterForm.vue'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons.vue'

// Mock localStorage before imports
const localStorageMock = (() => {
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

const createWrapper = () => {
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/auth/register', name: 'register', component: RegisterView }
    ]
  })

  const wrapper = mount(RegisterView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] }
      }
    }
  })

  return { wrapper, pinia, router }
}

describe('RegisterView', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
    setActivePinia(createPinia())
  })

  it('renders the component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Create your account" title', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Create your account')
  })

  it('displays "Start your 14-day free trial" subtitle', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Start your 14-day free trial')
  })

  it('renders AuthCard component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(AuthCard).exists()).toBe(true)
  })

  it('renders RegisterForm component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true)
  })

  it('renders SocialAuthButtons component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(SocialAuthButtons).exists()).toBe(true)
  })

  it('has link to login page', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Sign in instead')
    const link = wrapper.find('a[href="/auth/login"]')
    expect(link.exists()).toBe(true)
  })

  it('calls authStore.register on form submit with user data', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const registerSpy = vi.spyOn(store, 'register').mockResolvedValue({ success: true, user: { id: '2', name: 'New User' } })

    const registerForm = wrapper.findComponent(RegisterForm)
    const formData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
      role: 'candidate',
      acceptedTerms: true
    }
    registerForm.vm.$emit('submit', formData)
    await flushPromises()

    expect(registerSpy).toHaveBeenCalledWith(formData)
  })

  it('redirects to login on successful registration', async () => {
    const { wrapper, pinia, router } = createWrapper()
    const store = useAuthStore(pinia)
    const routerPushSpy = vi.spyOn(router, 'push').mockResolvedValue()

    vi.spyOn(store, 'register').mockResolvedValue({ success: true, user: { id: '2' } })

    const registerForm = wrapper.findComponent(RegisterForm)
    registerForm.vm.$emit('submit', { name: 'New User', email: 'new@example.com', password: 'password123', role: 'candidate' })
    await flushPromises()

    expect(routerPushSpy).toHaveBeenCalledWith('/auth/login')
    routerPushSpy.mockRestore()
  })

  it('shows alert on registration failure', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    vi.spyOn(store, 'register').mockResolvedValue({ success: false, error: 'Email already exists' })

    const registerForm = wrapper.findComponent(RegisterForm)
    registerForm.vm.$emit('submit', { name: 'New User', email: 'existing@example.com', password: 'password123', role: 'candidate' })
    await flushPromises()

    expect(alertSpy).toHaveBeenCalledWith('Email already exists')
    alertSpy.mockRestore()
  })

  it('passes loading state to RegisterForm', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    // Mock authApi.register with a delayed promise to test loading state
    const { authApi } = await import('@/services/auth')
    let resolveRegister
    const pendingPromise = new Promise(resolve => { resolveRegister = resolve })
    vi.spyOn(authApi, 'register').mockReturnValue(pendingPromise)

    const registerForm = wrapper.findComponent(RegisterForm)
    expect(registerForm.props('loading')).toBe(false)

    registerForm.vm.$emit('submit', { name: 'New User', email: 'new@example.com', password: 'password', role: 'candidate' })
    await wrapper.vm.$nextTick()

    expect(store.isLoading).toBe(true)
    
    // Clean up - resolve the pending promise
    resolveRegister({ id: '2', name: 'New User', email: 'new@example.com' })
  })
})
