import { server } from '@/test/mocks/server'
import { render } from '@/test/utils/test-utils'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OwnersPage from './OwnersPage'

describe('OwnersPage', () => {
  const user = userEvent.setup()

  // Helper function to get birthday input
  const getBirthdayInput = () => document.querySelector('input[type="date"]') as HTMLInputElement

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial load and data display', () => {
    it('should render owners page with loading state', async () => {
      render(<OwnersPage />)

      // Check if loading indicator appears
      expect(screen.getByText('Loading owners...')).toBeInTheDocument()

      // Wait for owners to load
      await waitFor(() => {
        expect(screen.queryByText('Loading owners...')).not.toBeInTheDocument()
      })

      // Check if owners are displayed
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should display owner information correctly', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Check owner details (email is not displayed in the cards, only address and phone)
      expect(screen.getByText('123 Main St')).toBeInTheDocument()
      expect(screen.getByText('555-0123')).toBeInTheDocument()
    })

    it('should handle API errors gracefully', async () => {
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Owners`, () => {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 })
        })
      )

      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText(/Failed to load owners/)).toBeInTheDocument()
      })
    })
  })

  describe('Search functionality', () => {
    it('should filter owners by name', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search owners...')
      await user.type(searchInput, 'John')

      // Check filtered results
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
    })

    it('should show all owners when search is cleared', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search owners...')
      await user.type(searchInput, 'John')
      await user.clear(searchInput)

      // Both owners should be visible again
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })

    it('should show no results message for non-matching search', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText('Search owners...')
      await user.type(searchInput, 'NonExistentOwner')

      expect(screen.getByText(/No Owners Found/)).toBeInTheDocument()
    })
  })

  describe('Create owner functionality', () => {
    it('should open create modal when Add Owner button is clicked', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Owner')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter owner name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter address')).toBeInTheDocument()
      expect(getBirthdayInput()).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      const createButton = screen.getByRole('button', { name: /Create Owner/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument()
        expect(screen.getByText('Address is required')).toBeInTheDocument()
        expect(screen.getByText('Birthday is required')).toBeInTheDocument()
      })
    })

    it('should create owner successfully with valid data', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByPlaceholderText('Enter owner name'), 'New Owner')
      await user.type(screen.getByPlaceholderText('Enter address'), '123 New St')
      await user.type(screen.getByPlaceholderText('Enter phone number (optional)'), '555-1234')
      await user.type(getBirthdayInput(), '1990-01-01')

      const createButton = screen.getByRole('button', { name: /Create Owner/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/Owner created successfully/)).toBeInTheDocument()
      })
    })

    it('should validate birthday format', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      await user.type(screen.getByPlaceholderText('Enter owner name'), 'Test Owner')
      await user.type(screen.getByPlaceholderText('Enter address'), 'Test Address')
      await user.type(getBirthdayInput(), 'invalid-date')

      const createButton = screen.getByRole('button', { name: /Create Owner/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid date')).toBeInTheDocument()
      })
    })
  })

  describe('Edit owner functionality', () => {
    it('should open edit modal with pre-filled data', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      expect(screen.getByText('Edit Owner')).toBeInTheDocument()
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
      expect(screen.getByDisplayValue('555-0123')).toBeInTheDocument()
    })

    it('should update owner successfully', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[0])

      const nameInput = screen.getByDisplayValue('John Doe')
      await user.clear(nameInput)
      await user.type(nameInput, 'Updated John Doe')

      const updateButton = screen.getByRole('button', { name: /Update Owner/i })
      await user.click(updateButton)

      await waitFor(() => {
        expect(screen.getByText(/Owner updated successfully/)).toBeInTheDocument()
      })
    })
  })

  describe('Delete owner functionality', () => {
    it('should open delete confirmation modal', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      expect(screen.getByText('Delete Owner')).toBeInTheDocument()
      expect(screen.getByText(/Are you sure you want to delete "John Doe"/)).toBeInTheDocument()
    })

    it('should delete owner successfully when no associated properties', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[1]) // Delete Jane Smith who has no properties

      const confirmButton = screen.getByRole('button', { name: /Delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText(/Owner deleted successfully/)).toBeInTheDocument()
      })
    })

    it('should show error when trying to delete owner with associated properties', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0]) // Delete John Doe who has properties

      const confirmButton = screen.getByRole('button', { name: /Delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText(/Cannot delete owner with associated properties/)).toBeInTheDocument()
      })
    })

    it('should cancel deletion', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Delete Owner')).not.toBeInTheDocument()
    })
  })

  describe('Refresh functionality', () => {
    it('should refresh data when refresh button is clicked', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const refreshButton = screen.getByText('Refresh')
      await user.click(refreshButton)

      // Should trigger a reload (loading state briefly appears)
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
    })
  })

  describe('Error handling', () => {
    it('should handle network errors during creation', async () => {
      server.use(
        http.post(`${import.meta.env.VITE_BACKEND_URL}/api/Owners`, () => {
          return HttpResponse.json({ message: 'Network error' }, { status: 500 })
        })
      )

      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      // Fill form
      await user.type(screen.getByPlaceholderText('Enter owner name'), 'Test Owner')
      await user.type(screen.getByPlaceholderText('Enter address'), 'Test Address')
      await user.type(getBirthdayInput(), '1990-01-01')

      const createButton = screen.getByRole('button', { name: /Create Owner/i })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText(/Failed to create owner/)).toBeInTheDocument()
      })
    })

    it('should handle specific error codes for deletion', async () => {
      server.use(
        http.delete(`${import.meta.env.VITE_BACKEND_URL}/api/Owners/:id`, () => {
          return HttpResponse.json(
            {
              code: 'Owner.HasAssociatedProperties',
              message: 'Cannot delete owner with associated properties'
            },
            { status: 400 }
          )
        })
      )

      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      const confirmButton = screen.getByRole('button', { name: /Delete/i })
      await user.click(confirmButton)

      await waitFor(() => {
        expect(screen.getByText(/Cannot delete owner with associated properties/)).toBeInTheDocument()
      })
    })
  })

  describe('Modal closing', () => {
    it('should close modal when Cancel button is clicked', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Owner')).toBeInTheDocument()

      const cancelButton = screen.getByRole('button', { name: /Cancel/i })
      await user.click(cancelButton)

      expect(screen.queryByText('Create New Owner')).not.toBeInTheDocument()
    })

    it('should close modal when clicking outside', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      const addButton = screen.getByRole('button', { name: /Add Owner/i })
      await user.click(addButton)

      expect(screen.getByText('Create New Owner')).toBeInTheDocument()

      // Click on backdrop - modal overlay
      const modalOverlay = document.querySelector('.fixed.inset-0.bg-black/50') as HTMLElement
      if (modalOverlay) {
        await user.click(modalOverlay)
      }

      expect(screen.queryByText('Create New Owner')).not.toBeInTheDocument()
    })
  })

  describe('Phone number formatting', () => {
    it('should display phone numbers correctly', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('555-0123')).toBeInTheDocument()
        expect(screen.getByText('555-0456')).toBeInTheDocument()
      })
    })

    it('should handle owners without phone numbers', async () => {
      server.use(
        http.get(`${import.meta.env.VITE_BACKEND_URL}/api/Owners`, () => {
          return HttpResponse.json([
            {
              id: '1',
              name: 'Owner Without Phone',
              email: 'nophone@example.com',
              address: '123 No Phone St',
              birthday: '1980-01-01'
            }
          ])
        })
      )

      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('Owner Without Phone')).toBeInTheDocument()
      })

      // Should not display phone section
      expect(screen.queryByText('555-')).not.toBeInTheDocument()
    })
  })

  describe('Date formatting', () => {
    it('should display birthdays in correct format', async () => {
      render(<OwnersPage />)

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })

      // Should display formatted date
      expect(screen.getByText(/January 1, 1980/i)).toBeInTheDocument()
    })
  })
})
