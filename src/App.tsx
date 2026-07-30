import { useEffect, useState } from 'react';
import { apiClient } from './api/apiClient';

// Описываем тип товара (как в твоем C# DTO)
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Чистый GET-запрос к контроллеру товаров
    apiClient.get<Product[]>('/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки товаров:', err);
        setError('Не удалось загрузить товары с сервера');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🛍️ RayFlux Market</h1>

      {loading && <p>Загрузка товаров из базы...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div>
          <h2>Каталог товаров</h2>
          {products.length === 0 ? (
            <p>Товаров пока нет в базе данных.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {products.map((product) => (
                <li 
                  key={product.id} 
                  style={{ 
                    border: '1px solid #ccc', 
                    borderRadius: '8px', 
                    padding: '12px', 
                    marginBottom: '10px' 
                  }}
                >
                  <h3>{product.name} — {product.price} ₽</h3>
                  <p>{product.description}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;