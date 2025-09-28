import { http } from '@/shared/lib/http'
import type { ApiResponse, Property, PropertyQueryParams } from '../types/property.types'

export const fetchProperties = async (params: PropertyQueryParams): Promise<ApiResponse<Property>> => {
  const searchParams = new URLSearchParams()

  // Add pagination parameters
  searchParams.append('Page', params.Page.toString())
  searchParams.append('PageSize', params.PageSize.toString())

  // Add filter parameters only if they exist
  if (params.name) {
    searchParams.append('name', params.name)
  }

  if (params.address) {
    searchParams.append('address', params.address)
  }

  if (params.MinPrice !== undefined && params.MinPrice > 0) {
    searchParams.append('MinPrice', params.MinPrice.toString())
  }

  if (params.MaxPrice !== undefined && params.MaxPrice > 0) {
    searchParams.append('MaxPrice', params.MaxPrice.toString())
  }

  const url = `/api/properties?${searchParams.toString()}`

  return await http.get<ApiResponse<Property>>({ url })
}
