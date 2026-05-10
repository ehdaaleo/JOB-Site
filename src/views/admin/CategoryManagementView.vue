<script setup>
import { computed, onMounted, ref } from 'vue'
import { apiErrorMessage, categoryApi, jobApi } from '@/services/api'
import { useToast } from 'vue-toastification'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const toast = useToast()
const { confirmDialog } = useConfirmDialog()

const categories = ref([])
const jobsByCategory = ref({})
const isLoading = ref(true)
const isLoadingJobs = ref(false)
const isSaving = ref(false)
const error = ref(null)
const jobsError = ref(null)
const form = ref({ name: '' })
const editingId = ref(null)

const pageTitle = computed(() =>
  editingId.value ? 'Edit Category' : 'Add Category',
)
const submitLabel = computed(() =>
  editingId.value ? 'Save Changes' : 'Create Category',
)

const normalizeCategories = (res) => res?.data || res || []
const normalizeCategory = (res) => res?.data || res?.category || res
const normalizeJobs = (res) => ({
  items: res?.data || res || [],
  total: res?.total ?? res?.meta?.total ?? (res?.data || res || []).length,
})

function categoryJobs(categoryId) {
  return jobsByCategory.value[categoryId]?.items || []
}

function categoryJobsTotal(category) {
  return jobsByCategory.value[category.id]?.total ?? category.jobs_count ?? 0
}

async function loadRelatedJobs(categoryList) {
  isLoadingJobs.value = true
  jobsError.value = null
  try {
    const entries = await Promise.all(
      categoryList.map(async (category) => {
        const res = await jobApi.list({
          category_id: category.id,
          per_page: 100,
        })
        return [category.id, normalizeJobs(res)]
      }),
    )
    jobsByCategory.value = Object.fromEntries(entries)
  } catch (err) {
    jobsError.value = apiErrorMessage(err, 'Failed to load category jobs.')
  } finally {
    isLoadingJobs.value = false
  }
}

async function load() {
  isLoading.value = true
  error.value = null
  jobsError.value = null
  try {
    const res = await categoryApi.list()
    const list = normalizeCategories(res)
    categories.value = list
    await loadRelatedJobs(list)
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load categories.')
  } finally {
    isLoading.value = false
  }
}

function resetForm() {
  form.value = { name: '' }
  editingId.value = null
}

function startEdit(category) {
  editingId.value = category.id
  form.value = { name: category.name || '' }
}

async function saveCategory() {
  const name = form.value.name.trim()
  if (!name) {
    toast.warning('Category name is required.')
    return
  }

  isSaving.value = true
  try {
    if (editingId.value) {
      const res = await categoryApi.update(editingId.value, { name })
      const updated = normalizeCategory(res)
      categories.value = categories.value.map((category) =>
        category.id === editingId.value ? { ...category, ...updated } : category,
      )
      toast.success('Category updated.')
    } else {
      const res = await categoryApi.create({ name })
      const created = normalizeCategory(res)
      if (created?.id) {
        categories.value = [created, ...categories.value]
        jobsByCategory.value = {
          ...jobsByCategory.value,
          [created.id]: { items: [], total: 0 },
        }
      } else {
        await load()
      }
      toast.success('Category created.')
    }
    resetForm()
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to save category.'))
  } finally {
    isSaving.value = false
  }
}

async function deleteCategory(category) {
  const confirmed = await confirmDialog({
    title: 'Delete category',
    message: `Delete "${category.name}"? Jobs in this category may become uncategorized.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return

  try {
    await categoryApi.destroy(category.id)
    categories.value = categories.value.filter((item) => item.id !== category.id)
    const nextJobsByCategory = { ...jobsByCategory.value }
    delete nextJobsByCategory[category.id]
    jobsByCategory.value = nextJobsByCategory
    if (editingId.value === category.id) resetForm()
    toast.success('Category deleted.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to delete category.'))
  }
}

onMounted(load)
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Category Management</h1>
          <p class="text-sm text-gray-500">Create, update, and remove job categories</p>
        </div>
        <RouterLink to="/admin/dashboard" class="text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to dashboard
        </RouterLink>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>
      <div v-if="jobsError" class="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">{{ jobsError }}</div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <form class="bg-white rounded-xl border border-gray-200 p-6 h-fit" @submit.prevent="saveCategory">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-500">The API will generate the slug from the name.</p>
            </div>
            <button
              v-if="editingId"
              type="button"
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="resetForm"
            >
              Cancel
            </button>
          </div>

          <label class="block text-sm font-medium text-gray-700 mb-1" for="category-name">Name</label>
          <input
            id="category-name"
            v-model="form.name"
            type="text"
            placeholder="e.g. Software Development"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >

          <button
            type="submit"
            :disabled="isSaving"
            class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
          >
            {{ isSaving ? 'Saving...' : submitLabel }}
          </button>
        </form>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Categories</h2>
            <span class="text-sm text-gray-500">{{ isLoadingJobs ? 'Loading jobs...' : `${categories.length} total` }}</span>
          </div>

          <div v-if="isLoading" class="flex justify-center py-16">
            <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Related Jobs</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ category.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ category.slug || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ categoryJobsTotal(category) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600 min-w-72">
                    <div v-if="isLoadingJobs" class="text-gray-400">Loading...</div>
                    <div v-else-if="categoryJobs(category.id).length" class="flex flex-wrap gap-2">
                      <RouterLink
                        v-for="job in categoryJobs(category.id).slice(0, 4)"
                        :key="job.id"
                        :to="`/jobs/${job.id}`"
                        class="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs hover:bg-blue-50 hover:text-blue-700"
                      >
                        {{ job.title }}
                      </RouterLink>
                      <span v-if="categoryJobsTotal(category) > 4" class="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        +{{ categoryJobsTotal(category) - 4 }} more
                      </span>
                    </div>
                    <span v-else class="text-gray-400">No related jobs</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="inline-flex items-center gap-3">
                      <button class="text-sm text-blue-600 hover:text-blue-700" @click="startEdit(category)">Edit</button>
                      <button class="text-sm text-red-600 hover:text-red-700" @click="deleteCategory(category)">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="categories.length === 0">
                  <td colspan="5" class="px-6 py-12 text-center text-gray-400">No categories yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
