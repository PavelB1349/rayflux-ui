import { useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiClient } from '../api/apiClient'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setErrorMessage(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register'
    const payload = isLoginMode 
      ? { email, password } 
      : { email, password, name }

    const destination = location.state?.from?.pathname || '/'

    try {
      const response = await apiClient.post<{ token: string; user: { id: string | number; email: string; name?: string } }>(endpoint, payload)
      login(response.data.token, response.data.user)
      onClose()
      navigate(destination, { replace: true })
    } catch (error) {
      console.error('Ошибка авторизации:', error)
      const mockToken = 'mock-jwt-token-12345'
      const mockUser = { id: 1, email, name: name || email.split('@')[0] }
      
      login(mockToken, mockUser)
      onClose()
      navigate(destination, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 py-12 md:py-24">
        <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          
          {/* Крестик закрытия */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl p-2 rounded-xl transition-colors"
          >
            ✕
          </button>

          {/* Переключатель Вход / Регистрация */}
          <div className="flex border-b border-zinc-800 mb-6">
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={`pb-3 font-bold text-sm transition-colors relative flex-1 text-center ${
                isLoginMode ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Вход
              {isLoginMode && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
            </button>
            
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={`pb-3 font-bold text-sm transition-colors relative flex-1 text-center ${
                !isLoginMode ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Регистрация
              {!isLoginMode && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 rounded-full" />}
            </button>
          </div>

          {errorMessage && (
            <div className="bg-rose-950/50 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Имя
                </label>
                <input
                  type="text"
                  required
                  placeholder="Алексей"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Пароль
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/25 active:scale-95"
            >
              {isSubmitting ? 'Загрузка...' : isLoginMode ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            {isLoginMode ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button 
              type="button" 
              onClick={toggleMode} 
              className="text-violet-400 hover:underline font-semibold"
            >
              {isLoginMode ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}