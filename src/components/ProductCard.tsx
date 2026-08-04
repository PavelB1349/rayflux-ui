import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300">
      <div>
        <div className="w-full h-44 bg-zinc-950 border border-zinc-800/50 rounded-xl mb-4 overflow-hidden flex items-center justify-center relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
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
            {product.price.toLocaleString('ru-RU')} ₸
          </span>
        </div>
        <button 
          onClick={() => onAddToCart?.(product)}
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2 rounded-xl text-sm transition-all duration-200 shadow-md shadow-emerald-500/10 active:scale-95"
        >
          В корзину
        </button>
      </div>
    </div>
  )
}