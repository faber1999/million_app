import { useState, useCallback } from 'react'
import { usePropertiesInfiniteQuery } from '../hooks/usePropertiesInfiniteQuery'
import type { PropertyFilters } from '../types/property.types'

const useHomePage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({})

  const {
    properties,
    totalCount,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch
  } = usePropertiesInfiniteQuery(filters)

  const applyFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    properties,
    totalCount,
    filters,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error: error?.message || null,
    applyFilters,
    clearFilters,
    loadMore,
    refetch
  }
}

export default useHomePage
