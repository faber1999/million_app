import { LoadingSpinner } from '@/shared/components/loaders/LoadingSpinner'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import PropertyCard from './components/PropertyCard'
import PropertyDetailsModal from './components/PropertyDetailsModal'
import PropertyFilters from './components/PropertyFilters'
import type { Property } from './types/property.types'
import useHomePage from './view-model/useHomePage'

const HomePage = () => {
  const {
    properties,
    totalCount,
    filters,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    applyFilters,
    clearFilters,
    loadMore,
    refetch
  } = useHomePage()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProperty(null)
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md w-full text-center"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
          >
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          </motion.div>
          <motion.h2
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Error Loading Properties
          </motion.h2>
          <motion.p
            className="text-gray-600 dark:text-gray-300 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {error}
          </motion.p>
          <motion.button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium flex items-center gap-2 mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Luxury background overlay */}
      <div
        className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f1f5f9" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.4"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]`}
      ></div>

      <div className="relative container mx-auto px-6 py-12">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 300 }}
          >
            <span className="inline-block w-24 h-1 bg-luxury-gold rounded-full mb-4"></span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-luxury text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Exceptional
            <span className="block text-luxury-gold">Luxury Properties</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover the world's most distinguished properties, where architectural excellence meets unparalleled luxury
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 300 }}
          >
            <div className="flex justify-center space-x-8 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-gold">{totalCount}+</div>
                <div className="text-sm uppercase tracking-wider">Exclusive Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-gold">50+</div>
                <div className="text-sm uppercase tracking-wider">Prime Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-luxury-gold">15+</div>
                <div className="text-sm uppercase tracking-wider">Years Experience</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <PropertyFilters filters={filters} onApplyFilters={applyFilters} onClearFilters={clearFilters} />
        </motion.div>

        <motion.div
          className="mb-12 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-luxury border border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="text-gray-700 dark:text-gray-300"
            key={properties.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {properties.length === 0 ? (
              <span className="text-gray-500 font-light">No exceptional properties found</span>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium">
                  Displaying <span className="text-luxury-gold font-semibold">{properties.length}</span> of{' '}
                  <span className="text-luxury-gold font-semibold">{totalCount}</span>
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  exclusive {totalCount === 1 ? 'property' : 'properties'}
                </span>
              </div>
            )}
          </motion.div>

          <motion.button
            onClick={() => refetch()}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: isFetching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.div>
            <span className="hidden sm:inline">Refresh Collection</span>
            <span className="sm:hidden">Refresh</span>
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner className="flex items-center justify-center h-full" />
            </motion.div>
          ) : properties.length === 0 ? (
            <motion.div
              key="no-properties"
              className="text-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-gray-400 mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center shadow-luxury">
                  <AlertCircle className="h-16 w-16 text-amber-500" />
                </div>
              </motion.div>
              <motion.h3
                className="text-3xl font-luxury text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No Exceptional Properties Found
              </motion.h3>
              <motion.p
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto font-light"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Refine your search criteria to discover the perfect luxury property that matches your distinguished
                taste.
              </motion.p>
              {Object.keys(filters).length > 0 && (
                <motion.button
                  onClick={clearFilters}
                  className="bg-luxury-gold text-white px-8 py-4 rounded-xl font-medium shadow-luxury hover:shadow-luxury-hover transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Search Criteria
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="properties-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ y: -5 }}
                  layout
                >
                  <PropertyCard property={property} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        <AnimatePresence>
          {!isLoading && properties.length > 0 && hasNextPage && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.button
                onClick={loadMore}
                disabled={isFetchingNextPage}
                className="bg-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 disabled:bg-gray-400 text-white px-12 py-4 rounded-xl font-luxury font-medium flex items-center gap-4 shadow-luxury hover:shadow-luxury-hover"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {isFetchingNextPage ? (
                  <>
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-lg">Curating More Excellence...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">Discover More Exceptional Properties</span>
                    <motion.span
                      className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      {totalCount - properties.length} more available
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <PropertyDetailsModal property={selectedProperty} isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </motion.div>
  )
}

export default HomePage
