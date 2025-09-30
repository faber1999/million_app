import { http } from '@/shared/lib/http'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Building, ChevronDown, Edit3, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type {
  ApiErrorResponse,
  CreatePropertyDto,
  OwnerDto,
  PropertyDto,
  PropertyDtoPagedResultDto,
  PropertySearchParams,
  UpdatePropertyDto
} from '../shared/types/api.types'

interface PropertyFormData {
  name: string
  address: string
  price: string
  image?: string
  idOwner: string
}

const PropertiesPage = () => {
  const [properties, setProperties] = useState<PropertyDto[]>([])
  const [owners, setOwners] = useState<OwnerDto[]>([])
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
  const [selectedProperty, setSelectedProperty] = useState<PropertyDto | null>(null)

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    address: '',
    price: '',
    image: '',
    idOwner: ''
  })
  const [formErrors, setFormErrors] = useState<Partial<PropertyFormData>>({})
  const [showCreateOwnerDropdown, setShowCreateOwnerDropdown] = useState(false)
  const [showEditOwnerDropdown, setShowEditOwnerDropdown] = useState(false)
  const createDropdownButtonRef = useRef<HTMLButtonElement>(null)
  const editDropdownButtonRef = useRef<HTMLButtonElement>(null)
  const createDropdownRef = useRef<HTMLDivElement>(null)
  const editDropdownRef = useRef<HTMLDivElement>(null)

  const fetchProperties = useCallback(async (params: PropertySearchParams = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const searchParams = new URLSearchParams()

      if (params.Name) searchParams.append('Name', params.Name)
      if (params.Address) searchParams.append('Address', params.Address)
      if (params.MinPrice) searchParams.append('MinPrice', params.MinPrice.toString())
      if (params.MaxPrice) searchParams.append('MaxPrice', params.MaxPrice.toString())
      if (params.Page) searchParams.append('Page', params.Page.toString())
      if (params.PageSize) searchParams.append('PageSize', params.PageSize.toString())

      const queryString = searchParams.toString()
      const url = `/api/Properties${queryString ? `?${queryString}` : ''}`

      const response = await http.get<PropertyDtoPagedResultDto>({ url })

      setProperties(response.data)
      setTotalCount(response.totalCount)
      setCurrentPage(response.page)
    } catch (err) {
      setError('Failed to load properties. Please try again.')
      console.error('Error fetching properties:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchOwners = useCallback(async () => {
    try {
      const response = await http.get<OwnerDto[]>({ url: '/api/Owners' })
      setOwners(response)
    } catch (err) {
      console.error('Error fetching owners:', err)
    }
  }, [])

  useEffect(() => {
    fetchProperties({
      Page: currentPage,
      PageSize: pageSize,
      Name: searchTerm || undefined
    })
    fetchOwners()
  }, [fetchProperties, fetchOwners, currentPage, searchTerm])

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is outside create dropdown
      if (
        showCreateOwnerDropdown &&
        createDropdownRef.current &&
        createDropdownButtonRef.current &&
        !createDropdownRef.current.contains(target) &&
        !createDropdownButtonRef.current.contains(target)
      ) {
        setShowCreateOwnerDropdown(false)
      }

      // Check if click is outside edit dropdown
      if (
        showEditOwnerDropdown &&
        editDropdownRef.current &&
        editDropdownButtonRef.current &&
        !editDropdownRef.current.contains(target) &&
        !editDropdownButtonRef.current.contains(target)
      ) {
        setShowEditOwnerDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCreateOwnerDropdown, showEditOwnerDropdown])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }, [])

  const handleRefresh = () => {
    fetchProperties({
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
    setFormData({ name: '', address: '', price: '', image: '', idOwner: '' })
    setFormErrors({})
    setShowCreateOwnerDropdown(false)
    setShowEditOwnerDropdown(false)
  }

  const validateForm = (): boolean => {
    const errors: Partial<PropertyFormData> = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.address.trim()) {
      errors.address = 'Address is required'
    }

    if (!formData.price.trim()) {
      errors.price = 'Price is required'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid price'
    }

    if (!formData.idOwner) {
      errors.idOwner = 'Owner is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Create Property
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const createData: CreatePropertyDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        price: Number(formData.price),
        image: formData.image?.trim() || undefined,
        idOwner: formData.idOwner
      }

      const newProperty = await http.post<PropertyDto>({ url: '/api/Properties', body: createData })
      setProperties((prev) => [...prev, newProperty])
      setSuccess(`Property "${formData.name}" created successfully!`)
      setShowCreateModal(false)
      resetForm()
    } catch (err) {
      setError('Failed to create property. Please try again.')
      console.error('Error creating property:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit Property
  const handleEditProperty = (property: PropertyDto) => {
    setSelectedProperty(property)
    setFormData({
      name: property.name,
      address: property.address,
      price: property.price.toString(),
      image: property.image || '',
      idOwner: property.idOwner
    })
    setShowEditModal(true)
    clearMessages()
  }

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !selectedProperty) return

    setIsSubmitting(true)
    try {
      const updateData: UpdatePropertyDto = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        price: Number(formData.price),
        image: formData.image?.trim() || undefined,
        idOwner: formData.idOwner
      }

      const updatedProperty = await http.put<PropertyDto>({
        url: `/api/Properties/${selectedProperty.id}`,
        body: updateData
      })

      setProperties((prev) =>
        prev.map((property) => (property.id === selectedProperty.id ? updatedProperty : property))
      )
      setSuccess(`Property "${formData.name}" updated successfully!`)
      setShowEditModal(false)
      resetForm()
      setSelectedProperty(null)
    } catch (err) {
      setError('Failed to update property. Please try again.')
      console.error('Error updating property:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete Property
  const handleDeleteProperty = (property: PropertyDto) => {
    setSelectedProperty(property)
    setShowDeleteModal(true)
    clearMessages()
  }

  const confirmDeleteProperty = async () => {
    if (!selectedProperty) return

    setIsSubmitting(true)
    try {
      await http._delete({ url: `/api/Properties/${selectedProperty.id}` })
      setProperties((prev) => prev.filter((property) => property.id !== selectedProperty.id))
      setSuccess(`Property "${selectedProperty.name}" deleted successfully!`)
      setShowDeleteModal(false)
      setSelectedProperty(null)
    } catch (err) {
      const apiError = err as ApiErrorResponse
      console.error('Error deleting property:', apiError)

      // Handle specific error codes if needed in the future
      if (apiError?.response?.data?.code) {
        // You can add specific error handling here based on error codes
        setError(apiError.response.data.name || 'Failed to delete property. Please try again.')
      } else {
        setError('Failed to delete property. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? owner.name : 'Unknown Owner'
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
              <Building className="h-8 w-8 text-luxury-gold" />
              <h1 className="text-4xl font-luxury text-gray-900 dark:text-white">Properties Management</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-light">
              Manage and oversee all luxury properties in your portfolio ({totalCount} total)
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
              <span>Add Property</span>
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
            placeholder="Search properties..."
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

      {/* Properties Grid */}
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
              <div className="text-gray-500">Loading properties...</div>
            </div>
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div
            key="no-properties"
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-luxury text-gray-900 dark:text-white mb-2">No Properties Found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first property'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="properties-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
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
                    <h3 className="text-xl font-luxury text-gray-900 dark:text-white">{property.name}</h3>
                    <span className="bg-luxury-gold text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {formatPrice(property.price)}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p className="text-sm">{property.address}</p>
                    <p className="text-sm">Owner: {getOwnerName(property.idOwner)}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property)}
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

      {/* Create Property Modal */}
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
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Create New Property</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateProperty} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter property name"
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
                      placeholder="Enter property address"
                      required
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter image URL (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner *</label>
                    <div className="relative">
                      <button
                        ref={createDropdownButtonRef}
                        type="button"
                        onClick={() => setShowCreateOwnerDropdown(!showCreateOwnerDropdown)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent flex items-center justify-between"
                      >
                        <span className={formData.idOwner ? '' : 'text-gray-400'}>
                          {formData.idOwner ? getOwnerName(formData.idOwner) : 'Select an owner'}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${showCreateOwnerDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showCreateOwnerDropdown &&
                        createPortal(
                          <div
                            ref={createDropdownRef}
                            className="fixed mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-[60] max-h-48 overflow-y-auto min-w-[300px]"
                            style={{
                              top: createDropdownButtonRef.current
                                ? createDropdownButtonRef.current.getBoundingClientRect().bottom + 4 + 'px'
                                : '0px',
                              left: createDropdownButtonRef.current
                                ? createDropdownButtonRef.current.getBoundingClientRect().left + 'px'
                                : '0px',
                              width: createDropdownButtonRef.current
                                ? createDropdownButtonRef.current.offsetWidth + 'px'
                                : 'auto'
                            }}
                          >
                            {owners.length === 0 ? (
                              <div className="p-4 text-gray-500 text-center">No owners available</div>
                            ) : (
                              owners.map((owner) => (
                                <button
                                  key={owner.id}
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('idOwner', owner.id)
                                    setShowCreateOwnerDropdown(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{owner.name}</div>
                                    <div className="text-sm text-gray-500">{owner.address || 'No address'}</div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>,
                          document.body
                        )}
                    </div>
                    {formErrors.idOwner && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.idOwner}</p>
                    )}
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
                      {isSubmitting ? 'Creating...' : 'Create Property'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Property Modal */}
      <AnimatePresence>
        {showEditModal && selectedProperty && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Edit Property</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProperty} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter property name"
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
                      placeholder="Enter property address"
                      required
                    />
                    {formErrors.address && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                    {formErrors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                      placeholder="Enter image URL (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner *</label>
                    <div className="relative">
                      <button
                        ref={editDropdownButtonRef}
                        type="button"
                        onClick={() => setShowEditOwnerDropdown(!showEditOwnerDropdown)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent flex items-center justify-between"
                      >
                        <span className={formData.idOwner ? '' : 'text-gray-400'}>
                          {formData.idOwner ? getOwnerName(formData.idOwner) : 'Select an owner'}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${showEditOwnerDropdown ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {showEditOwnerDropdown &&
                        createPortal(
                          <div
                            ref={editDropdownRef}
                            className="fixed mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-[60] max-h-48 overflow-y-auto min-w-[300px]"
                            style={{
                              top: editDropdownButtonRef.current
                                ? editDropdownButtonRef.current.getBoundingClientRect().bottom + 4 + 'px'
                                : '0px',
                              left: editDropdownButtonRef.current
                                ? editDropdownButtonRef.current.getBoundingClientRect().left + 'px'
                                : '0px',
                              width: editDropdownButtonRef.current
                                ? editDropdownButtonRef.current.offsetWidth + 'px'
                                : 'auto'
                            }}
                          >
                            {owners.length === 0 ? (
                              <div className="p-4 text-gray-500 text-center">No owners available</div>
                            ) : (
                              owners.map((owner) => (
                                <button
                                  key={owner.id}
                                  type="button"
                                  onClick={() => {
                                    handleInputChange('idOwner', owner.id)
                                    setShowEditOwnerDropdown(false)
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{owner.name}</div>
                                    <div className="text-sm text-gray-500">{owner.address || 'No address'}</div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>,
                          document.body
                        )}
                    </div>
                    {formErrors.idOwner && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.idOwner}</p>
                    )}
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
                      {isSubmitting ? 'Updating...' : 'Update Property'}
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
        {showDeleteModal && selectedProperty && (
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
                    <h2 className="text-xl font-luxury text-gray-900 dark:text-white">Delete Property</h2>
                    <p className="text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">"{selectedProperty.name}"</span>?
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Address: {selectedProperty.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Price: {formatPrice(selectedProperty.price)}
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
                    onClick={confirmDeleteProperty}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete Property'}
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

export default PropertiesPage
