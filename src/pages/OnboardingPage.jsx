import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Button from '../components/Button'
import Input from '../components/Input'

const SEGMENTS = ['Marmoraria', 'Marcenaria', 'Reforma', 'Revestimento', 'Outro']
const COLOR_PRESETS = [
  { label: 'Dourado', value: '#C9A84C' },
  { label: 'Verde', value: '#2E7D32' },
  { label: 'Azul', value: '#1565C0' },
  { label: 'Preto', value: '#212121' },
]
const PLANS = [
  { id: 'starter', name: 'Starter', price: 'R$197', desc: 'Até 10 projetos ativos', features: ['Provare Book', 'WhatsApp IA', 'Aceite digital'] },
  { id: 'pro', name: 'Pro', price: 'R$397', desc: 'Projetos ilimitados', features: ['Tudo do Starter', 'Relatórios', 'Multi-usuário (2)'], highlight: true },
  { id: 'studio', name: 'Studio', price: 'R$797', desc: 'Para equipes', features: ['Tudo do Pro', 'Domínio próprio', 'Multi-usuário ilimitado'] },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Passo 1
  const [companyName, setCompanyName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [segment, setSegment] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  // Passo 2
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [primaryColor, setPrimaryColor] = useState('#C9A84C')

  // Passo 3
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const handleLogoChange = e => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('company_name', companyName)
      formData.append('user_name', userName)
      formData.append('email', email)
      formData.append('segment', segment)
      formData.append('whatsapp', whatsapp)
      formData.append('primary_color', primaryColor)
      formData.append('plan', selectedPlan)
      if (logo) formData.append('logo', logo)
      await api.post('/companies/onboarding', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/login?cadastro=ok')
    } catch {
      alert('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0A0A0A' }}>
      {/* Header */}
      <header className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg font-semibold"
          style={{ background: '#C9A84C', color: '#000' }}>P</div>
        <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: '#C9A84C' }}>Provare</span>
      </header>

      {/* Progress */}
      <div className="flex gap-2 px-6 mb-8">
        {[1,2,3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: s <= step ? '#C9A84C' : '#1E1E1E' }} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pb-8">
        <div className="w-full max-w-md">

          {/* PASSO 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-serif font-medium mb-1" style={{ color: '#F5F0E8' }}>Sua empresa</h2>
              <p className="text-sm mb-8" style={{ color: '#666' }}>Vamos configurar o Provare para você</p>
              <div className="space-y-4">
                <Input label="Nome da empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ex: Pietra Milano" />
                <Input label="Seu nome" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Ex: Marco Ferreira" />
                <Input label="E-mail de acesso" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#999' }}>Segmento</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SEGMENTS.map(s => (
                      <button key={s} onClick={() => setSegment(s)}
                        className="py-3 px-4 rounded-lg text-sm text-left transition-all"
                        style={{
                          background: segment === s ? '#1A2A1A' : '#1A1A1A',
                          border: `1px solid ${segment === s ? '#C9A84C' : '#2A2A2A'}`,
                          color: segment === s ? '#C9A84C' : '#999'
                        }}>{s}</button>
                    ))}
                  </div>
                </div>
                <Input label="WhatsApp da empresa" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" type="tel" />
              </div>
              <Button className="w-full mt-8" onClick={() => setStep(2)} disabled={!companyName || !userName || !email || !segment}>
                Continuar →
              </Button>
            </div>
          )}

          {/* PASSO 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-serif font-medium mb-1" style={{ color: '#F5F0E8' }}>Identidade visual</h2>
              <p className="text-sm mb-8" style={{ color: '#666' }}>Seu Provare Book terá a sua marca</p>

              {/* Upload logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#999' }}>Logo da empresa</label>
                <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl cursor-pointer transition-all"
                  style={{ background: '#1A1A1A', border: '2px dashed #2A2A2A' }}>
                 {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="h-20 object-contain" />
                    : <><span className="text-3xl mb-2">📷</span><span className="text-sm" style={{ color: '#666' }}>Clique para adicionar o logo</span></>
                  }
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>

              {/* Cor principal */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#999' }}>Cor principal</label>
                <div className="flex gap-3 mb-3">
                  {COLOR_PRESETS.map(c => (
                    <button key={c.value} onClick={() => setPrimaryColor(c.value)}
                      className="w-10 h-10 rounded-full transition-all"
                      style={{ background: c.value, outline: primaryColor === c.value ? `3px solid ${c.value}` : 'none', outlineOffset: '3px' }} />
                  ))}
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-full cursor-pointer border-0 p-0"
                    style={{ background: 'transparent' }} />
                </div>
              </div>

              {/* Preview mini */}
              <div className="rounded-xl p-4 mb-8" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                <p className="text-xs mb-3" style={{ color: '#666' }}>Preview do Provare Book</p>
                <div className="rounded-lg p-4 text-center" style={{ background: primaryColor + '22', border: `1px solid ${primaryColor}44` }}>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo" className="h-10 object-contain mx-auto mb-2" />
                    : <div className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>{companyName}</div>
                  }
                  <div className="text-xs" style={{ color: '#999' }}>PROVARE BOOK · Documento Autêntico</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">← Voltar</Button>
                <Button onClick={() => setStep(3)} className="flex-1">Continuar →</Button>
              </div>
            </div>
          )}

          {/* PASSO 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-serif font-medium mb-1" style={{ color: '#F5F0E8' }}>Escolha seu plano</h2>
              <p className="text-sm mb-8" style={{ color: '#666' }}>7 dias grátis, sem cartão de crédito</p>

              <div className="space-y-3 mb-8">
                {PLANS.map(plan => (
                  <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      background: selectedPlan === plan.id ? '#1A2A1A' : '#1A1A1A',
                      border: `1px solid ${selectedPlan === plan.id ? '#C9A84C' : '#2A2A2A'}`
                    }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: '#F5F0E8' }}>{plan.name}</span>
                        {plan.highlight && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#C9A84C22', color: '#C9A84C' }}>Popular</span>}
                      </div>
                      <span className="font-semibold" style={{ color: '#C9A84C' }}>{plan.price}<span className="text-xs font-normal" style={{ color: '#666' }}>/mês</span></span>
                    </div>
                    <p className="text-sm" style={{ color: '#666' }}>{plan.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">← Voltar</Button>
                <Button onClick={handleStart} loading={loading} className="flex-1">Começar grátis 🏉</Button>
              </div>
              <p className="text-xs text-center mt-4" style={{ color: '#555' }}>Sem compromisso. Cancele quando quiser.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
