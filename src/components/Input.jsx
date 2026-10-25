export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-medium" style={{ color: '#999' }}>{label}</label>}
      <input
        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          background: '#1A1A1A',
          border: `1px solid ${error ? '#E74C3C' : '#2A2A2A'}`,
          color: '#F5F0E8',
          minHeight: '44px'
        }}
        onFocus={e => e.target.style.borderColor = '#C9A84C'}
        onBlur={e => e.target.style.borderColor = error ? '#E74C3C' : '#2A2A2A'}
        {...props}
      />
      {error && <span className="text-xs" style={{ color: '#E74C3C' }}>{error}</span>}
    </div>
  )
}
