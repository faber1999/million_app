import { QueryClient } from '@tanstack/react-query'
import { useI18nInstance } from './lib/i18n'
import { router } from './router/routes'

const useApp = () => {
  const { i18nInstance } = useI18nInstance()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 0
      },
      mutations: {
        retry: 0
      }
    }
  })

  return {
    queryClient,
    i18nInstance,
    router
  }
}

export default useApp
