<script setup>
import { computed } from 'vue'
import { useJobStore } from '../../stores/jobStore'
import { useApplicationStore } from '../../stores/applicationStore'
import { useAuthStore } from '../../stores/auth'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const jobStore = useJobStore()
const applicationStore = useApplicationStore()
const authStore = useAuthStore()

// Get employer's posted jobs (filter by logged in user)
const myJobs = computed(() => {
  // In a real app, filter by employer ID
  return jobStore.jobs.slice(0, 5)
})

// Get all applications
const allApplications = computed(() => applicationStore.applications)

const stats = computed(() => [
  { label: 'Active Jobs', value: myJobs.value.filter(j => j.status === 'active').length, icon: 'briefcase' },
  { label: 'Total Applications', value: allApplications.value.length, icon: 'users' },
  { label: 'Pending Review', value: allApplications.value.filter(a => a.status === 'pending').length, icon: 'clock' },
  { label: 'Profile Views', value: '234', icon: 'eye' },
])

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    interviewing: 'bg-green-100 text-green-700',
    accepted: 'bg-blue-100 text-blue-700',
    rejected: 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
  <div class="employer-dashboard">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p class="text-sm text-gray-500">Manage your job postings and applications</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Post New Job
          </a>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg v-if="stat.icon === 'briefcase'" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="stat.icon === 'users'" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else-if="stat.icon === 'clock'" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else-if="stat.icon === 'eye'" class="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- My Job Postings -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">My Job Postings</h2>
            <a href="/employer/manage-jobs" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="job in myJobs" :key="job.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ job.title }}</p>
                  <p class="text-sm text-gray-500">{{ job.company.name }} • {{ job.location }}</p>
                </div>
                <div class="text-right">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${
                    job.status === 'active' ? 'bg-green-100 text-green-700' : 
                    job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-gray-100 text-gray-700'
                  }`">
                    {{ job.status }}
                  </span>
                  <p class="text-xs text-gray-400 mt-1">{{ job.applicationsCount }} applications</p>
                </div>
              </div>
              <div v-if="myJobs.length === 0" class="text-center py-4 text-gray-500">
                No jobs posted yet. <a href="/employer/post-job" class="text-blue-600">Post a job</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Applications -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <a href="/employer/applications" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="app in allApplications.slice(0, 5)" :key="app.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ app.candidateName || 'Anonymous Candidate' }}</p>
                  <p class="text-sm text-gray-500">{{ app.job }}</p>
                </div>
                <div class="text-right">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(app.status)}`">
                    {{ app.status }}
                  </span>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(app.date || new Date().toISOString()) }}</p>
                </div>
              </div>
              <div v-if="allApplications.length === 0" class="text-center py-4 text-gray-500">
                No applications yet
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Promotion Banner -->
      <div class="px-0 mt-8 mb-4">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white relative overflow-hidden shadow-2xl group">
          <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="max-w-2xl text-center md:text-left">
              <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Limited Offer: Save 20%</span>
              <h2 class="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Boost Your Recruitment Today</h2>
              <p class="text-blue-100 text-lg leading-relaxed">Upgrade to our Pro package and get 15 featured listings, advanced analytics, and priority placement. Focus on finding talent, we'll handle the rest.</p>
            </div>
            <RouterLink to="/pricing" class="px-10 py-5 bg-white text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95 whitespace-nowrap">
              Explore Packages
            </RouterLink>
          </div>
          <!-- Decorative Background Elements -->
          <div class="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
          <div class="absolute -left-10 -top-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
          <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RouterLink to="/employer/post-job" class="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-4 shadow-sm">
              <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Post New Job</p>
              <p class="text-sm text-gray-500">Create a new job listing</p>
            </div>
          </RouterLink>
          
          <RouterLink to="/employer/manage-jobs" class="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-4 shadow-sm">
              <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Manage Jobs</p>
              <p class="text-sm text-gray-500">Edit active postings</p>
            </div>
          </RouterLink>

          <RouterLink to="/pricing" class="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center mr-4 shadow-sm">
              <svg class="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Pricing Plans</p>
              <p class="text-sm text-gray-500">View available packages</p>
            </div>
          </RouterLink>
          
          <RouterLink to="/employer/settings" class="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
            <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-4 shadow-sm">
              <svg class="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Company Settings</p>
              <p class="text-sm text-gray-500">Update company profile</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
  <Footer />
</template>

<style scoped>
.employer-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
