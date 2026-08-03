import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types/product'

// Описываем, как выглядит 1 позиция в корзине (сам товар + количество)
export interface CartItem {
  product: Product
  quantity: number
}

// Описываем, что будет доступно внутри нашего Контекста
interface CartContextType {
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (product: Product) => void
  removeFromCart: (productId: string | number) => void
  updateQuantity: (productId: string | number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Инициализируем корзину, пытаясь достать данные из localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('rayflux_cart')
    return savedCart ? JSON.parse(savedCart) : []
  })

  // При любом изменении cartItems автоматически сохраняем их в localStorage
  useEffect(() => {
    localStorage.setItem('rayflux_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Добавление товара
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        // Если товар уже есть, увеличиваем quantity на 1
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      }
      // Если товара нет, добавляем его с quantity: 1
      return [...prev, { product, quantity: 1 }]
    })
  }

  // Удаление товара полностью
  const removeFromCart = (productId: string | number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId))
  }

  // Обновление количества (например, плюсик/минусик в корзине)
  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ))
  }

  // Очистка всей корзины
  const clearCart = () => setCartItems([])

  // Вычисляемые свойства (считаются на лету)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Кастомный хук, чтобы не писать useContext(CartContext) каждый раз
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart должен использоваться внутри CartProvider')
  }
  return context
}