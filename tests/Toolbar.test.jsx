import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../src/components/Toolbar'

test('renders three buttons', () => {
  render(<Toolbar onCreateStory={() => {}} onSaveStory={() => {}} onLoadStory={() => {}} />)
  expect(screen.getByText('Create Story')).toBeInTheDocument()
  expect(screen.getByText('Save Story')).toBeInTheDocument()
  expect(screen.getByText('Load Story')).toBeInTheDocument()
})

test('calls onCreateStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar onCreateStory={fn} onSaveStory={() => {}} onLoadStory={() => {}} />)
  fireEvent.click(screen.getByText('Create Story'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onSaveStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar onCreateStory={() => {}} onSaveStory={fn} onLoadStory={() => {}} />)
  fireEvent.click(screen.getByText('Save Story'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onLoadStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar onCreateStory={() => {}} onSaveStory={() => {}} onLoadStory={fn} />)
  fireEvent.click(screen.getByText('Load Story'))
  expect(fn).toHaveBeenCalledOnce()
})
