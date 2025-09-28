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
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-luxury p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="inline-block w-16 h-1 bg-luxury-gold rounded-full mb-4"></div>
        <h2 className="text-2xl font-luxury text-gray-900 dark:text-white mb-2">Discover Your Perfect Property</h2>

        <p className="text-gray-600 dark:text-gray-300 font-light">
          Refine your search to find exceptional luxury properties
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Search className="text-luxury-gold h-5 w-5 transition-all duration-200 hover:scale-110" />
            </div>

            <motion.input
              type="text"
              placeholder="Property name"
              value={localFilters.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400"
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <MapPin className="text-luxury-gold h-5 w-5 transition-all duration-200 hover:scale-110" />
            </div>
            <motion.input
              type="text"
              placeholder="Address"
              value={localFilters.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400"
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <DollarSign className="text-luxury-gold h-5 w-5 transition-all duration-200 hover:scale-110" />
            </div>
            <motion.input
              type="number"
              placeholder="Min price"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400"
            />
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <DollarSign className="text-luxury-gold h-5 w-5 transition-all duration-200 hover:scale-110" />
            </div>
            <motion.input
              type="number"
              placeholder="Max price"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white transition-all duration-300 font-light placeholder-gray-400"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.button
            type="submit"
            className="bg-luxury-gold text-white px-10 py-4 rounded-xl font-luxury font-medium shadow-luxury hover:shadow-luxury-hover border border-amber-400/20 flex items-center gap-3"
            whileHover={{
              scale: 1.02,
              y: -2,
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)'
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            <Search className="h-5 w-5" />
            <span className="text-base">Search Exclusive Properties</span>
          </motion.button>

          <AnimatePresence>
            {hasActiveFilters && (
              <motion.button
                type="button"
                onClick={() => {
                  setLocalFilters({})
                  onClearFilters()
                }}
                className="bg-gray-500/80 hover:bg-gray-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-luxury font-medium flex items-center gap-3 border border-gray-400/20 shadow-lg"
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
                  scale: 1.02,
                  y: -2,
                  boxShadow: '0 10px 25px -12px rgba(75, 85, 99, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                  <X className="h-5 w-5" />
                </motion.div>
                <span className="text-base">Reset Filters</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}

export default PropertyFiltersComponent
