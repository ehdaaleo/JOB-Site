/**
 * Chatbot Store - Pinia store for chatbot state management
 * Manages chat messages, user preferences, and chat history
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatbotStore = defineStore('chatbot', () => {
  // State
  const messages = ref([])
  const isOpen = ref(false)
  const isTyping = ref(false)
  const error = ref(null)
  const userPreferences = ref({
    language: 'en',
    notifications: true,
    soundEnabled: true
  })
  const chatHistory = ref([])
  const unreadCount = ref(0)

  // Getters
  const messageCount = computed(() => messages.value.length)
  
  const lastMessage = computed(() => {
    return messages.value.length > 0 
      ? messages.value[messages.value.length - 1] 
      : null
  })

  const hasUnreadMessages = computed(() => unreadCount.value > 0)

  const userMessages = computed(() => 
    messages.value.filter(msg => msg.sender === 'user')
  )

  const botMessages = computed(() => 
    messages.value.filter(msg => msg.sender === 'bot')
  )

  // Actions
  const addMessage = (content, sender = 'user', metadata = {}) => {
    const message = {
      id: Date.now(),
      content,
      sender,
      timestamp: new Date().toISOString(),
      read: sender === 'user',
      ...metadata
    }
    
    messages.value.push(message)
    
    // Update unread count for bot messages
    if (sender === 'bot' && !isOpen.value) {
      unreadCount.value++
    }
    
    // Save to chat history
    saveToHistory(message)
    
    return message
  }

  const clearMessages = () => {
    messages.value = []
    unreadCount.value = 0
  }

  const markAsRead = () => {
    unreadCount.value = 0
    messages.value.forEach(msg => {
      msg.read = true
    })
  }

  const toggleChat = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      markAsRead()
    }
  }

  const openChat = () => {
    isOpen.value = true
    markAsRead()
  }

  const closeChat = () => {
    isOpen.value = false
  }

  const setTyping = (typing) => {
    isTyping.value = typing
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const updatePreferences = (preferences) => {
    userPreferences.value = {
      ...userPreferences.value,
      ...preferences
    }
    // Save to localStorage
    localStorage.setItem('chatbot_preferences', JSON.stringify(userPreferences.value))
  }

  const loadPreferences = () => {
    const saved = localStorage.getItem('chatbot_preferences')
    if (saved) {
      try {
        userPreferences.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load chatbot preferences:', e)
      }
    }
  }

  const saveToHistory = (message) => {
    // Keep last 100 messages in history
    chatHistory.value.push(message)
    if (chatHistory.value.length > 100) {
      chatHistory.value.shift()
    }
    // Save to localStorage
    localStorage.setItem('chatbot_history', JSON.stringify(chatHistory.value))
  }

  const loadHistory = () => {
    const saved = localStorage.getItem('chatbot_history')
    if (saved) {
      try {
        chatHistory.value = JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load chat history:', e)
      }
    }
  }

  const clearHistory = () => {
    chatHistory.value = []
    localStorage.removeItem('chatbot_history')
  }

  const exportChat = () => {
    const chatData = {
      messages: messages.value,
      exportedAt: new Date().toISOString(),
      messageCount: messages.value.length
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Initialize
  const initialize = () => {
    loadPreferences()
    loadHistory()
  }

  return {
    // State
    messages,
    isOpen,
    isTyping,
    error,
    userPreferences,
    chatHistory,
    unreadCount,
    
    // Getters
    messageCount,
    lastMessage,
    hasUnreadMessages,
    userMessages,
    botMessages,
    
    // Actions
    addMessage,
    clearMessages,
    markAsRead,
    toggleChat,
    openChat,
    closeChat,
    setTyping,
    setError,
    clearError,
    updatePreferences,
    loadPreferences,
    saveToHistory,
    loadHistory,
    clearHistory,
    exportChat,
    initialize
  }
})
