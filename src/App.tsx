import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CartProvider } from './context/CartContext' // <-- 1. Импортируем Провайдер

export default function App() {
  return (
    <BrowserRouter>
      {/* 2. Оборачиваем все наши страницы в купол корзины */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}