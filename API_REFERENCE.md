# Laravel Job Board API Reference

Complete API documentation for frontend integration.

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Table of Contents
1. [Authentication](#authentication-endpoints)
2. [General](#general-endpoints)
3. [Profile](#profile-endpoints)
4. [Jobs](#job-endpoints)
5. [Applications](#application-endpoints)
6. [Comments](#comment-endpoints)
7. [Categories](#category-endpoints)
8. [Candidate Dashboard](#candidate-dashboard-endpoints)
9. [Admin Dashboard](#admin-dashboard-endpoints)

---

## Authentication Endpoints

### Register User
**POST** `/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "candidate",
  "accepted_terms": true
}
```

**Role-specific fields:**
- **Candidate:** `phone`, `bio`, `location`, `headline`, `skills`, `linkedin_profile`, `experience`, `resume`
- **Employer:** `company_name`, `company_website`, `company_description`, `industry`, `company_size`, `location`, `phone`
- **Admin:** No additional fields

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    ...
  },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

---

### Login
**POST** `/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "user": { ... },
  "token": "1|abc123...",
  "token_type": "Bearer"
}
```

---

### Logout
**POST** `/logout`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Logged out successfully."
}
```

---

### Get Current User
**GET** `/me`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "candidate",
    ...
  }
}
```

---

### Get User Info
**GET** `/user`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns the authenticated user object.

---

## General Endpoints

### Home Data
**GET** `/home-data`

**Response (200):** Returns homepage data (featured jobs, statistics, etc.)

---

### Test Endpoint
**GET** `/test`

**Response (200):**
```json
{
  "test": "ok"
}
```

---

## Profile Endpoints

### Get Profile
**GET** `/profile`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns user profile data.

---

### Update Profile
**POST** `/profile`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "bio": "Software developer with 5 years of experience",
  "phone": "+1234567890",
  "location": "New York, NY",
  "headline": "Senior PHP Developer",
  "skills": ["PHP", "Laravel", "MySQL"],
  "linkedin_profile": "https://linkedin.com/in/username",
  "experience": "5 years",
  "resume": "path/to/resume.pdf"
}
```

---

## Job Endpoints

### Get All Jobs
**GET** `/jobs`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `per_page` (int): Items per page (default: 15)
- `search` (string): Search keyword
- `location` (string): Filter by location
- `category_id` (int): Filter by category
- `work_type` (string): Filter by work type (full_time, part_time, remote, etc.)
- `experience_level` (string): Filter by experience level

**Response (200):**
```json
{
  "data": [ ... ],
  "current_page": 1,
  "last_page": 5,
  "per_page": 15,
  "total": 75
}
```

---

### Get Job Details
**GET** `/jobs/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns job details with employer info.

---

### Create Job
**POST** `/jobs`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "title": "Senior PHP Developer",
  "description": "Job description...",
  "category_id": 1,
  "location": "New York, NY",
  "work_type": "full_time",
  "experience_level": "senior",
  "salary_min": 80000,
  "salary_max": 120000,
  "responsibilities": "Responsibilities...",
  "requirements": "Requirements...",
  "benefits": "Benefits...",
  "application_deadline": "2026-06-30"
}
```

**Response (201):** Returns created job.

---

### Update Job
**PUT** `/jobs/{id}`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:** (same fields as create, all optional)

**Response (200):** Returns updated job.

---

### Delete Job
**DELETE** `/jobs/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (204):** No content.

---

### Approve Job (Admin Only)
**POST** `/jobs/{id}/approve`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns approved job.

---

### Reject Job (Admin Only)
**POST** `/jobs/{id}/reject`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns rejected job.

---

## Application Endpoints

### Get Applications for Job
**GET** `/jobs/{jobId}/applications`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns list of applications for the job.

---

### Apply for Job
**POST** `/jobs/{jobId}/applications`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "resume": "path/to/resume.pdf",
  "cover_letter": "Cover letter text...",
  "phone": "+1234567890",
  "email": "candidate@example.com",
  "message": "Additional message to employer"
}
```

**Response (201):** Returns created application.

---

### Get Application Details
**GET** `/applications/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns application details.

---

### Update Application
**PUT** `/applications/{id}`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "cover_letter": "Updated cover letter...",
  "phone": "+0987654321"
}
```

**Response (200):** Returns updated application.

---

### Withdraw Application
**DELETE** `/applications/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (204):** No content.

---

### Update Application Status (Employer/Admin)
**POST** `/applications/{id}/status`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "status": "accepted",
  "rejection_reason": "Optional reason if rejected"
}
```

**Status values:** `pending`, `accepted`, `rejected`, `interviewing`

**Response (200):** Returns updated application.

---

### Process Payment (Employer Only)
**POST** `/applications/{id}/payment`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "payment_id": "PAY_123456789",
  "amount": 50000
}
```

**Response (200):** Returns payment confirmation.

---

## Comment Endpoints

### Get Comments for Job
**GET** `/jobs/{jobId}/comments`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns list of comments.

---

### Add Comment to Job
**POST** `/jobs/{jobId}/comments`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "content": "Comment text...",
  "rating": 5
}
```

**Response (201):** Returns created comment.

---

### Get Comment Details
**GET** `/comments/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns comment details.

---

### Update Comment
**PUT** `/comments/{id}`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "content": "Updated comment...",
  "rating": 4
}
```

**Response (200):** Returns updated comment.

---

### Delete Comment
**DELETE** `/comments/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (204):** No content.

---

### Approve Comment (Admin Only)
**POST** `/comments/{id}/approve`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns approved comment.

---

## Category Endpoints (Admin Only)

### Get All Categories
**GET** `/categories`

**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Technology",
      "description": "Tech jobs",
      ...
    }
  ]
}
```

---

### Create Category
**POST** `/categories`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "name": "New Category",
  "description": "Category description"
}
```

**Response (201):** Returns created category.

---

### Get Category Details
**GET** `/categories/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns category with jobs.

---

### Update Category
**PUT** `/categories/{id}`

**Headers:** `Authorization: Bearer {token}`, `Content-Type: application/json`

**Body:**
```json
{
  "name": "Updated Category",
  "description": "Updated description"
}
```

**Response (200):** Returns updated category.

---

### Delete Category
**DELETE** `/categories/{id}`

**Headers:** `Authorization: Bearer {token}`

**Response (204):** No content.

---

## Candidate Dashboard Endpoints

### Get Candidate Dashboard
**GET** `/candidate/dashboard`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns candidate statistics and overview.

---

### Get Candidate Applications
**GET** `/candidate/applications`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns list of candidate's applications.

---

## Admin Dashboard Endpoints

### Get Admin Dashboard
**GET** `/admin/dashboard`

**Headers:** `Authorization: Bearer {token}`

**Response (200):** Returns admin statistics (users, jobs, applications, revenue, etc.)

---

## Error Responses

### 401 Unauthenticated
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found."
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

## Frontend Integration Example (JavaScript/Fetch)

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Register
async function register(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
}

// Login
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

// Authenticated request
async function getJobs(token) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

// Logout
async function logout(token) {
  await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  localStorage.removeItem('token');
}