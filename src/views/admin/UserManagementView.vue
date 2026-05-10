<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { adminApi, apiErrorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const authStore = useAuthStore()
const toast = useToast()
const { confirmDialog } = useConfirmDialog()

const users = ref([])
const isLoading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const roleFilter = ref('')
const meta = ref({ current_page: 1, last_page: 1, total: 0 })

const filteredUsers = computed(() => users.value)

const getRoleClass = (role) => ({
  employer: 'bg-blue-100 text-blue-700',
  candidate: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700',
})[role] || 'bg-gray-100 text-gray-700'

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')

async function load(page = 1) {
  isLoading.value = true
  error.value = null
  try {
    const res = await adminApi.users({
      role: roleFilter.value || undefined,
      search: searchQuery.value || undefined,
      page,
      per_page: 20,
    })
    users.value = res.data || []
    meta.value = {
      current_page: res.current_page ?? 1,
      last_page: res.last_page ?? 1,
      total: res.total ?? users.value.length,
    }
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load users.')
  } finally {
    isLoading.value = false
  }
}

let debounceId = null
watch(searchQuery, () => {
  clearTimeout(debounceId)
  debounceId = setTimeout(() => load(1), 300)
})
watch(roleFilter, () => load(1))

const deleteUser = async (user) => {
  if (user.id === authStore.user?.id) {
    toast.warning('You cannot delete yourself.')
    return
  }
  const confirmed = await confirmDialog({
    title: 'Delete user',
    message: `Delete ${user.name}? This will cascade-delete their jobs and applications.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await adminApi.deleteUser(user.id)
    users.value = users.value.filter((u) => u.id !== user.id)
    toast.success('User deleted.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to delete user.'))
  }
}

const changeRole = async (user, role) => {
  if (!role || role === user.role) return
  try {
    await adminApi.updateUserRole(user.id, role)
    user.role = role
    toast.success(`Role updated to ${role}.`)
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to update role.'))
  }
}

onMounted(() => load(1))
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-sm text-gray-500">Manage platform users and roles</p>
        </div>
        <span class="text-sm text-gray-500">{{ meta.total }} total users</span>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>

      <div class="mt-6 flex flex-col md:flex-row gap-4">
        <input v-model="searchQuery" type="text" placeholder="Search by name, email, or company…"
               class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <select v-model="roleFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All roles</option>
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div class="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                  <p v-if="user.company_name || user.organization" class="text-xs text-gray-400">{{ user.company_name || user.organization }}</p>
                </td>
                <td class="px-6 py-4">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getRoleClass(user.role)}`">{{ user.role }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <p v-if="user.role === 'employer'">{{ user.jobs_count ?? 0 }} jobs</p>
                  <p v-else-if="user.role === 'candidate'">{{ user.applications_count ?? 0 }} applications</p>
                  <p v-else>—</p>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex items-center gap-2">
                    <select :value="user.role" @change="(e) => changeRole(user, e.target.value)"
                            class="px-2 py-1 border border-gray-300 rounded-lg text-sm">
                      <option value="candidate">Candidate</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button @click="deleteUser(user)" class="text-sm text-red-600 hover:text-red-700">Delete</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoading && filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-gray-400">No users match.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="meta.last_page > 1" class="mt-4 flex items-center justify-end gap-2">
        <button @click="load(meta.current_page - 1)" :disabled="meta.current_page <= 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Prev</button>
        <span class="text-sm text-gray-600">Page {{ meta.current_page }} / {{ meta.last_page }}</span>
        <button @click="load(meta.current_page + 1)" :disabled="meta.current_page >= meta.last_page"
                class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.user-management {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
