import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useJobStore } from './jobStore'

export const useApplicationStore = defineStore('applications', () => {
  const jobStore = useJobStore()
  
  const applications = ref([
    { 
      id: 1, 
      jobId: 1,
      job: 'Senior Frontend Developer', 
      company: 'TechCorp', 
      location: 'San Francisco, CA', 
      type: 'Remote', 
      salary: '$120k - $160k', 
      status: 'interviewing', 
      date: '2024-01-10', 
      coverLetter: 'I am excited to apply for this position because...' 
    },
    { 
      id: 2, 
      jobId: 2,
      job: 'Backend Engineer', 
      company: 'InnovateTech', 
      location: 'New York, NY', 
      type: 'Hybrid', 
      salary: '$130k - $170k', 
      status: 'pending', 
      date: '2024-01-08', 
      coverLetter: 'With my experience in backend development...' 
    },
    { 
      id: 3, 
      jobId: 3,
      job: 'Product Manager', 
      company: 'CloudSystems', 
      location: 'Austin, TX', 
      type: 'On-site', 
      salary: '$110k - $150k', 
      status: 'rejected', 
      date: '2024-01-05', 
      coverLetter: 'I am passionate about product management...' 
    },
  ])

  const savedJobs = ref([
    { id: 1, jobId: 1, job: 'Senior Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', type: 'Remote', salary: '$120k - $160k', postedAt: '2024-01-10', description: 'We are looking for a Senior Frontend Developer...' },
    { id: 2, jobId: 2, job: 'Backend Engineer', company: 'InnovateTech', location: 'New York, NY', type: 'Hybrid', salary: '$130k - $170k', postedAt: '2024-01-08', description: 'Join our backend team to build scalable...' },
  ])

  // Getters
  const myApplications = computed(() => applications.value)
  const mySavedJobs = computed(() => savedJobs.value)
  
  const applicationsByStatus = computed(() => {
    return {
      pending: applications.value.filter(a => a.status === 'pending'),
      interviewing: applications.value.filter(a => a.status === 'interviewing'),
      accepted: applications.value.filter(a => a.status === 'accepted'),
      rejected: applications.value.filter(a => a.status === 'rejected'),
    }
  })

  // Actions
  const applyToJob = (jobId) => {
    const job = jobStore.getJobById(jobId)
    if (!job) return null
    
    const newApp = {
      id: applications.value.length + 1,
      jobId: job.id,
      job: job.title,
      company: job.company.name,
      location: job.location,
      type: job.workType,
      salary: `$${job.salaryMin/1000}K - $${job.salaryMax/1000}K`,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      coverLetter: 'I am interested in this position...'
    }
    applications.value.push(newApp)
    return newApp
  }

  const withdrawApplication = (appId) => {
    const index = applications.value.findIndex(a => a.id === appId)
    if (index > -1) {
      applications.value.splice(index, 1)
    }
  }

  const saveJob = (jobId) => {
    const job = jobStore.getJobById(jobId)
    if (!job || savedJobs.value.find(s => s.jobId === jobId)) return
    
    savedJobs.value.push({
      id: savedJobs.value.length + 1,
      jobId: job.id,
      job: job.title,
      company: job.company.name,
      location: job.location,
      type: job.workType,
      salary: `$${job.salaryMin/1000}K - $${job.salaryMax/1000}K`,
      postedAt: new Date().toISOString().split('T')[0],
      description: job.description
    })
  }

  const unsaveJob = (jobId) => {
    const index = savedJobs.value.findIndex(s => s.jobId === jobId)
    if (index > -1) {
      savedJobs.value.splice(index, 1)
    }
  }

  const isJobSaved = (jobId) => {
    return savedJobs.value.some(s => s.jobId === jobId)
  }

  return {
    applications,
    savedJobs,
    myApplications,
    mySavedJobs,
    applicationsByStatus,
    applyToJob,
    withdrawApplication,
    saveJob,
    unsaveJob,
    isJobSaved
  }
})
