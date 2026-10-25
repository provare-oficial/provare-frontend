import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const cadastroOk = searchParams.get('cadastro') === 'ok'

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email) return setError('Digite seu e-mail')
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/magic-link', { email })
      setSent(true)
    } catch {
      setError('Não foi possível enviar o link. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: '#0A0A0A' }}>
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-serif font-semibold"
          style={{ background: '#C9A84C', color: '#000' }}>P</div>
        <h1 className="text-3xl font-serif font-medium" style={{ color: '#F5F0E8' }}>Provare</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>Prove cada etapa.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
        {!sent ? (
          <>
            {cadastroOk && (
              <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#0D2A0D', border: '1px solid #2E7D32', color: '#4CAF50' }}>
                ✓ Conta criada! Faça login para entrar.
              </div>
            )}
            <h2 className="text-base font-medium mb-1" style={{ color: '#F5F0E8' }}>Entrar na sua conta</h2>
            <p className="text-sm mb-6" style={{ color: '#666' }}>Enviaremos um link de acesso para o seu e-mail</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={error}
                autoFocus
              />
              <Button type="submit" loading={loading} className="w-full">
                Entrar com link mágico
              </Button>
            </form>

            <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid #1E1E1E' }}>
              <p className="text-xs" style={{ color: '#555' }}>
                Não tem conta?{' '}
                <a href="/onboarding" style={{ color: '#C9A84C' }}>Criar conta grátis</a>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">✉️</div>
            <h2 className="font-medium mb-2" style={{ color: '#F5F0E8' }}>Verifique seu e-mail</h2>
            <p className="text-sm" style={{ color: '#666' }}>
              Enviamos o link de acesso para<br />
              <strong style={{ color: '#F5F0E8' }}>{email}</strong>
            </p>
            <p className="text-xs mt-4" style={{ color: '#555' }}>
              O link é válido por 15 minutos
            </p>
            <button onClick={() => setSent(false)} className="text-xs mt-4 underline" style={{ color: '#C9A84C' }}>
              Usar outro e-mail
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
