import { render, screen } from '@testing-library/react'
import { ConfirmModal } from './ConfirmModal'

const noop = () => {}

it('renders nothing when message is falsy', () => {
  const { container } = render(<ConfirmModal message={null} confirmLabel="OK" variant="neutral" onConfirm={noop} onCancel={noop} />)
  expect(container.firstChild).toBeNull()
})

it('renders message and confirm button', () => {
  render(<ConfirmModal message="Are you sure?" confirmLabel="Yes" variant="neutral" onConfirm={noop} onCancel={noop} />)
  expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument()
})

it('renders crimson stripe for destructive variant', () => {
  render(<ConfirmModal message="Delete?" confirmLabel="Delete" variant="destructive" onConfirm={noop} onCancel={noop} />)
  const stripe = document.querySelector('.modal-stripe')
  expect(stripe).toHaveStyle('background: #e63946')
})

it('renders green stripe for save variant', () => {
  render(<ConfirmModal message="Save?" confirmLabel="Save" variant="save" onConfirm={noop} onCancel={noop} />)
  const stripe = document.querySelector('.modal-stripe')
  expect(stripe).toHaveStyle('background: #2dc653')
})
