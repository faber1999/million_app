import '@testing-library/jest-dom'
import React from 'react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './mocks/server'

// Mock framer-motion globally
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animate, initial, exit, transition, whileHover, whileTap, ...restProps } = props
        return React.createElement('div', restProps, children)
      },
      button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { animate, initial, exit, transition, whileHover, whileTap, ...restProps } = props
        return React.createElement('button', restProps, children)
      }
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children
  }
})

// Setup MSW
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
    VITE_USER_LOGIN: process.env.VITE_USER_LOGIN,
    VITE_USER_PASSWORD: process.env.VITE_USER_PASSWORD
  }
})
