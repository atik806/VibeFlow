import { forwardRef } from 'react'

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', block = false, className = '', loading = false, disabled, children, ...rest },
  ref
) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' && 'btn-sm',
    size === 'lg' && 'btn-lg',
    block && 'btn-block',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      ref={ref}
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  )
})
