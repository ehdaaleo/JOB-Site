// src/config/oauth.config.js
export const oauthProviders = {
  google: {
    authUrl:      'https://accounts.google.com/o/oauth2/v2/auth',
    clientId:     import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope:        'openid email profile',
    responseType: 'code',
  },
  github: {
    authUrl:      'https://github.com/login/oauth/authorize',
    clientId:     import.meta.env.VITE_GITHUB_CLIENT_ID,
    scope:        'read:user user:email',
    responseType: 'code',
  },
  linkedin: {
    authUrl:      'https://www.linkedin.com/oauth/v2/authorization',
    clientId:     import.meta.env.VITE_LINKEDIN_CLIENT_ID,
    scope:        'openid profile email',
    responseType: 'code',
  },
}

export const REDIRECT_BASE = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173'
