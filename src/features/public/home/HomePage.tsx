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
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Real Estate Properties
          </motion.h1>
          <motion.p
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Discover your perfect property from our extensive collection
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <PropertyFilters filters={filters} onApplyFilters={applyFilters} onClearFilters={clearFilters} />
        </motion.div>

        <motion.div
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="text-gray-600 dark:text-gray-300"
            key={properties.length}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {properties.length === 0
              ? 'No properties found'
              : `Showing ${properties.length} of ${totalCount} ${totalCount === 1 ? 'property' : 'properties'}`}
          </motion.div>

          <motion.button
            onClick={() => refetch()}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: isFetching ? 360 : 0 }}
              transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>
            Refresh
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
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-gray-400 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-12 w-12" />
                </div>
              </motion.div>
              <motion.h3
                className="text-xl font-semibold text-gray-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                No Properties Found
              </motion.h3>
              <motion.p
                className="text-gray-600 dark:text-gray-300 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Try adjusting your search filters to find more properties.
              </motion.p>
              {Object.keys(filters).length > 0 && (
                <motion.button
                  onClick={clearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200 font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
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
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-3 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                {isFetchingNextPage ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Loading more...
                  </>
                ) : (
                  <>
                    Load More Properties
                    <motion.span
                      className="text-sm bg-blue-500 px-2 py-1 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                    >
                      {totalCount - properties.length} left
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
