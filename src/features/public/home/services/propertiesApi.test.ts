import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiResponse, Property, PropertyQueryParams } from '../types/property.types'
import { fetchProperties } from './propertiesApi'

// Mock http client
vi.mock('@/shared/lib/http', () => ({
  http: {
    get: vi.fn()
  }
}))

describe('propertiesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchProperties', () => {
    it('should build correct URL with pagination parameters', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: '/api/properties?Page=1&PageSize=10'
      })
    })

    it('should include name filter in URL when provided', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10,
        name: 'Beautiful House'
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: expect.stringContaining('name=Beautiful+House')
      })
    })

    it('should include address filter in URL when provided', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10,
        address: '123 Main St'
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: expect.stringContaining('address=123+Main+St')
      })
    })

    it('should include MinPrice filter when greater than 0', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10,
        MinPrice: 100000
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: expect.stringContaining('MinPrice=100000')
      })
    })

    it('should not include MinPrice filter when 0', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10,
        MinPrice: 0
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: expect.not.stringContaining('MinPrice')
      })
    })

    it('should include MaxPrice filter when greater than 0', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 1,
        PageSize: 10,
        MaxPrice: 500000
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      })

      await fetchProperties(params)

      expect(mockGet).toHaveBeenCalledWith({
        url: expect.stringContaining('MaxPrice=500000')
      })
    })

    it('should include all filters when provided', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const params: PropertyQueryParams = {
        Page: 2,
        PageSize: 20,
        name: 'Modern',
        address: 'Downtown',
        MinPrice: 200000,
        MaxPrice: 800000
      }

      mockGet.mockResolvedValueOnce({
        data: [],
        totalCount: 0,
        page: 2,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: true
      })

      await fetchProperties(params)

      const call = mockGet.mock.calls[0][0]
      expect(call.url).toContain('Page=2')
      expect(call.url).toContain('PageSize=20')
      expect(call.url).toContain('name=Modern')
      expect(call.url).toContain('address=Downtown')
      expect(call.url).toContain('MinPrice=200000')
      expect(call.url).toContain('MaxPrice=800000')
    })

    it('should return API response data', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      const mockResponse: ApiResponse<Property> = {
        data: [
          {
            id: '1',
            name: 'Test Property',
            address: 'Test Address',
            price: 300000,
            image: 'test.jpg',
            ownerName: 'John Doe',
            idOwner: '1'
          }
        ],
        totalCount: 1,
        page: 1,
        pageSize: 10,
        totalPages: 1
      }

      mockGet.mockResolvedValueOnce(mockResponse)

      const result = await fetchProperties({
        Page: 1,
        PageSize: 10
      })

      expect(result).toEqual(mockResponse)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].name).toBe('Test Property')
    })

    it('should handle API errors', async () => {
      const { http } = await import('@/shared/lib/http')
      const mockGet = vi.mocked(http.get)

      mockGet.mockRejectedValueOnce(new Error('Network error'))

      await expect(
        fetchProperties({
          Page: 1,
          PageSize: 10
        })
      ).rejects.toThrow('Network error')
    })
  })
})
