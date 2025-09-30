import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div className="relative container mx-auto px-6 py-12">
      <motion.div
        className="min-h-[60vh] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl md:text-9xl font-luxury text-luxury-gold mb-4">
              404
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-luxury text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              The page you're looking for doesn't exist.
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={handleGoHome}
              className="bg-luxury-gold hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 mx-auto"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-5 w-5" />
              <span>Go to Home</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFoundPage
