import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import Badge from '../components/Badge'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function DashboardPage() {
  const { user, company } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>

  const metrics = [
    { label: 'Projetos Ativos', value: data?.metrics?.active_projects ?? 0, icon: '◈', color: '#C9A84C' },
    { label: 'Books Enviados', value: data?.metrics?.books_sent ?? 0, icon: '📲', color: '#3498DB' },
    { label: 'Aceites Pendentes', value: data?.metrics?.pending_acceptances ?? 0, icon: '✍', color: '#F39C12' },
    { label: 'Satisfação Média', value: data?.metrics?.avg_satisfaction ? `${data.metrics.avg_satisfaction}★` : 'N/A', icon: '⭐', color: '#2ECC71' },
  ]

  return (
    <div>
      {/* Saudação */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium" style={{ color: '#F5F0E8' }}>
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>{company?.name}</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: '#111', border: '1px solid #1E1E1E' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{m.icon}</span>
              <span className="text-2xl font-semibold" style={{ color: m.color }}>{m.value}</span>
            </div>
            <p className="text-xs" style={{ color: '#666' }}>{m.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Projetos recentes */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium" style={{ color: '#F5F0E8' }}>Projetos Recentes</h2>
            <button onClick={() => navigate('/projetos')} className="text-xs" style={{ color: '#C9A84C' }}>Ver todos →</button>
          </div>

          {(!data?.recent_projects?.length) ? (
            <EmptyState icon="◈" title="Nenhum projeto ainda"
              description="Crie seu primeiro projeto e comece a documentar"
              action={<button onClick={() => navigate('/projetos?novo=1')} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#C9A84C', color: '#000' }}>+ Novo Projeto</button>} />
          ) : (
            <div className="space-y-3">
              {data.recent_projects.map(p => (
                <button key={p.id} onClick={() => navigate(`/projetos/${p.id}`)}
                  className="w-full p-4 rounded-xl text-left transition-all hover:border-gold/30"
                  style={{ background: '#111', border: '1px solid #1E1E1E' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#F5F0E8' }}>{p.client_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#666' }}>{p.title}</p>
                    </div>
                    <Badge status={p.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full" style={{ background: '#1E1E1E' }}>
                      <div className="h-1 rounded-full transition-all" style={{ background: '#C9A84C', width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs" style={{ color: '#666' }}>{p.current_phase}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feed de atividade */}
        <div className="lg:w-72">
          <h2 className="font-medium mb-4" style={{ color: '#F5F0E8' }}>Atividade Recente</h2>
          <div className="space-y-3">
            {(data?.recent_activity || []).map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                  style={{ background: '#1A1A1A' }}>{a.icon || '●'}</div>
                <div>
                  <p className="text-sm" style={{ color: '#F5F0E8' }}>{a.message}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#555' }}>{a.time}</p>
                </div>
              </div>
            ))}
            {!data?.recent_activity?.length && (
              <p className="text-sm" style={{ color: '#555' }}>Nenhuma atividade ainda</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
