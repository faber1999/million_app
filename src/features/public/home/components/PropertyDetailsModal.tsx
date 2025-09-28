import { AnimatePresence, motion } from 'framer-motion'
import { DollarSign, MapPin, User, X } from 'lucide-react'
import React, { useState } from 'react'
import { useBodyScrollLock } from '../../../../shared/hooks/useBodyScrollLock'
import { useClickOutside } from '../../../../shared/hooks/useClickOutside'
import type { Property } from '../types/property.types'

interface PropertyDetailsModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false)
  const modalRef = useClickOutside(onClose)

  // Block body scroll when modal is open
  useBodyScrollLock(isOpen)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <AnimatePresence>
      {isOpen && property && (
        <motion.div
          className="fixed inset-0 backdrop-blur-md bg-white/20 dark:bg-gray-900/20 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-hidden shadow-2xl border border-white/20 dark:border-gray-700/30"
            initial={{ scale: 0.7, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
          >
            <motion.div
              className="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <motion.h2
                className="text-xl font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Property Details
              </motion.h2>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {!imageError && property.image ? (
                  <motion.img
                    src={property.image}
                    alt={property.name}
                    onError={() => setImageError(true)}
                    className="w-full h-64 object-cover rounded-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="text-gray-400 text-center">
                      <motion.div
                        className="w-20 h-20 mx-auto mb-3 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <MapPin className="h-10 w-10" />
                      </motion.div>
                      <p>No image available</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                  >
                    {property.name}
                  </motion.h3>
                  <motion.div
                    className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-lg font-semibold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.0, type: 'spring', stiffness: 400 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {formatPrice(property.price)}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3, duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.2 }}>
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-gray-900 dark:text-white">{property.address}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: -10 }} transition={{ duration: 0.2 }}>
                        <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner</p>
                        <p className="text-gray-900 dark:text-white">{property.ownerName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-mono">ID: {property.idOwner}</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ duration: 0.2 }}>
                        <DollarSign className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</p>
                        <p className="text-gray-900 dark:text-white text-lg font-semibold">
                          {formatPrice(property.price)}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PropertyDetailsModal
