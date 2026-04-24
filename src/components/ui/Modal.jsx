import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { Close } from '../../icons'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Accessible modal with focus trap, Esc-to-close, overlay click,
// restore focus on unmount, aria-labelledby, and body scroll lock.
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  labelledBy = 'modal-title',
  describedBy,
  size = 'md',
  closeOnOverlay = true,
}) {
  const contentRef = useRef(null)
  const previousFocusRef = useRef(null)
  useLockBodyScroll(isOpen)

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose?.()
        return
      }
      if (e.key !== 'Tab' || !contentRef.current) return
      const focusables = contentRef.current.querySelectorAll(FOCUSABLE)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [isOpen, onClose]
  )

  useEffect(() => {
    if (!isOpen) return undefined
    previousFocusRef.current = document.activeElement
    const focusables = contentRef.current?.querySelectorAll(FOCUSABLE)
    if (focusables && focusables.length > 0) {
      focusables[0].focus()
    } else {
      contentRef.current?.focus()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
      role="presentation"
    >
      <div
        className={`modal-content modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelledBy : undefined}
        aria-describedby={describedBy}
        ref={contentRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close dialog" type="button">
          <Close size={20} />
        </button>
        {title && <h2 id={labelledBy}>{title}</h2>}
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>,
    document.body
  )
}
