import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export const Header = () => {
  // Достаем счетчик товаров из глобального состояния
  const { cartCount } = useCart()

  return (
    <header className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
            R
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            RayFlux Market
          </span>
        </Link>

        <Link to="/cart" className="relative p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {/* Показываем кружочек, только если в корзине что-то есть */}
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-zinc-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}