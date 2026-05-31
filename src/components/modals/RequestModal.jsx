import { useCallback, useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { RequestForm } from '../forms/RequestForm'
import { useToast } from '../../context/useToast'
import { useAuth } from '../../hooks/useAuth'
import { Check } from '../../icons'
import { submitRequest } from '../../lib/api/submitRequest'

export function RequestModal({ isOpen, onClose, onSubmitted }) {
  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [submittedName, setSubmittedName] = useState('')
  const toast = useToast()

  const handleClose = useCallback(() => {
    setSubmitted(false)
    setSubmittedName('')
    onClose?.()
  }, [onClose])

  const handleSubmit = async (values) => {
    try {
      console.log('[RequestModal] Submitting request:', values)
      await submitRequest(values)
      setSubmittedName(values.name)
      setSubmitted(true)
      toast.success('Request submitted', "We'll reach out within 24 hours.")
      // Trigger refresh after a short delay to allow database to sync
      setTimeout(() => {
        onSubmitted?.()
      }, 500)
    } catch (err) {
      console.error('[RequestModal] Submit error:', err)
      toast.error('Failed to submit', err.message)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={submitted ? undefined : 'Submit a Request'}
      subtitle={submitted ? undefined : "Tell us what you need and we'll handle the rest."}
    >
      {submitted ? (
        <div className="success-message">
          <div className="success-icon"><Check size={36} /></div>
          <h2>Request submitted!</h2>
          <p>
            Thanks{submittedName ? `, ${submittedName.split(' ')[0]}` : ''}. Our team will review
            your request and get back to you within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={() => setSubmitted(false)}>
              Submit Another Request
            </Button>
            <Button variant="ghost" onClick={handleClose}>Close</Button>
          </div>
        </div>
      ) : (
        <RequestForm onSubmit={handleSubmit} user={user} />
      )}
    </Modal>
  )
}
