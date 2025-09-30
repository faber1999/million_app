import { createElement, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import AuthGuard from '../components/guard/AuthGuard'
import { createLazyElement } from './utils/lazyElement'

const PropertiesPage = lazy(() => import('@/features/private/properties/PropertiesPage'))
const OwnersPage = lazy(() => import('@/features/private/owners/OwnersPage'))
const UsersPage = lazy(() => import('@/features/private/users/UsersPage'))

export const privateRoutes: RouteObject = {
  element: createElement(AuthGuard),
  children: [
    {
      path: 'properties',
      element: createLazyElement(PropertiesPage)
    },
    {
      path: 'owners',
      element: createLazyElement(OwnersPage)
    },
    {
      path: 'users',
      element: createLazyElement(UsersPage)
    }
  ]
}
