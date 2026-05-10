<script setup>
import { RouterLink } from 'vue-router'
import Navbar from '@/components/homePageComponents/navbar.vue'
</script>

<template>
  <Navbar />
  <div class="not-found-view">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/" class="home-btn">
        Go Back Home
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 104px 24px 40px;
  background: #F9FAFB;
}

.not-found-content {
  text-align: center;
  max-width: 480px;
}

.error-code {
  font-size: 120px;
  font-weight: 800;
  color: #4F46E5;
  line-height: 1;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 12px;
}

p {
  font-size: 16px;
  color: #6B7280;
  margin: 0 0 32px;
}

.home-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: #4F46E5;
  color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.home-btn:hover {
  background: #4338CA;
  transform: translateY(-2px);
}
</style>
