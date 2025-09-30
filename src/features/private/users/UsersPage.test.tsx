import { server } from '@/test/mocks/server'
import { render } from '@/test/utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UsersPage from './UsersPage'

// Mock createPortal to avoid portal issues in tests
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (element: React.ReactNode) => element
  }
})

describe('UsersPage', () => {
  const user = userEvent.setup()

  // Helper function to get birthday input
  const getBirthdayInput = () => document.querySelector('input[type="date"]') as HTMLInputElement

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial load and data display', () => {
    it('should render users page with loading state', async () => {
      render(<UsersPage />)

      // Check if loading indicator appears
      expect(screen.getByText('Loading users...')).toBeInTheDocument()

      // Wait for users to load
      await waitFor(() => {
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
      })

      // Check if users are displayed
      expect(screen.getByText('Admin User')).toBeInTheDocument()
      expect(screen.getByText('Regular User')).toBeInTheDocument()
    })

    it('should display user information correctly', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument()
      })

      // Check user details
      expect(screen.getByText('admin@example.com')).toBeInTheDocument()
      expect(screen.getByText('789 Admin St')).toBeInTheDocument()
      expect(screen.getByText('Phone: 555-0789')).toBeInTheDocument()
    })

    it('should handle API errors gracefully', async () => {
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/User`, () => {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 })
        })
      )

      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to load users/)).toBeInTheDocument()
      })
    })
  })

  describe('Search functionality', () => {
    it('should filter users by name', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search users...')
      await user.type(searchInput, 'Admin')

      // Wait for search to trigger
      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
        expect(screen.queryByText('Regular User')).not.toBeInTheDocument()
      })
    })

    it('should clear search when input is emptied', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search users...')
      await user.type(searchInput, 'Admin')
      await user.clear(searchInput)

      // Both users should be visible again
      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
        expect(screen.getByText('Regular User')).toBeInTheDocument()
      })
    })
  })

  describe('Create user functionality', () => {
    it('should open create modal when Add User button is clicked', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add User/i })
      await user.click(addButton)

      expect(screen.getByText('Create New User')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter email address')).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add User/i })
      await user.click(addButton)

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByText('Create New User')).toBeInTheDocument()
      })

      // Try to submit the form without filling required fields
      const createButton = screen.getByRole('button', { name: /Create User/i })

      // First click the form fields and then try to submit to trigger validation
      const nameInput = screen.getByPlaceholderText('Enter full name')
      const emailInput = screen.getByPlaceholderText('Enter email address')
      const passwordInput = screen.getByPlaceholderText('Enter password (min 6 characters)')

      await user.click(nameInput)
      await user.click(emailInput)
      await user.click(passwordInput)
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('Email is required')).toBeInTheDocument()
        expect(screen.getByText('Password is required')).toBeInTheDocument()
      })
    })

    it('should create user successfully with valid data', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add User/i })
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByPlaceholderText('Enter full name'), 'New User')
      await user.type(screen.getByPlaceholderText('Enter email address'), 'newuser@example.com')
      await user.type(screen.getByPlaceholderText('Enter password (min 6 characters)'), 'password123')
      await user.type(screen.getByPlaceholderText('Enter address'), '123 New St')
      await user.type(screen.getByPlaceholderText('Enter phone number (optional)'), '555-1234')
      await user.type(getBirthdayInput(), '1990-01-01')

      const createButton = screen.getByRole('button', { name: /Create User/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/User created successfully/)).toBeInTheDocument()
      })
    })
  })

  describe('Edit user functionality', () => {
    it('should open edit modal with pre-filled data', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      expect(screen.getByText('Edit User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Admin User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('admin@example.com')).toBeInTheDocument()
    })

    it('should update user successfully', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('Admin User')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated Admin User')

      const updateButton = screen.getByRole('button', { name: /Update User/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/User updated successfully/)).toBeInTheDocument()
      })
    })
  })

  describe('Delete user functionality', () => {
    it('should open delete confirmation modal', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      expect(screen.getByText('Delete User')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    })

    it('should delete user successfully', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const confirmButton = screen.getByRole('button', { name: /Delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText(/User deleted successfully/)).toBeInTheDocument()
      })
    })

    it('should cancel deletion', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Delete User')).not.toBeInTheDocument()
    })
  })

  describe('Pagination', () => {
    it('should handle pagination controls', async () => {
      // Mock response with pagination
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/User`, ({ request }) => {
          const url = new URL(request.url)
          const page = Number(url.searchParams.get('Page')) || 1

          const mockData = Array.from({ length: 25 }, (_, i) => ({
            id: String(i + 1),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            address: `Address ${i + 1}`,
            phone: `555-${String(i + 1).padStart(4, '0')}`,
            birthday: '1990-01-01'
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

      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('User 1')).toBeInTheDocument()
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
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const refreshButton = screen.getByText('Refresh')
      await user.click(refreshButton)

      // Should trigger a reload (loading state briefly appears)
      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })
    })
  })

  describe('Form validation', () => {
    it('should validate email format', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add User/i })
      await user.click(addButton)

      await user.type(screen.getByPlaceholderText('Enter email address'), 'invalid-email')
      await user.type(screen.getByPlaceholderText('Enter full name'), 'Test User')
      await user.type(screen.getByPlaceholderText('Enter password (min 6 characters)'), 'password123')

      const createButton = screen.getByRole('button', { name: /Create User/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
      })
    })

    it('should validate password length', async () => {
      render(<UsersPage />)

      await waitFor(() => {
        expect(screen.getByText('Admin User')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add User/i })
      await user.click(addButton)

      await user.type(screen.getByPlaceholderText('Enter password (min 6 characters)'), '123')
      await user.type(screen.getByPlaceholderText('Enter full name'), 'Test User')
      await user.type(screen.getByPlaceholderText('Enter email address'), 'test@example.com')

      const createButton = screen.getByRole('button', { name: /Create User/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
      })
    })
  })
})
