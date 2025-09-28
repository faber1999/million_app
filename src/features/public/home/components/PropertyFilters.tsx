import { AnimatePresence, motion } from 'framer-motion'
import { DollarSign, MapPin, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import type { PropertyFilters } from '../types/property.types'

interface PropertyFiltersProps {
  filters: PropertyFilters
  onApplyFilters: (filters: PropertyFilters) => void
  onClearFilters: () => void
}

const PropertyFiltersComponent: React.FC<PropertyFiltersProps> = ({ filters, onApplyFilters, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApplyFilters(localFilters)
  }

  const handleInputChange = (field: keyof PropertyFilters, value: string | number) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }))
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '')

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.h2
        className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Search Properties
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Property name"
              value={localFilters.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: -5 }} transition={{ duration: 0.2 }}>
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </motion.div>
            <motion.input
              type="text"
              placeholder="Address"
              value={localFilters.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ duration: 0.2 }}>
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </motion.div>
            <motion.input
              type="number"
              placeholder="Min price"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.1, rotate: -10 }} transition={{ duration: 0.2 }}>
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </motion.div>
            <motion.input
              type="number"
              placeholder="Max price"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
              whileFocus={{ scale: 1.02 }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex gap-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
            whileHover={{
              scale: 1.05,
              boxShadow: '0 10px 25px -12px rgba(59, 130, 246, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            Search
          </motion.button>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                onClick={() => {
                  setLocalFilters({})
                  onClearFilters()
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium flex items-center gap-2"
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                  duration: 0.3
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px -12px rgba(75, 85, 99, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                  <X className="h-4 w-4" />
                </motion.div>
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}

export default PropertyFiltersComponent
