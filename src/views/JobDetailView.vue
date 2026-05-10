

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '../stores/jobStore';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applicationStore';
import { useToast } from 'vue-toastification';

import Navbar from '../components/homePageComponents/navbar.vue';
import Footer from '../components/homePageComponents/footer.vue';
import JobHero from '../components/jobPageComponents/JobHero.vue';
import JobTabs from '../components/jobPageComponents/JobTabs.vue';
import JobDescription from '../components/jobPageComponents/JobDescription.vue';
import JobResponsibilities from '../components/jobPageComponents/JobResponsibilities.vue';
import JobRequirements from '../components/jobPageComponents/JobRequirements.vue';
import JobBenefits from '../components/jobPageComponents/JobBenefits.vue';
import ApplyCard from '../components/jobPageComponents/ApplyCard.vue';
import JobOverview from '../components/jobPageComponents/JobOverview.vue';
import JobComments from '../components/jobPageComponents/JobComments.vue';

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();
const authStore = useAuthStore();
const applicationStore = useApplicationStore();
const toast = useToast();

const isLoading = ref(true);
const error = ref(null);
const raw = ref(null);

function toLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((s) => s.replace(/^[-•]\s*/, '').trim())
      .filter(Boolean);
  }
  return [];
}

const job = computed(() => {
  const j = raw.value;
  if (!j) return {};
  const employer = j.employer || {};
  return {
    id: j.id,
    title: j.title,
    description: j.description,
    company_name: employer.company_name || employer.organization || employer.name || 'Company',
    company_logo: employer.company_logo || j.company_logo || null,
    company_verified: !!employer.company_name,
    employer_id: employer.id || j.employer_id,
    category: j.category?.name || '',
    location: j.location || '',
    work_type: j.work_type || '',
    type: j.work_type || '',
    posted_at: j.created_at || '',
    applications_count: j.applications_count ?? 0,
    experience_level: j.experience_level || '',
    salary_min: Number(j.salary_min) || 0,
    salary_max: Number(j.salary_max) || 0,
    salary_period: 'yearly',
    application_deadline: j.application_deadline || '',
    responsibilities: toLines(j.responsibilities),
    requirements: toLines(j.requirements),
    technologies: (j.technologies || []).map((t) => t.name || t),
    benefits: toLines(j.benefits),
  };
});

const isCandidate = computed(() => authStore.isCandidate);
const isSaved = computed(() => raw.value && applicationStore.isJobSaved(raw.value.id));
const activeTab = ref(0);
const tabs = ['Description', 'Responsibilities', 'Requirements', 'Benefits', 'Comments'];

const fetchJob = async (id) => {
  if (!id) return;
  isLoading.value = true;
  error.value = null;
  try {
    raw.value = await jobStore.fetchJobById(id);
    if (!raw.value) {
      router.replace({ name: 'not-found' });
    }
  } catch (err) {
    error.value = err.message || 'Failed to load job';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => fetchJob(route.params.id));
watch(() => route.params.id, (id) => fetchJob(id));

const handleApply = () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  if (!authStore.isCandidate) {
    toast.info('Only candidates can apply for jobs.');
    return;
  }
  router.push(`/apply/${route.params.id}`);
};

const toggleSave = () => {
  if (!raw.value) return;
  if (applicationStore.isJobSaved(raw.value.id)) {
    applicationStore.unsaveJob(raw.value.id);
    toast.info('Removed from saved jobs.');
  } else {
    applicationStore.saveJob(raw.value);
    toast.success('Job saved.');
  }
};

const scrollToSection = (index) => {
  activeTab.value = index;
  const el = document.getElementById(`section-${index}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

</script>

<template>
  <div class="min-h-screen bg-[#f8fafc]">
    <Navbar />
    
    <div class="pt-24 pb-12">
      <div class="w-full px-4 md:px-8 lg:px-12 xl:px-16 mx-auto">
        
        <!-- Hero Header & Tabs (Full Width Section) -->
        <div class="bg-white border border-slate-200 rounded-[2.5rem] p-8 lg:p-12 shadow-sm mb-16">
          <JobHero 
            :job="job" 
            @apply="handleApply"
            @save="toggleSave"
          />
  
          <div class="mt-10">
            <JobTabs 
              :tabs="tabs" 
              :activeTab="activeTab" 
              @tabClick="scrollToSection"
            />
          </div>
        </div>
        
        <!-- Spacer -->
        <div class="h-4 md:h-8 lg:h-10"></div>
  
        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          <!-- Main Content (Left) -->
          <div class="lg:col-span-8 flex flex-col gap-8">
            <JobDescription :description="job.description" id="section-0" />
            <JobResponsibilities :responsibilities="job.responsibilities" id="section-1" />
            <JobRequirements :requirements="job.requirements" :technologies="job.technologies" id="section-2" />
            <JobBenefits :benefits="job.benefits" id="section-3" />
            <JobComments :jobId="route.params.id" id="section-4" />
          </div>
  
          <!-- Sidebar (Right) -->
          <aside class="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-8">
            <ApplyCard 
              :job="job" 
              :isCandidate="isCandidate" 
              :isSaved="isSaved"
              @apply="handleApply"
              @save="toggleSave"
            />
            <JobOverview :job="job" />
          </aside>
  
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>



<style scoped>

</style>
