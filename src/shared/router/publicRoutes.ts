import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createLazyElement } from './utils/lazyElement'

const HomePage = lazy(() => import('@/features/public/home/HomePage'))

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: createLazyElement(HomePage)
  }
]
