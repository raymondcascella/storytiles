const STRIPE = {
  destructive: '#e63946',
  save:        '#2dc653',
  neutral:     '#1847d4',
}

export function ConfirmModal({ message, onConfirm, onCancel, confirmLabel, variant = 'neutral' }) {
  if (!message) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-stripe" style={{ background: STRIPE[variant] ?? STRIPE.neutral }} />
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn btn-confirm" onClick={onConfirm}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
