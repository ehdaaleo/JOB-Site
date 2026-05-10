<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profileStore'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const toast = useToast()

/**
 * The Profile model only stores candidate-style fields; company fields
 * (company_name, company_size, etc.) live on the User model. The Laravel
 * /profile POST endpoint accepts both, so we just send everything.
 */
const form = ref({
  company_name: '',
  company_website: '',
  company_size: '',
  industry: '',
  company_description: '',
  location: '',
  phone: '',
  bio: '',
  organization: '',
  job_title: '',
})

const isSaving = ref(false)
const logoFile = ref(null)

onMounted(async () => {
  const u = authStore.user || {}
  form.value = {
    company_name: u.company_name || '',
    company_website: u.company_website || '',
    company_size: u.company_size || '',
    industry: u.industry || '',
    company_description: u.company_description || '',
    location: u.location || '',
    phone: u.phone || '',
    bio: u.bio || '',
    organization: u.organization || '',
    job_title: u.job_title || '',
  }
  await profileStore.fetchProfile()
})

const onLogoChange = (e) => {
  logoFile.value = e.target.files?.[0] || null
}

const save = async () => {
  isSaving.value = true
  try {
    if (logoFile.value) {
      const fd = new FormData()
      Object.entries(form.value).forEach(([k, v]) => v != null && fd.append(k, v))
      fd.append('company_logo', logoFile.value)
      await profileStore.updateProfile(fd)
    } else {
      await profileStore.updateProfile(form.value)
    }
    await authStore.refresh()
    toast.success('Company settings saved.')
    logoFile.value = null
  } catch {
    toast.error(profileStore.error || 'Failed to save settings.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p class="text-sm text-gray-500">This information appears on your job postings and company page.</p>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company name</label>
          <input v-model="form.company_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input v-model="form.company_website" type="url" placeholder="https://..." class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input v-model="form.industry" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company size</label>
            <input v-model="form.company_size" type="text" placeholder="e.g. 50-100" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input v-model="form.location" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input v-model="form.phone" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea v-model="form.company_description" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg"></textarea>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <p class="text-sm font-medium text-gray-700 mb-2">For individual employers</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="form.organization" type="text" placeholder="Organization" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input v-model="form.job_title" type="text" placeholder="Your job title" class="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company logo</label>
          <input type="file" accept="image/*" @change="onLogoChange" />
        </div>

        <div class="pt-4 flex justify-end">
          <button @click="save" :disabled="isSaving" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60">
            {{ isSaving ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
