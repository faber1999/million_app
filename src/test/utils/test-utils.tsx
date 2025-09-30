import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { AllTheProviders } from './TestProviders'
import { authenticateForTests } from './auth-utils'

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export { authenticateForTests, customRender as render }
