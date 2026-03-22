# JOB-Site - Freelance Platform

A modern freelancing platform built with Vue 3, Vite, Pinia, and Vue Router. Connect talented freelancers with employers looking for skilled professionals.

## Features

- **Freelancer Registration** - Create a profile showcasing your skills, experience, and portfolio
- **Employer Registration** - Post projects and find qualified freelancers
- **Multi-step Registration Forms** - User-friendly onboarding for both freelancers and employers
- **Password Strength Indicator** - Real-time feedback on password security
- **Social Authentication UI** - Ready for Google and GitHub OAuth integration
- **Responsive Design** - Built with Tailwind CSS and DaisyUI for a beautiful, mobile-first experience
- **Email Verification** - Secure account activation flow
- **Forgot/Reset Password** - Complete password recovery workflow

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```

### Run Unit Tests in Watch Mode

```sh
npm run test -- --watch
```

### Run Unit Tests with UI

```sh
npm run test:ui
```

### Run Unit Tests Once (No Watch Mode)

```sh
npm run test:run
```

### Format Code with Prettier

```sh
npm run format
```

---

## Testing Documentation

### Test Framework

This project uses **Vitest** as the testing framework, configured with:

- **@vue/test-utils** - Vue 3 component testing utilities
- **happy-dom** - Fast, lightweight DOM environment for testing
- **@vitest/ui** - Visual test runner UI

### Test Configuration

Tests are configured in `vitest.config.js`:

```js
test: {
  globals: true,
  environment: 'happy-dom',
  setupFiles: ['./src/test/setup.js'],
  include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
}
```

### Test File Location

Test files are located alongside their source files with the `.test.js` suffix:

- Components: `src/components/**/*.test.js`
- Views: `src/views/**/*.test.js`
- Stores: `src/stores/**/*.test.js`

### Test Coverage Summary

| Category | Files Tested | Tests Count |
|----------|-------------|-------------|
| **Stores** | 1 | 3 |
| **Components** | 3 | 24 |
| **Auth Components** | 9 | 70+ |
| **Views** | 6 | 40+ |
| **Total** | **19** | **137+** |

### What's Tested

#### Stores
- `counter.js` - State management, getters, actions

#### Core Components
- `AuthCard.vue` - Title, subtitle, slots, logo
- `PasswordStrength.vue` - Password requirements validation, visual indicators
- `SocialAuthButtons.vue` - Google/GitHub buttons, layout

#### Auth Components
- `LoginForm.vue` - Form fields, validation, submit emission
- `RoleSelection.vue` - Freelancer/Employer selection, styling
- `EmployerTypeSelection.vue` - Company/Individual selection
- `AccountForm.vue` - Account fields, password matching
- `CandidateProfileForm.vue` - Profile fields, resume upload
- `CompanyDetailsForm.vue` - Company fields, validation
- `IndividualEmployerForm.vue` - Professional fields
- `LogoUpload.vue` - Logo upload, preview, file handling
- `ReviewSubmit.vue` - Review display, terms acceptance

#### Views
- `HomeView.vue` - Basic rendering
- `AboutView.vue` - Basic rendering
- `LoginView.vue` - Login page integration
- `RegisterView.vue` - Registration page integration
- `ForgotPasswordView.vue` - Password reset request
- `ResetPasswordView.vue` - Password reset with validation

### Writing New Tests

Follow this pattern for new test files:

```js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName', () => {
  it('renders correctly', () => {
    const wrapper = mount(ComponentName)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### Best Practices

1. **Test user interactions** - Click events, form submissions, input changes
2. **Test edge cases** - Empty states, validation errors, boundary conditions
3. **Test emitted events** - Verify component emits correct events
4. **Test props** - Verify component handles props correctly
5. **Test slots** - Verify default and named slots render properly

---

## User Roles

### Freelancer
Freelancers can:
- Create a detailed profile with skills and experience
- Upload their resume
- Browse and apply for projects
- Manage their portfolio

### Employer
Employers can:
- Register as a company or individual
- Post project listings
- Review freelancer profiles
- Hire talent for their projects

---

## Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS + DaisyUI
- **Testing**: Vitest + @vue/test-utils
- **Code Formatting**: Prettier

---

## License

MIT
