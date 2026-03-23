<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'candidate', status: 'active', joinedAt: '2024-01-10', jobsApplied: 5 },
  { id: 2, name: 'Sarah Smith', email: 'sarah@techcorp.com', role: 'employer', status: 'active', joinedAt: '2024-01-08', jobsPosted: 12 },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'candidate', status: 'active', joinedAt: '2024-01-05', jobsApplied: 3 },
  { id: 4, name: 'Emily Brown', email: 'emily@innovate.com', role: 'employer', status: 'active', joinedAt: '2024-01-03', jobsPosted: 8 },
  { id: 5, name: 'David Wilson', email: 'david@example.com', role: 'candidate', status: 'inactive', joinedAt: '2023-12-20', jobsApplied: 2 },
  { id: 6, name: 'Admin User', email: 'admin@jobhub.com', role: 'admin', status: 'active', joinedAt: '2023-12-01', jobsPosted: 0 },
])

const searchQuery = ref('')
const roleFilter = ref('')
const selectedUser = ref(null)
const showModal = ref(false)

const filteredUsers = () => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
}

const getRoleClass = (role) => {
  const classes = { employer: 'bg-blue-100 text-blue-700', candidate: 'bg-purple-100 text-purple-700', admin: 'bg-red-100 text-red-700' }
  return classes[role] || 'bg-gray-100 text-gray-700'
}

const getStatusClass = (status) => {
  return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
}

const viewUser = (user) => {
  selectedUser.value = user
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

const toggleUserStatus = (user) => {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

const deleteUser = (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}
</script>

<template>
  <div class="user-management">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-sm text-gray-500">Manage platform users and roles</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">{{ users.length }} total users</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-6">
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Search users..." 
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>
        <select v-model="roleFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Roles</option>
          <option value="employer">Employers</option>
          <option value="candidate">Candidates</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in filteredUsers()" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">{{ user.name }}</p>
                      <p class="text-sm text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getRoleClass(user.role)}`">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(user.status)}`">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ user.joinedAt }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  <span v-if="user.role === 'employer'">{{ user.jobsPosted }} jobs posted</span>
                  <span v-else-if="user.role === 'candidate'">{{ user.jobsApplied }} jobs applied</span>
                  <span v-else>-</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <button @click="viewUser(user)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View
                    </button>
                    <button @click="toggleUserStatus(user)" class="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button @click="deleteUser(user)" class="text-red-600 hover:text-red-800 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredUsers().length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500">Try adjusting your search or filter.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="bg-white rounded-xl max-w-md w-full" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">User Details</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedUser">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
              {{ selectedUser.name.charAt(0) }}
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ selectedUser.name }}</h3>
              <p class="text-gray-500">{{ selectedUser.email }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Role</span>
              <span :class="`font-medium ${getRoleClass(selectedUser.role).split(' ').map(c => c.includes('text-') ? c : '').join(' ')}`">
                {{ selectedUser.role }}
              </span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Status</span>
              <span :class="`font-medium ${getStatusClass(selectedUser.status).split(' ').map(c => c.includes('text-') ? c : '').join(' ')}`">
                {{ selectedUser.status }}
              </span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Joined</span>
              <span class="font-medium text-gray-900">{{ selectedUser.joinedAt }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-500">Activity</span>
              <span class="font-medium text-gray-900">
                {{ selectedUser.role === 'employer' ? `${selectedUser.jobsPosted} jobs posted` : 
                   selectedUser.role === 'candidate' ? `${selectedUser.jobsApplied} jobs applied` : 'N/A' }}
              </span>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button @click="toggleUserStatus(selectedUser); closeModal()" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              {{ selectedUser.status === 'active' ? 'Deactivate' : 'Activate' }}
            </button>
            <button @click="deleteUser(selectedUser); closeModal()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
