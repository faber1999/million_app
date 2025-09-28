import { motion } from 'framer-motion'
import { DollarSign, Eye, MapPin, User } from 'lucide-react'
import React, { useState } from 'react'
import type { Property } from '../types/property.types'

interface PropertyCardProps {
  property: Property
  onViewDetails: (property: Property) => void
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const [imageError, setImageError] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group cursor-pointer"
      whileHover={{
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.4
      }}
      onClick={() => onViewDetails(property)}
    >
      <div className="relative overflow-hidden">
        {!imageError && property.image ? (
          <motion.img
            src={property.image}
            alt={property.name}
            onError={() => setImageError(true)}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <motion.div
            className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-gray-400 text-center">
              <motion.div
                className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="h-8 w-8" />
              </motion.div>
              <p className="text-sm">No image available</p>
            </div>
          </motion.div>
        )}

        <motion.div
          className="absolute top-3 right-3 z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
        >
          <motion.span
            className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {formatPrice(property.price)}
          </motion.span>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{
            opacity: 0,
            backdropFilter: 'blur(0px)'
          }}
          whileHover={{
            opacity: 1,
            backdropFilter: 'blur(4px)'
          }}
          transition={{ duration: 0.3 }}
        >
          <Eye className="h-6 w-6 text-gray-300" />
        </motion.div>
      </div>

      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h3
          className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {property.name}
        </motion.h3>

        <motion.div
          className="space-y-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            className="flex items-center text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.2 }}>
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            </motion.div>
            <span className="text-sm line-clamp-2 truncate">{property.address}</span>
          </motion.div>

          <motion.div
            className="flex items-center text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.2, rotate: -10 }} transition={{ duration: 0.2 }}>
              <User className="h-4 w-4 mr-2 flex-shrink-0" />
            </motion.div>
            <span className="text-sm">{property.ownerName}</span>
          </motion.div>

          <motion.div
            className="flex items-center text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.2, rotate: 15 }} transition={{ duration: 0.2 }}>
              <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            </motion.div>
            <span className="text-sm font-medium">{formatPrice(property.price)}</span>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(property)
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 10px 25px -12px rgba(59, 130, 246, 0.5)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Eye className="h-4 w-4" />
          </motion.div>
          View Details
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default PropertyCard
