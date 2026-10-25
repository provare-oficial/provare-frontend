import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  // Verifica token ao carregar
  useEffect(() => {
    const token = localStorage.getItem('provare_token')
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.user)
          setCompany(res.data.company)
        })
        .catch(() => localStorage.removeItem('provare_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token) => {
    localStorage.setItem('provare_token', token)
    api.get('/auth/me').then(res => {
      setUser(res.data.user)
      setCompany(res.data.company)
    })
  }

  const logout = () => {
    localStorage.removeItem('provare_token')
    setUser(null)
    setCompany(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, company, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
