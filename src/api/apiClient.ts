import axios from 'axios';

// Создаем единый экземпляр Axios с базовым URL твоего VPS
export const apiClient = axios.create({
  baseURL: 'https://rayflux-market.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json',
  },
});