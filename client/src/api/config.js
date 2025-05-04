// Конфигурация API с автоматическим определением базового URL
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api' // В продакшене запросы будут проксироваться через Netlify redirects
  : 'http://localhost:5002/api'; // В разработке используем локальный сервер

export default API_URL; 