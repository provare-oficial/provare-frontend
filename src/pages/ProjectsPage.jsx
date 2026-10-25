import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Input from '../components/Input'
import Modal from '../components/Modal'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const STATUS_FILTERS = ['Todos', 'Ativo', 'Concluído', 'Pausado']

export default function ProjectsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [showNewModal, setShowNewModal] = useState(searchParams.get('novo') === '1')
  const [newForm, setNewForm] = useState({ client_name: '', title: '', whatsapp: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.client_name?.toLowerCase().includes(search.toLowerCase()) || p.title?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Todos' || p.status === filter.toLowerCase()
    return matchSearch && matchFilter
  })

  const createProject = async () => {
    if (!newForm.client_name || !newForm.title) return
    setCreating(true)
    try {
      const res = await api.post('/projects', newForm)
      navigate(`/projetos/${res.data.id}`)
    } catch {
      alert('Erro ao criar projeto')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-medium" style={{ color: '#F5F0E8' }}>Projetos</h1>
        <Button onClick={() => setShowNewModal(true)} size="sm">+ Novo</Button>
      </div>

      {/* Busca e filtros */}
      <div className="mb-6 space-y-3">
        <Input placeholder="Buscar por cliente ou projeto..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter === f ? '#C9A84C' : '#1A1A1A',
                color: filter === f ? '#000' : '#666',
                border: `1px solid ${filter === f ? '#C9A84C' : '#2A2A2A'}`
              }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {!filtered.length ? (
        <EmptyState icon="◈" title={search ? 'Nenhum resultado' : 'Nenhum projeto ainda'}
          description={search ? 'Tente outro termo de busca' : 'Crie seu primeiro projeto'}
          action={!search && <Button onClick={() => setShowNewModal(true)}>+ Novo Projeto</Button>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-xl p-4" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="font-medium text-sm" style={{ color: '#F5F0E8' }}>{p.client_name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#666' }}>{p.title}</p>
                </div>
                <Badge status={p.status || 'ativo'} />
              </div>

              {/* Progresso */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: '#666' }}>
                  <span>{p.current_phase || 'Iniciando'}</span>
                  <span>{p.progress || 0}%</span>
                </div>
                <div className="h-1 rounded-full" style={{ background: '#1E1E1E' }}>
                  <div className="h-1 rounded-full" style={{ background: '#C9A84C', width: `${p.progress || 0}%` }} />
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate(`/projetos/${p.id}`)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #2A2A2A' }}>
                  Ver projeto
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: '#C9A84C22', color: '#C9A84C', border: '1px solid #C9A84C44' }}>
                  📲 Enviar Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal novo projeto */}
      <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="Novo Projeto">
        <div className="space-y-4">
          <Input label="Nome do cliente" value={newForm.client_name} onChange={e => setNewForm({...newForm, client_name: e.target.value})} placeholder="Ex: Rafael e Camila Monteiro" autoFocus />
          <Input label="Título do projeto" value={newForm.title} onChange={e => setNewForm({...newForm, title: e.target.value})} placeholder="Ex: Cozinha Jardim Europa" />
          <Input label="WhatsApp do cliente" value={newForm.whatsapp} onChange={e => setNewForm({...newForm, whatsapp: e.target.value})} placeholder="(11) 99999-9999" type="tel" />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowNewModal(false)} className="flex-1">Cancelar</Button>
            <Button onClick={createProject} loading={creating} className="flex-1" disabled={!newForm.client_name || !newForm.title}>Criar Projeto</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
