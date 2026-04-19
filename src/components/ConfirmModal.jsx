export function ConfirmModal({ message, onConfirm, onCancel, confirmLabel }) {
  if (!message) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onConfirm}>{confirmLabel}</button>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
