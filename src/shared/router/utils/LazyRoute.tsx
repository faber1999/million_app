import { LoadingSpinner } from '@/shared/components/loaders/LoadingSpinner'
import type { ComponentType, LazyExoticComponent } from 'react'
import React, { Suspense } from 'react'

interface LazyRouteProps {
  Component: LazyExoticComponent<ComponentType>
}

export const LazyRoute: React.FC<LazyRouteProps> = ({ Component }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  )
}
