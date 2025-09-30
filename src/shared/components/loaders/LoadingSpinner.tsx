import { motion } from 'framer-motion'
import React from 'react'

interface LoadingSpinnerProps {
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = 'fixed flex items-center justify-center h-full w-full'
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          delay: 0.1
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Inner spinning ring */}
        <motion.div
          className="absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-transparent border-t-amber-500"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        {/* Pulsing center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>

      {/* Loading text */}
      <motion.div
        className="absolute mt-24"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.p
          className="text-gray-600 dark:text-gray-300 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
