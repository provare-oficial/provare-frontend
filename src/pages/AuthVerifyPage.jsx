import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AuthVerifyPage() {
  const { token } = useParams()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`)
        await login(res.data.access_token)
        navigate('/dashboard', { replace: true })
      } catch (err) {
        const msg = err.response?.data?.detail || 'Link inválido ou expirado.'
        setError(msg)
      }
    }
    if (token) verify()
  }, [token])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0A0A0A' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 text-3xl font-serif font-semibold"
        style={{ background: '#C9A84C', color: '#000' }}>P</div>

      {!error ? (
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-sm" style={{ color: '#666' }}>Verificando seu link de acesso…</p>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-2xl p-6 text-center" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-medium mb-2" style={{ color: '#F5F0E8' }}>Link inválido</h2>
          <p className="text-sm mb-6" style={{ color: '#666' }}>{error}</p>
          <a
            href="/login"
            className="inline-block px-6 py-3 rounded-lg text-sm font-medium"
            style={{ background: '#C9A84C', color: '#000' }}
          >
            Solicitar novo link
          </a>
        </div>
      )}
    </div>
  )
}
