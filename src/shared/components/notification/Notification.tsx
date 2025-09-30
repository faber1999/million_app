// Notification.tsx

import type { NotificationData } from '@/shared/stores/useNotificationStore'
import { t } from 'i18next'
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export interface NotificationProps extends NotificationData {
  onClose?: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const colorMap = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300',
    progress: 'bg-green-500'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
    progress: 'bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300',
    progress: 'bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
    progress: 'bg-blue-500'
  }
}

export const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 4500,
  closable = true,
  pauseOnHover = true,
  onClose
}) => {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [paused, setPaused] = useState(false)

  const Icon = iconMap[type]
  const colors = colorMap[type]

  // dispara la animación de entrada
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  // cierra tras animación de salida
  const handleClose = () => {
    if (leaving) return
    setLeaving(true)
    setTimeout(() => onClose?.(id), 300)
  }

  return (
    <div
      className={`
        notification-item w-full relative overflow-hidden rounded-lg border shadow-lg
        transition-all duration-150 ease-out
        ${visible ? 'notification-enter' : ''}
        ${leaving ? 'notification-exit' : ''}
        ${colors.bg} ${colors.border}
      `}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div className="p-4 flex items-start">
        <Icon className={`h-5 w-5 ${colors.icon}`} />
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${colors.title}`}>{title}</p>
          {message && <p className={`mt-1 text-sm ${colors.message}`}>{message}</p>}
        </div>
        {closable && (
          <button
            onClick={handleClose}
            className={`ml-4 inline-flex rounded-md focus:outline-none ${colors.icon} hover:opacity-75`}
          >
            <span className="sr-only">{t('txt.close')}</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* barra de progreso animada */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className={`${colors.progress} h-full`}
            style={{
              animation: `progress ${duration}ms linear forwards`,
              animationPlayState: paused ? 'paused' : 'running'
            }}
            onAnimationEnd={handleClose}
          />
        </div>
      )}
    </div>
  )
}
