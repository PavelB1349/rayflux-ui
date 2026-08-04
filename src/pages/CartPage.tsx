import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CheckoutModal } from '../components/CheckoutModal' // <-- Добавляем импорт


export const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false) // <-- Новое состояние

  // Если корзина пуста — показываем дружелюбную заглушку
  if (cartItems.length === 0) {
    return (
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col items-center justify-center">
        <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-12 text-center shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ваша корзина пуста</h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Похоже, вы еще ничего не добавили. Перейдите в каталог, чтобы выбрать понравившиеся товары.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-600/25 active:scale-95"
          >
            ← Перейти к каталогу
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Корзина</h1>
          <p className="text-zinc-400 text-sm mt-1">Проверьте состав заказа перед оформлением</p>
        </div>
        
        {/* Кнопка очистки всей корзины */}
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-medium transition-colors"
        >
          Очистить корзину
        </button>
      </div>

      {/* Основная сетка: слева товары, справа сводка заказа */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Список товаров (занимает 2 колонки из 3) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map(({ product, quantity }) => (
            <div 
              key={product.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-zinc-700/80"
            >
              {/* Левая часть: Картинка + Название */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-zinc-600 text-xs">Нет фото</span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-100 text-base line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {product.price.toLocaleString('ru-RU')} ₸ / шт.
                  </p>
                </div>
              </div>

              {/* Правая часть: Управление количеством + Цена + Удаление */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800">
                
                {/* Счетчики + и - */}
                <div className="flex items-center border border-zinc-700 rounded-xl bg-zinc-950 overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 transition-colors font-bold"
                    title="Уменьшить"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 transition-colors font-bold"
                    title="Увеличить"
                  >
                    +
                  </button>
                </div>

                {/* Стоимость позиции (Цена * Количество) */}
                <div className="text-right min-w-[90px]">
                  <span className="text-lg font-extrabold text-white">
                    {(product.price * quantity).toLocaleString('ru-RU')} ₸
                  </span>
                </div>

                {/* Кнопка удаления товара */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-all"
                  title="Удалить позицию"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Сводка заказа (1 колонка справа) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl sticky top-24">
          <h2 className="text-xl font-bold text-white mb-6">Итого заказа</h2>
          
          <div className="space-y-3 text-sm pb-6 border-b border-zinc-800">
            <div className="flex justify-between text-zinc-400">
              <span>Товары ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</span>
              <span className="text-zinc-200 font-medium">{cartTotal.toLocaleString('ru-RU')} ₸</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Доставка</span>
              <span className="text-emerald-400 font-medium">Бесплатно</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-6">
            <span className="text-base font-bold text-white">К оплате:</span>
            <span className="text-2xl font-extrabold text-white">
              {cartTotal.toLocaleString('ru-RU')} ₸
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(true)} // <-- Заменили alert на открытие окна
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            Оформить заказ
          </button>
        </div>

      </div>
      
      {/* Модальное окно оформления */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </main>
  )
}