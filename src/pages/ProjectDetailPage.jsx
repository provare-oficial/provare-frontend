import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'

const TABS = ['Visão Geral', 'Fases', 'Mídias', 'Materiais', 'Equipe', 'Financeiro', 'Provare Book']

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Visão Geral')
  const [showWaModal, setShowWaModal] = useState(false)
  const [waLoading, setWaLoading] = useState(false)
  const [waMessage, setWaMessage] = useState('')
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)

  useEffect(() => {
    api.get(`/projects/${id}`).then(r => setProject(r.data)).catch(() => navigate('/projetos')).finally(() => setLoading(false))
  }, [id])

  const openWhatsApp = async () => {
    setShowWaModal(true)
    setWaLoading(true)
    setWaMessage('')
    try {
      const res = await api.post(`/projects/${id}/generate-message`)
      setWaMessage(res.data.message)
    } catch {
      setWaMessage(`${project?.client_name?.split(' ')[0]} ✦\n\nSeu Provare Book foi atualizado.\n\nprovare.com.br/book/${project?.slug}`)
    } finally {
      setWaLoading(false)
    }
  }

  const sendWhatsApp = () => {
    const phone = project?.client_whatsapp?.replace(/\D/g, '')
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(waMessage)}`
    window.open(url, '_blank')
    setShowWaModal(false)
    api.post(`/projects/${id}/log-message`, { message: waMessage }).catch(() => {})
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
  if (!project) return null

  const progress = project.progress || 0
  const currentPhase = project.phases?.find(p => p.status === 'current')

  return (
    <div>
      {/* Breadcrumb */}
      <button onClick={() => navigate('/projetos')} className="text-xs mb-4 flex items-center gap-1" style={{ color: '#666' }}>
        ← Projetos
      </button>

      {/* Header do projeto */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-xl font-serif font-medium" style={{ color: '#F5F0E8' }}>{project.client_name}</h1>
            <p className="text-sm mt-0.5" style={{ color: '#666' }}>{project.title}</p>
          </div>
          <Badge status={project.status || 'ativo'} />
        </div>

        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#666' }}>
            <span>{currentPhase?.name || 'Iniciando'}</span>
            <span>{progress}% concluído</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: '#1E1E1E' }}>
            <div className="h-2 rounded-full transition-all duration-500" style={{ background: '#C9A84C', width: `${progress}%` }} />
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 rounded-lg text-xs font-medium" style={{ background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #2A2A2A' }}>
            📷 Adicionar Foto
          </button>
          <button onClick={openWhatsApp} className="flex-1 py-2.5 rounded-lg text-xs font-medium" style={{ background: '#C9A84C', color: '#000' }}>
            📲 Enviar Book
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto mb-6 -mx-4 px-4">
        <div className="flex gap-1 min-w-max pb-2" style={{ borderBottom: '1px solid #1E1E1E' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-3 py-2 text-xs font-medium rounded-t transition-all whitespace-nowrap"
              style={{
                color: tab === t ? '#C9A84C' : '#666',
                borderBottom: tab === t ? '2px solid #C9A84C' : '2px solid transparent'
              }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Conteúdo das tabs */}
      {tab === 'Visão Geral' && <TabVisaoGeral project={project} />}
      {tab === 'Fases' && <TabFases project={project} onAdvance={() => setShowAdvanceModal(true)} setProject={setProject} projectId={id} />}
      {tab === 'Mídias' && <TabMidias projectId={id} />}
      {tab === 'Materiais' && <TabMateriais project={project} />}
      {tab === 'Equipe' && <TabEquipe project={project} />}
      {tab === 'Financeiro' && <TabFinanceiro project={project} />}
      {tab === 'Provare Book' && <TabProvarBook project={project} onSend={openWhatsApp} />}

      {/* Modal WhatsApp */}
      <Modal open={showWaModal} onClose={() => setShowWaModal(false)} title="Enviar Provare Book">
        <div>
          <p className="text-xs mb-3" style={{ color: '#666' }}>Para: {project.client_name} · {project.client_whatsapp}</p>
          {waLoading ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <LoadingSpinner />
              <p className="text-sm" style={{ color: '#666' }}>Gerando mensagem personalizada com IA...</p>
            </div>
          ) : (
            <>
              <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)} rows={8}
                className="w-full p-3 rounded-lg text-sm resize-none outline-none"
                style={{ background: '#0A0A0A', border: '1px solid #2A2A2A', color: '#F5F0E8', lineHeight: '1.6' }} />
              <div className="flex gap-3 mt-4">
                <Button variant="secondary" onClick={() => setShowWaModal(false)} className="flex-1">Cancelar</Button>
                <button onClick={sendWhatsApp}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold"
                  style={{ background: '#25D366', color: '#fff' }}>
                  Abrir WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

// ── Tabs ──
function TabVisaoGeral({ project }) {
  const currentPhase = project.phases?.find(p => p.status === 'current')
  const health = [
    { label: 'Fotos atualizadas', ok: (project.media_count || 0) > 0 },
    { label: 'Fase atual documentada', ok: !!currentPhase },
    { label: 'Prazo definido', ok: !!project.deadline },
    { label: 'Cliente informado', ok: !!project.last_book_sent },
    { label: 'Aceite do cliente', ok: project.accepted },
  ]
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {currentPhase && (
          <div className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #C9A84C44' }}>
            <p className="text-xs mb-1" style={{ color: '#C9A84C' }}>FASE ATUAL</p>
            <p className="font-medium" style={{ color: '#F5F0E8' }}>{currentPhase.name}</p>
            {currentPhase.started_at && <p className="text-xs mt-1" style={{ color: '#666' }}>Iniciada em {currentPhase.started_at}</p>}
          </div>
        )}
        <div>
          <p className="text-xs font-medium mb-3" style={{ color: '#666' }}>ÚLTIMAS FOTOS</p>
          <div className="grid grid-cols-4 gap-2">
            {(project.recent_photos || []).map((ph, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden" style={{ background: '#1A1A1A' }}>
                {ph.url && <img src={ph.url} alt="" className="w-full h-full object-cover" />}
              </div>
            ))}
            {(project.recent_photos?.length || 0) === 0 && Array(4).fill(0).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg flex items-center justify-center" style={{ background: '#1A1A1A' }}>
                <span style={{ color: '#333' }}>📷</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="text-xs font-medium mb-3" style={{ color: '#666' }}>SAÚDE DO PROJETO</p>
        <div className="p-4 rounded-xl space-y-3" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          {health.map(h => (
            <div key={h.label} className="flex items-center gap-3">
              <span className="text-sm">{h.ok ? '✓' : '⚠'}</span>
              <span className="text-xs" style={{ color: h.ok ? '#2ECC71' : '#F39C12' }}>{h.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabFases({ project, projectId, setProject }) {
  const [advancing, setAdvancing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const phases = project.phases || []
  const currentIdx = phases.findIndex(p => p.status === 'current')

  const advancePhase = async () => {
    setAdvancing(true)
    try {
      const res = await api.post(`/projects/${projectId}/advance-phase`)
      setProject(prev => ({ ...prev, phases: res.data.phases, progress: res.data.progress }))
      setShowConfirm(false)
    } catch { alert('Erro ao avançar fase') }
    finally { setAdvancing(false) }
  }

  return (
    <div className="pb-20">
      <div className="space-y-3">
        {phases.map((phase, i) => (
          <div key={i} className="rounded-xl p-4 transition-all"
            style={{ background: '#111', border: `1px solid ${phase.status === 'current' ? '#C9A84C55' : '#1E1E1E'}` }}>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                style={{
                  background: phase.status === 'done' ? '#1a3a1a' : phase.status === 'current' ? '#C9A84C22' : '#1A1A1A',
                  color: phase.status === 'done' ? '#2ECC71' : phase.status === 'current' ? '#C9A84C' : '#444'
                }}>
                {phase.status === 'done' ? '✓' : phase.status === 'current' ? '●' : (i + 1)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: phase.status === 'pending' ? '#555' : '#F5F0E8' }}>
                  {phase.name}
                </p>
                {phase.started_at && <p className="text-xs mt-0.5" style={{ color: '#555' }}>{phase.started_at}</p>}
              </div>
              <span className="text-xs" style={{ color: '#555' }}>{phase.photo_count || 0} fotos</span>
            </div>
            {phase.description && (
              <p className="text-xs mt-3 ml-10" style={{ color: '#666' }}>{phase.description}</p>
            )}
          </div>
        ))}
      </div>

      {currentIdx < phases.length - 1 && (
        <div className="fixed bottom-20 md:bottom-6 left-0 right-0 md:left-60 px-4 md:px-8">
          <button onClick={() => setShowConfirm(true)}
            className="w-full max-w-lg mx-auto block py-4 rounded-xl text-sm font-semibold shadow-2xl"
            style={{ background: '#C9A84C', color: '#000' }}>
            Avançar para próxima fase →
          </button>
        </div>
      )}

      <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Avançar fase?">
        <p className="text-sm mb-6" style={{ color: '#999' }}>
          Confirma o avanço para <strong style={{ color: '#F5F0E8' }}>{phases[currentIdx + 1]?.name}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowConfirm(false)} className="flex-1">Cancelar</Button>
          <Button onClick={advancePhase} loading={advancing} className="flex-1">Confirmar</Button>
        </div>
      </Modal>
    </div>
  )
}

function TabMidias({ projectId }) {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    api.get(`/projects/${projectId}/media`).then(r => setMedia(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [projectId])

  const upload = async (files) => {
    setUploading(true)
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await api.post(`/projects/${projectId}/media`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setMedia(prev => [res.data, ...prev])
      } catch {}
    }
    setUploading(false)
  }

  const toggleBook = async (mediaId, currentVal) => {
    await api.patch(`/projects/${projectId}/media/${mediaId}`, { include_in_book: !currentVal })
    setMedia(prev => prev.map(m => m.id === mediaId ? { ...m, include_in_book: !currentVal } : m))
  }

  if (loading) return <div className="flex justify-center py-10"><LoadingSpinner /></div>

  return (
    <div>
      {/* Upload zone */}
      <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl cursor-pointer mb-6 transition-all"
        style={{ background: '#111', border: '2px dashed #2A2A2A' }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); upload(Array.from(e.dataTransfer.files)) }}>
        {uploading
          ? <><LoadingSpinner size="sm" /><p className="text-xs mt-2" style={{ color: '#666' }}>Enviando...</p></>
          : <><span className="text-3xl mb-2">📷</span><p className="text-sm" style={{ color: '#666' }}>Arraste fotos aqui ou toque para adicionar</p></>
        }
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={e => upload(Array.from(e.target.files))} className="hidden" />
      </label>

      {/* Grid */}
      {!media.length ? (
        <p className="text-center text-sm py-8" style={{ color: '#555' }}>Nenhuma mídia ainda</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
          {media.map(m => (
            <div key={m.id} className="relative aspect-square rounded-lg overflow-hidden group" style={{ background: '#1A1A1A' }}>
              {m.type === 'video'
                ? <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">▶</span></div>
                : <img src={m.thumbnail_url || m.url} alt="" className="w-full h-full object-cover" />
              }
              {/* Toggle Book */}
              <button onClick={() => toggleBook(m.id, m.include_in_book)}
                className="absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                style={{ background: m.include_in_book ? '#C9A84C' : '#1A1A1Acc', color: m.include_in_book ? '#000' : '#666' }}>
                {m.include_in_book ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs mt-4" style={{ color: '#555' }}>★ = incluído no Provare Book</p>
    </div>
  )
}

function TabMateriais({ project }) {
  const materiais = project.materials || []
  return (
    <div className="space-y-3">
      {!materiais.length && <p className="text-sm py-8 text-center" style={{ color: '#555' }}>Nenhum material cadastrado</p>}
      {materiais.map((m, i) => (
        <div key={i} className="p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <p className="font-medium text-sm" style={{ color: '#F5F0E8' }}>{m.name}</p>
          <div className="flex gap-4 mt-1">
            {m.origin && <p className="text-xs" style={{ color: '#666' }}>Origem: {m.origin}</p>}
            {m.lot && <p className="text-xs" style={{ color: '#666' }}>Lote: {m.lot}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

function TabEquipe({ project }) {
  const team = project.team || []
  return (
    <div className="space-y-3">
      {!team.length && <p className="text-sm py-8 text-center" style={{ color: '#555' }}>Nenhum membro adicionado</p>}
      {team.map((m, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-medium"
            style={{ background: '#2A2A2A', color: '#C9A84C' }}>{m.name?.[0]}</div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#F5F0E8' }}>{m.name}</p>
            <p className="text-xs" style={{ color: '#666' }}>{m.role}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TabFinanceiro({ project }) {
  const fin = project.financial || {}
  return (
    <div className="space-y-4 max-w-sm">
      {[['Valor Total', fin.total_value], ['Valor Recebido', fin.received], ['Saldo a Receber', fin.balance]].map(([l, v]) => (
        <div key={l} className="flex justify-between p-4 rounded-xl" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
          <span className="text-sm" style={{ color: '#999' }}>{l}</span>
          <span className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>{v ? `R$ ${Number(v).toLocaleString('pt-BR', {minimumFractionDigits:2})}` : '—'}</span>
        </div>
      ))}
    </div>
  )
}

function TabProvarBook({ project, onSend }) {
  return (
    <div>
      {/* Preview mini do book */}
      <div className="p-6 rounded-xl mb-6 text-center" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
        <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
          style={{ background: '#C9A84C22' }}>📄</div>
        <p className="font-medium text-sm mb-1" style={{ color: '#F5F0E8' }}>Provare Book</p>
        <p className="text-xs mb-4" style={{ color: '#666' }}>
          {project.slug ? `provare.com.br/book/${project.slug}` : 'Link será gerado ao enviar'}
        </p>
        <button onClick={onSend}
          className="w-full py-3 rounded-lg text-sm font-semibold"
          style={{ background: '#C9A84C', color: '#000' }}>
          📲 Gerar e Enviar por WhatsApp
        </button>
      </div>

      {/* Histórico */}
      <p className="text-xs font-medium mb-3" style={{ color: '#666' }}>HISTÓRICO DE ENVIOS</p>
      <div className="space-y-2">
        {(project.message_history || []).map((h, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
            <div>
              <p className="text-xs" style={{ color: '#F5F0E8' }}>{h.date}</p>
              <p className="text-xs mt-0.5" style={{ color: '#666' }}>Fase: {h.phase}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#1a3a1a', color: '#2ECC71' }}>
                {h.read ? 'Lido' : 'Enviado'}
              </span>
              {h.signed && <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#1a2a3a', color: '#3498DB' }}>Assinado</span>}
            </div>
          </div>
        ))}
        {!project.message_history?.length && (
          <p className="text-sm py-4 text-center" style={{ color: '#555' }}>Nenhum envio ainda</p>
        )}
      </div>
    </div>
  )
}
