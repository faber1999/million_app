import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { privateRoutes } from './privateRoutes'
import { publicRoutes } from './publicRoutes'

const allRoutes: RouteObject[] = [...publicRoutes, ...privateRoutes]

export const router = createBrowserRouter(allRoutes)
