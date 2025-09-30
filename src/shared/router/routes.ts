import { createElement } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import { privateRoutes } from './privateRoutes'
import { publicRoutes } from './publicRoutes'

const allRoutes: RouteObject[] = [
  {
    path: '/',
    element: createElement(AppLayout),
    children: [...publicRoutes, privateRoutes]
  }
]

export const router = createBrowserRouter(allRoutes)
