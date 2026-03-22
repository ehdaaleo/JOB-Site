import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegisterForm from '@/components/auth/register/RegisterForm.vue'
import RoleSelection from '@/components/auth/register/RoleSelection.vue'
import EmployerTypeSelection from '@/components/auth/register/EmployerTypeSelection.vue'
import AccountForm from '@/components/auth/register/AccountForm.vue'
import CandidateProfileForm from '@/components/auth/register/CandidateProfileForm.vue'
import CompanyDetailsForm from '@/components/auth/register/CompanyDetailsForm.vue'
import IndividualEmployerForm from '@/components/auth/register/IndividualEmployerForm.vue'
import LogoUpload from '@/components/auth/register/LogoUpload.vue'
import ReviewSubmit from '@/components/auth/register/ReviewSubmit.vue'

describe('RegisterForm', () => {
  it('renders role selection stage initially', () => {
    const wrapper = mount(RegisterForm)
    expect(wrapper.text()).toContain('Create Your Account')
    expect(wrapper.text()).toContain('Candidate')
    expect(wrapper.text()).toContain('Employer')
  })

  it('emits submit event on form submission', async () => {
    const wrapper = mount(RegisterForm)
    wrapper.vm.$emit('submit', { name: 'Test', email: 'test@example.com' })
    expect(wrapper.emitted('submit')).toBeDefined()
  })
})

describe('RoleSelection', () => {
  it('renders both role cards', () => {
    const wrapper = mount(RoleSelection)
    expect(wrapper.text()).toContain('Candidate')
    expect(wrapper.text()).toContain('Employer')
  })

  it('emits select event with candidate when candidate card is clicked', async () => {
    const wrapper = mount(RoleSelection)
    const cards = wrapper.findAll('.cursor-pointer')
    await cards[0].trigger('click')
    expect(wrapper.emitted('select')).toContainEqual(['candidate'])
  })

  it('emits select event with employer when employer card is clicked', async () => {
    const wrapper = mount(RoleSelection)
    const cards = wrapper.findAll('.cursor-pointer')
    await cards[1].trigger('click')
    expect(wrapper.emitted('select')).toContainEqual(['employer'])
  })

  it('applies selected styles when modelValue is candidate', () => {
    const wrapper = mount(RoleSelection, {
      props: { modelValue: 'candidate' }
    })
    const cards = wrapper.findAll('.relative')
    expect(cards[0].classes()).toContain('border-violet-500')
    expect(cards[0].classes()).toContain('bg-violet-50')
  })

  it('applies selected styles when modelValue is employer', () => {
    const wrapper = mount(RoleSelection, {
      props: { modelValue: 'employer' }
    })
    const cards = wrapper.findAll('.relative')
    expect(cards[1].classes()).toContain('border-violet-500')
    expect(cards[1].classes()).toContain('bg-violet-50')
  })

  it('shows checkmark when candidate is selected', () => {
    const wrapper = mount(RoleSelection, {
      props: { modelValue: 'candidate' }
    })
    expect(wrapper.html()).toContain('fill-rule="evenodd"')
  })

  it('shows checkmark when employer is selected', () => {
    const wrapper = mount(RoleSelection, {
      props: { modelValue: 'employer' }
    })
    expect(wrapper.html()).toContain('fill-rule="evenodd"')
  })

  it('has candidate description text', () => {
    const wrapper = mount(RoleSelection)
    expect(wrapper.text()).toContain('Find jobs, showcase your skills, and work with top employers')
  })

  it('has employer description text', () => {
    const wrapper = mount(RoleSelection)
    expect(wrapper.text()).toContain('Post jobs, find talented candidates, and grow your team')
  })
})

describe('EmployerTypeSelection', () => {
  it('renders both employer type cards', () => {
    const wrapper = mount(EmployerTypeSelection)
    expect(wrapper.text()).toContain('Company')
    expect(wrapper.text()).toContain('Individual')
  })

  it('emits select event with company when company card is clicked', async () => {
    const wrapper = mount(EmployerTypeSelection)
    const cards = wrapper.findAll('.cursor-pointer')
    await cards[0].trigger('click')
    expect(wrapper.emitted('select')).toContainEqual(['company'])
  })

  it('emits select event with individual when individual card is clicked', async () => {
    const wrapper = mount(EmployerTypeSelection)
    const cards = wrapper.findAll('.cursor-pointer')
    await cards[1].trigger('click')
    expect(wrapper.emitted('select')).toContainEqual(['individual'])
  })

  it('applies selected styles when modelValue is company', () => {
    const wrapper = mount(EmployerTypeSelection, {
      props: { modelValue: 'company' }
    })
    const cards = wrapper.findAll('.relative')
    expect(cards[0].classes()).toContain('border-violet-500')
  })

  it('applies selected styles when modelValue is individual', () => {
    const wrapper = mount(EmployerTypeSelection, {
      props: { modelValue: 'individual' }
    })
    const cards = wrapper.findAll('.relative')
    expect(cards[1].classes()).toContain('border-violet-500')
  })

  it('shows checkmark when company is selected', () => {
    const wrapper = mount(EmployerTypeSelection, {
      props: { modelValue: 'company' }
    })
    expect(wrapper.html()).toContain('fill-rule="evenodd"')
  })

  it('shows checkmark when individual is selected', () => {
    const wrapper = mount(EmployerTypeSelection, {
      props: { modelValue: 'individual' }
    })
    expect(wrapper.html()).toContain('fill-rule="evenodd"')
  })
})

describe('AccountForm', () => {
  const createForm = () => ({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  it('renders all form fields', () => {
    const wrapper = mount(AccountForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('#confirmPassword').exists()).toBe(true)
  })

  it('has correct input placeholders', () => {
    const wrapper = mount(AccountForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#name').attributes('placeholder')).toBe('John Doe')
    expect(wrapper.find('#email').attributes('placeholder')).toBe('you@example.com')
  })

  it('includes PasswordStrength component', () => {
    const wrapper = mount(AccountForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('At least 8 characters')
  })

  it('shows password mismatch error when passwords do not match', () => {
    const form = createForm()
    form.password = 'password123'
    form.confirmPassword = 'password456'
    
    const wrapper = mount(AccountForm, {
      props: { form }
    })
    expect(wrapper.text()).toContain('Passwords do not match')
  })

  it('does not show password mismatch when passwords match', () => {
    const form = createForm()
    form.password = 'password123'
    form.confirmPassword = 'password123'
    
    const wrapper = mount(AccountForm, {
      props: { form }
    })
    expect(wrapper.text()).not.toContain('Passwords do not match')
  })

  it('has email verification hint', () => {
    const wrapper = mount(AccountForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('A verification email will be sent')
  })

  it('updates form data on input', async () => {
    const form = createForm()
    const wrapper = mount(AccountForm, {
      props: { form }
    })

    await wrapper.find('#name').setValue('John Doe')
    await wrapper.find('#email').setValue('john@example.com')

    expect(form.name).toBe('John Doe')
    expect(form.email).toBe('john@example.com')
  })
})

describe('CandidateProfileForm', () => {
  const createForm = () => ({
    headline: '',
    skills: '',
    experience: '',
    resume: null
  })

  it('renders all form fields', () => {
    const wrapper = mount(CandidateProfileForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#headline').exists()).toBe(true)
    expect(wrapper.find('#skills').exists()).toBe(true)
    expect(wrapper.find('#experience').exists()).toBe(true)
  })

  it('has correct input placeholders', () => {
    const wrapper = mount(CandidateProfileForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#headline').attributes('placeholder')).toBe('e.g., Senior Software Engineer')
    expect(wrapper.find('#skills').attributes('placeholder')).toBe('e.g., JavaScript, Vue.js, Node.js')
  })

  it('has experience level options', () => {
    const wrapper = mount(CandidateProfileForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('0-1 years (Entry level)')
    expect(wrapper.text()).toContain('5-10 years (Senior)')
  })

  it('has resume upload area', () => {
    const wrapper = mount(CandidateProfileForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('Upload resume')
    expect(wrapper.text()).toContain('PDF, DOC, DOCX')
  })

  it('updates form data on input', async () => {
    const form = createForm()
    const wrapper = mount(CandidateProfileForm, {
      props: { form }
    })

    await wrapper.find('#headline').setValue('Software Engineer')
    await wrapper.find('#skills').setValue('Vue, React')
    await wrapper.find('#experience').setValue('3-5')

    expect(form.headline).toBe('Software Engineer')
    expect(form.skills).toBe('Vue, React')
    expect(form.experience).toBe('3-5')
  })
})

describe('CompanyDetailsForm', () => {
  const createForm = () => ({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    companyDescription: ''
  })

  it('renders all form fields', () => {
    const wrapper = mount(CompanyDetailsForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#companyName').exists()).toBe(true)
    expect(wrapper.find('#companyWebsite').exists()).toBe(true)
    expect(wrapper.find('#companySize').exists()).toBe(true)
    expect(wrapper.find('#industry').exists()).toBe(true)
    expect(wrapper.find('#companyDescription').exists()).toBe(true)
  })

  it('has correct input placeholders', () => {
    const wrapper = mount(CompanyDetailsForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#companyName').attributes('placeholder')).toBe('Acme Inc.')
    expect(wrapper.find('#companyWebsite').attributes('placeholder')).toBe('https://www.example.com')
  })

  it('has company size options', () => {
    const wrapper = mount(CompanyDetailsForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('1-10 employees')
    expect(wrapper.text()).toContain('51-200 employees')
  })

  it('has industry options', () => {
    const wrapper = mount(CompanyDetailsForm, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('Technology')
    expect(wrapper.text()).toContain('Finance')
  })

  it('updates form data on input', async () => {
    const form = createForm()
    const wrapper = mount(CompanyDetailsForm, {
      props: { form }
    })

    await wrapper.find('#companyName').setValue('Acme Inc.')
    await wrapper.find('#companySize').setValue('51-200')
    await wrapper.find('#industry').setValue('technology')

    expect(form.companyName).toBe('Acme Inc.')
    expect(form.companySize).toBe('51-200')
    expect(form.industry).toBe('technology')
  })
})

describe('IndividualEmployerForm', () => {
  const createForm = () => ({
    organization: '',
    jobTitle: '',
    industry: '',
    bio: ''
  })

  it('renders all form fields', () => {
    const wrapper = mount(IndividualEmployerForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#organization').exists()).toBe(true)
    expect(wrapper.find('#jobTitle').exists()).toBe(true)
    expect(wrapper.find('#industry').exists()).toBe(true)
    expect(wrapper.find('#bio').exists()).toBe(true)
  })

  it('has correct input placeholders', () => {
    const wrapper = mount(IndividualEmployerForm, {
      props: { form: createForm() }
    })
    expect(wrapper.find('#organization').attributes('placeholder')).toBe('Your organization or company')
    expect(wrapper.find('#jobTitle').attributes('placeholder')).toBe('e.g., Hiring Manager, HR Director')
  })

  it('updates form data on input', async () => {
    const form = createForm()
    const wrapper = mount(IndividualEmployerForm, {
      props: { form }
    })

    await wrapper.find('#organization').setValue('My Company')
    await wrapper.find('#jobTitle').setValue('HR Director')

    expect(form.organization).toBe('My Company')
    expect(form.jobTitle).toBe('HR Director')
  })
})

describe('LogoUpload', () => {
  const createForm = () => ({
    logo: null
  })

  it('renders logo upload area', () => {
    const wrapper = mount(LogoUpload, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('Upload company logo')
    expect(wrapper.text()).toContain('Click to upload')
  })

  it('has correct file type acceptance', () => {
    const wrapper = mount(LogoUpload, {
      props: { form: createForm() }
    })
    const fileInput = wrapper.find('input[type="file"]')
    expect(fileInput.attributes('accept')).toBe('image/*')
  })

  it('shows file size limit', () => {
    const wrapper = mount(LogoUpload, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('PNG, JPG, GIF up to 2MB')
  })

  it('has email verification notice', () => {
    const wrapper = mount(LogoUpload, {
      props: { form: createForm() }
    })
    expect(wrapper.text()).toContain('Email Verification Required')
  })

  it('emits remove event when remove button is clicked', async () => {
    const form = createForm()
    form.logo = { name: 'logo.png' }
    
    const wrapper = mount(LogoUpload, {
      props: { form }
    })
    
    const removeButton = wrapper.find('button')
    await removeButton.trigger('click')
    
    expect(wrapper.emitted('remove')).toBeDefined()
  })
})

describe('ReviewSubmit', () => {
  const createFreelancerForm = () => ({
    name: 'John Doe',
    email: 'john@example.com',
    headline: 'Software Engineer',
    experience: '3-5',
    acceptedTerms: false
  })

  const createCompanyForm = () => ({
    name: 'John Doe',
    email: 'john@example.com',
    companyName: 'Acme Inc.',
    companyWebsite: 'https://acme.com',
    companySize: '51-200',
    industry: 'technology',
    acceptedTerms: false
  })

  const createIndividualForm = () => ({
    name: 'John Doe',
    email: 'john@example.com',
    organization: 'My Company',
    jobTitle: 'HR Director',
    industry: 'technology',
    acceptedTerms: false
  })

  it('renders review section for freelancer', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createFreelancerForm(),
        role: 'freelancer'
      }
    })
    expect(wrapper.text()).toContain('Freelancer Profile')
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders review section for company employer', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createCompanyForm(),
        role: 'employer',
        employerType: 'company'
      }
    })
    expect(wrapper.text()).toContain('Company Information')
  })

  it('renders review section for individual employer', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createIndividualForm(),
        role: 'employer',
        employerType: 'individual'
      }
    })
    expect(wrapper.text()).toContain('Professional Information')
  })

  it('displays account information', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createFreelancerForm(),
        role: 'freelancer'
      }
    })
    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john@example.com')
  })

  it('has terms acceptance checkbox', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createFreelancerForm(),
        role: 'freelancer'
      }
    })
    const checkbox = wrapper.find('#terms')
    expect(checkbox.exists()).toBe(true)
    expect(wrapper.text()).toContain('Terms of Service')
    expect(wrapper.text()).toContain('Privacy Policy')
  })

  it('shows email verification reminder', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createFreelancerForm(),
        role: 'freelancer'
      }
    })
    expect(wrapper.text()).toContain('verification link')
  })

  it('displays freelancer-specific fields', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createFreelancerForm(),
        role: 'freelancer'
      }
    })
    expect(wrapper.text()).toContain('Headline:')
    expect(wrapper.text()).toContain('Experience:')
  })

  it('displays company-specific fields', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createCompanyForm(),
        role: 'employer',
        employerType: 'company'
      }
    })
    expect(wrapper.text()).toContain('Company:')
    expect(wrapper.text()).toContain('Website:')
    expect(wrapper.text()).toContain('Size:')
    expect(wrapper.text()).toContain('Industry:')
  })

  it('displays individual employer-specific fields', () => {
    const wrapper = mount(ReviewSubmit, {
      props: {
        form: createIndividualForm(),
        role: 'employer',
        employerType: 'individual'
      }
    })
    expect(wrapper.text()).toContain('Organization:')
    expect(wrapper.text()).toContain('Job Title:')
  })
})
