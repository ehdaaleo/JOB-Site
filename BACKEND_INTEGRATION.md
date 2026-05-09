# Laravel Backend Integration Guide

Complete guide for integrating the Vue.js frontend with the Laravel Job Board API.

## Overview

The frontend has been configured to integrate with a Laravel backend API. The integration includes:

- ✅ Complete API service with all endpoints from `API_REFERENCE.md`
- ✅ Updated Pinia stores with Laravel API integration
- ✅ Fallback to mock data when backend is unavailable
- ✅ Automatic token management and authentication
- ✅ Error handling and loading states

## Environment Configuration

### Required Environment Variables

Create or update your `.env` file with:

```env
# Laravel Backend API URL (Required)
VITE_LARAVEL_API_URL=http://127.0.0.1:8000/api

# Optional: Legacy JSON Server (for development fallback)
VITE_API_URL=http://localhost:3000

# Other existing variables...
VITE_GROQ_API_KEY=your_key_here
VITE_AUTH0_DOMAIN=your_domain
VITE_AUTH0_CLIENT_ID=your_client_id
PORT=5173
```

### Backend Setup

Ensure your Laravel backend is running:

```bash
cd path/to/laravel-backend
php artisan serve
# Server should be running at http://127.0.0.1:8000
```

## API Service Structure

### Main API Service (`src/services/laravelApi.js`)

The service is organized into modules:

```javascript
import { 
  authApi,      // Authentication endpoints
  generalApi,   // General endpoints (home data, test)
  profileApi,   // Profile endpoints
  jobApi,       // Job CRUD operations
  applicationApi, // Application management
  commentApi,   // Comment operations
  categoryApi,  // Category management (Admin)
  candidateApi, // Candidate dashboard
  adminApi,     // Admin dashboard
  laravelApiAll // All APIs in one object
} from '@/services/laravelApi'
```

### Using the Composable (`src/composables/useLaravelApi.js`)

```vue
<script setup>
import { useLaravelApi } from '@/composables/useLaravelApi'

const { 
  auth, 
  jobs, 
  applications, 
  profile,
  isLoading, 
  error,
  isBackendAvailable 
} = useLaravelApi()

// Example: Fetch jobs
const fetchJobs = async () => {
  const jobsData = await jobs.getJobs({ page: 1, per_page: 15 })
  console.log(jobsData)
}

// Example: Login
const login = async (credentials) => {
  const response = await auth.login(credentials)
  console.log(response)
}
</script>
```

## Store Integration

### Authentication Store (`src/stores/auth.js`)

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Login with Laravel API
await authStore.login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
})

// Register with role-specific fields
await authStore.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'candidate', // or 'employer', 'admin'
  // Candidate-specific fields:
  phone: '+1234567890',
  bio: 'Developer bio',
  location: 'New York',
  headline: 'Senior Developer',
  skills: ['Vue.js', 'Laravel'],
  linkedin_profile: 'https://linkedin.com/in/username'
  // Employer-specific fields:
  // company_name: 'TechCorp',
  // company_website: 'https://techcorp.com',
  // company_description: 'Description',
  // industry: 'Technology',
  // company_size: '50-100',
  // location: 'New York',
  // phone: '+1234567890'
})

// Logout
await authStore.logout()

// Get current user
await authStore.refreshUser()
```

### Job Store (`src/stores/jobStore.js`)

```javascript
import { useJobStore } from '@/stores/jobStore'

const jobStore = useJobStore()

// Fetch jobs with filters
await jobStore.fetchJobs({
  page: 1,
  per_page: 15,
  search: 'developer',
  location: 'New York',
  category_id: 1,
  work_type: 'full_time',
  experience_level: 'senior'
})

// Fetch single job
const job = await jobStore.fetchJobById(1)

// Create job (Employer only)
await jobStore.createJob({
  title: 'Senior Developer',
  description: 'Job description...',
  category_id: 1,
  location: 'New York',
  work_type: 'full_time',
  experience_level: 'senior',
  salary_min: 80000,
  salary_max: 120000,
  responsibilities: 'Responsibilities...',
  requirements: 'Requirements...',
  benefits: 'Benefits...',
  application_deadline: '2026-06-30'
})

// Update job
await jobStore.updateJob(1, { title: 'Updated Title' })

// Delete job
await jobStore.deleteJob(1)

// Approve job (Admin only)
await jobStore.approveJob(1)

// Reject job (Admin only)
await jobStore.rejectJob(1)
```

### Application Store (`src/stores/applicationStore.js`)

```javascript
import { useApplicationStore } from '@/stores/applicationStore'

const appStore = useApplicationStore()

// Get candidate's applications
await appStore.fetchMyApplications()

// Apply for a job (Candidate)
await appStore.applyForJob(1, {
  resume: 'path/to/resume.pdf',
  cover_letter: 'Cover letter text...',
  phone: '+1234567890',
  email: 'candidate@example.com',
  message: 'Additional message'
})

// Get applications for a job (Employer)
const applications = await appStore.fetchApplicationsForJob(1)

// Update application status (Employer/Admin)
await appStore.updateApplicationStatus(1, 'accepted')
// or
await appStore.updateApplicationStatus(1, 'rejected', 'Not qualified')

// Withdraw application (Candidate)
await appStore.withdrawApplication(1)

// Save job
appStore.saveJob(1)

// Unsave job
appStore.unsaveJob(1)

// Check if job is saved
const isSaved = appStore.isJobSaved(1)
```

### Profile Store (`src/stores/profileStore.js`)

```javascript
import { useProfileStore } from '@/stores/profileStore'

const profileStore = useProfileStore()

// Fetch profile
await profileStore.fetchProfile()

// Update profile
await profileStore.updateProfile({
  bio: 'Updated bio',
  phone: '+0987654321',
  location: 'Los Angeles',
  title: 'Lead Developer',
  headline: 'Lead Developer',
  skills: ['Vue.js', 'React', 'Node.js'],
  linkedin_profile: 'https://linkedin.com/in/newprofile'
})

// Add skill
profileStore.addSkill('TypeScript')

// Remove skill
profileStore.removeSkill('Angular')

// Add experience
profileStore.addExperience({
  title: 'Lead Developer',
  company: 'TechCorp',
  period: '2022 - Present',
  description: 'Leading development team'
})

// Remove experience
profileStore.removeExperience(1)
```

## API Endpoint Mapping

### Authentication
| Method | Endpoint | Store Method | Description |
|--------|----------|--------------|-------------|
| POST | `/register` | `authStore.register()` | Register new user |
| POST | `/login` | `authStore.login()` | Login user |
| POST | `/logout` | `authStore.logout()` | Logout user |
| GET | `/me` | `authStore.refreshUser()` | Get current user |
| GET | `/user` | - | Get user info |

### Jobs
| Method | Endpoint | Store Method | Description |
|--------|----------|--------------|-------------|
| GET | `/jobs` | `jobStore.fetchJobs()` | Get all jobs |
| GET | `/jobs/{id}` | `jobStore.fetchJobById()` | Get job details |
| POST | `/jobs` | `jobStore.createJob()` | Create job |
| PUT | `/jobs/{id}` | `jobStore.updateJob()` | Update job |
| DELETE | `/jobs/{id}` | `jobStore.deleteJob()` | Delete job |
| POST | `/jobs/{id}/approve` | `jobStore.approveJob()` | Approve job (Admin) |
| POST | `/jobs/{id}/reject` | `jobStore.rejectJob()` | Reject job (Admin) |

### Applications
| Method | Endpoint | Store Method | Description |
|--------|----------|--------------|-------------|
| GET | `/jobs/{jobId}/applications` | `appStore.fetchApplicationsForJob()` | Get job applications |
| POST | `/jobs/{jobId}/applications` | `appStore.applyForJob()` | Apply for job |
| GET | `/applications/{id}` | `appStore.fetchApplication()` | Get application |
| PUT | `/applications/{id}` | `appStore.updateApplication()` | Update application |
| DELETE | `/applications/{id}` | `appStore.withdrawApplication()` | Withdraw application |
| POST | `/applications/{id}/status` | `appStore.updateApplicationStatus()` | Update status |
| GET | `/candidate/applications` | `appStore.fetchMyApplications()` | Get candidate's applications |

### Profile
| Method | Endpoint | Store Method | Description |
|--------|----------|--------------|-------------|
| GET | `/profile` | `profileStore.fetchProfile()` | Get profile |
| POST | `/profile` | `profileStore.updateProfile()` | Update profile |

### Categories (Admin)
| Method | Endpoint | API Method | Description |
|--------|----------|------------|-------------|
| GET | `/categories` | `categoryApi.getCategories()` | Get all categories |
| POST | `/categories` | `categoryApi.createCategory()` | Create category |
| GET | `/categories/{id}` | `categoryApi.getCategory()` | Get category |
| PUT | `/categories/{id}` | `categoryApi.updateCategory()` | Update category |
| DELETE | `/categories/{id}` | `categoryApi.deleteCategory()` | Delete category |

### Comments
| Method | Endpoint | API Method | Description |
|--------|----------|------------|-------------|
| GET | `/jobs/{jobId}/comments` | `commentApi.getCommentsForJob()` | Get comments |
| POST | `/jobs/{jobId}/comments` | `commentApi.addComment()` | Add comment |
| PUT | `/comments/{id}` | `commentApi.updateComment()` | Update comment |
| DELETE | `/comments/{id}` | `commentApi.deleteComment()` | Delete comment |

### Dashboard
| Method | Endpoint | API Method | Description |
|--------|----------|------------|-------------|
| GET | `/candidate/dashboard` | `candidateApi.getDashboard()` | Candidate dashboard |
| GET | `/admin/dashboard` | `adminApi.getDashboard()` | Admin dashboard |
| GET | `/home-data` | `generalApi.getHomeData()` | Home page data |

## Error Handling

The integration includes comprehensive error handling:

```javascript
try {
  await jobStore.fetchJobs()
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - user will be redirected to login
  } else if (error.response?.status === 403) {
    // Forbidden - insufficient permissions
  } else if (error.response?.status === 422) {
    // Validation error
    console.log(error.response.data.errors)
  } else if (error.response?.status === 404) {
    // Resource not found
  } else {
    // Network or server error
  }
}
```

## Fallback Behavior

When the Laravel backend is unavailable:

1. **Authentication**: Falls back to legacy JSON Server (if configured)
2. **Jobs**: Uses local mock data
3. **Applications**: Uses local mock data
4. **Profile**: Uses localStorage data

This ensures the application remains functional during development or backend downtime.

## Testing the Integration

### 1. Start the Laravel Backend

```bash
cd path/to/laravel-backend
php artisan serve
```

### 2. Configure Environment

Ensure `.env` has the correct `VITE_LARAVEL_API_URL`

### 3. Start the Frontend

```bash
npm install
npm run dev
```

### 4. Test Authentication

```javascript
// In browser console or component
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

// Try login
await authStore.login({
  email: 'test@example.com',
  password: 'password123'
})
```

### 5. Test Job Fetching

```javascript
import { useJobStore } from '@/stores/jobStore'
const jobStore = useJobStore()

await jobStore.fetchJobs()
console.log(jobStore.jobs)
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your Laravel backend has proper CORS configuration:

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Token Issues

If authentication fails:

1. Check that the token is being stored correctly
2. Verify the `Authorization` header is being sent
3. Ensure Laravel Sanctum is properly configured

### Network Issues

If the backend is not reachable:

1. Verify the backend URL in `.env`
2. Check that the Laravel server is running
3. Ensure no firewall is blocking the connection

## Migration from Mock Data

To fully migrate from mock data to Laravel API:

1. Ensure all API endpoints are implemented in Laravel
2. Set `VITE_LARAVEL_API_URL` in `.env`
3. Remove or comment out mock data in stores
4. Test all features thoroughly

## Additional Resources

- [API_REFERENCE.md](./API_REFERENCE.md) - Complete API documentation
- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Pinia Documentation](https://pinia.vuejs.org/)