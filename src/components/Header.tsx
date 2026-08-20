import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { AuthModal } from './AuthModal'

export const Header = () => {
  const { cartItems } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Логотип */}
        <Link to="/" className="text-xl font-extrabold tracking-wider text-white hover:text-violet-400 transition-colors">
          RAYFLUX<span className="text-violet-500">.MARKET</span>
        </Link>

        {/* Правая часть: Авторизация и Корзина */}
        <div className="flex items-center gap-4">
          
          {/* Блок пользователя / Кнопка входа */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-300 font-medium bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
                👤 {user.name || user.email}
              </span>
              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-rose-400 transition-colors px-2 py-1"
                title="Выйти из аккаунта"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              Войти
            </button>
          )}

          {/* Кнопка Корзины */}
          <Link
            to="/cart"
            className="relative bg-violet-600 hover:bg-violet-500 text-white font-bold p-2.5 rounded-xl transition-all shadow-lg shadow-violet-600/20 active:scale-95 flex items-center justify-center"
          >
            🛒
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Модальное окно входа / регистрации */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />
    </header>
  )
}