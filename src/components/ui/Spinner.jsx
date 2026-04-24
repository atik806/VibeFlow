export function Spinner({ size = 'md', label = 'Loading…' }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : 'spinner'
  return (
    <span className={cls} role="status" aria-label={label} />
  )
}
