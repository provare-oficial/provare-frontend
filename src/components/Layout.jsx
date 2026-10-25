import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/projetos', icon: '◈', label: 'Projetos' },
  { to: '/configuracoes', icon: '⚙', label: 'Config' },
]

export default function Layout({ children }) {
  const { user, company, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const activeStyle = { color: '#C9A84C', borderLeftColor: '#C9A84C' }
  const inactiveStyle = { color: '#666', borderLeftColor: 'transparent' }

  return (
    <div className="flex min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 z-20"
        style={{ background: '#0D0D0D', borderRight: '1px solid #1E1E1E' }}>

        {/* Logo */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif text-lg font-semibold"
              style={{ background: '#C9A84C', color: '#000' }}>P</div>
            <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: '#C9A84C' }}>Provare</span>
          </div>
          {company && <p className="text-xs mt-3 truncate" style={{ color: '#555' }}>{company.name}</p>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-150 border-l-2"
              style={({ isActive }) => isActive ? { ...activeStyle, background: '#1A1A1A' } : inactiveStyle}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Botão novo projeto */}
        <div className="p-4">
          <button onClick={() => navigate('/projetos?novo=1')}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#C9A84C', color: '#000' }}>
            + Novo Projeto
          </button>
        </div>

        {/* User */}
        <div className="p-4 pt-0" style={{ borderTop: '1px solid #1E1E1E' }}>
          <div className="flex items-center gap-3 pt-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: '#2A2A2A', color: '#C9A84C' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: '#F5F0E8' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#555' }}>{company?.plan || 'Pro'}</p>
            </div>
            <button onClick={logout} className="text-xs transition-colors hover:text-red-400" style={{ color: '#444' }}>Sair</button>
          </div>
        </div>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="flex-1 md:ml-60 pb-20 md:pb-0">
        {/* Header mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 sticky top-0 z-10"
          style={{ background: '#0A0A0Aee', backdropFilter: 'blur(10px)', borderBottom: '1px solid #1E1E1E' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center font-serif text-base font-semibold"
              style={{ background: '#C9A84C', color: '#000' }}>P</div>
            <span className="font-semibold tracking-widest text-xs uppercase" style={{ color: '#C9A84C' }}>Provare</span>
          </div>
          {company && <span className="text-xs truncate max-w-[150px]" style={{ color: '#666' }}>{company.name}</span>}
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* ── BOTTOM NAV MOBILE ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around px-2 py-2"
        style={{ background: '#0D0D0D', borderTop: '1px solid #1E1E1E' }}>
        <NavLink to="/dashboard" className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px]"
          style={({ isActive }) => ({ color: isActive ? '#C9A84C' : '#555' })}>
          <span className="text-xl">⊞</span>
          <span className="text-[10px]">Início</span>
        </NavLink>

        <NavLink to="/projetos" className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px]"
          style={({ isActive }) => ({ color: isActive ? '#C9A84C' : '#555' })}>
          <span className="text-xl">◈</span>
          <span className="text-[10px]">Projetos</span>
        </NavLink>

        {/* Botão central de novo projeto */}
        <button onClick={() => navigate('/projetos?novo=1')}
          className="w-14 h-14 rounded-full flex items-center justify-center -mt-4 shadow-lg text-xl font-bold"
          style={{ background: '#C9A84C', color: '#000' }}>+</button>

        <NavLink to="/configuracoes" className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px]"
          style={({ isActive }) => ({ color: isActive ? '#C9A84C' : '#555' })}>
          <span className="text-xl">⚙</span>
          <span className="text-[10px]">Config</span>
        </NavLink>

        <button onClick={logout} className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px]" style={{ color: '#555' }}>
          <span className="text-xl">↩</span>
          <span className="text-[10px]">Sair</span>
        </button>
      </nav>
    </div>
  )
}
