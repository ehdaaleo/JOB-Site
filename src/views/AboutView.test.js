import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from '@/views/AboutView.vue'

describe('AboutView', () => {
  it('renders the component', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "This is an about page" text', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.text()).toContain('This is an about page')
  })

  it('has about div container', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.find('.about').exists()).toBe(true)
  })

  it('has h1 heading', () => {
    const wrapper = mount(AboutView)
    expect(wrapper.find('h1').exists()).toBe(true)
  })
})
