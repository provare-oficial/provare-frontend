import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SettingsPage from './pages/SettingsPage'
import ProvarBookPage from './pages/ProvarBookPage'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'

// Rota protegida: redireciona para login se não autenticado
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen" style={{background:'#0A0A0A'}}><LoadingSpinner /></div>
  if (!user) return <Navigate to="/login" replace />
  return <Layout>{children}</Layout>
}

function AppRoutes() {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen" style={{background:'#0A0A0A'}}><LoadingSpinner /></div>

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/book/:slug" element={<ProvarBookPage />} />

      {/* Onboarding (auth mas sem layout) */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Protegidas com layout */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/projetos" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
      <Route path="/projetos/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
