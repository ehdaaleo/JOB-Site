<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '../stores/jobStore';

// Components
import JobHero from '../components/jobPageComponents/JobHero.vue';
import JobTabs from '../components/jobPageComponents/JobTabs.vue';
import JobDescription from '../components/jobPageComponents/JobDescription.vue';
import JobResponsibilities from '../components/jobPageComponents/JobResponsibilities.vue';
import JobRequirements from '../components/jobPageComponents/JobRequirements.vue';
import JobBenefits from '../components/jobPageComponents/JobBenefits.vue';
import ApplyCard from '../components/jobPageComponents/ApplyCard.vue';
import JobOverview from '../components/jobPageComponents/JobOverview.vue';


const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

// get job with id
const job = ref({
  title: '',
  company_name: 'ITI',
  company_logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEgKtZiO3hayBevddOML4GOzKQYi-qX24gPg&s', 
  company_verified: true,
  category: '',
  location: '',
  work_type: '',
  posted_at: '',
  applications_count: 0,
  experience_level: '',
  salary_min: 0,
  salary_max: 0,
  application_deadline: '',
  description: '',
  responsibilities: [],
  requirements: [],
  technologies: [],
  benefits: []
});

onMounted(() => {
  const jobId = route.params.id;
  if (!jobId) return;

  const foundJob = jobStore.jobs.find(j => j.id.toString() === jobId.toString());
  
  if (foundJob) {
    job.value = { ...foundJob };
  }
  //  else {
  //  //will redirect to 404 page
  // }
});

const isCandidate = ref(true);
const isSaved = ref(false);
const showModal = ref(false);
const activeTab = ref(0);
const tabs = ['Description', 'Responsibilities', 'Requirements', 'Benefits'];

const handleApply = () => {
  showModal.value = true;
};

const toggleSave = () => {
  isSaved.value = !isSaved.value;
};

const scrollToSection = (index) => {
  activeTab.value = index;
  const el = document.getElementById(`section-${index}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const goToApply = () => {
  if (isCandidate.value) {
    alert('Redirecting to application form...');
  } else {
    router.push('/login');
  }
  showModal.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] py-6 md:py-8">
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
        </div>

        <!-- Sidebar (Right) -->
        <aside class="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-8">
          <ApplyCard 
            :job="job" 
            :isCandidate="isCandidate" 
            :isSaved="isSaved"
            :applicantAvatars="applicantAvatars"
            @apply="handleApply"
            @save="toggleSave"
          />
          <JobOverview :job="job" />
        </aside>

      </div>
    </div>

  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

body {
  font-family: 'DM Sans', sans-serif;
  color: #0f172a;
}
</style>
