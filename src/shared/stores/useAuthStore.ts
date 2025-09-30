import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { http } from '../lib/http'

export interface UserData {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: UserData | null
  login: (userData: UserData) => void
  logout: () => void
  refreshToken: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set) => ({
        user: null,

        login: (userData: UserData) => {
          set((state) => {
            state.user = {
              id: userData.id,
              email: userData.email,
              name: userData.name
            }
          })
        },

        logout: () => {
          set((state) => {
            state.user = null
          })
        },

        refreshToken: async () => {
          try {
            // Importar axios aquí para evitar dependencias circulares
            await http.post({ url: '/api/auth/refresh' })

            return true
          } catch {
            // Si falla el refresh, hacer logout
            set((state) => {
              state.user = null
            })
            return false
          }
        }
      })),
      { name: 'auth-store' }
    ),
    { name: 'auth-store-devtools' }
  )
)
