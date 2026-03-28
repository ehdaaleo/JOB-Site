/**
 * Chatbot Composable - AI-powered chatbot for job site support
 * Enhanced with intelligent responses and accurate query detection
 */

import { ref, computed } from 'vue'
import axios from 'axios'

export function useChatbot() {
  const messages = ref([])
  const isTyping = ref(false)
  const error = ref(null)
  const isOpen = ref(false)
  const conversationContext = ref({
    lastTopic: null,
    userPreferences: {},
    searchHistory: []
  })

  // API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  /**
   * Add a message to the chat
   */
  const addMessage = (content, sender = 'user', metadata = {}) => {
    messages.value.push({
      id: Date.now(),
      content,
      sender,
      timestamp: new Date().toISOString(),
      ...metadata
    })
  }

  /**
   * Send a message and get AI response
   */
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return

    // Add user message
    addMessage(userMessage, 'user')
    isTyping.value = true
    error.value = null

    try {
      // Process the message and generate response
      const response = await processMessage(userMessage)
      addMessage(response, 'bot')
    } catch (e) {
      error.value = e.message
      addMessage('Sorry, I encountered an error. Please try again.', 'bot')
    } finally {
      isTyping.value = false
    }
  }

  /**
   * Process user message and generate appropriate response
   */
  const processMessage = async (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Update conversation context
    conversationContext.value.searchHistory.push({
      message,
      timestamp: new Date().toISOString()
    })
    
    // Keep only last 10 searches
    if (conversationContext.value.searchHistory.length > 10) {
      conversationContext.value.searchHistory.shift()
    }

    // Greeting - check first as it's most specific
    if (isGreeting(lowerMessage)) {
      return getGreeting()
    }

    // Thank you
    if (isThankYou(lowerMessage)) {
      return getThankYouResponse()
    }

    // Goodbye
    if (isGoodbye(lowerMessage)) {
      return getGoodbyeResponse()
    }

    // Job search queries - more specific detection
    if (isJobSearchQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'job_search'
      return await handleJobSearch(message)
    }

    // Application queries
    if (isApplicationQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'application'
      return await handleApplicationQuery(message)
    }

    // Company queries
    if (isCompanyQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'company'
      return await handleCompanyQuery(message)
    }

    // Salary queries
    if (isSalaryQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'salary'
      return await handleSalaryQuery(message)
    }

    // Interview queries
    if (isInterviewQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'interview'
      return handleInterviewQuery(message)
    }

    // Resume queries
    if (isResumeQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'resume'
      return handleResumeQuery(message)
    }

    // Remote work queries
    if (isRemoteWorkQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'remote'
      return await handleRemoteWorkQuery(message)
    }

    // FAQ queries
    if (isFAQQuery(lowerMessage)) {
      conversationContext.value.lastTopic = 'faq'
      return handleFAQ(message)
    }

    // Follow-up based on context
    if (conversationContext.value.lastTopic) {
      return getFollowUpResponse(conversationContext.value.lastTopic, message)
    }

    // Default response with suggestions
    return getDefaultResponse()
  }

  /**
   * Check if message is a greeting
   */
  const isGreeting = (message) => {
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings']
    return greetings.some(g => message.includes(g))
  }

  /**
   * Check if message is a thank you
   */
  const isThankYou = (message) => {
    const thanks = ['thank', 'thanks', 'appreciate', 'grateful', 'thank you']
    return thanks.some(t => message.includes(t))
  }

  /**
   * Check if message is a goodbye
   */
  const isGoodbye = (message) => {
    const goodbyes = ['bye', 'goodbye', 'see you', 'take care', 'farewell', 'exit', 'quit']
    return goodbyes.some(g => message.includes(g))
  }

  /**
   * Check if message is a job search query
   */
  const isJobSearchQuery = (message) => {
    // More specific job search patterns
    const jobSearchPatterns = [
      /find\s+(a\s+)?job/i,
      /search\s+(for\s+)?jobs?/i,
      /looking\s+for\s+(a\s+)?job/i,
      /show\s+me\s+jobs?/i,
      /what\s+jobs?\s+are\s+available/i,
      /any\s+(job\s+)?openings/i,
      /job\s+search/i,
      /job\s+listings/i,
      /available\s+positions/i,
      /hiring\s+now/i,
      /need\s+(a\s+)?job/i,
      /want\s+(a\s+)?job/i,
      /remote\s+(job|work|position)/i,
      /full[\s-]?time\s+(job|position)/i,
      /part[\s-]?time\s+(job|position)/i,
      /programming\s+(job|position)/i,
      /developer\s+(job|position)/i,
      /design\s+(job|position)/i,
      /marketing\s+(job|position)/i,
      /jobs?\s+in\s+/i,
      /jobs?\s+near\s+/i,
      /jobs?\s+at\s+/i,
      /jobs?\s+for\s+/i,
      /jobs?\s+with\s+/i
    ]

    return jobSearchPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is an application query
   */
  const isApplicationQuery = (message) => {
    const applicationPatterns = [
      /how\s+(do\s+)?i\s+apply/i,
      /apply\s+for\s+(a\s+)?job/i,
      /application\s+(status|process)/i,
      /check\s+(my\s+)?application/i,
      /track\s+(my\s+)?application/i,
      /submit\s+(an?\s+)?application/i,
      /application\s+tips/i,
      /how\s+to\s+apply/i,
      /where\s+(do\s+)?i\s+apply/i
    ]

    return applicationPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is a company query
   */
  const isCompanyQuery = (message) => {
    const companyPatterns = [
      /show\s+me\s+companies/i,
      /what\s+companies/i,
      /which\s+companies/i,
      /companies\s+hiring/i,
      /company\s+information/i,
      /about\s+(the\s+)?company/i,
      /tell\s+me\s+about\s+(the\s+)?company/i,
      /company\s+culture/i,
      /company\s+reviews/i
    ]

    return companyPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is a salary query
   */
  const isSalaryQuery = (message) => {
    const salaryPatterns = [
      /salary\s+(range|information|data)/i,
      /how\s+much\s+(does|do)/i,
      /what\s+(is|are)\s+the\s+salary/i,
      /average\s+salary/i,
      /salary\s+expectations/i,
      /compensation\s+(package|information)/i,
      /pay\s+(range|scale)/i,
      /how\s+much\s+(can|could)\s+i\s+(earn|make)/i
    ]

    return salaryPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is an interview query
   */
  const isInterviewQuery = (message) => {
    const interviewPatterns = [
      /interview\s+(tips|preparation|advice)/i,
      /how\s+to\s+(prepare\s+for\s+)?interview/i,
      /interview\s+questions/i,
      /ace\s+(an?\s+)?interview/i,
      /do\s+well\s+in\s+(an?\s+)?interview/i,
      /what\s+to\s+(expect|wear)\s+(at|to)\s+(an?\s+)?interview/i
    ]

    return interviewPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is a resume query
   */
  const isResumeQuery = (message) => {
    const resumePatterns = [
      /resume\s+(tips|help|writing)/i,
      /how\s+to\s+(write|create|make)\s+(a\s+)?resume/i,
      /cv\s+(tips|help|writing)/i,
      /improve\s+(my\s+)?resume/i,
      /resume\s+(format|template)/i,
      /what\s+(should|to)\s+(put|include)\s+(in|on)\s+(my\s+)?resume/i
    ]

    return resumePatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is a remote work query
   */
  const isRemoteWorkQuery = (message) => {
    const remotePatterns = [
      /remote\s+(job|work|position)/i,
      /work\s+from\s+home/i,
      /wfh\s+(job|position)/i,
      /telecommute/i,
      /virtual\s+(job|position)/i,
      /any\s+remote\s+(jobs?|positions?)/i
    ]

    return remotePatterns.some(pattern => pattern.test(message))
  }

  /**
   * Check if message is a FAQ query
   */
  const isFAQQuery = (message) => {
    const faqPatterns = [
      /how\s+(do|can|could)\s+i/i,
      /what\s+(is|are)\s+the/i,
      /where\s+(do|can|could)\s+i/i,
      /when\s+(do|can|could)\s+i/i,
      /why\s+(do|should)\s+i/i,
      /can\s+you\s+help/i,
      /i\s+need\s+help/i,
      /help\s+me/i,
      /explain/i,
      /tell\s+me\s+about/i
    ]

    return faqPatterns.some(pattern => pattern.test(message))
  }

  /**
   * Handle job search queries with intelligent filtering
   */
  const handleJobSearch = async (message) => {
    try {
      // Extract search parameters from message
      const params = extractSearchParams(message)
      
      // Fetch jobs from API
      const response = await axios.get(`${API_BASE_URL}/jobs`, { params })
      let jobs = response.data

      if (jobs.length === 0) {
        return getNoResultsResponse(message)
      }

      // Randomize and limit results for variety
      jobs = shuffleArray(jobs).slice(0, 5)

      // Format response with varied formatting
      const responseTemplates = [
        () => formatJobResultsStandard(jobs, params),
        () => formatJobResultsDetailed(jobs, params),
        () => formatJobResultsConcise(jobs, params)
      ]
      
      const randomTemplate = responseTemplates[Math.floor(Math.random() * responseTemplates.length)]
      return randomTemplate()
    } catch (e) {
      return "I'm having trouble accessing the job database right now. Please try again later or visit the Jobs page directly."
    }
  }

  /**
   * Format job results - Standard format
   */
  const formatJobResultsStandard = (jobs, params) => {
    let result = `Great news! I found ${jobs.length} job(s) matching your criteria:\n\n`
    jobs.forEach((job, index) => {
      result += `${index + 1}. **${job.title}**\n`
      result += `   🏢 ${job.company?.name || 'Company'}\n`
      result += `   📍 ${job.location} | 💼 ${job.type || 'Full-time'}\n`
      if (job.salaryMin && job.salaryMax) {
        result += `   💰 $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}\n`
      }
      result += `\n`
    })
    result += `Would you like more details about any of these positions?`
    return result
  }

  /**
   * Format job results - Detailed format
   */
  const formatJobResultsDetailed = (jobs, params) => {
    let result = `I've found some excellent opportunities for you!\n\n`
    jobs.forEach((job, index) => {
      result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      result += `🎯 **${job.title}**\n`
      result += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
      result += `🏢 Company: ${job.company?.name || 'Not specified'}\n`
      result += `📍 Location: ${job.location}\n`
      result += `💼 Type: ${job.type || 'Full-time'}\n`
      result += `🏠 Work Style: ${job.workType || 'On-site'}\n`
      if (job.salaryMin && job.salaryMax) {
        result += `💰 Salary: $${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} per year\n`
      }
      if (job.skills && job.skills.length > 0) {
        result += `🛠️ Skills: ${job.skills.slice(0, 3).join(', ')}\n`
      }
      result += `\n`
    })
    result += `Want to know more about any specific role? Just ask!`
    return result
  }

  /**
   * Format job results - Concise format
   */
  const formatJobResultsConcise = (jobs, params) => {
    let result = `Found ${jobs.length} jobs for you:\n\n`
    jobs.forEach((job, index) => {
      result += `• ${job.title} @ ${job.company?.name || 'Company'} (${job.location})\n`
    })
    result += `\nType a number (1-${jobs.length}) for details, or ask me anything else!`
    return result
  }

  /**
   * Extract search parameters from message
   */
  const extractSearchParams = (message) => {
    const params = {}
    const lowerMessage = message.toLowerCase()

    // Extract location
    const locationPatterns = [
      /in\s+([a-zA-Z\s]+?)(?:\s+with|\s+for|\s+and|\s*$)/i,
      /(?:located|based)\s+in\s+([a-zA-Z\s]+)/i,
      /([a-zA-Z]+(?:\s+[a-zA-Z]+)?)\s+(?:jobs?|positions?|roles?)/i
    ]
    
    for (const pattern of locationPatterns) {
      const match = lowerMessage.match(pattern)
      if (match) {
        params.location = match[1].trim()
        break
      }
    }

    // Extract job type
    if (lowerMessage.includes('remote')) params.workType = 'remote'
    if (lowerMessage.includes('hybrid')) params.workType = 'hybrid'
    if (lowerMessage.includes('onsite') || lowerMessage.includes('on-site')) params.workType = 'onsite'
    if (lowerMessage.includes('full-time') || lowerMessage.includes('full time')) params.type = 'full-time'
    if (lowerMessage.includes('part-time') || lowerMessage.includes('part time')) params.type = 'part-time'
    if (lowerMessage.includes('contract')) params.type = 'contract'
    if (lowerMessage.includes('internship') || lowerMessage.includes('intern')) params.type = 'internship'

    // Extract category
    const categoryMap = {
      'programming': ['programming', 'developer', 'engineer', 'coding', 'software'],
      'design': ['design', 'designer', 'ux', 'ui', 'creative'],
      'marketing': ['marketing', 'seo', 'content', 'social media'],
      'management': ['management', 'manager', 'lead', 'director'],
      'sales': ['sales', 'business development', 'account'],
      'hr': ['hr', 'human resources', 'recruiting', 'recruiter'],
      'finance': ['finance', 'accounting', 'financial'],
      'customer-service': ['customer service', 'support', 'helpdesk']
    }

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        params.category = category
        break
      }
    }

    // Extract experience level
    if (lowerMessage.includes('senior') || lowerMessage.includes('sr.')) params.experienceLevel = 'senior'
    if (lowerMessage.includes('junior') || lowerMessage.includes('jr.') || lowerMessage.includes('entry')) params.experienceLevel = 'junior'
    if (lowerMessage.includes('mid') || lowerMessage.includes('intermediate')) params.experienceLevel = 'mid'

    // Extract salary expectations
    const salaryMatch = lowerMessage.match(/(\d+)[k]?\s*(?:salary|pay|compensation)/i)
    if (salaryMatch) {
      params.minSalary = parseInt(salaryMatch[1]) * 1000
    }

    return params
  }

  /**
   * Handle application queries
   */
  const handleApplicationQuery = async (message) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('status') || lowerMessage.includes('track') || lowerMessage.includes('check')) {
      const responses = [
        "To check your application status:\n\n1. Log in to your account\n2. Go to your Dashboard\n3. Click on 'My Applications'\n4. You'll see all your applications with their current status\n\nYou can also filter by status: Pending, Reviewed, Shortlisted, or Rejected.",
        "You can track your applications in the Dashboard section. Each application shows:\n• Submission date\n• Current status\n• Last update\n• Employer notes (if any)\n\nWould you like me to guide you through accessing your dashboard?",
        "Application tracking is easy! Just visit your Dashboard and look for the 'My Applications' section. You'll see real-time updates on all your submitted applications."
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    if (lowerMessage.includes('how to apply') || lowerMessage.includes('apply for') || lowerMessage.includes('submit application')) {
      const responses = [
        "Here's how to apply for a job:\n\n1. 🔍 Browse available jobs on the Jobs page\n2. 👆 Click on a job that interests you\n3. 📖 Review the job details carefully\n4. ✅ Click the 'Apply' button\n5. 📝 Fill out the application form\n6. 📎 Upload your resume and cover letter\n7. ✔️ Submit your application\n\nYou'll receive a confirmation email once submitted!",
        "Applying is simple! Follow these steps:\n\n• Find a job you like\n• Click 'Apply' on the job page\n• Complete the application form\n• Attach your resume\n• Add a cover letter (optional but recommended)\n• Submit and wait for employer response\n\nPro tip: Customize your application for each job!",
        "To apply for any position:\n\n1. Navigate to the job listing\n2. Click the 'Apply Now' button\n3. Fill in your details\n4. Upload required documents\n5. Review and submit\n\nMost employers respond within 1-2 weeks."
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    }

    if (lowerMessage.includes('tips') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return "Here are some tips to improve your application success:\n\n✅ **Customize your resume** for each job\n✅ **Write a compelling cover letter** explaining why you're a great fit\n✅ **Highlight relevant skills** mentioned in the job description\n✅ **Apply early** - many jobs fill quickly\n✅ **Follow up** if you don't hear back in 2 weeks\n✅ **Keep your profile updated** with latest experience\n\nWould you like specific advice on any of these?"
    }

    return "I can help you with:\n• Checking application status\n• How to apply for jobs\n• Application tips and best practices\n• Required documents\n\nWhat would you like to know?"
  }

  /**
   * Handle company queries
   */
  const handleCompanyQuery = async (message) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`)
      let companies = response.data

      if (companies.length === 0) {
        return "We're currently building our company network. Check back soon for exciting opportunities!"
      }

      // Randomize for variety
      companies = shuffleArray(companies).slice(0, 5)

      const responseTemplates = [
        () => {
          let result = `Here are some companies currently hiring:\n\n`
          companies.forEach((company, index) => {
            result += `${index + 1}. **${company.name}**\n`
            result += `   🏭 ${company.industry}\n`
            result += `   📍 ${company.location}\n`
            result += `   💼 ${company.jobCount || 'Multiple'} open positions\n\n`
          })
          result += `Want to know more about any specific company?`
          return result
        },
        () => {
          let result = `Great companies looking for talent:\n\n`
          companies.forEach((company) => {
            result += `🏢 **${company.name}** - ${company.industry}\n`
            result += `   📍 ${company.location} | 🎯 ${company.jobCount || 0} jobs\n\n`
          })
          return result
        }
      ]

      const randomTemplate = responseTemplates[Math.floor(Math.random() * responseTemplates.length)]
      return randomTemplate()
    } catch (e) {
      return "I'm having trouble accessing company information. Please visit the Companies page directly for the latest listings."
    }
  }

  /**
   * Handle salary queries
   */
  const handleSalaryQuery = async (message) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`)
      const jobs = response.data

      if (jobs.length === 0) {
        return "I don't have salary data available right now. Please check individual job listings for compensation details."
      }

      // Calculate salary statistics
      const salaries = jobs
        .filter(job => job.salaryMin && job.salaryMax)
        .map(job => ({ min: job.salaryMin, max: job.salaryMax }))

      if (salaries.length === 0) {
        return "Salary information is not available for current listings. Check individual job posts for compensation details."
      }

      const avgMin = Math.round(salaries.reduce((sum, s) => sum + s.min, 0) / salaries.length)
      const avgMax = Math.round(salaries.reduce((sum, s) => sum + s.max, 0) / salaries.length)
      const highestMax = Math.max(...salaries.map(s => s.max))

      return `Here's what I found about salaries:\n\n📊 **Salary Overview:**\n• Average range: $${avgMin.toLocaleString()} - $${avgMax.toLocaleString()}\n• Highest salary: $${highestMax.toLocaleString()}\n• Based on ${salaries.length} job listings\n\n💡 **Tips for salary negotiation:**\n• Research market rates for your role\n• Consider total compensation (benefits, equity)\n• Be prepared to discuss your expectations\n• Know your minimum acceptable salary\n\nWould you like to see jobs in a specific salary range?`
    } catch (e) {
      return "I can't access salary data right now. Check individual job listings for compensation details."
    }
  }

  /**
   * Handle interview queries
   */
  const handleInterviewQuery = (message) => {
    const responses = [
      `Great question! Here are essential interview tips:\n\n🎯 **Before the Interview:**\n• Research the company thoroughly\n• Review the job description\n• Prepare answers for common questions\n• Plan your outfit and route\n\n💼 **During the Interview:**\n• Arrive 10-15 minutes early\n• Make eye contact and smile\n• Listen carefully to questions\n• Use the STAR method for behavioral questions\n• Ask thoughtful questions\n\n📝 **After the Interview:**\n• Send a thank-you email within 24 hours\n• Follow up if you don't hear back\n• Reflect on what went well\n\nWould you like specific tips for any type of interview?`,
      `Here's how to ace your interview:\n\n**Common Questions to Prepare:**\n• "Tell me about yourself"\n• "Why do you want this job?"\n• "What are your strengths/weaknesses?"\n• "Where do you see yourself in 5 years?"\n\n**Pro Tips:**\n✅ Use the STAR method (Situation, Task, Action, Result)\n✅ Prepare specific examples from your experience\n✅ Research the company's culture and values\n✅ Have questions ready to ask the interviewer\n✅ Practice with a friend or mirror\n\nNeed help with a specific interview type?`,
      `Interview preparation is key to success! Here's a quick guide:\n\n**Research:**\n• Company mission, values, and culture\n• Recent news and achievements\n• The role and team structure\n• Interviewer's background (LinkedIn)\n\n**Practice:**\n• Your elevator pitch (30-60 seconds)\n• Stories that showcase your skills\n• Questions to ask them\n• Handling difficult questions\n\n**Logistics:**\n• Confirm time and location\n• Plan your route\n• Bring extra resumes\n• Dress appropriately\n\nWhat specific aspect would you like help with?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Handle resume queries
   */
  const handleResumeQuery = (message) => {
    const responses = [
      `Here's how to create a winning resume:\n\n📄 **Resume Structure:**\n• Contact Information\n• Professional Summary (2-3 sentences)\n• Work Experience (reverse chronological)\n• Skills (relevant to the job)\n• Education\n• Certifications (if applicable)\n\n✨ **Pro Tips:**\n• Keep it to 1-2 pages\n• Use action verbs (achieved, developed, led)\n• Quantify achievements when possible\n• Tailor it for each job application\n• Proofread carefully!\n\n📎 **Format:**\n• PDF format is best\n• Clean, professional design\n• Consistent formatting\n• Easy to read fonts\n\nWould you like help with a specific section?`,
      `Your resume is your first impression! Here's how to make it great:\n\n**Must-Have Sections:**\n✅ Contact info (email, phone, LinkedIn)\n✅ Professional summary\n✅ Work experience with achievements\n✅ Relevant skills\n✅ Education\n\n**Common Mistakes to Avoid:**\n❌ Typos and grammatical errors\n❌ Too long (keep it concise)\n❌ Generic objective statements\n❌ Irrelevant information\n❌ Poor formatting\n\n**Power Tips:**\n• Use keywords from the job description\n• Show impact with numbers\n• Include relevant projects\n• Keep design clean and professional\n\nNeed help with a specific resume section?`,
      `Resume writing tips for job seekers:\n\n**The Golden Rules:**\n1. Tailor your resume for each job\n2. Focus on achievements, not just duties\n3. Use strong action verbs\n4. Keep it concise and relevant\n5. Proofread multiple times\n\n**Sections to Include:**\n• Header with contact info\n• Summary or objective\n• Experience (most recent first)\n• Skills (technical and soft)\n• Education and certifications\n\n**Formatting Tips:**\n• Use bullet points for readability\n• Consistent font and spacing\n• 1-2 pages maximum\n• PDF format for submissions\n\nWhat part of your resume would you like to improve?`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Handle remote work queries
   */
  const handleRemoteWorkQuery = async (message) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`, { params: { workType: 'remote' } })
      const remoteJobs = response.data

      if (remoteJobs.length === 0) {
        return "I don't see any remote positions available right now, but new jobs are added regularly. Check the Jobs page and filter by 'Remote' to see the latest opportunities!"
      }

      const randomJobs = shuffleArray(remoteJobs).slice(0, 3)

      let result = `Great news! We have ${remoteJobs.length} remote position(s) available:\n\n`
      randomJobs.forEach((job, index) => {
        result += `${index + 1}. **${job.title}**\n`
        result += `   🏢 ${job.company?.name || 'Company'}\n`
        result += `   🏠 Remote | 💼 ${job.type || 'Full-time'}\n\n`
      })

      result += `\n💡 **Remote Work Tips:**\n• Set up a dedicated workspace\n• Maintain a routine\n• Communicate proactively\n• Use collaboration tools effectively\n• Take regular breaks\n\nWould you like to see more remote jobs?`
      return result
    } catch (e) {
      return "Remote work is popular! Check the Jobs page and filter by 'Remote' to find work-from-home opportunities."
    }
  }

  /**
   * Handle FAQ queries
   */
  const handleFAQ = (message) => {
    const lowerMessage = message.toLowerCase()

    const faqResponses = {
      'password': `To reset your password:\n\n1. Go to the Login page\n2. Click "Forgot Password"\n3. Enter your email address\n4. Check your email for a reset link\n5. Click the link and create a new password\n\n💡 Tip: Use a strong password with letters, numbers, and symbols.`,
      'profile': `To update your profile:\n\n1. Log in to your account\n2. Go to your Dashboard\n3. Click on "Profile" or "Settings"\n4. Update your information\n5. Save your changes\n\nKeep your profile updated to attract more employers!`,
      'resume': `You can upload your resume:\n\n• When applying for jobs\n• In your profile settings\n\nSupported formats: PDF, DOC, DOCX\nMaximum file size: 5MB\n\n💡 Tip: Keep your resume updated with latest experience!`,
      'account': `Account management:\n\n• **Create Account:** Click "Sign Up" and fill in your details\n• **Update Info:** Go to Dashboard > Profile\n• **Change Password:** Settings > Security\n• **Delete Account:** Contact support\n\nNeed help with something specific?`,
      'job': `To find jobs:\n\n1. Visit the Jobs page\n2. Use filters (location, type, category)\n3. Browse listings\n4. Click on jobs for details\n5. Apply directly from the job page\n\nYou can also save jobs to apply later!`,
      'company': `To explore companies:\n\n1. Visit the Companies page\n2. Browse company profiles\n3. See open positions\n4. Learn about company culture\n5. Apply directly to company jobs\n\nResearch companies before applying!`,
      'apply': `Application process:\n\n1. Find a job you like\n2. Click "Apply"\n3. Fill out the form\n4. Upload your resume\n5. Submit application\n\nYou'll get email updates on your application status.`,
      'status': `Check application status:\n\n1. Go to Dashboard\n2. Click "My Applications"\n3. View status for each application\n\nStatuses: Pending, Reviewed, Shortlisted, Rejected`,
      'interview': `Interview preparation:\n\n• Research the company\n• Practice common questions\n• Prepare your own questions\n• Dress appropriately\n• Arrive early\n• Follow up with thank-you email\n\nGood luck!`,
      'salary': `Salary information:\n\n• Check job listings for salary ranges\n• Research market rates\n• Consider total compensation\n• Be prepared to negotiate\n• Know your worth\n\nSalary is often negotiable!`
    }

    // Find matching FAQ
    for (const [key, response] of Object.entries(faqResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }

    // Default FAQ response
    return `I can help with:\n\n• **Account** - Password reset, profile updates\n• **Jobs** - Finding and applying for jobs\n• **Applications** - Status tracking, tips\n• **Companies** - Exploring employers\n• **Interviews** - Preparation tips\n• **Resumes** - Writing and formatting\n• **Salary** - Negotiation advice\n\nWhat would you like to know more about?`
  }

  /**
   * Get greeting message with variety
   */
  const getGreeting = () => {
    const greetings = [
      "Hello! 👋 I'm your job search assistant. How can I help you find your dream job today?",
      "Hi there! Ready to help you with your job search. What are you looking for?",
      "Hey! I'm here to make your job search easier. What can I do for you?",
      "Welcome! I can help you find jobs, prepare for interviews, or answer any questions. What do you need?",
      "Hello! Whether you're job hunting or need career advice, I'm here to help. What's on your mind?"
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  /**
   * Get thank you response
   */
  const getThankYouResponse = () => {
    const responses = [
      "You're welcome! 😊 Is there anything else I can help you with?",
      "Happy to help! Let me know if you need anything else.",
      "My pleasure! Feel free to ask if you have more questions.",
      "Glad I could assist! Good luck with your job search! 🍀",
      "Anytime! I'm here whenever you need help."
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Get goodbye response
   */
  const getGoodbyeResponse = () => {
    const responses = [
      "Goodbye! Best of luck with your job search! 🍀",
      "See you later! Feel free to come back if you need help.",
      "Take care! I hope you find your perfect job soon! 👋",
      "Bye! Remember, I'm here whenever you need assistance.",
      "Have a great day! Happy job hunting! 🎯"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Get follow-up response based on context
   */
  const getFollowUpResponse = (topic, message) => {
    const followUps = {
      'job_search': [
        "Would you like me to search for jobs with different criteria?",
        "I can help you refine your search. What specific requirements do you have?",
        "Want to explore jobs in a different category or location?"
      ],
      'application': [
        "Do you need help with any specific part of the application process?",
        "Would you like tips on making your application stand out?",
        "I can help you track your applications or improve your approach."
      ],
      'company': [
        "Would you like to know more about a specific company?",
        "I can help you research company culture and benefits.",
        "Want to see jobs from a particular company?"
      ],
      'salary': [
        "Would you like to see jobs in a specific salary range?",
        "I can help you research market rates for your role.",
        "Need tips on salary negotiation?"
      ],
      'interview': [
        "Would you like help with a specific type of interview?",
        "I can provide tips for technical or behavioral interviews.",
        "Need help preparing for common interview questions?"
      ],
      'resume': [
        "Would you like help with a specific resume section?",
        "I can provide tips for making your resume stand out.",
        "Need help tailoring your resume for a specific job?"
      ],
      'remote': [
        "Would you like to see more remote job opportunities?",
        "I can help you find remote jobs in your field.",
        "Need tips for succeeding in remote work?"
      ],
      'faq': [
        "Is there something specific you'd like to know more about?",
        "I can help with other questions too. What else can I assist with?",
        "Would you like more detailed information on any topic?"
      ]
    }

    const topicFollowUps = followUps[topic] || followUps['faq']
    return topicFollowUps[Math.floor(Math.random() * topicFollowUps.length)]
  }

  /**
   * Get no results response
   */
  const getNoResultsResponse = (message) => {
    const responses = [
      "I couldn't find any jobs matching your criteria. Try:\n• Broadening your search\n• Using different keywords\n• Checking spelling\n• Removing some filters\n\nWould you like me to search with different criteria?",
      "No exact matches found, but new jobs are added daily! Consider:\n• Expanding your location radius\n• Looking at related job categories\n• Checking back in a few days\n\nCan I help you search differently?",
      "Sorry, no jobs match that search. Here are some suggestions:\n• Try more general terms\n• Remove location filters\n• Check for typos\n• Browse all jobs\n\nWant me to try a different search?"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Get default response with suggestions
   */
  const getDefaultResponse = () => {
    const responses = [
      "I'm here to help you with your job search! Try asking me:\n\n🔍 \"Find remote programming jobs\"\n📝 \"How do I apply for a job?\"\n🏢 \"Show me companies hiring\"\n💰 \"What's the average salary?\"\n📋 \"Interview tips\"\n📄 \"Resume writing help\"\n\nWhat would you like to know?",
      "I can assist you with:\n\n• Finding jobs by location, type, or category\n• Application process and tips\n• Company information\n• Salary insights\n• Interview preparation\n• Resume writing\n\nJust ask me anything about your job search!",
      "Not sure what to ask? Here are some ideas:\n\n• \"Find marketing jobs in New York\"\n• \"How do I check my application status?\"\n• \"What companies are hiring?\"\n• \"Give me interview tips\"\n• \"Help me write my resume\"\n\nI'm here to help!"
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  /**
   * Shuffle array for randomization
   */
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Clear chat history
   */
  const clearChat = () => {
    messages.value = []
    error.value = null
    conversationContext.value = {
      lastTopic: null,
      userPreferences: {},
      searchHistory: []
    }
  }

  /**
   * Toggle chatbot visibility
   */
  const toggleChat = () => {
    isOpen.value = !isOpen.value
  }

  /**
   * Open chatbot
   */
  const openChat = () => {
    isOpen.value = true
  }

  /**
   * Close chatbot
   */
  const closeChat = () => {
    isOpen.value = false
  }

  return {
    messages,
    isTyping,
    error,
    isOpen,
    sendMessage,
    clearChat,
    toggleChat,
    openChat,
    closeChat,
    addMessage
  }
}
