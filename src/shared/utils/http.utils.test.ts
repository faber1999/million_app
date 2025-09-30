import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../stores/useAuthStore'
import { validateHttpStatus } from './http.utils'

// Mock notification
vi.mock('../components/notification/notificationFn', () => ({
  notification: vi.fn()
}))

// Mock useAuthStore
vi.mock('../stores/useAuthStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      logout: vi.fn()
    }))
  }
}))

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'mock-uuid')
  }
})

describe('validateHttpStatus', () => {
  let mockNotification: ReturnType<typeof vi.fn>
  const mockLogout = vi.fn()

  beforeEach(async () => {
    const module = await import('../components/notification/notificationFn')
    mockNotification = vi.mocked(module.notification)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore.getState).mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: mockLogout,
      refreshToken: vi.fn().mockResolvedValue(true)
    })
  })

  const createMockResponse = (status: number, statusText: string, data?: unknown): AxiosResponse =>
    ({
      status,
      statusText,
      data,
      headers: {},
      config: { headers: {} } as InternalAxiosRequestConfig,
      request: {}
    } as AxiosResponse)

  describe('Informational responses (100-199)', () => {
    it('should show info notification for informational status codes', () => {
      const response = createMockResponse(101, 'Switching Protocols')

      validateHttpStatus(101, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'info',
        title: 'Informational 101',
        message: 'Switching Protocols',
        id: 'mock-uuid'
      })
    })
  })

  describe('Success responses (200-299)', () => {
    it('should show success notification for success status codes', () => {
      const response = createMockResponse(200, 'OK')

      validateHttpStatus(200, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success 200',
        message: 'OK',
        id: 'mock-uuid'
      })
    })

    it('should use response data message when no statusText', () => {
      const response = createMockResponse(201, '', { message: 'Created successfully' })

      validateHttpStatus(201, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success 201',
        message: 'Created successfully',
        id: 'mock-uuid'
      })
    })
  })

  describe('Redirection responses (300-399)', () => {
    it('should show warning notification for redirection status codes', () => {
      const response = createMockResponse(301, 'Moved Permanently')

      validateHttpStatus(301, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'warning',
        title: 'Redirection 301',
        message: 'Moved Permanently',
        id: 'mock-uuid'
      })
    })
  })

  describe('Client error responses (400-499)', () => {
    it('should show error notification for client error status codes', () => {
      const response = createMockResponse(400, 'Bad Request')

      validateHttpStatus(400, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Client Error 400',
        message: 'Bad Request',
        id: 'mock-uuid'
      })
    })

    it('should trigger logout for 401 status code', () => {
      const response = createMockResponse(401, 'Unauthorized')

      validateHttpStatus(401, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Client Error 401',
        message: 'Unauthorized',
        id: 'mock-uuid'
      })
      expect(mockLogout).toHaveBeenCalled()
    })
  })

  describe('Server error responses (500-599)', () => {
    it('should show error notification for server error status codes', () => {
      const response = createMockResponse(500, 'Internal Server Error')

      validateHttpStatus(500, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Server Error 500',
        message: 'Internal Server Error',
        id: 'mock-uuid'
      })
    })
  })

  describe('Unknown status codes', () => {
    it('should show error notification for unknown status codes', () => {
      const response = createMockResponse(999, 'Unknown')

      validateHttpStatus(999, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Unknown Status Code 999',
        message: 'Unknown',
        id: 'mock-uuid'
      })
    })
  })

  describe('Empty response handling', () => {
    it('should handle empty description gracefully', () => {
      const response = createMockResponse(200, '')

      validateHttpStatus(200, response)

      expect(mockNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Success 200',
        message: '',
        id: 'mock-uuid'
      })
    })
  })
})
