import { forwardRef, useId } from 'react'
import { AlertCircle } from '../../icons'

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="field-error" role="alert">
      <AlertCircle size={14} aria-hidden="true" />
      {message}
    </p>
  )
}

function FieldHint({ message }) {
  if (!message) return null
  return <p className="field-hint">{message}</p>
}

export const Input = forwardRef(function Input(
  { label, error, hint, id, ...rest },
  ref
) {
  const generatedId = useId()
  const controlId = id || generatedId
  return (
    <div className="field">
      {label && <label htmlFor={controlId} className="field-label">{label}</label>}
      <input
        id={controlId}
        ref={ref}
        className={`field-control ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${controlId}-err` : hint ? `${controlId}-hint` : undefined}
        {...rest}
      />
      {error ? <FieldError message={error} /> : <FieldHint message={hint} />}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, ...rest },
  ref
) {
  const generatedId = useId()
  const controlId = id || generatedId
  return (
    <div className="field">
      {label && <label htmlFor={controlId} className="field-label">{label}</label>}
      <textarea
        id={controlId}
        ref={ref}
        className={`field-control ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${controlId}-err` : hint ? `${controlId}-hint` : undefined}
        {...rest}
      />
      {error ? <FieldError message={error} /> : <FieldHint message={hint} />}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { label, error, hint, id, children, ...rest },
  ref
) {
  const generatedId = useId()
  const controlId = id || generatedId
  return (
    <div className="field">
      {label && <label htmlFor={controlId} className="field-label">{label}</label>}
      <select
        id={controlId}
        ref={ref}
        className={`field-control ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${controlId}-err` : hint ? `${controlId}-hint` : undefined}
        {...rest}
      >
        {children}
      </select>
      {error ? <FieldError message={error} /> : <FieldHint message={hint} />}
    </div>
  )
})
