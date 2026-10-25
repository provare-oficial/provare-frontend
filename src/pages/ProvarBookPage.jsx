import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProvarBookPage() {
  const { slug } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [readProgress, setReadProgress] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const [signed, setSigned] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signing, setSigning] = useState(false)
  const [financialOpen, setFinancialOpen] = useState(false)

  // Barra de progresso de leitura
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const prog = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setReadProgress(Math.min(100, prog))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    api.get(`/book/${slug}`)
      .then(r => { setBook(r.data); if (r.data.accepted) setSigned(true) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
    // Registra visualização
    api.post(`/book/${slug}/view`).catch(() => {})
  }, [slug])

  const handleSign = async () => {
    if (!signerName.trim()) return
    setSigning(true)
    try {
      await api.post(`/book/${slug}/accept`, { signer_name: signerName })
      setSigned(true)
    } catch { alert('Erro ao registrar aceite. Tente novamente.') }
    finally { setSigning(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <LoadingSpinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center" style={{ background: '#0A0A0A' }}>
      <div className="text-5xl mb-4">404</div>
      <p style={{ color: '#666' }}>Documento não encontrado</p>
    </div>
  )

  const { company, project } = book
  const primaryColor = company?.primary_color || '#C9A84C'

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

      {/* Barra de progresso de leitura (sticky) */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ height: '3px', background: '#1A1A1A' }}>
        <div className="h-full transition-all duration-150" style={{ width: `${readProgress}%`, background: primaryColor }} />
      </div>

      {/* Header sticky */}
      <header className="fixed top-0.5 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: '#0A0A0Aee', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1A1A1A' }}>
        {company?.logo_url
          ? <img src={company.logo_url} alt={company.name} className="h-7 object-contain" />
          : <span className="font-semibold text-sm" style={{ color: primaryColor }}>{company?.name}</span>
        }
        <span className="text-xs font-mono" style={{ color: '#444' }}>{book.code}</span>
      </header>

      {/* ── CAPA ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-10 text-center relative overflow-hidden">
        {/* Background abstrato */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%, ${primaryColor}15 0%, transparent 70%)` }} />

        <div className="relative z-10">
          {company?.logo_url
            ? <img src={company.logo_url} alt={company.name} className="h-16 object-contain mx-auto mb-8" />
            : <div className="text-2xl font-semibold mb-8" style={{ color: primaryColor }}>{company?.name}</div>
          }

          <div className="text-xs tracking-widest mb-4 uppercase" style={{ color: '#555' }}>
            PROVARE BOOK · DOCUMENTO AUTÊNTICO
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2 max-w-md" style={{ color: '#F5F0E8' }}>
            {project?.client_name}
          </h1>
          <p className="text-base mb-8" style={{ color: '#777' }}>{project?.title}</p>

          {/* QR Code SVG simplificado */}
          <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl mb-8" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="0" y="0" width="30" height="30" rx="2" fill={primaryColor} fillOpacity=".3"/>
              <rect x="5" y="5" width="20" height="20" rx="1" fill={primaryColor} fillOpacity=".6"/>
              <rect x="9" y="9" width="12" height="12" rx="1" fill={primaryColor}/>
              <rect x="50" y="0" width="30" height="30" rx="2" fill={primaryColor} fillOpacity=".3"/>
              <rect x="55" y="5" width="20" height="20" rx="1" fill={primaryColor} fillOpacity=".6"/>
              <rect x="59" y="9" width="12" height="12" rx="1" fill={primaryColor}/>
              <rect x="0" y="50" width="30" height="30" rx="2" fill={primaryColor} fillOpacity=".3"/>
              <rect x="5" y="55" width="20" height="20" rx="1" fill={primaryColor} fillOpacity=".6"/>
              <rect x="9" y="59" width="12" height="12" rx="1" fill={primaryColor}/>
              <rect x="35" y="35" width="10" height="10" fill={primaryColor} fillOpacity=".8"/>
              <rect x="50" y="35" width="6" height="6" fill={primaryColor} fillOpacity=".5"/>
              <rect x="60" y="40" width="8" height="8" fill={primaryColor} fillOpacity=".5"/>
              <rect x="35" y="50" width="6" height="6" fill={primaryColor} fillOpacity=".5"/>
              <rect x="45" y="55" width="10" height="10" fill={primaryColor} fillOpacity=".5"/>
              <rect x="60" y="55" width="8" height="8" fill={primaryColor} fillOpacity=".5"/>
            </svg>
            <span className="text-xs font-mono" style={{ color: '#555' }}>{book.code}</span>
          </div>

          <div className="flex items-center gap-2 justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: primaryColor }} />
            <span className="text-xs" style={{ color: '#555' }}>Autenticidade verificada · Provare</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: '#444' }}>↓</div>
      </section>

      {/* ── SAUDAÇÃO ── */}
      {book.greeting && (
        <section className="px-6 py-12 max-w-2xl mx-auto text-center">
          <p className="text-xl font-serif leading-relaxed" style={{ color: '#F5F0E8' }}>{book.greeting}</p>
          <p className="text-sm mt-6" style={{ color: '#666' }}>— {company?.name}</p>
        </section>
      )}

      {/* ── LINHA DO TEMPO DAS FASES ── */}
      {book.phases?.length > 0 && (
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xs tracking-widest uppercase mb-8" style={{ color: primaryColor }}>O PROCESSO</h2>
            <div className="overflow-x-auto pb-4 -mx-6 px-6">
              <div className="flex gap-4 min-w-max">
                {book.phases.map((phase, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 w-28">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0"
                      style={{
                        background: phase.status === 'done' ? primaryColor + '22' : phase.status === 'current' ? primaryColor + '33' : '#1A1A1A',
                        border: `2px solid ${phase.status === 'done' ? primaryColor : phase.status === 'current' ? primaryColor : '#2A2A2A'}`,
                        color: phase.status === 'pending' ? '#444' : primaryColor
                      }}>
                      {phase.status === 'done' ? '✓' : (i + 1)}
                    </div>
                    {i < book.phases.length - 1 && (
                      <div className="absolute" style={{ display: 'none' }} />
                    )}
                    <p className="text-xs text-center" style={{ color: phase.status === 'pending' ? '#444' : '#F5F0E8' }}>{phase.name}</p>
                    {phase.date && <p className="text-xs" style={{ color: '#555' }}>{phase.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GALERIA ── */}
      {book.photos?.length > 0 && (
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xs tracking-widest uppercase mb-8" style={{ color: primaryColor }}>A OBRA EM IMAGENS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {book.photos.map((ph, i) => (
                <button key={i} onClick={() => setLightbox(ph)}
                  className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={ph.url} alt={ph.caption || ''} className="w-full h-full object-cover transition-transform duration-300 group-active:scale-95" />
                  {ph.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                      <p className="text-xs" style={{ color: '#F5F0E8' }}>{ph.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VÍDEOS ── */}
      {book.videos?.length > 0 && (
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xs tracking-widest uppercase mb-8" style={{ color: primaryColor }}>EM MOVIMENTO</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {book.videos.map((v, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: '#111' }}>
                  <video src={v.url} controls className="w-full" style={{ maxHeight: '280px' }} />
                  {v.caption && <p className="p-3 text-xs" style={{ color: '#666' }}>{v.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MATERIAIS ── */}
      {book.materials?.length > 0 && (
        <section className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xs tracking-widest uppercase mb-8" style={{ color: primaryColor }}>MATERIAIS UTILIZADOS</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {book.materials.map((m, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
                  <p className="font-medium text-sm mb-1" style={{ color: '#F5F0E8' }}>{m.name}</p>
                  {m.origin && <p className="text-xs" style={{ color: '#666' }}>Origem: {m.origin}</p>}
                  {m.specification && <p className="text-xs mt-0.5" style={{ color: '#555' }}>{m.specification}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FINANCEIRO (colapsável) ── */}
      {book.show_financial && book.financial && (
        <section className="px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setFinancialOpen(!financialOpen)}
              className="flex items-center justify-between w-full p-4 rounded-xl text-left"
              style={{ background: '#111', border: '1px solid #1E1E1E' }}>
              <span className="text-sm font-medium" style={{ color: '#F5F0E8' }}>Resumo financeiro</span>
              <span style={{ color: '#666' }}>{financialOpen ? '▲' : '▼'}</span>
            </button>
            {financialOpen && (
              <div className="mt-2 p-4 rounded-xl space-y-2" style={{ background: '#0D0D0D', border: '1px solid #1E1E1E' }}>
                {[['Investimento total', book.financial.total], ['Valor recebido', book.financial.received], ['Saldo', book.financial.balance]].map(([l, v]) => v && (
                  <div key={l} className="flex justify-between text-sm">
                    <span style={{ color: '#666' }}>{l}</span>
                    <span style={{ color: '#F5F0E8' }}>R$ {Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── ACEITE DIGITAL ── */}
      <section className="px-6 py-16">
        <div className="max-w-md mx-auto">
          {signed ? (
            <div className="text-center p-8 rounded-2xl" style={{ background: '#0D2A0D', border: `1px solid ${primaryColor}44` }}>
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-serif font-medium mb-2" style={{ color: '#F5F0E8' }}>Recebimento confirmado</h3>
              <p className="text-sm mb-4" style={{ color: '#666' }}>
                {book.accepted_at && `Assinado em ${book.accepted_at}`}
              </p>
              <p className="text-xs" style={{ color: '#444' }}>Código: {book.code}</p>
            </div>
          ) : (
            <div className="p-6 rounded-2xl" style={{ background: '#111', border: `1px solid ${primaryColor}33` }}>
              <h3 className="text-xl font-serif font-medium mb-2" style={{ color: '#F5F0E8' }}>Confirmar recebimento</h3>
              <p className="text-sm mb-6" style={{ color: '#666' }}>
                Ao assinar, você confirma o recebimento e aprovação dos serviços realizados pela {company?.name}, conforme documentado acima.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#666' }}>Seu nome completo</label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={e => setSignerName(e.target.value)}
                    placeholder="Digite seu nome para assinar"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: '#0A0A0A', border: `1px solid ${primaryColor}44`, color: '#F5F0E8', minHeight: '44px' }}
                    onFocus={e => e.target.style.borderColor = primaryColor}
                    onBlur={e => e.target.style.borderColor = `${primaryColor}44`}
                  />
                </div>
                <button
                  onClick={handleSign}
                  disabled={!signerName.trim() || signing}
                  className="w-full py-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: primaryColor, color: '#000' }}>
                  {signing ? 'Registrando...' : 'CONFIRMAR RECEBIMENTO'}
                </button>
              </div>
              <p className="text-xs text-center mt-4" style={{ color: '#444' }}>
                Este documento possui validade legal · Código {book.code}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── RODAPÉ ── */}
      <footer className="px-6 py-12 text-center" style={{ borderTop: '1px solid #1A1A1A' }}>
        {company?.logo_url
          ? <img src={company.logo_url} alt={company.name} className="h-8 object-contain mx-auto mb-3" />
          : <p className="font-semibold mb-3" style={{ color: primaryColor }}>{company?.name}</p>
        }
        <p className="text-xs" style={{ color: '#333' }}>Documentado com Provare</p>
      </footer>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt="" className="max-w-full max-h-full object-contain rounded-xl" />
          <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-lg" style={{ background: '#1A1A1A', color: '#F5F0E8' }}>✕</button>
        </div>
      )}
    </div>
  )
}
