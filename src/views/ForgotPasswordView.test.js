import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import AuthCard from '@/components/auth/AuthCard.vue'

const createWrapper = () => {
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/auth/forgot-password', name: 'forgot-password', component: ForgotPasswordView }
    ]
  })

  const wrapper = mount(ForgotPasswordView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] }
      }
    }
  })

  return { wrapper, pinia, router }
}

describe('ForgotPasswordView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Forgot your password?" title', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Forgot your password?')
  })

  it('displays subtitle about reset instructions', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain("we'll send you reset instructions")
  })

  it('renders AuthCard component', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.findComponent(AuthCard).exists()).toBe(true)
  })

  it('has email input field', () => {
    const { wrapper } = createWrapper()
    const emailInput = wrapper.find('#email')
    expect(emailInput.exists()).toBe(true)
    expect(emailInput.attributes('type')).toBe('email')
  })

  it('has submit button with "Send reset link" text', () => {
    const { wrapper } = createWrapper()
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Send reset link')
  })

  it('has link back to sign in page', () => {
    const { wrapper } = createWrapper()
    expect(wrapper.text()).toContain('Back to sign in')
    const link = wrapper.find('a[href="/auth/login"]')
    expect(link.exists()).toBe(true)
  })

  it('calls authStore.forgotPassword on form submit with email', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const forgotPasswordSpy = vi.spyOn(store, 'forgotPassword').mockResolvedValue({ 
      success: true, 
      message: 'Password reset link sent to your email' 
    })

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(forgotPasswordSpy).toHaveBeenCalledWith('test@example.com')
  })

  it('shows success message on successful password reset request', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'forgotPassword').mockResolvedValue({ 
      success: true, 
      message: 'Password reset link sent to your email' 
    })

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Password reset link sent to your email')
  })

  it('shows error message on failed password reset request', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'forgotPassword').mockResolvedValue({ 
      success: false, 
      error: 'Email not found' 
    })

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('notfound@example.com')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Email not found')
  })

  it('clears email field on successful submission', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'forgotPassword').mockResolvedValue({ 
      success: true, 
      message: 'Password reset link sent' 
    })

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')
    
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(emailInput.element.value).toBe('')
  })

  it('disables submit button while loading', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const { authApi } = await import('@/services/auth')

    let resolveForgot
    const pendingPromise = new Promise(resolve => { resolveForgot = resolve })
    vi.spyOn(authApi, 'forgotPassword').mockReturnValue(pendingPromise)

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
    
    // Clean up
    resolveForgot({ message: 'Password reset link sent' })
  })

  it('shows loading text while processing', async () => {
    const { wrapper, pinia } = createWrapper()
    const store = useAuthStore(pinia)
    const { authApi } = await import('@/services/auth')

    let resolveForgot
    const pendingPromise = new Promise(resolve => { resolveForgot = resolve })
    vi.spyOn(authApi, 'forgotPassword').mockReturnValue(pendingPromise)

    const emailInput = wrapper.find('#email')
    await emailInput.setValue('test@example.com')

    const form = wrapper.find('form')
    form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toContain('Sending...')
    
    // Clean up
    resolveForgot({ message: 'Password reset link sent' })
  })
})
