import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import LoginForm from '@/components/auth/login/LoginForm.vue'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons.vue'

const createWrapper = () => {
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: LoginView },
      { path: '/auth/register', name: 'register', component: { template: '<div>Register</div>' } }
    ]
  })

  const wrapper = mount(LoginView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] }
      }
    }
  })

  return { wrapper, pinia, router }
}

describe('LoginView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Sign in to your account" title', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Sign in to your account')
  })

  it('renders AuthCard component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(AuthCard).exists()).toBe(true)
  })

  it('renders LoginForm component with email and password fields', () => {
    const { wrapper } = createWrapper()
    const loginForm = wrapper.findComponent(LoginForm)
    expect(loginForm.exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
  })

  it('renders SocialAuthButtons component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(SocialAuthButtons).exists()).toBe(true)
  })

  it('has link to register page', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Create one now')
    const link = wrapper.find('a[href="/auth/register"]')
    expect(link.exists()).toBe(true)
  })

  it('calls authStore.login on form submit with credentials', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const loginSpy = vi.spyOn(store, 'login').mockResolvedValue({ success: true, user: { id: '1', name: 'Test' } })

    const loginForm = wrapper.findComponent(LoginForm)
    loginForm.vm.$emit('submit', { email: 'test@example.com', password: 'password123' })
    await flushPromises()

    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' })
  })

  it('sets error state on login failure', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'login').mockResolvedValue({ success: false, error: 'Invalid credentials' })

    const loginForm = wrapper.findComponent(LoginForm)
    loginForm.vm.$emit('submit', { email: 'wrong@example.com', password: 'wrong' })
    await flushPromises()

    expect(store.error).toBe('Invalid credentials')
  })

  it('passes loading state to LoginForm', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    // Mock authApi.login with a delayed promise to test loading state
    const { authApi } = await import('@/services/auth')
    let resolveLogin
    const pendingPromise = new Promise(resolve => { resolveLogin = resolve })
    vi.spyOn(authApi, 'login').mockReturnValue(pendingPromise)

    const loginForm = wrapper.findComponent(LoginForm)
    expect(loginForm.props('loading')).toBe(false)

    loginForm.vm.$emit('submit', { email: 'test@example.com', password: 'password' })
    await wrapper.vm.$nextTick()

    expect(store.isLoading).toBe(true)

    // Clean up - resolve the pending promise
    resolveLogin({ id: '1', name: 'Test User', email: 'test@example.com' })
  })
})
