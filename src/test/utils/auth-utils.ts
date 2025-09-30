import { http } from '@/shared/lib/http'

let isAuthenticated = false
let authPromise: Promise<void> | null = null

export const authenticateForTests = async (): Promise<void> => {
  if (isAuthenticated) {
    return Promise.resolve()
  }
  
  if (authPromise) {
    return authPromise
  }

  authPromise = performAuthentication()
  return authPromise
}

const performAuthentication = async (): Promise<void> => {
  try {
    const email = import.meta.env.VITE_USER_LOGIN
    const password = import.meta.env.VITE_USER_PASSWORD

    if (!email || !password) {
      throw new Error('Authentication credentials not provided in environment variables')
    }

    await http.post({
      url: '/api/auth/login',
      body: {
        email,
        password
      }
    })

    isAuthenticated = true
    console.log('✅ Test authentication successful')
  } catch (error) {
    console.error('❌ Test authentication failed:', error)
    throw error
  }
}

export const resetAuthState = (): void => {
  isAuthenticated = false
  authPromise = null
}