<script setup>
import { ref, computed } from 'vue'
import { useJobStore } from '../../stores/jobStore'

const jobStore = useJobStore()

const stats = computed(() => [
  { label: 'Total Jobs', value: jobStore.allJobs.length, icon: 'briefcase' },
  { label: 'Active Jobs', value: jobStore.activeJobs.length, icon: 'check' },
  { label: 'Pending Approval', value: jobStore.pendingJobs.length, icon: 'clock' },
  { label: 'Total Users', value: '5,678', icon: 'users' },
])

const recentJobs = computed(() => jobStore.allJobs.slice(0, 5))

const recentUsers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'candidate', date: '2024-01-15' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@example.com', role: 'employer', date: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'candidate', date: '2024-01-13' },
])

const getStatusClass = (status) => {
  const classes = { active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700' }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getRoleClass = (role) => {
  const classes = { employer: 'bg-blue-100 text-blue-700', candidate: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }
  return classes[role] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-sm text-gray-500">Manage the job board platform</p>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-500">Welcome, Admin</span>
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
            A
          </div>
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
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Recent Jobs -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <a href="/admin/pending-jobs" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-xs text-gray-500 uppercase">
                    <th class="pb-3">Job Title</th>
                    <th class="pb-3">Company</th>
                    <th class="pb-3">Status</th>
                    <th class="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="job in recentJobs" :key="job.id" class="border-t border-gray-100">
                    <td class="py-3 text-sm font-medium text-gray-900">{{ job.title }}</td>
                    <td class="py-3 text-sm text-gray-500">{{ job.company.name }}</td>
                    <td class="py-3">
                      <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(job.status)}`">
                        {{ job.status }}
                      </span>
                    </td>
                    <td class="py-3 text-sm text-gray-500">{{ formatDate(job.postedAt) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Users -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Users</h2>
            <a href="/admin/users" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-xs text-gray-500 uppercase">
                    <th class="pb-3">Name</th>
                    <th class="pb-3">Email</th>
                    <th class="pb-3">Role</th>
                    <th class="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in recentUsers" :key="user.id" class="border-t border-gray-100">
                    <td class="py-3 text-sm font-medium text-gray-900">{{ user.name }}</td>
                    <td class="py-3 text-sm text-gray-500">{{ user.email }}</td>
                    <td class="py-3">
                      <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getRoleClass(user.role)}`">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="py-3 text-sm text-gray-500">{{ user.date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
