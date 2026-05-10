<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminApi, apiErrorMessage, commentApi } from '@/services/api'
import { useToast } from 'vue-toastification'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const toast = useToast()
const { confirmDialog } = useConfirmDialog()

const data = ref(null)
const isLoading = ref(true)
const isLoadingComments = ref(false)
const error = ref(null)
const commentsError = ref(null)
const recentComments = ref([])

const stats = computed(() => {
  const s = data.value?.stats || {}
  return [
    { label: 'Total Users', value: s.total_users ?? 0 },
    { label: 'Total Jobs', value: s.total_jobs ?? 0 },
    { label: 'Pending Jobs', value: s.pending_jobs ?? 0 },
    { label: 'Total Applications', value: s.total_applications ?? 0 },
  ]
})

const recentJobs = computed(() => data.value?.recent_jobs || [])
const recentApplications = computed(() => data.value?.recent_applications || [])
const adminLinks = [
  {
    label: 'Pending Jobs',
    description: 'Review employer job posts',
    to: '/admin/pending-jobs',
  },
  {
    label: 'Users',
    description: 'Manage accounts and roles',
    to: '/admin/users',
  },
  {
    label: 'Categories',
    description: 'Add and edit job categories',
    to: '/admin/categories',
  },
]

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')
const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : '')

const getStatusClass = (status) =>
  ({
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-gray-100 text-gray-700',
    accepted: 'bg-green-100 text-green-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
  })[status] || 'bg-gray-100 text-gray-700'

const getCommentStatusClass = (comment) =>
  comment.is_approved
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700'

const commentJobId = (comment) => {
  if (comment.job_id) return comment.job_id
  if (comment.job?.id) return comment.job.id
  if (typeof comment.job === 'number' || typeof comment.job === 'string') {
    return comment.job
  }
  return null
}

async function loadRecentComments(dashboardData) {
  const dashboardComments = dashboardData?.recent_comments || []
  const normalizedDashboardComments = dashboardComments.map((comment) => ({
      ...comment,
      job_id: commentJobId(comment),
    }))

  if (
    normalizedDashboardComments.length &&
    normalizedDashboardComments.every((comment) => comment.job_id)
  ) {
    recentComments.value = normalizedDashboardComments
    return
  }

  const jobs = dashboardData?.recent_jobs || []
  if (!jobs.length) {
    recentComments.value = []
    return
  }

  isLoadingComments.value = true
  commentsError.value = null
  try {
    const results = await Promise.all(
      jobs.slice(0, 8).map(async (job) => {
        const res = await commentApi.listForJob(job.id, { per_page: 10 })
        return (res.data || []).map((comment) => ({
          ...comment,
          job: comment.job || job,
          job_id: comment.job_id || job.id,
        }))
      }),
    )
    recentComments.value = results
      .flat()
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 10)
  } catch (err) {
    commentsError.value = apiErrorMessage(err, 'Failed to load comments.')
    recentComments.value = []
  } finally {
    isLoadingComments.value = false
  }
}

async function approveComment(comment) {
  try {
    const res = await commentApi.approve(comment.id)
    const updated = res.data || res
    recentComments.value = recentComments.value.map((item) =>
      item.id === comment.id ? { ...item, ...updated, job: item.job } : item,
    )
    toast.success('Comment approved.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to approve comment.'))
  }
}

async function rejectComment(comment) {
  const confirmed = await confirmDialog({
    title: 'Reject comment',
    message: 'Reject this comment? It will be removed.',
    confirmText: 'Reject',
  })
  if (!confirmed) return

  const jobId = commentJobId(comment)
  if (!jobId) {
    toast.error('Cannot reject this comment because its job id is missing.')
    return
  }

  try {
    await commentApi.reject(comment.id, jobId)
    recentComments.value = recentComments.value.filter(
      (item) => item.id !== comment.id,
    )
    toast.success('Comment rejected.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to reject comment.'))
  }
}

onMounted(async () => {
  try {
    const res = await adminApi.dashboard()
    const dashboardData = res.data ?? res
    data.value = dashboardData
    await loadRecentComments(dashboardData)
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load admin dashboard.')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-sm text-gray-500">Manage the job board platform</p>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>
      <div v-if="commentsError" class="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">{{ commentsError }}</div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-gray-200 p-6">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <RouterLink
          v-for="link in adminLinks"
          :key="link.to"
          :to="link.to"
          class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <p class="font-semibold text-gray-900">{{ link.label }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ link.description }}</p>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <RouterLink to="/admin/pending-jobs" class="text-sm text-blue-600 hover:text-blue-700">Pending →</RouterLink>
          </div>
          <div class="p-6">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs text-gray-500 uppercase">
                  <th class="pb-3">Title</th>
                  <th class="pb-3">Employer</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in recentJobs" :key="job.id" class="border-t border-gray-100">
                  <td class="py-3 text-sm font-medium text-gray-900">{{ job.title }}</td>
                  <td class="py-3 text-sm text-gray-500">{{ job.employer?.name }}</td>
                  <td class="py-3">
                    <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(job.status)}`">{{ job.status }}</span>
                  </td>
                  <td class="py-3 text-sm text-gray-500">{{ formatDate(job.created_at) }}</td>
                </tr>
                <tr v-if="!isLoading && recentJobs.length === 0">
                  <td colspan="4" class="py-6 text-center text-gray-400">No jobs yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div class="p-6">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs text-gray-500 uppercase">
                  <th class="pb-3">Candidate</th>
                  <th class="pb-3">Job</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in recentApplications" :key="app.id" class="border-t border-gray-100">
                  <td class="py-3 text-sm font-medium text-gray-900">{{ app.candidate?.name }}</td>
                  <td class="py-3 text-sm text-gray-500">{{ app.job?.title }}</td>
                  <td class="py-3">
                    <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(app.status)}`">{{ app.status }}</span>
                  </td>
                  <td class="py-3 text-sm text-gray-500">{{ formatDate(app.created_at) }}</td>
                </tr>
                <tr v-if="!isLoading && recentApplications.length === 0">
                  <td colspan="4" class="py-6 text-center text-gray-400">No applications yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Recent Comments</h2>
            <p class="text-sm text-gray-500">Latest job comments across recent jobs</p>
          </div>
          <span class="text-sm text-gray-500">{{ recentComments.length }} shown</span>
        </div>

        <div v-if="isLoadingComments" class="flex justify-center py-12">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="comment in recentComments" :key="comment.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-gray-900">{{ comment.user?.name || 'User' }}</p>
                  <p v-if="comment.user?.email" class="text-xs text-gray-500">{{ comment.user.email }}</p>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <RouterLink v-if="comment.job_id" :to="`/jobs/${comment.job_id}`" class="text-blue-600 hover:text-blue-700">
                    {{ comment.job?.title || `Job #${comment.job_id}` }}
                  </RouterLink>
                  <span v-else>{{ comment.job?.title || '-' }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700 max-w-md">
                  <p class="line-clamp-2">{{ comment.content }}</p>
                </td>
                <td class="px-6 py-4">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getCommentStatusClass(comment)}`">
                    {{ comment.is_approved ? 'Approved' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ formatDateTime(comment.created_at) }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="inline-flex items-center gap-3">
                    <button
                      v-if="!comment.is_approved"
                      class="text-sm text-green-600 hover:text-green-700"
                      @click="approveComment(comment)"
                    >
                      Approve
                    </button>
                    <button
                      class="text-sm text-red-600 hover:text-red-700"
                      @click="rejectComment(comment)"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!isLoadingComments && recentComments.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-400">No comments yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
