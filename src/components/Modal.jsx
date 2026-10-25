import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)' }} />
      {/* Modal */}
      <div className={`relative w-full ${maxWidth} rounded-t-2xl sm:rounded-2xl p-6`}
        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-base" style={{ color: '#F5F0E8' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            style={{ color: '#666' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
