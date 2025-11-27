import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // 🔁 Cambia el puerto si es otro
  withCredentials: false, // true si usas cookies en vez de JWT en headers
});

// Puedes agregar un interceptor si quieres añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
