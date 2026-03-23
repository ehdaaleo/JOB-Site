import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize auth state from localStorage and setup listeners
const authStore = useAuthStore(pinia)
authStore.setupAuthListener()

app.use(router)

// Configure toastification
app.use(Toast, {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  filterBeforeCreate: (toast, toasts) => {
    // Prevent duplicate toasts
    if (toasts.filter(t => t.content === toast.content).length > 0) {
      return false
    }
    return toast
  }
})

app.mount('#app')
