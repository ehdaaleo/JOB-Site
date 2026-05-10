# Find Job Laravel REST API Integration Reference

Generated: 2026-05-10

## Quick Reference

**Auth:** Bearer tokens (no expiration) | **CORS:** NOT CONFIGURED (needs adding)  
**Roles:** candidate, employer, admin | **Sanctum:** Token-based

## All Endpoints

### Authentication (Public)
- POST /api/register → {user, token}
- POST /api/login → {user, token}  
- POST /api/logout → {message}
- GET /api/me → {user}

### Jobs
- GET /api/jobs [filters] → paginated approved jobs
- POST /api/jobs → Job (auth, role:employer|admin)
- GET /api/jobs/{id} → Job
- PUT /api/jobs/{id} → Job
- DELETE /api/jobs/{id} → message
- POST /api/jobs/{id}/approve → Job (admin)
- POST /api/jobs/{id}/reject → Job (admin)

### Applications  
- GET /api/jobs/{job_id}/applications → paginated (employer|admin)
- POST /api/jobs/{job_id}/applications → Application (candidate)
- GET/PUT/DELETE /api/jobs/{job_id}/applications/{app_id}
- POST /api/applications/{app_id}/status → Application (employer|admin)

### Payments (PayPal)
- POST /api/applications/{app_id}/payment/paypal/create → {approval_url, paypal_order_id}
- POST /api/applications/{app_id}/payment/paypal/capture → Payment
- GET /api/payments/{payment_id} → Payment
- POST /api/payments/paypal/webhook → message (public)

### Comments
- GET /api/jobs/{job_id}/comments → paginated
- POST /api/jobs/{job_id}/comments → Comment
- PUT/DELETE /api/jobs/{job_id}/comments/{comment_id}
- POST /api/jobs/{job_id}/comments/{comment_id}/approve → (admin)

### Categories
- GET /api/categories → [categories]
- POST/PUT/DELETE /api/categories/{id} (admin)

### Profile & Dashboard
- GET/POST /api/profile (auth)
- GET /api/admin/dashboard (admin)
- GET /api/candidate/dashboard (auth)
- GET /api/candidate/applications (auth)

### Public
- GET /api/home-data → {featured_jobs, categories, counters}

## Models

**User:** id, email (UNIQUE), role (enum), employer_type, password, phone, linkedin_profile, company_*, organization, job_title  
**Job:** id, employer_id, category_id, title, description, work_type, salary_min/max, experience_level, status (pending|approved|rejected|closed), views_count, applications_count  
**Application:** id, job_id, candidate_id, status (pending|reviewed|shortlisted|accepted|rejected|withdrawn), payment_status (unpaid|pending|paid|failed|refunded), payment_id, reviewed_at  
**Payment:** id, user_id, application_id, amount, currency, payment_method, payment_intent_id, status  
**Comment:** id, user_id, job_id, content, is_approved, deleted_at (soft delete)  
**Category:** id, name (UNIQUE), slug  
**Technology:** id, name, slug  
**Profile:** id, user_id, title, location, phone, website, linkedin_profile, github_profile, bio, profile_picture, resume, skills (JSON), experience (JSON), education (JSON)

## Critical Issues

1. **CORS Not Configured** — No config/cors.php, no middleware. SPA on different domain will fail.
2. **PayPal Webhook Not Verified** — Production vulnerability.
3. **Application Status Mismatch** — Controller uses 'under_review' but DB defines 'reviewed', 'shortlisted'.
4. **No Rate Limiting** — Login endpoint vulnerable to brute force.
5. **No Token Expiration** — Set SANCTUM_EXPIRATION in .env if needed.
6. **Only Comments Soft-Delete** — Deleting jobs/applications/payments cascades permanently.
7. **File Storage Not Cloud-Ready** — public disk won't work in production.
8. **No Refresh Token** — Must re-login if token expires.

## Frontend Integration Checklist

- Add CORS middleware
- Register/login → get token → store securely → include in Authorization header
- Check user.role before rendering UI
- Implement job listing with filters + pagination
- Application workflow: apply → wait → payment if accepted
- PayPal: create order → redirect → capture
- Handle all HTTP error codes (403, 404, 400, 409, 422, 502)
- Profile uploads (avatar, resume files)
- Test with Postman collection

See vuelance/ directory for full frontend starter code.


---

## Detailed Endpoints Reference

### Register Full Example
POST /api/register
Request: {name, email, password, password_confirmation, role, accepted_terms, employer_type, phone, company_name, organization, job_title, ...}
Response: 201 Created with {user, token, token_type}

### Login Full Example
POST /api/login  
Request: {email, password, remember_me}
Response: 200 OK with {user, token, token_type}

### All Protected Endpoints
Header: Authorization: Bearer {token}

### Job Filters
- search: string (title, description, requirements)
- location: string (LIKE)
- category_id: int
- work_type: enum (remote, onsite, hybrid, full_time, part_time, contract, internship)
- experience_level: enum (entry, junior, mid, senior, lead)
- salary_min: float
- salary_max: float
- per_page: int (default 15)

### Application Statuses
Database: pending, reviewed, shortlisted, accepted, rejected, withdrawn
Controller: pending, under_review, accepted, rejected (MISMATCH!)
Payment Status: unpaid, pending, paid, failed, refunded

### File Uploads
Endpoint: POST /api/profile
Content-Type: multipart/form-data
Fields: profile_picture (max 2MB), resume (max 10MB)
Storage: storage/app/public/profiles/
Access: Returned as relative paths in responses

### Pagination
All list endpoints support:
- per_page (int, varies by endpoint, default 15)
- Returns: {data: [...], links: {...}, meta: {...current_page, last_page, total...}}

### Roles & Permissions
- candidate: apply, view own applications, view profile, dashboard
- employer: create/edit/delete own jobs, view own job applications, manage payments
- admin: approve/reject jobs, manage comments, view dashboard, manage categories

### Important Validation Rules
- Email: unique, valid format
- Password: minimum 8 characters, must be confirmed
- Job title: required, max 255
- Job description: required, max 10000
- Application deadline: future date only
- Salary range: salary_max >= salary_min (if both provided)
- Comment: 1-2000 characters
- Profile picture: JPEG, PNG, GIF, max 2MB
- Resume: PDF, DOC, DOCX, max 10MB

---

## Complete Model Relationships

User
  - profile: hasOne Profile
  - comments: hasMany Comment
  - applications: hasMany Application (via candidate_id)
  - payments: hasMany Payment
  - jobs: hasMany Job (via employer_id, not defined in code but exists)

Job
  - employer: belongsTo User (employer_id)
  - category: belongsTo Category
  - technologies: belongsToMany Technology (job_technology pivot)
  - applications: hasMany Application
  - comments: hasMany Comment

Application
  - job: belongsTo Job
  - candidate: belongsTo User (candidate_id)
  - payments: hasMany Payment

Payment
  - user: belongsTo User
  - application: belongsTo Application

Comment
  - user: belongsTo User
  - job: belongsTo Job

Category
  - jobs: hasMany Job

Technology
  - jobs: belongsToMany Job (job_technology pivot)

Profile
  - user: belongsTo User

---

## Database Constraints

Primary Keys: id (bigint, auto-increment)

Foreign Keys with Cascading:
- jobs.employer_id → users.id (CASCADE on delete)
- applications.job_id → jobs.id (CASCADE on delete)
- applications.candidate_id → users.id (CASCADE on delete)
- payments.user_id → users.id (CASCADE on delete)
- payments.application_id → applications.id (CASCADE on delete)
- comments.user_id → users.id (CASCADE on delete)
- comments.job_id → jobs.id (CASCADE on delete)
- profiles.user_id → users.id (CASCADE on delete)

Foreign Keys with NULL:
- jobs.category_id → categories.id (NULL on delete, nullable)

Unique Constraints:
- users.email
- categories.name
- applications(job_id, candidate_id) — one application per candidate per job
- personal_access_tokens.token

Indexes:
- jobs(status, created_at)
- applications(status, payment_status)
- payments(status, payment_intent_id)
- comments(job_id, is_approved)

---

## Sanctum Token Details

Table: personal_access_tokens
Columns: id, tokenable_type (always "App\Models\User"), tokenable_id (user ID), name (always "auth_token"), token (hashed), abilities (JSON, unused), last_used_at (nullable), expires_at (nullable), created_at, updated_at

Token Format:
- Issued: plaintext string like "1|abc123def456..."
- Stored: hashed for security
- Expiration: currently set to null (never expires)
- Revocation: delete record from personal_access_tokens

---

## Common Frontend Tasks

1. Register new candidate
   - POST /api/register with role="candidate"
   - Store returned token

2. Post a job (employer)
   - POST /api/jobs with role="employer"
   - Job created with status="pending" (needs admin approval)
   - Admin posts directly: status="approved"

3. Apply for job (candidate)
   - POST /api/jobs/{id}/applications with role="candidate"
   - Creates Application with status="pending"
   - Check for 409 Conflict if already applied

4. Employer reviews applications
   - GET /api/jobs/{id}/applications (employer sees own applications)
   - POST /api/applications/{id}/status to update status

5. Candidate pays for accepted application
   - POST /api/applications/{id}/payment/paypal/create
   - Get approval_url
   - Redirect user to PayPal
   - On return, POST /api/applications/{id}/payment/paypal/capture with paypal_order_id

6. Post comment
   - POST /api/jobs/{id}/comments
   - Creates with is_approved=false (unless admin)
   - Visible to author immediately, others see after admin approval

7. Update profile
   - POST /api/profile with multipart/form-data
   - Include files: profile_picture, resume
   - Returned as storage paths (not full URLs)

---

## Environment Variables Required

Laravel:
- APP_KEY
- DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- SANCTUM_STATEFUL_DOMAINS (optional, defaults provided)
- SANCTUM_EXPIRATION (optional, defaults to null)

PayPal:
- PAYPAL_MODE (sandbox|live)
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- PAYPAL_WEBHOOK_ID (optional)

Storage:
- FILESYSTEM_DISK (default: public)

---

**Complete Integration API Reference**
**Last updated: 2026-05-10**
**Ready for Vue.js frontend integration**
