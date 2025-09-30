import { QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { RouterProvider } from 'react-router-dom'
import useApp from './shared/useApp'

function App() {
  const { queryClient, i18nInstance, router } = useApp()

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nInstance} defaultNS={'translation'}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default App
