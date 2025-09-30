import { http } from '@/shared/lib/http'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Edit3, Mail, Plus, RefreshCw, Search, Trash2, UserCheck, Users, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type {
  ApiErrorResponse,
  CreateUserRequestDto,
  UpdateUserDto,
  UserDto,
  UserDtoPagedResultDto,
  UserSearchParams
} from '../shared/types/api.types'

interface UserFormData {
  name: string
  address: string
  email: string
  phone: string
  password: string
  birthday: string
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserDto[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const pageSize = 12

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    birthday: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({})

  const fetchUsers = useCallback(async (params: UserSearchParams = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const searchParams = new URLSearchParams()

      if (params.Name) searchParams.append('Name', params.Name)
      if (params.Email) searchParams.append('Email', params.Email)
      if (params.Page) searchParams.append('Page', params.Page.toString())
      if (params.PageSize) searchParams.append('PageSize', params.PageSize.toString())

      const queryString = searchParams.toString()
      const url = `/api/User${queryString ? `?${queryString}` : ''}`

      const response = await http.get<UserDtoPagedResultDto>({ url })

      setUsers(response.data)
      setTotalCount(response.totalCount)
      setCurrentPage(response.page)
    } catch (err) {
      setError('Failed to load users. Please try again.')
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers({
      Page: currentPage,
      PageSize: pageSize,
      Name: searchTerm || undefined
    })
  }, [fetchUsers, currentPage, searchTerm])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handleRefresh = () => {
    fetchUsers({
      Page: currentPage,
      PageSize: pageSize,
      Name: searchTerm || undefined
    })
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const resetForm = () => {
    setFormData({ name: '', address: '', email: '', phone: '', password: '', birthday: '' })
    setFormErrors({})
  }

  const validateForm = (isEdit = false): boolean => {
    const errors: Partial<UserFormData> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!isEdit && !formData.password.trim()) {
      errors.password = 'Password is required'
    } else if (!isEdit && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!formData.birthday.trim()) {
      errors.birthday = 'Birthday is required'
    } else {
      const date = new Date(formData.birthday)
      if (isNaN(date.getTime())) {
        errors.birthday = 'Please enter a valid date'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const createData: CreateUserRequestDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        birthday: new Date(formData.birthday).toISOString()
      }

      const newUser = await http.post<UserDto>({ url: '/api/User', body: createData })
      setUsers((prev) => [...prev, newUser])
      setSuccess(`User "${formData.name}" created successfully!`)
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      setError('Failed to create user. Please try again.')
      console.error('Error creating user:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit User
  const handleEditUser = (user: UserDto) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      address: user.address,
      email: user.email,
      phone: user.phone || '',
      password: '', // Don't pre-fill password for security
      birthday: user.birthday.split('T')[0] // Convert ISO to date input format
    })
    setShowEditModal(true)
    clearMessages()
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm(true) || !selectedUser) return

    setIsSubmitting(true)
    try {
      const updateData: UpdateUserDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        birthday: new Date(formData.birthday).toISOString()
      }

      const updatedUser = await http.put<UserDto>({
        url: `/api/User/${selectedUser.id}`,
        body: updateData
      })

      setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? updatedUser : user)))
      setSuccess(`User "${formData.name}" updated successfully!`)
      setShowEditModal(false)
      resetForm()
      setSelectedUser(null)
    } catch (err) {
      setError('Failed to update user. Please try again.')
      console.error('Error updating user:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete User
  const handleDeleteUser = (user: UserDto) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
    clearMessages()
  }

  const confirmDeleteUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await http._delete({ url: `/api/User/${selectedUser.id}` })
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
      setSuccess(`User "${selectedUser.name}" deleted successfully!`)
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (err) {
      const apiError = err as ApiErrorResponse
      console.error('Error deleting user:', apiError)

      // Handle specific error codes if needed in the future
      if (apiError?.response?.data?.code) {
        // You can add specific error handling here based on error codes
        setError(apiError.response.data.name || 'Failed to delete user. Please try again.')
      } else {
        setError('Failed to delete user. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      className="relative container mx-auto px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-luxury-gold" />
              <h1 className="text-4xl font-luxury text-gray-900 dark:text-white">Users Management</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-light">
              Manage and oversee all system users ({totalCount} total)
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-xl flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
              >
                <RefreshCw className="h-4 w-4" />
              </motion.div>
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setShowCreateModal(true)
                resetForm()
                clearMessages()
              }}
              className="bg-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Plus className="h-5 w-5" />
              <span>Add User</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative max-w-md">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Search className="text-luxury-gold h-5 w-5 transition-all duration-200 hover:scale-110" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Success Message */}
      {success && (
        <motion.div
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 text-green-500">✓</div>
            <p className="text-green-700 dark:text-green-300">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button onClick={handleRefresh} className="ml-auto text-red-600 hover:text-red-700 underline text-sm">
              Try again
            </button>
          </div>
        </motion.div>
      )}

      {/* Users Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="text-gray-500">Loading users...</div>
            </div>
          </motion.div>
        ) : users.length === 0 ? (
          <motion.div
            key="no-users"
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-luxury text-gray-900 dark:text-white mb-2">No Users Found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first user'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="users-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-luxury overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-luxury-gold/20 rounded-full flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-luxury-gold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-luxury text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                    <p className="text-sm">{user.address}</p>
                    {user.phone && <p className="text-sm">Phone: {user.phone}</p>}
                    <p className="text-sm">Birthday: {formatDate(user.birthday)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="flex-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create User Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Create New User</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter full name"
                        required
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter address"
                        required
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter phone number (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Birthday *
                      </label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        required
                      />
                      {formErrors.birthday && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.birthday}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Edit User</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter full name"
                        required
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter email address"
                        required
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter address"
                        required
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        placeholder="Enter phone number (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Birthday *
                      </label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => handleInputChange('birthday', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                        required
                      />
                      {formErrors.birthday && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.birthday}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      <strong>Note:</strong> Password cannot be changed through this form for security reasons.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update User'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-luxury text-gray-900 dark:text-white">Delete User</h2>
                    <p className="text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">"{selectedUser.name}"</span>?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Email: {selectedUser.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address: {selectedUser.address}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteUser}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default UsersPage
