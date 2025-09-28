import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { validateHttpStatus } from '../utils/http.utility'

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
