<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useJobStore } from '../../stores/jobStore'

const router = useRouter()
const jobStore = useJobStore()

const jobForm = ref({
  title: '',
  company: { id: 1, name: 'TechCorp Inc.', location: 'San Francisco, CA', industry: 'Technology' },
  location: '',
  workType: 'remote',
  salaryMin: '',
  salaryMax: '',
  salaryPeriod: 'yearly',
  description: '',
  requirements: '',
  responsibilities: '',
  category: 'programming',
  type: 'full-time',
  experienceLevel: 'mid',
  skills: []
})

const skillInput = ref('')
const currentStep = ref(1)
const isSubmitting = ref(false)

const addSkill = () => {
  if (skillInput.value.trim() && !jobForm.value.skills.includes(skillInput.value.trim())) {
    jobForm.value.skills.push(skillInput.value.trim())
    skillInput.value = ''
  }
}

const removeSkill = (skill) => {
  jobForm.value.skills = jobForm.value.skills.filter(s => s !== skill)
}

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const submitJob = () => {
  isSubmitting.value = true
  
  const newJob = {
    ...jobForm.value,
    salaryMin: parseInt(jobForm.value.salaryMin) * 1000,
    salaryMax: parseInt(jobForm.value.salaryMax) * 1000,
  }
  
  jobStore.addJob(newJob)
  
  setTimeout(() => {
    isSubmitting.value = false
    alert('Job posted successfully! It will appear on the admin dashboard for approval.')
    router.push('/employer/jobs')
  }, 1000)
}
</script>

<template>
  <div class="post-job-view">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Post a Job</h1>
        <p class="text-sm text-gray-500">Create a new job listing</p>
      </div>
    </div>

    <div class="p-6">
      <!-- Progress Steps -->
      <div class="flex items-center justify-center mb-8">
        <div class="flex items-center">
          <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`">1</div>
          <div :class="`w-20 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`"></div>
          <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`">2</div>
          <div :class="`w-20 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`"></div>
          <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`">3</div>
        </div>
      </div>

      <div class="max-w-2xl mx-auto">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 1" class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input v-model="jobForm.title" type="text" placeholder="e.g. Senior Frontend Developer" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select v-model="jobForm.category" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="programming">Programming</option>
                  <option value="management">Management</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                <select v-model="jobForm.workType" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input v-model="jobForm.location" type="text" placeholder="e.g. San Francisco, CA" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Min Salary (K) *</label>
                <input v-model="jobForm.salaryMin" type="number" placeholder="e.g. 80" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Salary (K) *</label>
                <input v-model="jobForm.salaryMax" type="number" placeholder="e.g. 120" 
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button @click="nextStep" :disabled="!jobForm.title || !jobForm.location" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Next Step
            </button>
          </div>
        </div>

        <!-- Step 2: Details -->
        <div v-if="currentStep === 2" class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Job Details</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea v-model="jobForm.description" rows="4" placeholder="Describe the job role..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Requirements *</label>
              <textarea v-model="jobForm.requirements" rows="4" placeholder="List the job requirements..." 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Skills (press Enter to add)</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span v-for="skill in jobForm.skills" :key="skill" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  {{ skill }}
                  <button @click="removeSkill(skill)" class="text-blue-400 hover:text-blue-600">&times;</button>
                </span>
              </div>
              <input v-model="skillInput" @keyup.enter="addSkill" type="text" placeholder="Add skills..." 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button @click="prevStep" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Previous
            </button>
            <button @click="nextStep" :disabled="!jobForm.description || !jobForm.requirements" 
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              Next Step
            </button>
          </div>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3" class="bg-white rounded-xl border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h2>
          
          <div class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-medium text-gray-900 mb-2">{{ jobForm.title || 'Job Title' }}</h3>
              <p class="text-sm text-gray-600">{{ jobForm.company.name }} • {{ jobForm.location }}</p>
              <div class="flex gap-2 mt-2">
                <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{{ jobForm.workType }}</span>
                <span class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{{ jobForm.category }}</span>
              </div>
              <p class="text-sm font-medium text-green-600 mt-2">${{ jobForm.salaryMin }}K - ${{ jobForm.salaryMax }}K</p>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-1">Description</h4>
              <p class="text-sm text-gray-600">{{ jobForm.description }}</p>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-1">Requirements</h4>
              <p class="text-sm text-gray-600">{{ jobForm.requirements }}</p>
            </div>

            <div>
              <h4 class="font-medium text-gray-900 mb-2">Skills</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in jobForm.skills" :key="skill" class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <button @click="prevStep" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Previous
            </button>
            <button @click="submitJob" :disabled="isSubmitting" 
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50">
              {{ isSubmitting ? 'Submitting...' : 'Submit Job' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.post-job-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
