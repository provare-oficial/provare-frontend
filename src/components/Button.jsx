export default function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-6 py-4 text-base min-h-[52px]'
  }
  const variants = {
    primary: 'text-black font-semibold',
    secondary: 'border text-text-primary hover:border-gold hover:text-gold',
    ghost: 'text-text-secondary hover:text-text-primary',
    danger: 'text-white'
  }
  const styles = {
    primary: { background: '#C9A84C' },
    secondary: { background: 'transparent', borderColor: '#2A2A2A' },
    ghost: { background: 'transparent' },
    danger: { background: '#E74C3C' }
  }

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={styles[variant]}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />}
      {children}
    </button>
  )
}
