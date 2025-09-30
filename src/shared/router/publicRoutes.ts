import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { createLazyElement } from './utils/lazyElement'

const HomePage = lazy(() => import('@/features/public/home/HomePage'))
const NotFoundPage = lazy(() => import('@/features/public/not-found/NotFoundPage'))

export const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: createLazyElement(HomePage)
  },
  {
    path: '*',
    element: createLazyElement(NotFoundPage)
  }
]
