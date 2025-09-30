import { type AxiosResponse } from 'axios'
import { notification } from '../components/notification/notificationFn'
import { useAuthStore } from '../stores/useAuthStore'

export const validateHttpStatus = (httpStatusCode: number, response: AxiosResponse): void => {
  let title: string
  const description = response.statusText || response.data?.message || ''

  switch (true) {
    case httpStatusCode >= 100 && httpStatusCode < 200:
      title = `Informational ${httpStatusCode}`

      notification({
        type: 'info',
        title,
        message: description,
        id: crypto.randomUUID()
      })
      return

    case httpStatusCode >= 200 && httpStatusCode < 300:
      title = `Success ${httpStatusCode}`

      notification({
        type: 'success',
        title,
        message: description,
        id: crypto.randomUUID()
      })
      return

    case httpStatusCode >= 300 && httpStatusCode < 400:
      title = `Redirection ${httpStatusCode}`

      notification({
        type: 'warning',
        title,
        message: description,
        id: crypto.randomUUID()
      })
      return

    case httpStatusCode >= 400 && httpStatusCode < 500:
      title = `Client Error ${httpStatusCode}`
      break
    case httpStatusCode >= 500 && httpStatusCode < 600:
      title = `Server Error ${httpStatusCode}`
      break
    default:
      title = `Unknown Status Code ${httpStatusCode}`
  }

  notification({
    type: 'error',
    title,
    message: description,
    id: crypto.randomUUID()
  })

  if (httpStatusCode === 401) {
    useAuthStore.getState().logout()
  }
}
