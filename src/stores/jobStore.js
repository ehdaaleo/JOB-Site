import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useJobStore = defineStore('jobs', () => {
  // Mock Data (Initial state)
  const initialData = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: { id: 1, name: 'TechCorp Inc.', location: 'San Francisco, CA', industry: 'Technology' },
      location: 'San Francisco, CA',
      workType: 'remote',
      salaryMin: 120000,
      salaryMax: 160000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'GraphQL'],
      description: 'We are looking for a Senior Frontend Developer to join our team...',
      responsibilities: '- Lead frontend development\n- Mentor junior developers\n- Collaborate with design team',
      requirements: '- 5+ years frontend experience\n- Strong Vue.js/React skills\n- Experience with TypeScript',
      category: 'programming',
      type: 'full-time',
      experienceLevel: 'senior',
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active', // pending, active, rejected
      applicationsCount: 12
    },
    {
      id: 2,
      title: 'Product Manager',
      company: { id: 2, name: 'InnovateTech', location: 'New York, NY', industry: 'Software' },
      location: 'New York, NY',
      workType: 'hybrid',
      salaryMin: 130000,
      salaryMax: 180000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmapping'],
      description: 'Join our product team to drive innovation...',
      responsibilities: '- Define product roadmap\n- Work with engineering teams\n- Conduct user research',
      requirements: '- 3+ years PM experience\n- Strong analytical skills\n- MBA preferred',
      category: 'management',
      type: 'full-time',
      experienceLevel: 'mid',
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active',
      applicationsCount: 8
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: { id: 3, name: 'DesignStudio', location: 'Remote', industry: 'Design' },
      location: 'Remote',
      workType: 'remote',
      salaryMin: 90000,
      salaryMax: 130000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      description: 'Create beautiful and intuitive user experiences...',
      responsibilities: '- Design user interfaces\n- Conduct usability tests\n- Create design systems',
      requirements: '- 4+ years UX/UI experience\n- Strong portfolio\n- Figma expertise',
      category: 'design',
      type: 'full-time',
      experienceLevel: 'mid',
      postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active',
      applicationsCount: 15
    },
    {
      id: 4,
      title: 'Backend Engineer',
      company: { id: 4, name: 'CloudSystems', location: 'Austin, TX', industry: 'Cloud Computing' },
      location: 'Austin, TX',
      workType: 'onsite',
      salaryMin: 110000,
      salaryMax: 150000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      description: 'Build scalable backend services...',
      responsibilities: '- Design API endpoints\n- Optimize database queries\n- Implement microservices',
      requirements: '- 3+ years backend experience\n- Python/Django proficiency\n- Cloud experience',
      category: 'programming',
      type: 'full-time',
      experienceLevel: 'mid',
      postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'active',
      applicationsCount: 6
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: { id: 5, name: 'InfraTech', location: 'Seattle, WA', industry: 'Infrastructure' },
      location: 'Seattle, WA',
      workType: 'hybrid',
      salaryMin: 140000,
      salaryMax: 190000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'AWS', 'Linux'],
      description: 'Manage cloud infrastructure and CI/CD pipelines...',
      responsibilities: '- Maintain Kubernetes clusters\n- Build CI/CD pipelines\n- Infrastructure as Code',
      requirements: '- 4+ years DevOps experience\n- Strong Kubernetes knowledge\n- AWS certification preferred',
      category: 'programming',
      type: 'full-time',
      experienceLevel: 'senior',
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'active',
      applicationsCount: 9
    },
    {
      id: 6,
      title: 'Marketing Manager',
      company: { id: 6, name: 'GrowthLabs', location: 'Los Angeles, CA', industry: 'Marketing' },
      location: 'Los Angeles, CA',
      workType: 'onsite',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Digital Marketing', 'SEO', 'Analytics', 'Content Strategy', 'Social Media'],
      description: 'Lead marketing campaigns and brand strategy...',
      responsibilities: '- Develop marketing strategy\n- Manage campaigns\n- Analyze performance metrics',
      requirements: '- 5+ years marketing experience\n- Strong analytical skills\n- Experience with B2B marketing',
      category: 'marketing',
      type: 'full-time',
      experienceLevel: 'senior',
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'pending',
      applicationsCount: 0
    }
  ]

  // Initialize from LocalStorage or use Mock Data
  const jobs = ref(JSON.parse(localStorage.getItem('jobs')) || initialData)

  // Watch for changes and save to LocalStorage
  watch(jobs, (newJobs) => {
    localStorage.setItem('jobs', JSON.stringify(newJobs))
  }, { deep: true })

  // Getters
  const activeJobs = computed(() => jobs.value.filter(job => job.status === 'active'))
  const featuredJobs = computed(() => activeJobs.value.filter(job => job.featured))
  const pendingJobs = computed(() => jobs.value.filter(job => job.status === 'pending'))
  const allJobs = computed(() => jobs.value)

  // Actions
  const addJob = (job) => {
    const newJob = {
      ...job,
      id: jobs.value.length + 1,
      postedAt: new Date().toISOString(),
      status: 'pending', // New jobs go to pending
      applicationsCount: 0
    }
    jobs.value.push(newJob)
    return newJob
  }

  const approveJob = (jobId) => {
    const job = jobs.value.find(j => j.id === jobId)
    if (job) {
      job.status = 'active'
      job.featured = true
    }
  }

  const rejectJob = (jobId) => {
    const job = jobs.value.find(j => j.id === jobId)
    if (job) {
      job.status = 'rejected'
    }
  }

  const getJobById = (id) => {
    return jobs.value.find(j => j.id === parseInt(id))
  }

  return {
    jobs,
    activeJobs,
    featuredJobs,
    pendingJobs,
    allJobs,
    addJob,
    approveJob,
    rejectJob,
    getJobById
  }
})
