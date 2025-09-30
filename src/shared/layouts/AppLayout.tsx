import { useAuthStore } from '@/shared/stores/useAuthStore'
import { motion } from 'framer-motion'
import { Building, Home, LogOut, Users } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { http } from '../lib/http'

const AppLayout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building },
    { path: '/owners', label: 'Owners', icon: Users },
    { path: '/users', label: 'Users', icon: Users }
  ]

  const handleLogout = async () => {
    try {
      await http.post({
        url: '/api/auth/logout'
      })
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      logout()
      navigate('/')
    }
  }

  if (!user) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
      {/* Navigation Header */}
      <motion.header
        className="relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-600/30 shadow-luxury"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-luxury-gold rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-luxury text-gray-900 dark:text-white">Million Properties</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin Dashboard</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-luxury-gold text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:text-luxury-gold hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.button>
                )
              })}
            </nav>

            {/* User Info & Logout */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>

              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 hidden md:block" />

              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="relative z-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default AppLayout
