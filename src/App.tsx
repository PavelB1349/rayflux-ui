import { useEffect, useState } from 'react'
import { apiClient } from './api/apiClient'

interface Product {
  id: number | string
  name: string
  price: number
  description?: string
  imageUrl?: string
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient.get<Product[]>('/products')
      .then((response: { data: Product[] }) => {
        setProducts(response.data)
        setLoading(false)
      })
      .catch((err: unknown) => {
        console.error('Ошибка загрузки товаров:', err)
        setError('Не удалось загрузить каталог товаров')
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Шапка сайта (Header) */}
      <header className="sticky top-0 z-10 bg-zinc-900/90 backdrop-blur border-b border-zinc-800 px-6 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/25">
              R
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              RayFlux Market
            </span>
          </div>

          {/* Иконка корзины */}
          <button className="relative p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/60 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-zinc-950 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              0
            </span>
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Каталог товаров</h1>
            <p className="text-zinc-400 text-sm mt-1">Выбирайте и добавляйте в корзину</p>
          </div>
          <span className="text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1.5 rounded-full">
            Товаров: {products.length}
          </span>
        </div>

        {/* Загрузка (Skeleton) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 animate-pulse h-80 flex flex-col justify-between">
                <div className="w-full h-40 bg-zinc-800 rounded-xl" />
                <div className="space-y-2 my-4">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
                <div className="h-10 bg-zinc-800 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-center my-8">
            {error}
          </div>
        )}

        {/* Сетка товаров */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div>
                  <div className="w-full h-44 bg-zinc-950 border border-zinc-800/50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-zinc-600 flex flex-col items-center gap-2">
                        <svg className="w-10 h-10 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">Нет фото</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg text-zinc-100 group-hover:text-violet-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1 line-clamp-2 min-h-[32px]">
                    {product.description || 'Описание отсутствует'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Цена</span>
                    <span className="text-xl font-extrabold text-white">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95">
                    В корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Футер */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500 mt-auto">
        RayFlux Market &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}