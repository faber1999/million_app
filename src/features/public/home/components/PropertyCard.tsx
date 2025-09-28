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
      className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-luxury overflow-hidden group cursor-pointer border border-gray-200/50 dark:border-gray-700/50"
      whileHover={{
        y: -12,
        boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
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
          className="absolute top-4 right-4 z-10"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
        >
          <motion.span
            className="bg-luxury-gold text-white px-4 py-2 rounded-xl text-sm font-luxury font-medium shadow-luxury backdrop-blur-sm border border-white/20"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            {formatPrice(property.price)}
          </motion.span>
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent backdrop-blur-sm flex items-center justify-center"
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
          <motion.div
            className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Eye className="h-6 w-6 text-white" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h3
          className="text-xl font-luxury text-gray-900 dark:text-white mb-3 line-clamp-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {property.name}
        </motion.h3>

        <motion.div
          className="space-y-3 mb-6"
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
            <motion.div 
              className="text-luxury-gold"
              whileHover={{ scale: 1.2, rotate: 10 }} 
              transition={{ duration: 0.2 }}
            >
              <MapPin className="h-5 w-5 mr-3 flex-shrink-0" />
            </motion.div>
            <span className="text-sm font-light line-clamp-2 truncate">{property.address}</span>
          </motion.div>

          <motion.div
            className="flex items-center text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <motion.div 
              className="text-luxury-gold"
              whileHover={{ scale: 1.2, rotate: -10 }} 
              transition={{ duration: 0.2 }}
            >
              <User className="h-5 w-5 mr-3 flex-shrink-0" />
            </motion.div>
            <span className="text-sm font-light">{property.ownerName}</span>
          </motion.div>

          <motion.div
            className="flex items-center text-gray-900 dark:text-white"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.div 
              className="text-luxury-gold"
              whileHover={{ scale: 1.2, rotate: 15 }} 
              transition={{ duration: 0.2 }}
            >
              <DollarSign className="h-5 w-5 mr-3 flex-shrink-0" />
            </motion.div>
            <span className="text-lg font-luxury font-medium">{formatPrice(property.price)}</span>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(property)
          }}
          className="w-full bg-luxury-gold text-white py-4 px-6 rounded-xl font-luxury font-medium flex items-center justify-center gap-3 shadow-luxury hover:shadow-luxury-hover border border-amber-400/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          whileHover={{
            scale: 1.02,
            y: -2,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #92400e 100%)'
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Eye className="h-5 w-5" />
          </motion.div>
          <span className="text-base">View Exclusive Details</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default PropertyCard
