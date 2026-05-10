<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../../stores/profileStore'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'vue-toastification'
import NavBar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const toast = useToast()

const isEditing = ref(false)
const isSaving = ref(false)
const newSkill = ref('')
const resumeFile = ref(null)
const pictureFile = ref(null)

const editForm = ref({
  title: '',
  location: '',
  phone: '',
  website: '',
  linkedin_profile: '',
  github_profile: '',
  bio: '',
  skills: [],
  experience: [],
  education: [],
})

const profile = computed(() => profileStore.profile)
const user = computed(() => authStore.user)
const isOwner = computed(() => true) // /profile always returns the current user's profile

const fullName = computed(() => user.value?.name || 'Your name')
const email = computed(() => user.value?.email || '')

const startEdit = () => {
  if (!profile.value) return
  editForm.value = {
    title: profile.value.title || '',
    location: profile.value.location || '',
    phone: profile.value.phone || '',
    website: profile.value.website || '',
    linkedin_profile: profile.value.linkedin_profile || '',
    github_profile: profile.value.github_profile || '',
    bio: profile.value.bio || '',
    skills: [...(profile.value.skills || [])],
    experience: [...(profile.value.experience || [])],
    education: [...(profile.value.education || [])],
  }
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  resumeFile.value = null
  pictureFile.value = null
  newSkill.value = ''
}

const addSkill = () => {
  const s = newSkill.value.trim()
  if (!s) return
  if (!editForm.value.skills.includes(s)) editForm.value.skills.push(s)
  newSkill.value = ''
}

const removeSkill = (skill) => {
  editForm.value.skills = editForm.value.skills.filter((s) => s !== skill)
}

const addExperience = () => {
  editForm.value.experience.push({ title: '', company: '', period: '', description: '' })
}
const removeExperience = (idx) => {
  editForm.value.experience.splice(idx, 1)
}
const addEducation = () => {
  editForm.value.education.push({ degree: '', school: '', year: '' })
}
const removeEducation = (idx) => {
  editForm.value.education.splice(idx, 1)
}

const onResumeChange = (e) => {
  resumeFile.value = e.target.files?.[0] || null
}
const onPictureChange = (e) => {
  pictureFile.value = e.target.files?.[0] || null
}

const save = async () => {
  isSaving.value = true
  try {
    if (resumeFile.value || pictureFile.value) {
      await profileStore.uploadFiles({
        ...editForm.value,
        resume: resumeFile.value,
        profilePicture: pictureFile.value,
      })
    } else {
      await profileStore.updateProfile(editForm.value)
    }
    toast.success('Profile saved.')
    isEditing.value = false
    resumeFile.value = null
    pictureFile.value = null
  } catch {
    toast.error(profileStore.error || 'Failed to save profile.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => profileStore.fetchProfile())
</script>

<template>
  <NavBar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
          <p class="text-sm text-gray-500">Manage your profile information</p>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="!isEditing" @click="startEdit" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm">
            Edit Profile
          </button>
          <template v-else>
            <button @click="cancelEdit" :disabled="isSaving" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold text-sm">
              Cancel
            </button>
            <button @click="save" :disabled="isSaving" class="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-sm">
              {{ isSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </template>
        </div>
      </div>

      <div v-if="profileStore.isLoading && !profile" class="text-center py-16 text-gray-500">Loading profile…</div>

      <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold">
                <img v-if="profile?.profile_picture" :src="profile.profile_picture" :alt="fullName" class="w-full h-full object-cover" />
                <span v-else>{{ fullName.charAt(0) }}</span>
              </div>
              <h2 class="text-xl font-semibold text-gray-900 mt-3">{{ fullName }}</h2>
              <p class="text-gray-500">{{ profile?.title || user?.role || '' }}</p>
            </div>

            <div class="space-y-3 text-sm">
              <div>📧 {{ email }}</div>
              <div v-if="!isEditing">
                <div v-if="profile?.phone">📞 {{ profile.phone }}</div>
                <div v-if="profile?.location">📍 {{ profile.location }}</div>
                <div v-if="profile?.linkedin_profile">
                  <a :href="profile.linkedin_profile" target="_blank" class="text-blue-600 hover:underline">LinkedIn</a>
                </div>
                <div v-if="profile?.github_profile">
                  <a :href="profile.github_profile" target="_blank" class="text-blue-600 hover:underline">GitHub</a>
                </div>
                <div v-if="profile?.website">
                  <a :href="profile.website" target="_blank" class="text-blue-600 hover:underline">Website</a>
                </div>
              </div>
              <template v-else>
                <input v-model="editForm.title" placeholder="Job title (e.g. Senior Developer)" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="editForm.phone" placeholder="Phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="editForm.location" placeholder="Location" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="editForm.linkedin_profile" placeholder="LinkedIn URL" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="editForm.github_profile" placeholder="GitHub URL" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="editForm.website" placeholder="Website" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              </template>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-3">Resume</h3>
              <div v-if="!isEditing">
                <span v-if="profile?.resume" class="text-sm text-gray-600">{{ profile.resume }}</span>
                <span v-else class="text-sm text-gray-400">No resume uploaded</span>
              </div>
              <div v-else class="space-y-2">
                <label class="text-sm text-gray-600 block">Upload resume (PDF/DOC, max 10 MB)</label>
                <input type="file" accept=".pdf,.doc,.docx" @change="onResumeChange" class="text-sm" />
                <label class="text-sm text-gray-600 block mt-3">Profile picture (max 2 MB)</label>
                <input type="file" accept="image/*" @change="onPictureChange" class="text-sm" />
              </div>
            </div>
          </div>
        </div>

        <!-- Main column -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Bio</h3>
            <p v-if="!isEditing" class="text-gray-600 whitespace-pre-line">{{ profile?.bio || 'No bio yet.' }}</p>
            <textarea v-else v-model="editForm.bio" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Skills</h3>
            <div v-if="!isEditing" class="flex flex-wrap gap-2">
              <span v-for="skill in profile?.skills || []" :key="skill" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{{ skill }}</span>
              <span v-if="!profile?.skills?.length" class="text-gray-400 text-sm">No skills added.</span>
            </div>
            <div v-else>
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-for="skill in editForm.skills" :key="skill" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {{ skill }}
                  <button @click="removeSkill(skill)" class="text-blue-400 hover:text-blue-600">×</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="newSkill" type="text" placeholder="Add skill" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg" @keyup.enter="addSkill">
                <button @click="addSkill" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">Experience</h3>
              <button v-if="isEditing" @click="addExperience" class="text-sm text-blue-600 hover:text-blue-700">+ Add</button>
            </div>
            <div v-if="!isEditing" class="space-y-4">
              <div v-for="(exp, idx) in profile?.experience || []" :key="idx" class="border-l-2 border-blue-500 pl-4">
                <h4 class="font-medium text-gray-900">{{ exp.title }}</h4>
                <p class="text-sm text-gray-500">{{ exp.company }}<span v-if="exp.period"> · {{ exp.period }}</span></p>
                <p v-if="exp.description" class="text-sm text-gray-600 mt-1">{{ exp.description }}</p>
              </div>
              <p v-if="!profile?.experience?.length" class="text-gray-400 text-sm">No experience added.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(exp, idx) in editForm.experience" :key="idx" class="border border-gray-200 rounded-lg p-3 space-y-2">
                <input v-model="exp.title" placeholder="Title" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="exp.company" placeholder="Company" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="exp.period" placeholder="Period (e.g. 2021 - Present)" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <textarea v-model="exp.description" placeholder="Description" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                <button @click="removeExperience(idx)" class="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900">Education</h3>
              <button v-if="isEditing" @click="addEducation" class="text-sm text-blue-600 hover:text-blue-700">+ Add</button>
            </div>
            <div v-if="!isEditing" class="space-y-3">
              <div v-for="(edu, idx) in profile?.education || []" :key="idx" class="border-l-2 border-purple-500 pl-4">
                <h4 class="font-medium text-gray-900">{{ edu.degree }}</h4>
                <p class="text-sm text-gray-500">{{ edu.school }}<span v-if="edu.year"> · {{ edu.year }}</span></p>
              </div>
              <p v-if="!profile?.education?.length" class="text-gray-400 text-sm">No education added.</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="(edu, idx) in editForm.education" :key="idx" class="border border-gray-200 rounded-lg p-3 space-y-2">
                <input v-model="edu.degree" placeholder="Degree" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="edu.school" placeholder="School" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <input v-model="edu.year" placeholder="Year" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                <button @click="removeEducation(idx)" class="text-sm text-red-600 hover:text-red-700">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
