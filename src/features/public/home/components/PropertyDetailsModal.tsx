import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { AnimatePresence, motion } from 'framer-motion'
import { DollarSign, MapPin, User, X } from 'lucide-react'
import React, { useState } from 'react'
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
          className="fixed inset-0 backdrop-blur-xl bg-black/40 flex items-center justify-center p-6 z-50"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-luxury border border-gray-200/30 dark:border-gray-600/30"
            initial={{ scale: 0.8, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 60 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.5
            }}
          >
            <motion.div
              className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-600/30 p-6 flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-12 h-1 bg-luxury-gold rounded-full mb-3"></div>
                <h2 className="text-2xl font-luxury text-gray-900 dark:text-white">Exclusive Property Details</h2>
                <p className="text-gray-600 dark:text-gray-300 font-light text-sm mt-1">
                  Curated for the distinguished connoisseur
                </p>
              </motion.div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-luxury-gold p-3 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-110 hover:rotate-90"
              >
                <X className="h-7 w-7" />
              </button>
            </motion.div>

            <motion.div
              className="p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {!imageError && property.image ? (
                  <motion.img
                    src={property.image}
                    alt={property.name}
                    onError={() => setImageError(true)}
                    className="w-full h-80 object-cover rounded-2xl shadow-luxury"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                  />
                ) : (
                  <motion.div
                    className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-luxury"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
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
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.h3
                    className="text-3xl font-luxury text-gray-900 dark:text-white mb-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {property.name}
                  </motion.h3>
                  <motion.div
                    className="inline-block bg-luxury-gold text-white px-6 py-3 rounded-2xl text-xl font-luxury font-medium shadow-luxury border border-amber-400/20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {formatPrice(property.price)}
                  </motion.div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="space-y-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.2 }}>
                        <MapPin className="h-6 w-6 text-luxury-gold mr-4 mt-1 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-luxury uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Address
                        </p>
                        <p className="text-gray-900 dark:text-white font-light text-lg">{property.address}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: -10 }} transition={{ duration: 0.2 }}>
                        <User className="h-6 w-6 text-luxury-gold mr-4 mt-1 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-luxury uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Owner
                        </p>
                        <p className="text-gray-900 dark:text-white font-light text-lg">{property.ownerName}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">
                          ID: {property.idOwner}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="space-y-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30 dark:border-gray-600/30"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ duration: 0.2 }}>
                        <DollarSign className="h-6 w-6 text-luxury-gold mr-4 mt-1 flex-shrink-0" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-luxury uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                          Investment Value
                        </p>
                        <p className="text-gray-900 dark:text-white text-2xl font-luxury font-medium">
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
