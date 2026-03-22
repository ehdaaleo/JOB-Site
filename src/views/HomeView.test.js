import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'

describe('HomeView', () => {
  it('renders the component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.exists()).toBe(true)
  })

  it('displays "Home View" heading', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Home View')
  })

  it('has main element', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('main').exists()).toBe(true)
  })

  it('has h1 heading', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('h1').exists()).toBe(true)
  })
})
