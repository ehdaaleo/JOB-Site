// src/composables/useAI.js
import { ref } from 'vue'
import axios from 'axios'

export function useAI() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Generate job content using Groq API (free, fast inference)
   * @param {Object} jobData - Job information to generate content from
   * @returns {Promise<Object>} Generated content (description, responsibilities, requirements, benefits)
   */
  const generateJobContent = async (jobData) => {
    loading.value = true
    error.value = null

    const prompt = `
Generate a professional job posting with the following details:
- Job Title: ${jobData.title || 'Not specified'}
- Category: ${jobData.category || 'Not specified'}
- Experience Level: ${jobData.experienceLevel || 'Not specified'}
- Work Type: ${jobData.workType || 'Not specified'}

Provide a JSON response with:
1. description: A 2-3 paragraph job description
2. responsibilities: Array of 5-6 key responsibilities
3. requirements: Array of 5-6 key requirements
4. benefits: Array of 4-5 benefits/perks

Format the output as valid JSON only, without any markdown formatting.
`.trim()

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      if (!apiKey) {
        throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to your .env file.')
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a professional HR content writer specialized in creating job postings. Always respond with valid JSON only, no markdown formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const content = response.data.choices[0].message.content
      
      // Try to parse the JSON response
      let parsedContent
      try {
        parsedContent = JSON.parse(content)
      } catch (parseError) {
        // If direct parse fails, try to extract JSON from the response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('Failed to parse AI response')
        }
      }

      return parsedContent
    } catch (e) {
      console.error('AI generation failed:', e)
      error.value = e.message || 'Failed to generate content'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate a company description
   * @param {Object} companyData - Company information
   * @returns {Promise<string>} Generated company description
   */
  const generateCompanyDescription = async (companyData) => {
    loading.value = true
    error.value = null

    const prompt = `
Write a compelling company description for "${companyData.name}" located in ${companyData.location || 'various locations'}.
Industry: ${companyData.industry || 'Various'}

Keep it 2-3 paragraphs, professional, and focused on what makes the company a great place to work.
`.trim()

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      
      if (!apiKey) {
        throw new Error('Groq API key not configured')
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.1-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a professional HR content writer. Write compelling company descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (e) {
      console.error('AI generation failed:', e)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    generateJobContent,
    generateCompanyDescription
  }
}
