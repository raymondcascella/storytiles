import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

vi.mock('../src/data/icons', async () => {
  const { faStar, faHeart, faBolt } = await import('@fortawesome/free-solid-svg-icons')
  return { ICONS: [faStar, faHeart, faBolt] }
})

beforeEach(() => {
  localStorage.clear()
})

test('renders toolbar buttons', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /^new$/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /^load$/i })).toBeInTheDocument()
})

test('renders 3 panels by default', () => {
  render(<App />)
  expect(screen.getAllByPlaceholderText('Caption...').length).toBe(3)
})

test('Add Panel button adds a panel', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /add panel/i }))
  expect(screen.getAllByPlaceholderText('Caption...').length).toBe(4)
})

test('Save Story shows confirm dialog', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }))
  expect(screen.getByText(/Save as/)).toBeInTheDocument()
})

test('confirming save clears dirty state (no unsaved-changes warning after)', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }))
  fireEvent.click(document.querySelector('.modal-actions .btn-confirm'))
  fireEvent.click(screen.getByRole('button', { name: /^new$/i }))
  expect(screen.queryByText('You have unsaved changes')).toBeNull()
})

test('Create Story on dirty state shows unsaved warning', () => {
  render(<App />)
  fireEvent.change(screen.getAllByPlaceholderText('Caption...')[0], { target: { value: 'Changed' } })
  fireEvent.click(screen.getByRole('button', { name: /^new$/i }))
  expect(screen.getByText('You have unsaved changes. Continue?')).toBeInTheDocument()
})

test('Load Story opens load modal', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /^load$/i }))
  expect(screen.getByText('No saved stories.')).toBeInTheDocument()
})

test('tray toggle button is always visible', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /icons/i })).toBeInTheDocument()
})

test('canceling save confirm dismisses dialog', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /^save$/i }))
  fireEvent.click(document.querySelector('.modal-actions .btn-ghost'))
  expect(screen.queryByText(/Save as/)).toBeNull()
})
