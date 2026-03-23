/**
 * API Service - Mock API based on Retool API Generator format
 * This service simulates API endpoints for the job board platform
 * 
 * In production, replace mock data with actual API calls
 */

import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ==================== MOCK DATA ====================
// These simulate what would come from Retool API Generator

export const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: {
      id: 1,
      name: "TechCorp Inc.",
      logo: null,
      location: "San Francisco, CA",
      industry: "Technology"
    },
    location: "San Francisco, CA",
    workType: "remote",
    salaryMin: 120000,
    salaryMax: 160000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Vue.js", "React", "TypeScript", "Node.js", "GraphQL"],
    description: "We're looking for a Senior Frontend Developer to join our team...",
    responsibilities: "- Lead frontend development\n- Mentor junior developers\n- Collaborate with design team",
    requirements: "- 5+ years frontend experience\n- Strong Vue.js/React skills\n- Experience with TypeScript",
    category: "programming",
    type: "full-time",
    experienceLevel: "senior",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    status: "active",
    applicationsCount: 12
  },
  {
    id: 2,
    title: "Product Manager",
    company: {
      id: 2,
      name: "InnovateTech",
      logo: null,
      location: "New York, NY",
      industry: "Software"
    },
    location: "New York, NY",
    workType: "hybrid",
    salaryMin: 130000,
    salaryMax: 180000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Product Strategy", "Agile", "User Research", "Analytics", "Roadmapping"],
    description: "Join our product team to drive innovation...",
    responsibilities: "- Define product roadmap\n- Work with engineering teams\n- Conduct user research",
    requirements: "- 3+ years PM experience\n- Strong analytical skills\n- MBA preferred",
    category: "management",
    type: "full-time",
    experienceLevel: "mid",
    postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    status: "active",
    applicationsCount: 8
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: {
      id: 3,
      name: "DesignStudio",
      logo: null,
      location: "Remote",
      industry: "Design"
    },
    location: "Remote",
    workType: "remote",
    salaryMin: 90000,
    salaryMax: 130000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    description: "Create beautiful and intuitive user experiences...",
    responsibilities: "- Design user interfaces\n- Conduct usability tests\n- Create design systems",
    requirements: "- 4+ years UX/UI experience\n- Strong portfolio\n- Figma expertise",
    category: "design",
    type: "full-time",
    experienceLevel: "mid",
    postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    featured: true,
    status: "active",
    applicationsCount: 15
  },
  {
    id: 4,
    title: "Backend Engineer",
    company: {
      id: 4,
      name: "CloudSystems",
      logo: null,
      location: "Austin, TX",
      industry: "Cloud Computing"
    },
    location: "Austin, TX",
    workType: "onsite",
    salaryMin: 110000,
    salaryMax: 150000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    description: "Build scalable backend services...",
    responsibilities: "- Design API endpoints\n- Optimize database queries\n- Implement microservices",
    requirements: "- 3+ years backend experience\n- Python/Django proficiency\n- Cloud experience",
    category: "programming",
    type: "full-time",
    experienceLevel: "mid",
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
    status: "active",
    applicationsCount: 6
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: {
      id: 5,
      name: "InfraTech",
      logo: null,
      location: "Seattle, WA",
      industry: "Infrastructure"
    },
    location: "Seattle, WA",
    workType: "hybrid",
    salaryMin: 140000,
    salaryMax: 190000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Kubernetes", "Docker", "CI/CD", "Terraform", "AWS", "Linux"],
    description: "Manage cloud infrastructure and CI/CD pipelines...",
    responsibilities: "- Maintain Kubernetes clusters\n- Build CI/CD pipelines\n- Infrastructure as Code",
    requirements: "- 4+ years DevOps experience\n- Strong Kubernetes knowledge\n- AWS certification preferred",
    category: "programming",
    type: "full-time",
    experienceLevel: "senior",
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
    status: "active",
    applicationsCount: 9
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: {
      id: 6,
      name: "GrowthLabs",
      logo: null,
      location: "Los Angeles, CA",
      industry: "Marketing"
    },
    location: "Los Angeles, CA",
    workType: "onsite",
    salaryMin: 80000,
    salaryMax: 120000,
    salaryPeriod: "yearly",
    salaryCurrency: "USD",
    skills: ["Digital Marketing", "SEO", "Analytics", "Content Strategy", "Social Media"],
    description: "Lead marketing campaigns and brand strategy...",
    responsibilities: "- Develop marketing strategy\n- Manage campaigns\n- Analyze performance metrics",
    requirements: "- 5+ years marketing experience\n- Strong analytical skills\n- Experience with B2B marketing",
    category: "marketing",
    type: "full-time",
    experienceLevel: "senior",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    featured: false,
    status: "active",
    applicationsCount: 11
  }
]

export const mockCategories = [
  { id: 1, name: "Programming", slug: "programming", jobCount: 2450, icon: "code" },
  { id: 2, name: "Management", slug: "management", jobCount: 1230, icon: "briefcase" },
  { id: 3, name: "Design", slug: "design", jobCount: 890, icon: "palette" },
  { id: 4, name: "Marketing", slug: "marketing", jobCount: 1560, icon: "megaphone" },
  { id: 5, name: "Sales", slug: "sales", jobCount: 1120, icon: "chart" },
  { id: 6, name: "Human Resources", slug: "hr", jobCount: 650, icon: "users" },
  { id: 7, name: "Finance", slug: "finance", jobCount: 780, icon: "dollar" },
  { id: 8, name: "Customer Service", slug: "customer-service", jobCount: 920, icon: "headset" }
]

export const mockCompanies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    tagline: "Building the future of technology",
    location: "San Francisco, CA",
    industry: "Technology",
    jobCount: 45,
    rating: 4.8,
    isHiring: true,
    openJobs: ["Frontend Developer", "Backend Engineer", "DevOps"]
  },
  {
    id: 2,
    name: "InnovateTech",
    tagline: "Innovation starts here",
    location: "New York, NY",
    industry: "Software",
    jobCount: 32,
    rating: 4.7,
    isHiring: true,
    openJobs: ["Product Manager", "Data Scientist", "UX Designer"]
  },
  {
    id: 3,
    name: "CloudSystems",
    tagline: "Cloud solutions for everyone",
    location: "Austin, TX",
    industry: "Cloud Computing",
    jobCount: 28,
    rating: 4.6,
    isHiring: true,
    openJobs: ["Cloud Architect", "Security Engineer", "Python Developer"]
  },
  {
    id: 4,
    name: "DesignStudio",
    tagline: "Design that inspires",
    location: "Remote",
    industry: "Design",
    jobCount: 18,
    rating: 4.9,
    isHiring: false,
    openJobs: ["UI/UX Designer", "Graphic Designer"]
  },
  {
    id: 5,
    name: "GrowthLabs",
    tagline: "Data-driven marketing",
    location: "Los Angeles, CA",
    industry: "Marketing",
    jobCount: 22,
    rating: 4.5,
    isHiring: true,
    openJobs: ["Marketing Manager", "SEO Specialist", "Content Writer"]
  },
  {
    id: 6,
    name: "FinTech Pro",
    tagline: "Revolutionizing finance",
    location: "Chicago, IL",
    industry: "Finance",
    jobCount: 15,
    rating: 4.7,
    isHiring: true,
    openJobs: ["Financial Analyst", "Backend Developer"]
  }
]

// ==================== API METHODS ====================

/**
 * Fetch all jobs with optional filters
 * @param {Object} params - Query parameters (keyword, location, category, etc.)
 * @returns {Promise}
 */
export const fetchJobs = async (params = {}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let jobs = [...mockJobs]
  
  // Apply filters
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    jobs = jobs.filter(job => 
      job.title.toLowerCase().includes(keyword) ||
      job.description.toLowerCase().includes(keyword) ||
      job.skills.some(skill => skill.toLowerCase().includes(keyword))
    )
  }
  
  if (params.location) {
    const location = params.location.toLowerCase()
    jobs = jobs.filter(job => 
      job.location.toLowerCase().includes(location) ||
      job.workType === location
    )
  }
  
  if (params.category) {
    jobs = jobs.filter(job => job.category === params.category)
  }
  
  if (params.workType) {
    jobs = jobs.filter(job => job.workType === params.workType)
  }
  
  if (params.experienceLevel) {
    jobs = jobs.filter(job => job.experienceLevel === params.experienceLevel)
  }
  
  // Featured jobs first
  jobs.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  
  return { data: jobs, total: jobs.length }
}

/**
 * Fetch single job by ID
 * @param {number} id - Job ID
 * @returns {Promise}
 */
export const fetchJobById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const job = mockJobs.find(j => j.id === parseInt(id))
  return { data: job }
}

/**
 * Fetch featured jobs
 * @returns {Promise}
 */
export const fetchFeaturedJobs = async () => {
  await new Promise(resolve => setTimeout(resolve, 400))
  const featured = mockJobs.filter(job => job.featured)
  return { data: featured }
}

/**
 * Fetch all categories
 * @returns {Promise}
 */
export const fetchCategories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return { data: mockCategories }
}

/**
 * Fetch companies
 * @returns {Promise}
 */
export const fetchCompanies = async () => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return { data: mockCompanies }
}

/**
 * Submit job application
 * @param {Object} applicationData - Application form data
 * @returns {Promise}
 */
export const submitApplication = async (applicationData) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  // In production: return await api.post('/applications', applicationData)
  return { 
    data: { 
      id: Math.random().toString(36).substr(2, 9),
      ...applicationData,
      status: 'pending',
      createdAt: new Date().toISOString()
    } 
  }
}

/**
 * User authentication
 * @param {Object} credentials - Email and password
 * @returns {Promise}
 */
export const login = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  // Mock login - in production use real API
  return {
    data: {
      user: {
        id: 1,
        name: "John Doe",
        email: credentials.email,
        role: "candidate"
      },
      token: "mock-jwt-token-" + Date.now()
    }
  }
}

/**
 * User registration
 * @param {Object} userData - Registration form data
 * @returns {Promise}
 */
export const register = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return {
    data: {
      user: {
        id: Math.random(),
        ...userData
      },
      token: "mock-jwt-token-" + Date.now()
    }
  }
}
