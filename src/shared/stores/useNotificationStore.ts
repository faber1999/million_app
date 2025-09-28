import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  closable?: boolean
  pauseOnHover?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

type NotificationOptions = Omit<NotificationData, 'id' | 'type' | 'title' | 'message'>

interface NotificationState {
  notifications: NotificationData[]
  addNotification: (notification: Omit<NotificationData, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  success: (title: string, message?: string, options?: NotificationOptions) => string
  error: (title: string, message?: string, options?: NotificationOptions) => string
  warning: (title: string, message?: string, options?: NotificationOptions) => string
  info: (title: string, message?: string, options?: NotificationOptions) => string
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    immer((set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const id = crypto.randomUUID()
        const newNotification: NotificationData = {
          id,
          duration: 4500,
          closable: true,
          pauseOnHover: true,
          ...notification
        }

        set((state) => {
          state.notifications.push(newNotification)
        })

        return id
      },

      removeNotification: (id) => {
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id)
        })
      },

      clearAll: () => {
        set((state) => {
          state.notifications = []
        })
      },

      success: (title, message, options = {}) => {
        return get().addNotification({
          type: 'success',
          title,
          message,
          ...options
        })
      },

      error: (title, message, options = {}) => {
        return get().addNotification({
          type: 'error',
          title,
          message,
          ...options
        })
      },

      warning: (title, message, options = {}) => {
        return get().addNotification({
          type: 'warning',
          title,
          message,
          ...options
        })
      },

      info: (title, message, options = {}) => {
        return get().addNotification({
          type: 'info',
          title,
          message,
          ...options
        })
      }
    })),
    { name: 'notification-store' }
  )
)
