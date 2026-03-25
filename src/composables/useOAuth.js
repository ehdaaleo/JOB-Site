// src/composables/useOAuth.js
import { oauthProviders, REDIRECT_BASE } from '@/config/oauth.config'

export function useOAuth() {
  function buildAuthUrl(provider) {
    const config = oauthProviders[provider]
    if (!config) {
      console.error(`Provider ${provider} not configured`)
      return ''
    }

    const redirectUri = `${REDIRECT_BASE}/auth/callback/${provider}`

    // Store state token to prevent CSRF
    const state = crypto.randomUUID()
    sessionStorage.setItem('oauth_state', state)
    sessionStorage.setItem('oauth_provider', provider)

    const params = new URLSearchParams({
      client_id:     config.clientId || '',
      redirect_uri:  redirectUri,
      response_type: config.responseType,
      scope:         config.scope,
      state,
    })

    return `${config.authUrl}?${params}`
  }

  function login(provider) {
    const url = buildAuthUrl(provider)
    if (url) {
      window.location.href = url
    }
  }

  return { login, buildAuthUrl }
}
