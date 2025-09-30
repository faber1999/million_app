import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UserData } from './useAuthStore'
import { useAuthStore } from './useAuthStore'

// Mock http
vi.mock('../lib/http', () => ({
  http: {
    post: vi.fn()
  }
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ user: null })
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have null user initially', () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
    })
  })

  describe('login', () => {
    it('should set user data on login', () => {
      const userData: UserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }

      useAuthStore.getState().login(userData)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(userData)
      expect(state.user?.id).toBe('123')
      expect(state.user?.name).toBe('John Doe')
      expect(state.user?.email).toBe('john@example.com')
    })

    it('should update user data when login is called multiple times', () => {
      const firstUser: UserData = {
        id: '1',
        name: 'User One',
        email: 'user1@example.com'
      }

      const secondUser: UserData = {
        id: '2',
        name: 'User Two',
        email: 'user2@example.com'
      }

      useAuthStore.getState().login(firstUser)
      expect(useAuthStore.getState().user?.id).toBe('1')

      useAuthStore.getState().login(secondUser)
      expect(useAuthStore.getState().user?.id).toBe('2')
      expect(useAuthStore.getState().user?.name).toBe('User Two')
    })
  })

  describe('logout', () => {
    it('should clear user data on logout', () => {
      const userData: UserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }

      useAuthStore.getState().login(userData)
      expect(useAuthStore.getState().user).not.toBeNull()

      useAuthStore.getState().logout()
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('should handle logout when no user is logged in', () => {
      expect(useAuthStore.getState().user).toBeNull()

      useAuthStore.getState().logout()
      expect(useAuthStore.getState().user).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should return true on successful token refresh', async () => {
      const { http } = await import('../lib/http')
      const mockPost = vi.mocked(http.post)

      mockPost.mockResolvedValueOnce({ success: true })

      const result = await useAuthStore.getState().refreshToken()

      expect(result).toBe(true)
      expect(mockPost).toHaveBeenCalledWith({ url: '/api/auth/refresh' })
    })

    it('should return false and clear user on failed token refresh', async () => {
      const { http } = await import('../lib/http')
      const mockPost = vi.mocked(http.post)

      // Set initial user
      const userData: UserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }
      useAuthStore.getState().login(userData)
      expect(useAuthStore.getState().user).not.toBeNull()

      // Mock failed refresh
      mockPost.mockRejectedValueOnce(new Error('Refresh failed'))

      const result = await useAuthStore.getState().refreshToken()

      expect(result).toBe(false)
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('should call refresh endpoint with correct URL', async () => {
      const { http } = await import('../lib/http')
      const mockPost = vi.mocked(http.post)

      mockPost.mockResolvedValueOnce({ success: true })

      await useAuthStore.getState().refreshToken()

      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(mockPost).toHaveBeenCalledWith({ url: '/api/auth/refresh' })
    })

    it('should handle network errors during refresh', async () => {
      const { http } = await import('../lib/http')
      const mockPost = vi.mocked(http.post)

      mockPost.mockRejectedValueOnce(new Error('Network error'))

      const result = await useAuthStore.getState().refreshToken()

      expect(result).toBe(false)
    })
  })

  describe('state persistence', () => {
    it('should maintain user data across multiple operations', () => {
      const userData: UserData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      }

      // Login
      useAuthStore.getState().login(userData)
      let state = useAuthStore.getState()
      expect(state.user?.email).toBe('john@example.com')

      // Access user data
      state = useAuthStore.getState()
      expect(state.user?.name).toBe('John Doe')

      // Verify data is still there
      state = useAuthStore.getState()
      expect(state.user).toEqual(userData)
    })
  })
})