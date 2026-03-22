<script setup>
// Home Screen View - Main landing page for the job board platform
// This view combines all home page components to create a complete landing page

import Navbar from '../components/homePageComponents/navbar.vue'
import HeroSection from '../components/homePageComponents/heroSection.vue'
import FeaturedJobs from '../components/homePageComponents/featuredJobs.vue'
import CategoriesSection from '../components/homePageComponents/categoriesSection.vue'
import TopCompanies from '../components/homePageComponents/topCompanies.vue'
import Footer from '../components/homePageComponents/footer.vue'
</script>

<template>
  <div class="home-screen">
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content -->
    <main class="main-content">
      <!-- Hero Section -->
      <HeroSection />

      <!-- Featured Jobs Section -->
      <FeaturedJobs />

      <!-- Categories Section -->
      <CategoriesSection />

      <!-- Top Companies Section -->
      <TopCompanies />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<style scoped>
/* Home Screen Container */
.home-screen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content */
.main-content {
  flex: 1;
}
</style>
