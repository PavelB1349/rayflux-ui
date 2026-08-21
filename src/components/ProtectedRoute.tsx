import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // Перенаправляем на главную, передавая текущую страницу и флаг открытия окна
    return <Navigate to="/" state={{ from: location, openAuth: true }} replace />
  }

  return <>{children}</>
}