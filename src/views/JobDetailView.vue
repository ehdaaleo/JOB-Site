

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useJobStore } from '../stores/jobStore';

// Components
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
  salary_period: '',
  application_deadline: '',
  description: '',
  responsibilities: [],
  requirements: [],
  technologies: [],
  benefits: []
});

const fetchJob = (id) => {
  if (!id) return;
  console.log('Fetching job with ID:', id);
  const foundJob = jobStore.getJobById(id);
  console.log('Found job from store:', foundJob);
  
  if (foundJob) {
    // Map store data to component data
    job.value = {
      ...foundJob,
      company_name: foundJob.company?.name || 'ITI',
      company_logo: foundJob.company?.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEgKtZiO3hayBevddOML4GOzKQYi-qX24gPg&s',
      company_verified: foundJob.company?.verified ?? true,
      work_type: foundJob.workType || '',
      type: foundJob.type || '',
      posted_at: foundJob.postedAt || '',
      applications_count: foundJob.applicationsCount || 0,
      experience_level: foundJob.experienceLevel || '',
      salary_min: foundJob.salaryMin || 0,
      salary_max: foundJob.salaryMax || 0,
      salary_period: foundJob.salaryPeriod || '',
      application_deadline: foundJob.deadline || '',
      // Convert strings to arrays if necessary
      responsibilities: typeof foundJob.responsibilities === 'string' 
        ? foundJob.responsibilities.split('\n').filter(s => s.trim()).map(s => s.replace(/^- /, '')) 
        : (foundJob.responsibilities || []),
      requirements: typeof foundJob.requirements === 'string' 
        ? foundJob.requirements.split('\n').filter(s => s.trim()).map(s => s.replace(/^- /, '')) 
        : (foundJob.requirements || []),
      technologies: foundJob.skills || [],
      benefits: foundJob.benefits || []
    };
  } else {
    console.warn(`Job with ID ${id} not found.`);
    // You could redirect to a 404 page here
    router.push('/404');
  }
};

onMounted(() => {
  fetchJob(route.params.id);
});

// Watch for route param changes 
watch(() => route.params.id, (newId) => {
  fetchJob(newId);
});

const isCandidate = ref(true);
const isSaved = ref(false);
const showModal = ref(false);
const activeTab = ref(0);
const tabs = ['Description', 'Responsibilities', 'Requirements', 'Benefits', 'Comments'];

const handleApply = () => {
  router.push(`/apply/${route.params.id}`);
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
