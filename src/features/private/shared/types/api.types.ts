// API Response Types
export interface PropertyDto {
  id: string
  name: string
  address: string
  price: number
  image?: string
  ownerName: string
  idOwner: string
}

export interface PropertyDtoPagedResultDto {
  data: PropertyDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CreatePropertyDto {
  name: string
  address: string
  price: number
  image?: string
  idOwner: string
}

export interface UpdatePropertyDto {
  name?: string
  address?: string
  price?: number
  image?: string
  idOwner?: string
}

export interface OwnerDto {
  id: string
  name: string
  email: string
  address?: string
  phone?: string
  birthday?: string
}

export interface CreateOwnerDto {
  name: string
  address: string
  phone?: string
  birthday: string
}

export interface UpdateOwnerDto {
  name?: string
  address?: string
  phone?: string
  birthday?: string
}

export interface UserDto {
  id: string
  name: string
  address: string
  email: string
  phone?: string
  birthday: string
}

export interface UserDtoPagedResultDto {
  data: UserDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface CreateUserRequestDto {
  name: string
  address: string
  email: string
  phone?: string
  password: string
  birthday: string
}

export interface UpdateUserDto {
  name?: string
  address?: string
  email?: string
  phone?: string
  birthday?: string
}

export interface LoginRequestDto {
  email: string
  password: string
}

// Query Parameters
export interface PropertySearchParams {
  Name?: string
  Address?: string
  MinPrice?: number
  MaxPrice?: number
  Page?: number
  PageSize?: number
}

export interface UserSearchParams {
  Name?: string
  Email?: string
  Page?: number
  PageSize?: number
}

// Error response types
export interface ApiErrorResponse {
  response?: {
    data?: {
      code?: string
      name?: string
      message?: string
    }
  }
  message?: string
}
