import { useEffect } from 'react'

function Modal({ open, title, description, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal__header">
          <h3>{title}</h3>
          <button
            className="icon-button"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            x
          </button>
        </div>
        {description ? <p className="modal__description">{description}</p> : null}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
