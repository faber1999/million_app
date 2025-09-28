import { createElement } from 'react'
import { LazyRoute } from './LazyRoute'

export const createLazyElement = (Component: React.LazyExoticComponent<React.ComponentType>) =>
  createElement(LazyRoute, { Component })
