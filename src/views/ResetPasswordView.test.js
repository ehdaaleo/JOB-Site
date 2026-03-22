import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import AuthCard from '@/components/auth/AuthCard.vue'
import PasswordStrength from '@/components/auth/PasswordStrength.vue'

const createWrapper = (query = {}) => {
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } },
      { path: '/auth/reset-password', name: 'reset-password', component: ResetPasswordView }
    ]
  })

  router.push({ path: '/auth/reset-password', query })

  const wrapper = mount(ResetPasswordView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] }
      }
    }
  })

  return { wrapper, pinia, router }
}

describe('ResetPasswordView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders the component', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Reset your password" title', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.text()).toContain('Reset your password')
  })

  it('displays subtitle about entering new password', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.text()).toContain('Enter your new password below')
  })

  it('renders AuthCard component', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.findComponent(AuthCard).exists()).toBe(true)
  })

  it('has new password input field', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    const passwordInput = wrapper.find('#password')
    expect(passwordInput.exists()).toBe(true)
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('has confirm password input field', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    const confirmPasswordInput = wrapper.find('#confirmPassword')
    expect(confirmPasswordInput.exists()).toBe(true)
    expect(confirmPasswordInput.attributes('type')).toBe('password')
  })

  it('renders PasswordStrength component', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.findComponent(PasswordStrength).exists()).toBe(true)
  })

  it('has submit button with "Reset password" text', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Reset password')
  })

  it('has link back to sign in page', () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })
    expect(wrapper.text()).toContain('Back to sign in')
    const link = wrapper.find('a[href="/auth/login"]')
    expect(link.exists()).toBe(true)
  })

  it('shows error when reset token is missing', async () => {
    const { wrapper } = createWrapper()

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Missing reset token')
  })

  it('calls authStore.resetPassword with token and new password', async () => {
    const { wrapper, pinia } = createWrapper({ token: 'validtoken123' })
    const store = useAuthStore(pinia)
    const { authApi } = await import('@/services/auth')
    const resetPasswordSpy = vi.spyOn(authApi, 'resetPassword').mockResolvedValue({ message: 'Password reset successful' })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(resetPasswordSpy).toHaveBeenCalledWith('validtoken123', 'newpassword123')
  })

  it('shows success message on successful password reset', async () => {
    const { wrapper, pinia } = createWrapper({ token: 'validtoken123' })
    const store = useAuthStore(pinia)
    const { authApi } = await import('@/services/auth')

    vi.spyOn(authApi, 'resetPassword').mockResolvedValue({ message: 'Password reset successful' })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Password reset successful')
  })

  it('shows error message on failed password reset', async () => {
    const { wrapper, pinia } = createWrapper({ token: 'invalidtoken' })
    const store = useAuthStore(pinia)
    const { authApi } = await import('@/services/auth')

    vi.spyOn(authApi, 'resetPassword').mockRejectedValue(new Error('Invalid or expired reset token'))

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid or expired reset token')
  })

  it('shows error when passwords do not match', async () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('password123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('password456')

    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('disables submit button when passwords do not match', async () => {
    const { wrapper } = createWrapper({ token: 'validtoken' })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('password123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('password456')

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('redirects to login after successful password reset', async () => {
    const { wrapper, pinia, router } = createWrapper({ token: 'validtoken123' })
    const store = useAuthStore(pinia)
    const routerPushSpy = vi.spyOn(router, 'push').mockResolvedValue()

    vi.spyOn(store, 'resetPassword').mockResolvedValue({ 
      success: true, 
      message: 'Password reset successful' 
    })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await flushPromises()

    // Wait for the setTimeout
    await new Promise(resolve => setTimeout(resolve, 2100))

    expect(routerPushSpy).toHaveBeenCalledWith('/auth/login')
    routerPushSpy.mockRestore()
  })

  it('disables submit button while loading', async () => {
    const { wrapper, pinia } = createWrapper({ token: 'validtoken' })
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'resetPassword').mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return { success: true, message: 'Success' }
    })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('shows loading text while processing', async () => {
    const { wrapper, pinia } = createWrapper({ token: 'validtoken' })
    const store = useAuthStore(pinia)

    vi.spyOn(store, 'resetPassword').mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      return { success: true, message: 'Success' }
    })

    const passwordInput = wrapper.find('#password')
    await passwordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#confirmPassword')
    await confirmPasswordInput.setValue('newpassword123')

    const form = wrapper.find('form')
    form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const button = wrapper.find('button[type="submit"]')
    expect(button.text()).toContain('Resetting...')
  })
})
