import { server } from '@/test/mocks/server'
import { render } from '@/test/utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PropertiesPage from './PropertiesPage'

// Mock createPortal to avoid portal issues in tests
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (element: ReactNode) => element
  }
})

describe('PropertiesPage', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial load and data display', () => {
    it('should render properties page with loading state', async () => {
      render(<PropertiesPage />)

      // Check if loading indicator appears
      expect(screen.getByText('Loading properties...')).toBeInTheDocument()

      // Wait for properties to load
      await waitFor(() => {
        expect(screen.queryByText('Loading properties...')).not.toBeInTheDocument()
      })

      // Check if properties are displayed
      expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      expect(screen.getByText('Modern Apartment')).toBeInTheDocument()
    })

    it('should display property information correctly', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      // Check property details
      expect(screen.getByText('123 Property St')).toBeInTheDocument()
      expect(screen.getByText('$250,000')).toBeInTheDocument()
      expect(screen.getByText('Owner: John Doe')).toBeInTheDocument()
    })

    it('should handle API errors gracefully', async () => {
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Properties`, () => {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 })
        })
      )

      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to load properties/)).toBeInTheDocument()
      })
    })
  })

  describe('Search functionality', () => {
    it('should filter properties by name', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search properties...')
      await user.type(searchInput, 'Beautiful')

      // Wait for search to trigger
      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
        expect(screen.queryByText('Modern Apartment')).not.toBeInTheDocument()
      })
    })

    it('should clear search when input is emptied', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search properties...')
      await user.type(searchInput, 'Beautiful')
      await user.clear(searchInput)

      // Both properties should be visible again
      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
        expect(screen.getByText('Modern Apartment')).toBeInTheDocument()
      })
    })
  })

  describe('Create property functionality', () => {
    it('should open create modal when Add Property button is clicked', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Property')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter property name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter property address')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter price')).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      // Check that modal opens
      expect(screen.getByText('Create New Property')).toBeInTheDocument()

      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /Create Property/i })
      await user.click(submitButton)

      // Check validation messages appear
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Address is required')).toBeInTheDocument()
      expect(screen.getByText('Price is required')).toBeInTheDocument()
      expect(screen.getByText('Owner is required')).toBeInTheDocument()
    })

    it('should create property successfully with valid data', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByPlaceholderText('Enter property name'), 'New Property')
      await user.type(screen.getByPlaceholderText('Enter property address'), '123 New St')
      await user.type(screen.getByPlaceholderText('Enter price'), '300000')

      // Select owner from dropdown
      const ownerDropdown = screen.getByText('Select an owner')
      await user.click(ownerDropdown)

      // Wait for dropdown options to appear and select first owner
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
      await user.click(screen.getByText('John Doe'))

      const createButton = screen.getByRole('button', { name: /Create Property/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/Property created successfully/)).toBeInTheDocument()
      })
    })

    it('should validate price is a positive number', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      await user.type(screen.getByPlaceholderText('Enter price'), '-100')
      await user.type(screen.getByPlaceholderText('Enter property name'), 'Test Property')
      await user.type(screen.getByPlaceholderText('Enter property address'), 'Test Address')

      const createButton = screen.getByRole('button', { name: /Create Property/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid price')).toBeInTheDocument()
      })
    })
  })

  describe('Edit property functionality', () => {
    it('should open edit modal with pre-filled data', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      expect(screen.getByText('Edit Property')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Beautiful House')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123 Property St')).toBeInTheDocument()
      expect(screen.getByDisplayValue('250000')).toBeInTheDocument()
    })

    it('should update property successfully', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Beautiful House')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Property Name')

      const updateButton = screen.getByRole('button', { name: /Update Property/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/Property updated successfully/)).toBeInTheDocument()
      })
    })
  })

  describe('Delete property functionality', () => {
    it('should open delete confirmation modal', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      expect(screen.getByText('Delete Property')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete "Beautiful House"/)).toBeInTheDocument()
    })

    it('should delete property successfully', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const confirmButton = screen.getByRole('button', { name: /Delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText(/Property deleted successfully/)).toBeInTheDocument()
      })
    })

    it('should cancel deletion', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Delete Property')).not.toBeInTheDocument()
    })
  })

  describe('Owner dropdown functionality', () => {
    it('should open and close owner dropdown', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      const dropdown = screen.getByText('Select an owner')
      await user.click(dropdown)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      })

      // Click outside to close
      await user.click(document.body)

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
      })
    })

    it('should select owner from dropdown', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      const dropdown = screen.getByText('Select an owner')
      await user.click(dropdown)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      await user.click(screen.getByText('John Doe'))

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Select an owner')).not.toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('should handle pagination controls', async () => {
      // Mock response with pagination
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Properties`, ({ request }) => {
          const url = new URL(request.url)
          const page = Number(url.searchParams.get('Page')) || 1

          const mockData = Array.from({ length: 25 }, (_, i) => ({
            id: String(i + 1),
            name: `Property ${i + 1}`,
            address: `Address ${i + 1}`,
            price: 100000 + i * 10000,
            ownerName: 'John Doe',
            idOwner: '1'
          }))

          const pageSize = 12
          const startIndex = (page - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedData = mockData.slice(startIndex, endIndex)

          return HttpResponse.json({
            data: paginatedData,
            totalCount: mockData.length,
            page,
            pageSize,
            totalPages: Math.ceil(mockData.length / pageSize),
            hasNextPage: endIndex < mockData.length,
            hasPreviousPage: page > 1
          })
        })
      )

      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Property 1')).toBeInTheDocument()
      })

      // Check if pagination controls are present
      expect(screen.getByText(/Page 1 of/)).toBeInTheDocument()

      // Test next page
      const nextButton = screen.getByLabelText(/Next page/i)
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Page 2 of/)).toBeInTheDocument()
      })
    })
  })

  describe('Refresh functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const refreshButton = screen.getByText('Refresh')
      await user.click(refreshButton)

      // Should trigger a reload (loading state briefly appears)
      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })
    })
  })

  describe('Error handling', () => {
    it('should handle network errors during creation', async () => {
      server.use(
        http.post(`${import.meta.env.VITE_BACKEND_URL}/api/Properties`, () => {
          return HttpResponse.json({ message: 'Network error' }, { status: 500 })
        })
      )

      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByPlaceholderText('Enter property name'), 'Test Property')
      await user.type(screen.getByPlaceholderText('Enter property address'), 'Test Address')
      await user.type(screen.getByPlaceholderText('Enter price'), '100000')

      // Select owner
      const ownerDropdown = screen.getByText('Select an owner')
      await user.click(ownerDropdown)
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
      await user.click(screen.getByText('John Doe'))

      const createButton = screen.getByRole('button', { name: /Create Property/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/Failed to create property/)).toBeInTheDocument()
      })
    })
  })

  describe('Modal closing', () => {
    it('should close modal when Cancel button is clicked', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Property')).toBeInTheDocument()

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Create New Property')).not.toBeInTheDocument()
    })

    it('should close modal when clicking outside', async () => {
      render(<PropertiesPage />)

      await waitFor(() => {
        expect(screen.getByText('Beautiful House')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Property/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Property')).toBeInTheDocument()

      // Click on backdrop - modal overlay
      const modalOverlay = document.querySelector('.fixed.inset-0') as HTMLElement
      if (modalOverlay) {
        await user.click(modalOverlay)
      }

      expect(screen.queryByText('Create New Property')).not.toBeInTheDocument()
    })
  })
})
