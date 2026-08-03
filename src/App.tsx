import { useEffect, useState } from 'react'
import { apiClient } from './api/apiClient'
import type { Product } from './types/product'
import { Header } from './components/Header'
import { ProductCard } from './components/ProductCard'
import { ProductSkeleton } from './components/ProductSkeleton'

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
      <Header cartCount={0} />

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

        {loading && <ProductSkeleton />}

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 p-4 rounded-xl text-center my-8">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs text-zinc-500 mt-auto">
        RayFlux Market &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}