<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { companyApi } from '@/services/api'

import CompanyHeader from '@/components/companyComponents/CompanyHeader.vue'
import CompanyAbout from '@/components/companyComponents/CompanyAbout.vue'
import CompanySidebar from '@/components/companyComponents/CompanySidebar.vue'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const route = useRoute()
const router = useRouter()
const raw = ref(null)
const loading = ref(true)

const fetchCompanyData = async () => {
  try {
    loading.value = true
    const res = await companyApi.show(route.params.id)
    raw.value = res.data || res
  } catch {
    router.replace({ name: 'not-found' })
  } finally {
    loading.value = false
  }
}

// Adapt the Laravel employer payload to the shape the existing
// CompanyHeader/About/Sidebar components expect.
const company = computed(() => {
  if (!raw.value) return null
  return {
    id: raw.value.id,
    name:
      raw.value.company_name ||
      raw.value.organization ||
      raw.value.name ||
      'Company',
    logo: raw.value.company_logo,
    industry: raw.value.industry,
    location: raw.value.location,
    website: raw.value.company_website,
    description: raw.value.company_description,
    size: raw.value.company_size,
    employer_type: raw.value.employer_type,
    job_title: raw.value.job_title,
    contact_name: raw.value.name,
  }
})

const jobs = computed(() => raw.value?.jobs || [])
const jobsLoading = computed(() => loading.value)

onMounted(fetchCompanyData)
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
