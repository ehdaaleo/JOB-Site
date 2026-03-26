<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/auth'

const employers = ref([])
const loading = ref(true)
const error = ref(null)

const fetchEmployers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/users', {
      params: { role: 'employer' },
    })
    employers.value = response.data
  } catch (err) {
    console.error('Failed to fetch employers:', err)
    error.value = 'Failed to load companies. Please check your network connection.'
  } finally {
    loading.value = false
  }
}

// Helpers for extracting varied data from employer profiles
const getCompanyName = (emp) =>
  emp.company?.name || emp.organization || emp.company_name || emp.name || 'Unnamed Company'
const getIndustry = (emp) => emp.company?.industry || emp.industry || null
const getLocation = (emp) => emp.company?.location || emp.location || null
const getSize = (emp) => emp.company?.size || emp.companySize || null
const getDescription = (emp) =>
  emp.company?.description || emp.companyDescription || emp.bio || null
const getWebsite = (emp) => {
  let site = emp.company?.website || emp.companyWebsite || null
  if (site && !site.startsWith('http')) {
    site = 'https://' + site
  }
  return site
}

const getInitials = (name) => {
  if (!name) return 'C'
  const words = name.split(' ').filter((w) => w.length > 0)
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

onMounted(() => {
  fetchEmployers()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-bold text-base-content mb-2">Companies</h1>
        <p class="text-base-content/70 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
              clip-rule="evenodd"
            />
          </svg>
          Browse companies hiring on our platform
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="flex flex-col items-center gap-4">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-base-content/60 font-medium animate-pulse">Loading companies...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-error shadow-lg max-w-2xl mx-auto mt-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 class="font-bold">Error Loading Data</h3>
        <div class="text-xs">{{ error }}</div>
      </div>
      <button class="btn btn-sm btn-ghost" @click="fetchEmployers">Retry</button>
    </div>

    <!-- Companies Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="employer in employers"
        :key="employer.id"
        class="card bg-base-100 shadow-sm border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div class="card-body p-6 flex flex-col h-full">
          <div class="flex items-start gap-4 mb-4">
            <div class="avatar placeholder">
              <div
                class="bg-primary/10 text-primary border border-primary/20 rounded-xl w-14 h-14 flex items-center justify-center"
              >
                <span class="text-xl font-bold">{{ getInitials(getCompanyName(employer)) }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h2
                class="card-title text-lg leading-tight truncate block mb-1"
                :title="getCompanyName(employer)"
              >
                {{ getCompanyName(employer) }}
              </h2>
              <div
                class="flex items-center gap-1.5 text-xs text-base-content/60 bg-base-200 w-fit px-2 py-1 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ employer.employerType === 'individual' ? 'Individual' : 'Company' }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 mb-4 text-sm text-base-content/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="truncate">{{ getLocation(employer) || 'Remote / Unspecified' }}</span>
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-if="getIndustry(employer)" class="badge badge-primary badge-sm badge-outline">{{
              getIndustry(employer)
            }}</span>
            <span v-if="getSize(employer)" class="badge badge-secondary badge-sm badge-outline"
              >{{ getSize(employer) }} employees</span
            >
            <span
              v-if="!getIndustry(employer) && !getSize(employer)"
              class="badge badge-ghost badge-sm text-base-content/50"
              >No details</span
            >
          </div>

          <p class="text-sm text-base-content/80 line-clamp-3 mb-6 flex-grow leading-relaxed">
            {{ getDescription(employer) || 'No description provided by this employer.' }}
          </p>

          <div
            class="card-actions mt-auto pt-4 border-t border-base-200 justify-between items-center"
          >
            <a
              v-if="getWebsite(employer)"
              :href="getWebsite(employer)"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-semibold text-primary hover:text-primary-focus flex items-center gap-1 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-3.5 h-3.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
              Website
            </a>
            <span v-else class="text-xs text-base-content/40">No website</span>

            <button class="btn btn-primary btn-sm rounded-full px-6">View</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="employers.length === 0 && !loading"
        class="col-span-full flex flex-col items-center justify-center py-20 bg-base-200/50 rounded-2xl border border-base-200 border-dashed"
      >
        <div class="bg-base-100 p-4 rounded-full shadow-sm mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-primary/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-base-content">No companies found</h3>
        <p class="text-base-content/60 mt-2 max-w-sm text-center">
          There are currently no employers registered on the platform. Check back later.
        </p>
      </div>
    </div>
  </div>
</template>

