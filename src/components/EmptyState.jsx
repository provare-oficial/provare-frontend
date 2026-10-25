export default function EmptyState({ icon = '📂', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-medium mb-2" style={{ color: '#F5F0E8' }}>{title}</h3>
      {description && <p className="text-sm mb-6 max-w-xs" style={{ color: '#666' }}>{description}</p>}
      {action}
    </div>
  )
}
