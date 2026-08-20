import axios from 'axios';

// Создаем единый экземпляр Axios с базовым URL твоего VPS
export const apiClient = axios.create({
  baseURL: 'https://rayflux-market.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик (Interceptor): при наличии токена добавляет заголовок Authorization
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})