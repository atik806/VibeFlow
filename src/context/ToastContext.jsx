import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, Close } from '../icons'
import { ToastContext } from './toastContextObject'

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (toast) => {
      idCounter += 1
      const id = idCounter
      const full = {
        id,
        variant: 'info',
        duration: 4500,
        ...toast,
      }
      setToasts((t) => [...t, full])
      if (full.duration > 0) {
        const timer = setTimeout(() => dismiss(id), full.duration)
        timersRef.current.set(id, timer)
      }
      return id
    },
    [dismiss]
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const api = useMemo(
    () => ({
      toast: push,
      success: (title, description) => push({ variant: 'success', title, description }),
      error: (title, description) => push({ variant: 'error', title, description }),
      info: (title, description) => push({ variant: 'info', title, description }),
      dismiss,
    }),
    [push, dismiss]
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const Icon = toast.variant === 'success' ? CheckCircle2 : toast.variant === 'error' ? AlertCircle : Info
  return (
    <div className={`toast toast-${toast.variant}`} role="status">
      <Icon className="toast-icon" size={20} aria-hidden="true" />
      <div className="toast-body">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        {toast.description && <div className="toast-description">{toast.description}</div>}
      </div>
      <button className="toast-dismiss" aria-label="Dismiss notification" onClick={onDismiss}>
        <Close size={16} />
      </button>
    </div>
  )
}
