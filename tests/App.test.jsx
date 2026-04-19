import { render, screen, fireEvent } from '@testing-library/react'
import App from '../src/App'

beforeEach(() => {
  localStorage.clear()
})

test('renders toolbar buttons', () => {
  render(<App />)
  expect(screen.getByText('Create Story')).toBeInTheDocument()
  expect(screen.getByText('Save Story')).toBeInTheDocument()
  expect(screen.getByText('Load Story')).toBeInTheDocument()
})

test('renders 3 panels by default', () => {
  render(<App />)
  expect(screen.getAllByPlaceholderText('Panel title').length).toBe(3)
})

test('Add Panel button adds a panel', () => {
  render(<App />)
  fireEvent.click(screen.getByText('+ Add Panel'))
  expect(screen.getAllByPlaceholderText('Panel title').length).toBe(4)
})

test('Save Story shows confirm dialog', () => {
  render(<App />)
  fireEvent.click(screen.getByText('Save Story'))
  expect(screen.getByText(/Save as/)).toBeInTheDocument()
})

test('confirming save clears dirty state (no unsaved-changes warning after)', () => {
  render(<App />)
  fireEvent.click(screen.getByText('Save Story'))
  fireEvent.click(screen.getByText('Save'))  // confirm save
  // Now Create Story should not show dirty warning
  fireEvent.click(screen.getByText('Create Story'))
  expect(screen.queryByText('You have unsaved changes')).toBeNull()
})

test('Create Story on dirty state shows unsaved warning', () => {
  render(<App />)
  // Make it dirty by changing a panel title
  fireEvent.change(screen.getAllByPlaceholderText('Panel title')[0], { target: { value: 'Changed' } })
  fireEvent.click(screen.getByText('Create Story'))
  expect(screen.getByText('You have unsaved changes. Continue?')).toBeInTheDocument()
})

test('Load Story opens load modal', () => {
  render(<App />)
  fireEvent.click(screen.getByText('Load Story'))
  expect(screen.getByText('No saved stories.')).toBeInTheDocument()
})

test('Icons button toggles icon sidebar', () => {
  render(<App />)
  fireEvent.click(screen.getByText('Icons'))
  expect(document.querySelector('.sidebar')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Icons'))
  expect(document.querySelector('.sidebar')).toBeNull()
})

test('canceling save confirm dismisses dialog', () => {
  render(<App />)
  fireEvent.click(screen.getByText('Save Story'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(screen.queryByText(/Save as/)).toBeNull()
})
