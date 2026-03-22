import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter.js'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with count 0', () => {
    const counter = useCounterStore()
    expect(counter.count).toBe(0)
  })

  it('computes doubleCount correctly', () => {
    const counter = useCounterStore()
    expect(counter.doubleCount).toBe(0)
    counter.increment()
    expect(counter.doubleCount).toBe(2)
  })

  it('increments count', () => {
    const counter = useCounterStore()
    counter.increment()
    expect(counter.count).toBe(1)
    
    counter.increment()
    expect(counter.count).toBe(2)
  })
})
