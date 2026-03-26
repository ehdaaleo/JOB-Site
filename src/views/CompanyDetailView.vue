<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchCompanyById } from '@/services/api'
import axios from 'axios'

// Import Components
import CompanyHeader from '@/components/companyComponents/CompanyHeader.vue'
import CompanyAbout from '@/components/companyComponents/CompanyAbout.vue'
import CompanySidebar from '@/components/companyComponents/CompanySidebar.vue'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const route = useRoute()
const router = useRouter()
const company = ref(null)
const jobs = ref([])
const loading = ref(true)
const jobsLoading = ref(true)

const fetchCompanyData = async () => {
  try {
    loading.value = true
    const response = await fetchCompanyById(route.params.id)
    if (response.data) {
      company.value = response.data
      // Use openJobs from the company object if available
      if (company.value.openJobs) {
        jobs.value = company.value.openJobs
        jobsLoading.value = false
      }
    } else {
      router.push('/not-found')
    }
  } catch (error) {
    router.push('/not-found')
  } finally {
    loading.value = false
  }
}

// const fetchCompanyJobs = async () => {
//   try {
//     jobsLoading.value = true
//     const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/jobs`, {
//       params: { 'company.id': route.params.id }
//     })
//     jobs.value = response.data
//   } catch (error) {
//     console.error('Error fetching company jobs:', error)
//   } finally {
//     jobsLoading.value = false
//   }
// }

onMounted(() => {
  fetchCompanyData()
 // fetchCompanyJobs()
})
</script>

<template>
  <Navbar />
  
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <CompanyHeader :company="company" :loading="loading" />
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <CompanyAbout 
          :company="company" 
          :jobs="jobs" 
          :loading="loading" 
          :jobsLoading="jobsLoading" 
        />
        <CompanySidebar :company="company" :loading="loading" />
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
