import axios from 'axios'

// Instância principal da API
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Adiciona token de auth em toda requisição
api.interceptors.request.use(config => {
  const token = localStorage.getItem('provare_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redireciona para login se não autorizado
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('provare_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
