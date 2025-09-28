import { QueryClient } from '@tanstack/react-query'
import { router } from './router/routes'

const useApp = () => {
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
    router
  }
}

export default useApp
