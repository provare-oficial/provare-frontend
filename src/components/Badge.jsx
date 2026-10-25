const configs = {
  ativo: { bg: '#1a3a1a', color: '#2ECC71', label: 'Ativo' },
  concluido: { bg: '#1a2a3a', color: '#3498DB', label: 'Concluído' },
  pausado: { bg: '#3a2a1a', color: '#F39C12', label: 'Pausado' },
  pendente: { bg: '#3a1a1a', color: '#E74C3C', label: 'Pendente' },
  assinado: { bg: '#1a3a1a', color: '#2ECC71', label: 'Assinado' },
}

export default function Badge({ status, label: customLabel }) {
  const cfg = configs[status] || { bg: '#1A1A1A', color: '#999', label: status }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: cfg.color }} />
      {customLabel || cfg.label}
    </span>
  )
}
