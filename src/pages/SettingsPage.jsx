import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'

const COLOR_PRESETS = ['#C9A84C','#2E7D32','#1565C0','#7B1FA2','#C62828','#212121']

export default function SettingsPage() {
  const { company, user } = useAuth()
  const [form, setForm] = useState({ name: '', segment: '', whatsapp: '', primary_color: '#C9A84C' })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (company) {
      setForm({ name: company.name || '', segment: company.segment || '', whatsapp: company.whatsapp || '', primary_color: company.primary_color || '#C9A84C' })
      setLogoPreview(company.logo_url || null)
    }
  }, [company])

  const handleLogoChange = e => {
    const file = e.target.files[0]
    if (file) { setLogo(file); setLogoPreview(URL.createObjectURL(file)) }
  }

  const save = async () => {
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (logo) fd.append('logo', logo)
      await api.patch('/company', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { alert('Erro ao salvar') }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-serif font-medium mb-8" style={{ color: '#F5F0E8' }}>Configurações</h1>

      {/* Logo */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: '#999' }}>Logo da empresa</label>
        <label className="flex items-center gap-4 cursor-pointer">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
            {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" /> : <span className="text-2xl">🏢</span>}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>Alterar logo</p>
            <p className="text-xs mt-0.5" style={{ color: '#666' }}>PNG ou SVG, fundo transparente</p>
          </div>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
        </label>
      </div>

      {/* Cor primária */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3" style={{ color: '#999' }}>Cor principal do Provare Book</label>
        <div className="flex gap-3 flex-wrap">
          {COLOR_PRESETS.map(c => (
            <button key={c} onClick={() => setForm(f => ({...f, primary_color: c}))}
              className="w-10 h-10 rounded-full transition-all"
              style={{ background: c, outline: form.primary_color === c ? `3px solid ${c}` : 'none', outlineOffset: '3px' }} />
          ))}
          <input type="color" value={form.primary_color} onChange={e => setForm(f => ({...f, primary_color: e.target.value}))}
            className="w-10 h-10 rounded-full cursor-pointer border-0" style={{ background: 'transparent', padding: 0 }} />
        </div>
        {/* Preview ao vivo */}
        <div className="mt-4 p-4 rounded-xl text-center" style={{ background: form.primary_color + '15', border: `1px solid ${form.primary_color}33` }}>
          <p className="text-xs" style={{ color: form.primary_color }}>Preview do Provare Book · {form.name || company?.name}</p>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-4 mb-8">
        <Input label="Nome da empresa" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        <Input label="WhatsApp da empresa" value={form.whatsapp} onChange={e => setForm(f => ({...f, whatsapp: e.target.value}))} type="tel" />
        <Input label="Segmento" value={form.segment} onChange={e => setForm(f => ({...f, segment: e.target.value}))} placeholder="Ex: Marmoraria" />
      </div>

      <Button onClick={save} loading={saving} className="w-full">
        {saved ? '✓ Salvo!' : 'Salvar configurações'}
      </Button>

      {/* Plano */}
      <div className="mt-10 p-5 rounded-xl" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-sm" style={{ color: '#F5F0E8' }}>Plano {company?.plan || 'Pro'}</p>
            <p className="text-xs mt-0.5" style={{ color: '#666' }}>Próxima cobrança: {company?.next_billing || '—'}</p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#1a3a1a', color: '#2ECC71' }}>Ativo</span>
        </div>
        <button className="text-xs" style={{ color: '#C9A84C' }}>Gerenciar assinatura →</button>
      </div>
    </div>
  )
}
