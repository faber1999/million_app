import type {
  CreateOwnerDto,
  CreatePropertyDto,
  CreateUserRequestDto,
  OwnerDto,
  PropertyDto,
  PropertyDtoPagedResultDto,
  UpdateOwnerDto,
  UpdatePropertyDto,
  UpdateUserDto,
  UserDto,
  UserDtoPagedResultDto
} from '@/features/private/shared/types/api.types'
import { http, HttpResponse } from 'msw'

// Mock data
const mockOwners: OwnerDto[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St',
    phone: '555-0123',
    birthday: '1980-01-01'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    address: '456 Oak Ave',
    phone: '555-0456',
    birthday: '1985-05-15'
  }
]

const mockProperties: PropertyDto[] = [
  {
    id: '1',
    name: 'Beautiful House',
    address: '123 Property St',
    price: 250000,
    image: 'house1.jpg',
    ownerName: 'John Doe',
    idOwner: '1'
  },
  {
    id: '2',
    name: 'Modern Apartment',
    address: '456 Apartment Blvd',
    price: 180000,
    image: 'apt1.jpg',
    ownerName: 'Jane Smith',
    idOwner: '2'
  }
]

const mockUsers: UserDto[] = [
  {
    id: '1',
    name: 'Admin User',
    address: '789 Admin St',
    email: 'admin@example.com',
    phone: '555-0789',
    birthday: '1975-03-20'
  },
  {
    id: '2',
    name: 'Regular User',
    address: '321 User Ave',
    email: 'user@example.com',
    phone: '555-0321',
    birthday: '1990-07-10'
  }
]

export const handlers = [
  // Properties endpoints
  http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Properties`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('Page')) || 1
    const pageSize = Number(url.searchParams.get('PageSize')) || 10
    const name = url.searchParams.get('Name')

    let filteredProperties = mockProperties
    if (name) {
      filteredProperties = mockProperties.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()))
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredProperties.slice(startIndex, endIndex)

    const response: PropertyDtoPagedResultDto = {
      data: paginatedData,
      totalCount: filteredProperties.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredProperties.length / pageSize),
      hasNextPage: endIndex < filteredProperties.length,
      hasPreviousPage: page > 1
    }

    return HttpResponse.json(response)
  }),

  http.post(`${import.meta.env.VITE_BACKEND_URL}/api/Properties`, async ({ request }) => {
    const body = (await request.json()) as CreatePropertyDto
    const newProperty: PropertyDto = {
      id: String(mockProperties.length + 1),
      ...body,
      ownerName: mockOwners.find((o) => o.id === body.idOwner)?.name || 'Unknown'
    }
    mockProperties.push(newProperty)
    return HttpResponse.json(newProperty, { status: 201 })
  }),

  http.put(`${import.meta.env.VITE_BACKEND_URL}/api/Properties/:id`, async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as UpdatePropertyDto
    const propertyIndex = mockProperties.findIndex((p) => p.id === id)

    if (propertyIndex === -1) {
      return HttpResponse.json({ message: 'Property not found' }, { status: 404 })
    }

    mockProperties[propertyIndex] = { ...mockProperties[propertyIndex], ...body }
    return HttpResponse.json(mockProperties[propertyIndex])
  }),

  http.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Properties/:id`, ({ params }) => {
    const id = params.id as string
    const propertyIndex = mockProperties.findIndex((p) => p.id === id)

    if (propertyIndex === -1) {
      return HttpResponse.json({ message: 'Property not found' }, { status: 404 })
    }

    mockProperties.splice(propertyIndex, 1)
    return HttpResponse.json({}, { status: 204 })
  }),

  // Owners endpoints
  http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Owners`, () => {
    return HttpResponse.json(mockOwners)
  }),

  http.post(`${import.meta.env.VITE_BACKEND_URL}/api/Owners`, async ({ request }) => {
    const body = (await request.json()) as CreateOwnerDto
    const newOwner: OwnerDto = {
      id: String(mockOwners.length + 1),
      email: `${body.name.toLowerCase().replace(' ', '.')}@example.com`,
      ...body
    }
    mockOwners.push(newOwner)
    return HttpResponse.json(newOwner, { status: 201 })
  }),

  http.put(`${import.meta.env.VITE_BACKEND_URL}/api/Owners/:id`, async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as UpdateOwnerDto
    const ownerIndex = mockOwners.findIndex((o) => o.id === id)

    if (ownerIndex === -1) {
      return HttpResponse.json({ message: 'Owner not found' }, { status: 404 })
    }

    mockOwners[ownerIndex] = { ...mockOwners[ownerIndex], ...body }
    return HttpResponse.json(mockOwners[ownerIndex])
  }),

  http.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Owners/:id`, ({ params }) => {
    const id = params.id as string
    const ownerIndex = mockOwners.findIndex((o) => o.id === id)

    if (ownerIndex === -1) {
      return HttpResponse.json({ message: 'Owner not found' }, { status: 404 })
    }

    // Check if owner has properties
    const hasProperties = mockProperties.some((p) => p.idOwner === id)
    if (hasProperties) {
      return HttpResponse.json(
        {
          code: 'Owner.HasAssociatedProperties',
          message: 'Cannot delete owner with associated properties'
        },
        { status: 400 }
      )
    }

    mockOwners.splice(ownerIndex, 1)
    return HttpResponse.json({}, { status: 204 })
  }),

  // Users endpoints
  http.get(`${import.meta.env.VITE_BACKEND_URL}/api/User`, ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('Page')) || 1
    const pageSize = Number(url.searchParams.get('PageSize')) || 10
    const name = url.searchParams.get('Name')
    const email = url.searchParams.get('Email')

    let filteredUsers = mockUsers
    if (name) {
      filteredUsers = filteredUsers.filter((u) => u.name.toLowerCase().includes(name.toLowerCase()))
    }
    if (email) {
      filteredUsers = filteredUsers.filter((u) => u.email.toLowerCase().includes(email.toLowerCase()))
    }

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = filteredUsers.slice(startIndex, endIndex)

    const response: UserDtoPagedResultDto = {
      data: paginatedData,
      totalCount: filteredUsers.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredUsers.length / pageSize),
      hasNextPage: endIndex < filteredUsers.length,
      hasPreviousPage: page > 1
    }

    return HttpResponse.json(response)
  }),

  http.post(`${import.meta.env.VITE_BACKEND_URL}/api/User`, async ({ request }) => {
    const body = (await request.json()) as CreateUserRequestDto
    const newUser: UserDto = {
      id: String(mockUsers.length + 1),
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      birthday: body.birthday
    }
    mockUsers.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.put(`${import.meta.env.VITE_BACKEND_URL}/api/User/:id`, async ({ params, request }) => {
    const id = params.id as string
    const body = (await request.json()) as UpdateUserDto
    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body }
    return HttpResponse.json(mockUsers[userIndex])
  }),

  http.delete(`${import.meta.env.VITE_BACKEND_URL}/api/User/:id`, ({ params }) => {
    const id = params.id as string
    const userIndex = mockUsers.findIndex((u) => u.id === id)

    if (userIndex === -1) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }

    mockUsers.splice(userIndex, 1)
    return HttpResponse.json({}, { status: 204 })
  })
]
