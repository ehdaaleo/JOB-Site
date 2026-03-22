
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Components
import JobHero from '../components/jobPageComponents/JobHero.vue';
import JobTabs from '../components/jobPageComponents/JobTabs.vue';
import JobDescription from '../components/jobPageComponents/JobDescription.vue';
import JobResponsibilities from '../components/jobPageComponents/JobResponsibilities.vue';
import JobRequirements from '../components/jobPageComponents/JobRequirements.vue';
import JobBenefits from '../components/jobPageComponents/JobBenefits.vue';
import ApplyCard from '../components/jobPageComponents/ApplyCard.vue';
import JobOverview from '../components/jobPageComponents/JobOverview.vue';


const router = useRouter();

// Mock Data
const job = ref({
  id: 1,
  title: 'Senior Frontend Developer',
  company_name: 'ITI',
  company_logo: '', 
  company_verified: true,
  category: 'Software Engineering',
  category_id: 'software',
  location: 'Remote / Minya, Egypt',
  work_type: 'Full-time',
  posted_at: '2 days ago',
  applications_count: 124,
  experience_level: 'Senior (5+ years)',
  salary_min: 80000,
  salary_max: 120000,
  application_deadline: 'Oct 30, 2024',
  description: '<p>Join our dynamic team as a Senior Frontend Developer. You will be responsible for building high-quality, scalable web applications using Vue.js and modern technologies.</p><p>We value clean code, performance, and exceptional user experiences.</p>',
  responsibilities: [
    'Develop and maintain complex web applications using Vue 3',
    'Collaborate with designers to implement pixel-perfect UIs',
    'Mentor junior developers and conduct code reviews',
    'Optimize applications for maximum speed and scalability'
  ],
  requirements: [
    '5+ years of experience in frontend development',
    'Strong proficiency in JavaScript and Vue.js ecosystem',
    'Experience with state management (Pinia/Vuex)',
    'Solid understanding of CSS/SCSS and responsive design'
  ],
  technologies: ['Vue 3', 'Vite', 'Pinia', 'TypeScript', 'Tailwind', 'Sass'],
  benefits: [
    'Competitive salary and equity options',
    'Flexible working hours and remote options',
    'Annual learning and development budget',
    'Comprehensive health and dental insurance'
  ]
});

const isCandidate = ref(true);
const isSaved = ref(false);
const showModal = ref(false);
const activeTab = ref(0);
const tabs = ['Description', 'Responsibilities', 'Requirements', 'Benefits'];

const applicantAvatars = [
  { initial: 'JD', color: '#3b82f6' },
  { initial: 'AS', color: '#10b981' },
  { initial: 'MK', color: '#f59e0b' },
  { initial: '+', color: '#94a3b8' }
];

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
