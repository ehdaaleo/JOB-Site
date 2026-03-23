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
      applicationsCount: 12,
      comments: [
        {
          id: 'c1',
          user: {
            id: 'u2',
            name: 'Issac',
            initials: 'IS',
            avatarColor: '#10b981',
            role: 'Employer'
          },
          time: '2 hours ago',
          content: 'We are very excited to hear from all the applicants! Feel free to ask any questions about the role here.',
          timestamp: Date.now() - 7200000 
        },
        {
          id: 'c2',
          user: {
            id: 'u3',
            name: 'Gerges',
            initials: 'GJ',
            avatarColor: '#3b82f6',
            role: 'Candidate'
          },
          time: '1 hour ago',
          content: 'Is this role strictly onsite or does it offer a hybrid schedule?',
          timestamp: Date.now() - 3600000 
        },
        {
          id: 'c3',
          user: {
            id: 'u4',
            name: 'Ehdaa',
            initials: 'ED',
            avatarColor: '#f59e0b',
            role: 'Candidate'
          },
          time: '30 mins ago',
          content: 'What is the interview process like?',
          timestamp: Date.now() - 1800000
        },
        {
          id: 'c4',
          user: {
            id: 'u5',
            name: 'Abdo tolba',
            initials: 'AT',
            avatarColor: '#6366f1',
            role: 'Candidate'
          },
          time: '10 mins ago',
          content: 'Just submitted my application!',
          timestamp: Date.now() - 600000
        }
      ]
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
      applicationsCount: 8,
      comments: []
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
      applicationsCount: 15,
      comments: []
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
      applicationsCount: 6,
      comments: []
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
      applicationsCount: 9,
      comments: []
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
      applicationsCount: 0,
      comments: []
    }
  ]

  // Initialize from LocalStorage or use Mock Data
  const initializeJobs = () => {
    let loadedJobs = []
    try {
      const saved = localStorage.getItem('jobs')
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsedJobs = JSON.parse(saved)
        if (Array.isArray(parsedJobs)) {
          loadedJobs = parsedJobs
        }
      }
    } catch (e) {
      console.error('Failed to parse jobs from localStorage', e)
    }
//merge mock data with local storage data
    const mergedJobs = [...initialData]
    for (const job of loadedJobs) {
      const idx = mergedJobs.findIndex(j => String(j.id) === String(job.id))
      if (idx !== -1) {
        mergedJobs[idx] = job // LocalStorage version takes priority if modified
      } else {
        mergedJobs.push(job) // Append new jobs
      }
    }
    return mergedJobs
  }

  const jobs = ref(initializeJobs())

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
      applicationsCount: 0,
      comments: []
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
    console.log('getJobById search started for ID:', id, 'Type:', typeof id);
    if (!id) return undefined;
    
    const searchId = String(id).trim();
    let found = jobs.value.find(j => String(j.id).trim() === searchId);
    
    // Fallback mechanism: if somehow state was cleared but the user wants a mock job
    if (!found) {
      console.warn('Job not found in reactive state, checking mock data directly...');
      found = initialData.find(j => String(j.id).trim() === searchId);
    }
    
    if (found) {
      console.log('getJobById found job:', found.title);
    } else {
      console.log('getJobById did NOT find job. Available IDs:', jobs.value.map(j => j.id));
    }
    return found;
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
