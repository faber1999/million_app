export interface Property {
  id: string
  idOwner: string
  name: string
  address: string
  price: number
  image: string
  ownerName: string
}

export interface PropertyFilters {
  name?: string
  address?: string
  minPrice?: number
  maxPrice?: number
}

export interface PropertyQueryParams {
  name?: string
  address?: string
  MinPrice?: number
  MaxPrice?: number
  Page: number
  PageSize: number
}

export interface ApiResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface HomePageState {
  properties: Property[]
  filteredProperties: Property[]
  filters: PropertyFilters
  isLoading: boolean
  error: string | null
  pagination: {
    totalCount: number
    page: number
    pageSize: number
    totalPages: number
  }
}