<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/jobs')
}
</script>

<template>
  <div class="success-card bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm text-center animate-fade-in-up">
    <!-- Animated checkmark -->
    <div class="checkmark-wrap mx-auto mb-6">
      <div class="checkmark-circle">
        <svg class="checkmark-svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>
    </div>

    <!-- Confetti dots -->
    <div class="confetti-wrap">
      <span class="confetti confetti-1"></span>
      <span class="confetti confetti-2"></span>
      <span class="confetti confetti-3"></span>
      <span class="confetti confetti-4"></span>
      <span class="confetti confetti-5"></span>
      <span class="confetti confetti-6"></span>
    </div>

    <h3 class="text-2xl font-bold text-slate-900 mb-2" style="font-family: 'Syne', sans-serif;">
      Application Submitted! 🎉
    </h3>
    <p class="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
      Your application has been sent successfully. The hiring team at
      <span class="font-semibold text-blue-600">TechCorp Inc.</span>
      will review it and get back to you soon.
    </p>

    <button
      @click="goBack"
      class="go-back-btn"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
      Go back to Jobs
    </button>
  </div>
</template>

<style scoped>
.success-card {
  font-family: 'DM Sans', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Checkmark animation */
.checkmark-wrap {
  width: 80px;
  height: 80px;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  position: relative;
}

.checkmark-svg {
  width: 80px;
  height: 80px;
}

.checkmark-circle-bg {
  stroke-width: 2;
  stroke: #10b981;
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  animation: stroke-draw 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark-check {
  stroke: #10b981;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke-draw 0.35s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
}

@keyframes stroke-draw {
  100% { stroke-dashoffset: 0; }
}

/* Confetti dots */
.confetti-wrap {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: confetti-pop 0.8s ease-out forwards;
  opacity: 0;
}

.confetti-1 { background: #2563eb; top: 15%; left: 20%; animation-delay: 0.3s; }
.confetti-2 { background: #10b981; top: 10%; right: 25%; animation-delay: 0.4s; }
.confetti-3 { background: #f59e0b; top: 25%; left: 10%; animation-delay: 0.5s; }
.confetti-4 { background: #ec4899; top: 20%; right: 15%; animation-delay: 0.55s; }
.confetti-5 { background: #8b5cf6; top: 30%; left: 30%; animation-delay: 0.6s; }
.confetti-6 { background: #ef4444; top: 12%; right: 35%; animation-delay: 0.65s; }

@keyframes confetti-pop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

/* Go back button */
.go-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  background: #2563eb;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.go-back-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.go-back-btn:active {
  transform: translateY(0);
}
</style>
