import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CartProvider } from './context/CartContext'
import { ProtectedRoute } from './components/ProtectedRoute' // <-- Импортируем защиту

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            
            {/* Оборачиваем CartPage в ProtectedRoute */}
            <Route 
              path="cart" 
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}