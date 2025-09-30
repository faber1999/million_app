import { useAuthStore } from '@/shared/stores/useAuthStore'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

interface AuthGuardProps {
  children?: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user) {
    return null
  }

  // Si hay children, renderizarlos; si no, usar Outlet para rutas anidadas
  return <Outlet />
}

export default AuthGuard
