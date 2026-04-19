import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmModal } from '../src/components/ConfirmModal'

test('renders message', () => {
  render(<ConfirmModal message="Are you sure?" onConfirm={() => {}} onCancel={() => {}} confirmLabel="OK" />)
  expect(screen.getByText('Are you sure?')).toBeInTheDocument()
})

test('calls onConfirm when confirm button clicked', () => {
  const fn = vi.fn()
  render(<ConfirmModal message="Sure?" onConfirm={fn} onCancel={() => {}} confirmLabel="Save" />)
  fireEvent.click(screen.getByText('Save'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onCancel when Cancel clicked', () => {
  const fn = vi.fn()
  render(<ConfirmModal message="Sure?" onConfirm={() => {}} onCancel={fn} confirmLabel="OK" />)
  fireEvent.click(screen.getByText('Cancel'))
  expect(fn).toHaveBeenCalledOnce()
})

test('renders nothing when message is null', () => {
  const { container } = render(<ConfirmModal message={null} onConfirm={() => {}} onCancel={() => {}} confirmLabel="OK" />)
  expect(container.firstChild).toBeNull()
})
