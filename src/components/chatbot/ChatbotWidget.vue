<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { useChatbot } from '@/composables/useChatbot'
import { useChatbotStore } from '@/stores/chatbotStore'

const { messages, isTyping, error, isOpen, sendMessage, clearChat, toggleChat, closeChat } = useChatbot()
const chatbotStore = useChatbotStore()

const inputMessage = ref('')
const messagesContainer = ref(null)

// Auto-scroll to bottom when new messages arrive
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

// Initialize chatbot store on mount
onMounted(() => {
  chatbotStore.initialize()
})

const handleSend = async () => {
  if (!inputMessage.value.trim()) return
  
  const message = inputMessage.value
  inputMessage.value = ''
  
  await sendMessage(message)
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleClearChat = () => {
  clearChat()
  chatbotStore.clearMessages()
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Chat Toggle Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-white hover:scale-110"
      aria-label="Open chat"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <!-- Unread badge -->
      <span
        v-if="chatbotStore.hasUnreadMessages"
        class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold"
      >
        {{ chatbotStore.unreadCount > 9 ? '9+' : chatbotStore.unreadCount }}
      </span>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-lg">Job Assistant</h3>
            <p class="text-xs text-white/80">Online • Ready to help</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="handleClearChat"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Clear chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            @click="closeChat"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages Container -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
      >
        <!-- Welcome message -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 class="font-semibold text-gray-800 mb-2">Welcome to Job Assistant!</h4>
          <p class="text-sm text-gray-600 mb-4">I can help you find jobs, answer questions, and guide you through the application process.</p>
          <div class="space-y-2">
            <button
              @click="inputMessage = 'Find remote programming jobs'"
              class="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              🔍 Find remote programming jobs
            </button>
            <button
              @click="inputMessage = 'How do I apply for a job?'"
              class="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              📝 How do I apply for a job?
            </button>
            <button
              @click="inputMessage = 'Show me companies hiring'"
              class="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
            >
              🏢 Show me companies hiring
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.sender === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-white text-gray-800 shadow-sm border border-gray-200'
            ]"
          >
            <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
            <p
              :class="[
                'text-xs mt-1',
                message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
              ]"
            >
              {{ formatTimestamp(message.timestamp) }}
            </p>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-2xl px-4 py-3">
            <div class="flex space-x-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></div>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="flex justify-start">
          <div class="bg-red-50 text-red-600 border border-red-200 rounded-2xl px-4 py-3">
            <p class="text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="flex items-center gap-2">
          <input
            v-model="inputMessage"
            @keypress="handleKeyPress"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-3 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm"
            :disabled="isTyping"
          />
          <button
            @click="handleSend"
            :disabled="!inputMessage.trim() || isTyping"
            class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send • Powered by AI
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
