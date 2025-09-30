import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import { validateHttpStatus } from '../utils/http.utils'

interface HttpParams {
  url: string
  body?: unknown
  config?: AxiosRequestConfig
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Flag para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })

  failedQueue = []
}

// Interceptor de respuesta para manejar 401 y refresh automático
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // No aplicar el interceptor al endpoint de refresh para evitar bucles infinitos
    if (originalRequest.url?.includes('/api/auth/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está haciendo refresh, esperar a que termine
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('🔄 Attempting to refresh token...')

        // Intentar hacer refresh del token
        await axiosInstance.post('/api/auth/refresh')

        console.log('✅ Token refresh successful')

        // Si el refresh fue exitoso, procesar la cola de requests fallidos
        processQueue(null)

        // Reintentar el request original
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        console.log('❌ Token refresh failed:', refreshError)

        // Si el refresh falla, hacer logout y rechazar todos los requests en cola
        processQueue(refreshError)

        // Obtener el logout del store
        const { logout } = useAuthStore.getState()
        logout()

        console.log('🚪 User logged out due to refresh failure')

        // Redirigir a home si estamos en una ruta protegida
        if (window.location.pathname !== '/') {
          console.log('🏠 Redirecting to home page')
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

const get = async <T>({ url, config }: HttpParams) =>
  axiosInstance
    .get<T>(url, config)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      validateHttpStatus(error.response?.status || 500, error.response as AxiosResponse)
      throw error
    })

const post = async <T>({ url, body, config }: HttpParams) =>
  axiosInstance
    .post<T>(url, body, config)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      validateHttpStatus(error.response?.status || 500, error.response as AxiosResponse)
      throw error
    })

const put = async <T>({ url, body, config }: HttpParams) =>
  axiosInstance
    .put<T>(url, body, config)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      validateHttpStatus(error.response?.status || 500, error.response as AxiosResponse)
      throw error
    })

const patch = async <T>({ url, body, config }: HttpParams) =>
  axiosInstance
    .patch<T>(url, body, config)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      validateHttpStatus(error.response?.status || 500, error.response as AxiosResponse)
      throw error
    })

const _delete = async <T>({ url, config }: HttpParams) =>
  axiosInstance
    .delete<T>(url, config)
    .then((response) => response.data)
    .catch((error: AxiosError) => {
      validateHttpStatus(error.response?.status || 500, error.response as AxiosResponse)
      throw error
    })

export const http = {
  get,
  post,
  put,
  patch,
  _delete
}
