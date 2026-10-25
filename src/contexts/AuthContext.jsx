import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUserAndCompany = async () => {
    const [userRes, companyRes] = await Promise.all([
      api.get('/auth/me'),
      api.get('/companies/me'),
    ])
    setUser(userRes.data)
    setCompany(companyRes.data)
  }

  // Verifica token ao carregar
  useEffect(() => {
    const token = localStorage.getItem('provare_token')
    if (token) {
      fetchUserAndCompany()
        .catch(() => localStorage.removeItem('provare_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (token) => {
    localStorage.setItem('provare_token', token)
    try {
      await fetchUserAndCompany()
    } catch {
      localStorage.removeItem('provare_token')
    }
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
