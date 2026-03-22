<script setup>
import { ref, watch } from 'vue'
import JobPostTopBar from '@/components/jobPostComponents/PostTopBar.vue'
import JobPostProgress from '@/components/jobPostComponents/PostProgress.vue'
import JobPostBasics from '@/components/jobPostComponents/PostBasics.vue'
import JobPostDetails from '@/components/jobPostComponents/PostDetails.vue'
import JobPostSkills from '@/components/jobPostComponents/PostSkills.vue'
import JobPostReview from '@/components/jobPostComponents/PostReview.vue'
import JobPostLivePreview from '@/components/jobPostComponents/PostLivePreview.vue'
import JobPostFooter from '@/components/jobPostComponents/PostFooter.vue'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const currentStep = ref(0)
const steps = ref([
  { label: 'Basics' },
  { label: 'Details' },
  { label: 'Skills' },
  { label: 'Review' }
])

const employer = ref({
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEgKtZiO3hayBevddOML4GOzKQYi-qX24gPg&s',
  name: 'ITI',
  email: 'iti_menya@iti.com',
  location: 'Menya, Egypt',
  verified: true
})

const categories = ref([
  { id: 1, name: 'Software Development' },
  { id: 2, name: 'Design & Creative' },
  { id: 3, name: 'Marketing & SEO' },
  { id: 4, name: 'Sales & Communication' },
  { id: 5, name: 'Finance & Accounting' },
  { id: 6, name: 'HR & Recruiting' },
  { id: 7, name: 'Customer Support' },
  { id: 8, name: 'Other' }
])

const form = ref({
  title: '',
  category_id: '',
  work_type: '',
  location: '',
  application_deadline: '',
  experience_level: '',
  description: '',
  responsibilities: [''],
  requirements: [''],
  benefits: [''],
  salary_min: null,
  salary_max: null,
  technologies: []
})

const getCategoryName = (id) => {
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : 'Unknown'
}

const errors = ref({})

//handle appearing errors when user type in the form
watch(form, (newVal) => {
  // If there are no errors, nothing to clear
  if (Object.keys(errors.value).length === 0) return

  const updatedErrors = { ...errors.value }
  let hasChanges = false

  Object.keys(updatedErrors).forEach(key => {
    let shouldClear = false
    
    if (key === 'responsibilities' || key === 'requirements') {
      if (newVal[key].some(item => item && item.trim() !== '')) {
        shouldClear = true
      }
    } else if (key === 'salary_max') {
      if (newVal.salary_max && (!newVal.salary_min || newVal.salary_max >= newVal.salary_min)) {
        shouldClear = true
      }
    } else if (key === 'salary_min') {
      if (newVal.salary_min) {
        shouldClear = true
      }
    } else if (key === 'technologies') {
      if (newVal.technologies.length > 0) {
        shouldClear = true
      }
    } else {
      const val = newVal[key]
      if (val !== undefined && val !== null && (typeof val !== 'string' || val.trim() !== '')) {
        shouldClear = true
      }
    }

    if (shouldClear) {
      delete updatedErrors[key]
      hasChanges = true
    }
  })

  if (hasChanges) {
    errors.value = updatedErrors
  }
}, { deep: true })

const validateStep = (step) => {
  errors.value = {}
  let isValid = true

  if (step === 0) {
    if (!form.value.title?.trim()) { errors.value.title = 'Job title is required'; isValid = false }
    if (!form.value.category_id) { errors.value.category_id = 'Category is required'; isValid = false }
    if (!form.value.work_type) { errors.value.work_type = 'Work type is required'; isValid = false }
    if (!form.value.location?.trim()) { errors.value.location = 'Location is required'; isValid = false }
  } else if (step === 1) {
    if (!form.value.description?.trim()) { errors.value.description = 'Description is required'; isValid = false }
    
    const validResps = form.value.responsibilities.filter(r => r.trim() !== '')
    if (validResps.length === 0) { errors.value.responsibilities = 'At least one responsibility is required'; isValid = false }
    
    const validReqs = form.value.requirements.filter(r => r.trim() !== '')
    if (validReqs.length === 0) { errors.value.requirements = 'At least one requirement is required'; isValid = false }
  } else if (step === 2) {
    if (!form.value.salary_min) { errors.value.salary_min = 'Min salary is required'; isValid = false }
    if (!form.value.salary_max) { errors.value.salary_max = 'Max salary is required'; isValid = false }
    else if (form.value.salary_min > form.value.salary_max) { errors.value.salary_max = 'Max salary must be greater than min salary'; isValid = false }
    
    if (form.value.technologies.length === 0) { errors.value.technologies = 'At least one technology is required'; isValid = false }
  }

  return isValid
}

import { useJobStore } from '@/stores/jobStore'

const jobStore = useJobStore()

const handleNext = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < steps.value.length - 1) {
      currentStep.value++
    }
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleStepClick = (index) => {
  if (index < currentStep.value) {
    currentStep.value = index
  }
}

const submitting = ref(false)
const submitted = ref(false)

const submitJob = () => {
  if (!validateStep(currentStep.value)) return;
  submitting.value = true
  
  // Actually store the job data
  setTimeout(() => {
    // Map work_type to descriptive labels
    const workTypeMap = {
      'remote': 'Remote',
      'on-site': 'On-site',
      'hybrid': 'Hybrid'
    }

    // Capitalize location
    const formattedLocation = form.value.location 
      ? form.value.location.split(',').map(part => part.trim().charAt(0).toUpperCase() + part.trim().slice(1)).join(', ')
      : '';

    // Map experience level to descriptive labels with years
    const experienceMap = {
      'Entry': 'Entry (0-2 years)',
      'Mid': 'Mid (2-5 years)',
      'Senior': 'Senior (5+ years)',
      'Lead': 'Lead (8+ years)'
    }

    jobStore.addJob({
      ...form.value,
      company_name: employer.value.name,
      company_logo: employer.value.logo,
      company_verified: employer.value.verified,
      category: getCategoryName(form.value.category_id),
      work_type: workTypeMap[form.value.work_type] || form.value.work_type,
      location: formattedLocation,
      experience_level: experienceMap[form.value.experience_level] || form.value.experience_level
    })
    
    submitting.value = false
    submitted.value = true
    setTimeout(() => {
      submitted.value = false
      //will redirect to home page after 3 seconds
      router.push('/')
    }, 3000)
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <Navbar />
    
    <div class="pt-16 pb-12 flex-1 flex flex-col mt-2">
      <div class="pj-wrap flex flex-col text-slate-900 overflow-hidden flex-1 shadow-xl mx-4 md:mx-10 rounded-[2rem] border border-slate-200">
        <!-- Topbar Component -->
        <JobPostTopBar :employer="employer" />
        
        <!-- Progress Tabs Component -->
        <JobPostProgress :currentStep="currentStep" :steps="steps" @updateStep="handleStepClick" />
        
        <!-- Split Layout Area -->
        <div class="flex flex-1 overflow-hidden h-full">
          <!-- Form Side -->
          <div class="flex-1 p-[28px] md:p-[32px] overflow-y-auto bg-white border-r border-slate-200 hide-scrollbar scroll-smooth form-side">
            <transition name="slide-fade" mode="out-in">
              <JobPostBasics v-if="currentStep === 0" v-model="form" :categories="categories" :errors="errors" />
              <JobPostDetails v-else-if="currentStep === 1" v-model="form" :errors="errors" />
              <JobPostSkills v-else-if="currentStep === 2" v-model="form" :errors="errors" />
              <JobPostReview v-else-if="currentStep === 3" v-model="form" :employer="employer" :getCategoryName="getCategoryName" />
            </transition>
          </div>
  
          <!-- Live Preview -->
          <JobPostLivePreview 
            class="hidden md:flex"
            :form="form" 
            :employer="employer" 
            :steps="steps" 
            :currentStep="currentStep" 
            :getCategoryName="getCategoryName" 
          />
        </div>
  
        <!-- Footer Component -->
        <JobPostFooter 
          :currentStep="currentStep" 
          :steps="steps" 
          :submitting="submitting"
          @next="handleNext"
          @back="handleBack"
          @submit="submitJob"
        />
      </div>
    </div>

    <!-- Toast Component -->
    <transition name="toast">
      <div v-if="submitted" class="fixed bottom-[20px] right-[20px] bg-green-50 border border-green-200 text-green-800 px-[18px] py-[11px] rounded-[10px] text-[13px] font-medium z-[999] shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-[6px]">
        ✓ Job posted! Pending admin approval.
      </div>
    </transition>

    <Footer />
  </div>
</template>

<style scoped>

.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.25s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-20px); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }

.hide-scrollbar::-webkit-scrollbar { width: 4px; }
.hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>
