import { useEffect, useState, useMemo } from 'react'
import { apiClient } from '../api/apiClient'
import type { Product } from '../types/product'
import { ProductCard } from '../components/ProductCard'
import { ProductSkeleton } from '../components/ProductSkeleton'
import { useCart } from '../context/CartContext'

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Достаем функцию добавления в корзину из глобального состояния
  const { addToCart } = useCart()

  // Состояния для управления витриной (поиск и сортировка)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')

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

  // Мемоизированная фильтрация и сортировка
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price) 
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price) 
    }

    return result
  }, [products, searchQuery, sortOrder])

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      
      {/* Шапка страницы с панелью управления */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Каталог товаров</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Найдено товаров: <span className="text-zinc-200 font-bold">{filteredAndSortedProducts.length}</span>
          </p>
        </div>

        {/* Панель поиска и сортировки */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Поиск товаров..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-zinc-500 hover:text-violet-400 transition-colors"
                title="Очистить"
              >
                ✕
              </button>
            )}
          </div>

          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
            className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer outline-none"
          >
            <option value="default">По умолчанию</option>
            <option value="asc">Сначала дешевые</option>
            <option value="desc">Сначала дорогие</option>
          </select>
        </div>
      </div>

      {loading && <ProductSkeleton />}
      
      {error && (
        <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-center my-8">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 border-dashed">
              <p className="text-zinc-400 text-lg">По вашему запросу ничего не найдено 🕵️‍♂️</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 text-violet-400 hover:text-violet-300 font-medium transition-colors"
              >
                Сбросить поиск
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} // <-- ВОТ ТУТ МЫ ПЕРЕДАЕМ ФУНКЦИЮ
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}