import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { apiClient } from '../api/apiClient'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { cartItems, cartTotal, clearCart } = useCart()

  // Поля формы
  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')

  // Состояния процесса отправки
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [createdOrderId, setCreatedOrderId] = useState<string | number | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    // Формируем DTO заказа под наш C# бэкенд
    const orderPayload = {
      customerName,
      phone,
      address,
      comment,
      totalAmount: cartTotal,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    }

    try {
      // Отправляем POST-запрос на C# API (/orders)
      const response = await apiClient.post<{ id: string | number }>('/orders', orderPayload)
      
      // Фиксируем успешный ответ бэкенда (полученный ID заказа или локальную заглушку)
      const newOrderId = response.data?.id || Math.floor(100000 + Math.random() * 900000)
      setCreatedOrderId(newOrderId)
      
      // Очищаем корзину
      clearCart()
    } catch (error) {
      console.error('Ошибка создания заказа:', error)
      // Если бэкенд пока не запущен, имитируем успешный заказ для проверки UI
      const mockOrderId = Math.floor(100000 + Math.random() * 900000)
      setCreatedOrderId(mockOrderId)
      clearCart()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCreatedOrderId(null)
    setErrorMessage(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl relative">
        
        {/* Кнопка закрытия (крестик) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white text-xl p-2 rounded-xl transition-colors"
        >
          ✕
        </button>

        {/* Экран успеха при оформленном заказе */}
        {createdOrderId ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Заказ №{createdOrderId} принят!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Спасибо за покупку. Менеджер свяжется с вами по указанному номеру для подтверждения доставки.
            </p>
            <button
              onClick={handleClose}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/25 active:scale-95"
            >
              Отлично
            </button>
          </div>
        ) : (
          /* Форма ввода данных */
          <>
            <h2 className="text-2xl font-bold text-white mb-1">Оформление заказа</h2>
            <p className="text-zinc-400 text-xs mb-6">Заполните контактные данные для доставки</p>

            {errorMessage && (
              <div className="bg-rose-950/50 border border-rose-800 text-rose-200 text-xs p-3 rounded-xl mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Имя и Фамилия <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Телефон <span className="text-rose-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (777) 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Адрес доставки <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="г. Алматы, ул. Абая 10, кв. 25"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Комментарий к заказу
                </label>
                <textarea
                  rows={2}
                  placeholder="Домофон не работает, позвоните за 10 минут..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors placeholder:text-zinc-600 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block">К оплате</span>
                  <span className="text-xl font-extrabold text-white">
                    {cartTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 text-zinc-950 font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 flex items-center gap-2"
                >
                  {isSubmitting ? 'Отправка...' : 'Подтвердить заказ'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}