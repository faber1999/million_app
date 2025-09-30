import { http } from '@/shared/lib/http'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Calendar, Edit3, MapPin, Phone, Plus, RefreshCw, Search, Trash2, Users, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { ApiErrorResponse, CreateOwnerDto, OwnerDto, UpdateOwnerDto } from '../shared/types/api.types'

interface OwnerFormData {
  name: string
  address: string
  phone?: string
  birthday: string
}

const OwnersPage = () => {
  const [owners, setOwners] = useState<OwnerDto[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<OwnerDto | null>(null)

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<OwnerFormData>({
    name: '',
    address: '',
    phone: '',
    birthday: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<OwnerFormData>>({})

  const fetchOwners = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await http.get<OwnerDto[]>({ url: '/api/Owners' })
      setOwners(response)
    } catch (err) {
      setError('Failed to load owners. Please try again.')
      console.error('Error fetching owners:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOwners()
  }, [fetchOwners])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleRefresh = () => {
    fetchOwners()
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const resetForm = () => {
    setFormData({ name: '', address: '', phone: '', birthday: '' })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Partial<OwnerFormData> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required'
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

  const handleInputChange = (field: keyof OwnerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Create Owner
  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const createData: CreateOwnerDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone?.trim() || undefined,
        birthday: new Date(formData.birthday).toISOString()
      }

      const newOwner = await http.post<OwnerDto>({ url: '/api/Owners', body: createData })
      setOwners((prev) => [...prev, newOwner])
      setSuccess(`Owner "${formData.name}" created successfully!`)
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      setError('Failed to create owner. Please try again.')
      console.error('Error creating owner:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit Owner
  const handleEditOwner = (owner: OwnerDto) => {
    setSelectedOwner(owner)
    setFormData({
      name: owner.name,
      address: owner.address || '',
      phone: owner.phone || '',
      birthday: owner.birthday ? new Date(owner.birthday).toISOString().split('T')[0] : ''
    })
    setShowEditModal(true)
    clearMessages()
  }

  const handleUpdateOwner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !selectedOwner) return

    setIsSubmitting(true)
    try {
      const updateData: UpdateOwnerDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone?.trim() || undefined,
        birthday: new Date(formData.birthday).toISOString()
      }

      const updatedOwner = await http.put<OwnerDto>({
        url: `/api/Owners/${selectedOwner.id}`,
        body: updateData
      })

      setOwners((prev) => prev.map((owner) => (owner.id === selectedOwner.id ? updatedOwner : owner)))
      setSuccess(`Owner "${formData.name}" updated successfully!`)
      setShowEditModal(false)
      resetForm()
      setSelectedOwner(null)
    } catch (err) {
      setError('Failed to update owner. Please try again.')
      console.error('Error updating owner:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Owner
  const handleDeleteOwner = (owner: OwnerDto) => {
    setSelectedOwner(owner)
    setShowDeleteModal(true)
    clearMessages()
  }

  const confirmDeleteOwner = async () => {
    if (!selectedOwner) return

    setIsSubmitting(true)
    try {
      await http._delete({ url: `/api/Owners/${selectedOwner.id}` })
      setOwners((prev) => prev.filter((owner) => owner.id !== selectedOwner.id))
      setSuccess(`Owner "${selectedOwner.name}" deleted successfully!`)
      setShowDeleteModal(false)
      setSelectedOwner(null)
    } catch (err) {
      const apiError = err as ApiErrorResponse
      console.error('Error deleting owner:', apiError)
      setShowDeleteModal(false)

      // Check if it's the specific error about associated properties
      if (apiError?.response?.data?.code === 'Owner.HasAssociatedProperties') {
        setError(
          `Cannot delete "${selectedOwner.name}" because this owner has properties assigned. Please reassign or delete the properties first.`
        )
      } else {
        setError('Failed to delete owner. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (owner.address && owner.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (owner.phone && owner.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <h1 className="text-4xl font-luxury text-gray-900 dark:text-white">Owners Management</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-light">
              Manage property owners and their contact information ({owners.length} total)
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
              <span>Add Owner</span>
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
            placeholder="Search owners..."
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

      {/* Owners Grid */}
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
              <div className="text-gray-500">Loading owners...</div>
            </div>
          </motion.div>
        ) : filteredOwners.length === 0 ? (
          <motion.div
            key="no-owners"
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-luxury text-gray-900 dark:text-white mb-2">No Owners Found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first owner'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="owners-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredOwners.map((owner, index) => (
              <motion.div
                key={owner.id}
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
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-luxury text-gray-900 dark:text-white">{owner.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {owner.id.substring(0, 8)}...</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {owner.address && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 text-luxury-gold flex-shrink-0" />
                        <span className="text-sm truncate">{owner.address}</span>
                      </div>
                    )}

                    {owner.birthday && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 text-luxury-gold flex-shrink-0" />
                        <span className="text-sm">{formatDate(owner.birthday)}</span>
                      </div>
                    )}

                    {owner.phone && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 text-luxury-gold flex-shrink-0" />
                        <span className="text-sm">{owner.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOwner(owner)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOwner(owner)}
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

      {/* Create Owner Modal */}
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
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Create New Owner</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateOwner} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter owner name"
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
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
                      {isSubmitting ? 'Creating...' : 'Create Owner'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Owner Modal */}
      <AnimatePresence>
        {showEditModal && selectedOwner && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Edit Owner</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateOwner} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter owner name"
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address *</label>
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
                      {isSubmitting ? 'Updating...' : 'Update Owner'}
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
        {showDeleteModal && selectedOwner && (
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
                    <h2 className="text-xl font-luxury text-gray-900 dark:text-white">Delete Owner</h2>
                    <p className="text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">"{selectedOwner.name}"</span>?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Address: {selectedOwner.address || 'Not specified'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteOwner}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete Owner'}
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

export default OwnersPage
