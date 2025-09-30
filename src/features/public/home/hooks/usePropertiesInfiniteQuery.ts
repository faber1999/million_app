import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchProperties } from '../services/propertiesApi'
import type { PropertyFilters } from '../types/property.types'

const PAGE_SIZE = 10

export const usePropertiesInfiniteQuery = (filters: PropertyFilters) => {
  const query = useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        // Try real API first
        const response = await fetchProperties({
          name: filters.name,
          address: filters.address,
          MinPrice: filters.minPrice,
          MaxPrice: filters.maxPrice,
          Page: pageParam,
          PageSize: PAGE_SIZE
        })

        // If API returns data, use it
        if (response.data && response.data.length > 0) {
          return response
        }

        // Return empty for subsequent pages when using mock data
        return {
          data: [],
          totalCount: 0,
          page: pageParam,
          pageSize: PAGE_SIZE,
          totalPages: 0
        }
      } catch (error) {
        // API failed, use mock data only for first page
        if (pageParam === 1) {
          console.log('API failed, using mock data:', error)
          return {
            data: [],
            totalCount: 0,
            page: 1,
            pageSize: 0,
            totalPages: 1
          }
        }

        throw error
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1
  })

  // Flatten all pages data
  const properties = useMemo(() => {
    return query.data?.pages.flatMap((page) => page.data) ?? []
  }, [query.data])

  // Get total count from first page
  const totalCount = query.data?.pages[0]?.totalCount ?? 0

  return {
    properties,
    totalCount,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    refetch: query.refetch
  }
}
