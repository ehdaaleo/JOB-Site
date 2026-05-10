<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { commentApi, apiErrorMessage } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const props = defineProps({
  jobId: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const comments = ref([])
const isLoading = ref(false)
const error = ref(null)
const newComment = ref('')
const isPosting = ref(false)

const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUserId = computed(() => authStore.user?.id)
const isAdmin = computed(() => authStore.isAdmin)

const initials = (name) =>
  (name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

async function load() {
  if (!props.jobId) return
  isLoading.value = true
  error.value = null
  try {
    const res = await commentApi.listForJob(props.jobId, { per_page: 50 })
    comments.value = (res.data || []).filter(
      // Only show approved comments OR your own pending comments OR all if admin.
      (c) =>
        c.is_approved ||
        c.user_id === currentUserId.value ||
        isAdmin.value,
    )
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load comments.')
  } finally {
    isLoading.value = false
  }
}

const postComment = async () => {
  if (!isLoggedIn.value) {
    router.push({ name: 'login' })
    return
  }
  const content = newComment.value.trim()
  if (!content) return
  isPosting.value = true
  try {
    const res = await commentApi.add(props.jobId, content)
    const created = res.data || res
    comments.value = [created, ...comments.value]
    newComment.value = ''
    if (!created.is_approved) {
      toast.info('Your comment is awaiting admin approval.')
    }
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to post comment.'))
  } finally {
    isPosting.value = false
  }
}

const deleteComment = async (comment) => {
  if (!confirm('Delete this comment?')) return
  try {
    await commentApi.destroy(props.jobId, comment.id)
    comments.value = comments.value.filter((c) => c.id !== comment.id)
    toast.success('Comment deleted.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to delete comment.'))
  }
}

const approveComment = async (comment) => {
  try {
    const res = await commentApi.approve(comment.id)
    const updated = res.data || res
    const idx = comments.value.findIndex((c) => c.id === comment.id)
    if (idx !== -1) comments.value[idx] = updated
    toast.success('Comment approved.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to approve.'))
  }
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleString() : ''

onMounted(load)
watch(() => props.jobId, load)
</script>

<template>
  <section class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm" id="job-comments">
    <h2 class="text-xl font-semibold text-slate-900 mb-4">Comments</h2>

    <div v-if="isLoggedIn" class="mb-6">
      <textarea v-model="newComment" rows="3" placeholder="Write a comment…" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
      <div class="mt-2 flex justify-end">
        <button @click="postComment" :disabled="isPosting || !newComment.trim()" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm">
          {{ isPosting ? 'Posting…' : 'Post' }}
        </button>
      </div>
    </div>
    <div v-else class="mb-6 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm">
      <RouterLink to="/auth/login" class="font-semibold underline">Sign in</RouterLink>
      to leave a comment.
    </div>

    <div v-if="isLoading" class="text-slate-500">Loading comments…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="comments.length === 0" class="text-slate-500">No comments yet.</div>

    <ul v-else class="space-y-4">
      <li v-for="c in comments" :key="c.id" class="border border-slate-100 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
            {{ initials(c.user?.name) }}
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="font-medium text-slate-900">{{ c.user?.name || 'User' }}</span>
              <span class="text-xs text-slate-400">{{ formatDate(c.created_at) }}</span>
              <span v-if="!c.is_approved" class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">Awaiting approval</span>
            </div>
            <p class="text-slate-700 whitespace-pre-line">{{ c.content }}</p>
            <div class="mt-2 flex gap-3 text-xs">
              <button v-if="c.user_id === currentUserId" @click="deleteComment(c)" class="text-red-600 hover:text-red-700">Delete</button>
              <button v-if="isAdmin && !c.is_approved" @click="approveComment(c)" class="text-green-600 hover:text-green-700">Approve</button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
