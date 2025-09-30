import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NotificationData } from './useNotificationStore'
import { useNotificationStore } from './useNotificationStore'

// Mock crypto.randomUUID with counter to generate unique IDs
let idCounter = 0
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn(() => `test-uuid-${idCounter++}`)
  }
})

describe('useNotificationStore', () => {
  beforeEach(() => {
    // Reset store state and counter before each test
    useNotificationStore.setState({ notifications: [] })
    idCounter = 0
  })

  describe('initial state', () => {
    it('should have empty notifications array initially', () => {
      const state = useNotificationStore.getState()
      expect(state.notifications).toEqual([])
      expect(state.notifications).toHaveLength(0)
    })
  })

  describe('addNotification', () => {
    it('should add a notification to the store with default values', () => {
      const notification: Omit<NotificationData, 'id'> = {
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully'
      }

      useNotificationStore.getState().addNotification(notification)

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0]).toMatchObject({
        type: 'success',
        title: 'Success',
        message: 'Operation completed successfully',
        duration: 4500,
        closable: true,
        pauseOnHover: true
      })
      expect(state.notifications[0].id).toBeDefined()
    })

    it('should add multiple notifications', () => {
      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Success',
        message: 'First notification'
      })

      useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Error',
        message: 'Second notification'
      })

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(2)
      expect(state.notifications[0].type).toBe('success')
      expect(state.notifications[1].type).toBe('error')
    })

    it('should maintain order of notifications', () => {
      useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Info 1',
        message: 'Message 1'
      })
      useNotificationStore.getState().addNotification({
        type: 'warning',
        title: 'Warning 1',
        message: 'Message 2'
      })
      useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Error 1',
        message: 'Message 3'
      })

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(3)
      expect(state.notifications[0].type).toBe('info')
      expect(state.notifications[1].type).toBe('warning')
      expect(state.notifications[2].type).toBe('error')
    })

    it('should handle different notification types', () => {
      const types: Array<'success' | 'error' | 'warning' | 'info'> = ['success', 'error', 'warning', 'info']

      types.forEach((type) => {
        useNotificationStore.getState().addNotification({
          type,
          title: `${type} title`,
          message: `${type} message`
        })
      })

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(4)
      expect(state.notifications[0].type).toBe('success')
      expect(state.notifications[1].type).toBe('error')
      expect(state.notifications[2].type).toBe('warning')
      expect(state.notifications[3].type).toBe('info')
    })

    it('should allow custom duration, closable, and pauseOnHover values', () => {
      useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Custom',
        message: 'Custom notification',
        duration: 10000,
        closable: false,
        pauseOnHover: false
      })

      const state = useNotificationStore.getState()
      expect(state.notifications[0].duration).toBe(10000)
      expect(state.notifications[0].closable).toBe(false)
      expect(state.notifications[0].pauseOnHover).toBe(false)
    })
  })

  describe('removeNotification', () => {
    it('should remove a notification by id', () => {
      const id = useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Success',
        message: 'Test message'
      })
      expect(useNotificationStore.getState().notifications).toHaveLength(1)

      useNotificationStore.getState().removeNotification(id)

      expect(useNotificationStore.getState().notifications).toHaveLength(0)
    })

    it('should only remove the specified notification', () => {
      const id1 = useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Success',
        message: 'First'
      })

      const id2 = useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Error',
        message: 'Second'
      })

      useNotificationStore.getState().removeNotification(id1)

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].id).toBe(id2)
    })

    it('should handle removing non-existent notification', () => {
      useNotificationStore.getState().addNotification({
        type: 'success',
        title: 'Success',
        message: 'Test'
      })
      expect(useNotificationStore.getState().notifications).toHaveLength(1)

      useNotificationStore.getState().removeNotification('999')

      expect(useNotificationStore.getState().notifications).toHaveLength(1)
    })

    it('should handle removing from empty notifications array', () => {
      expect(useNotificationStore.getState().notifications).toHaveLength(0)

      useNotificationStore.getState().removeNotification('1')

      expect(useNotificationStore.getState().notifications).toHaveLength(0)
    })

    it('should remove notifications in correct order', () => {
      const id1 = useNotificationStore.getState().addNotification({
        type: 'info',
        title: 'Info 1',
        message: 'Message 1'
      })
      const id2 = useNotificationStore.getState().addNotification({
        type: 'warning',
        title: 'Warning 1',
        message: 'Message 2'
      })
      const id3 = useNotificationStore.getState().addNotification({
        type: 'error',
        title: 'Error 1',
        message: 'Message 3'
      })

      useNotificationStore.getState().removeNotification(id2)

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(2)
      expect(state.notifications.map((n) => n.id)).toEqual([id1, id3])
    })
  })

  describe('helper methods', () => {
    it('should create success notification using success method', () => {
      const id = useNotificationStore.getState().success('Success Title', 'Success message')

      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].type).toBe('success')
      expect(state.notifications[0].title).toBe('Success Title')
      expect(state.notifications[0].message).toBe('Success message')
      expect(id).toBe(state.notifications[0].id)
    })

    it('should create error notification using error method', () => {
      const state = useNotificationStore.getState()
      expect(state.notifications).toHaveLength(1)
      expect(state.notifications[0].type).toBe('error')
      expect(state.notifications[0].title).toBe('Error Title')
      expect(state.notifications[0].message).toBe('Error message')
    })

    it('should create warning notification using warning method', () => {
      useNotificationStore.getState().warning('Warning Title', 'Warning message')

      const state = useNotificationStore.getState()
      expect(state.notifications[0].type).toBe('warning')
    })

    it('should create info notification using info method', () => {
      useNotificationStore.getState().info('Info Title', 'Info message')

      const state = useNotificationStore.getState()
      expect(state.notifications[0].type).toBe('info')
    })

    it('should accept custom options in helper methods', () => {
      useNotificationStore.getState().success('Title', 'Message', {
        duration: 8000,
        closable: false
      })

      const state = useNotificationStore.getState()
      expect(state.notifications[0].duration).toBe(8000)
      expect(state.notifications[0].closable).toBe(false)
    })
  })

  describe('clearAll', () => {
    it('should clear all notifications', () => {
      useNotificationStore.getState().addNotification({ type: 'success', title: 'Test 1' })
      useNotificationStore.getState().addNotification({ type: 'error', title: 'Test 2' })
      useNotificationStore.getState().addNotification({ type: 'info', title: 'Test 3' })
      expect(useNotificationStore.getState().notifications).toHaveLength(3)

      useNotificationStore.getState().clearAll()

      expect(useNotificationStore.getState().notifications).toHaveLength(0)
    })

    it('should handle clearing empty notifications array', () => {
      expect(useNotificationStore.getState().notifications).toHaveLength(0)

      useNotificationStore.getState().clearAll()

      expect(useNotificationStore.getState().notifications).toHaveLength(0)
    })
  })
})
