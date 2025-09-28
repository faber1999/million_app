import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface UserData {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: UserData | null
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    immer((set) => ({
      user: null,

      logout: () => {
        set((state) => {
          state.user = null
        })
      }
    })),
    { name: 'user-store' }
  )
)
