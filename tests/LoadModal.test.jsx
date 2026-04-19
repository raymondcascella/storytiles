import { render, screen, fireEvent } from '@testing-library/react'
import { LoadModal } from '../src/components/LoadModal'

const noop = () => {}

test('renders story titles as buttons', () => {
  const stories = [
    { title: 'Story A', panels: [] },
    { title: 'Story B', panels: [] },
  ]
  render(<LoadModal stories={stories} onLoad={noop} onClose={noop} />)
  expect(screen.getByText('Story A')).toBeInTheDocument()
  expect(screen.getByText('Story B')).toBeInTheDocument()
})

test('calls onLoad with story when story button clicked', () => {
  const fn = vi.fn()
  const stories = [{ title: 'My Story', panels: [] }]
  render(<LoadModal stories={stories} onLoad={fn} onClose={noop} />)
  fireEvent.click(screen.getByText('My Story'))
  expect(fn).toHaveBeenCalledWith(stories[0])
})

test('shows empty message when no stories', () => {
  render(<LoadModal stories={[]} onLoad={noop} onClose={noop} />)
  expect(screen.getByText('No saved stories.')).toBeInTheDocument()
})

test('calls onClose when cancel button clicked', () => {
  const fn = vi.fn()
  render(<LoadModal stories={[]} onLoad={noop} onClose={fn} />)
  fireEvent.click(screen.getByText('Cancel'))
  expect(fn).toHaveBeenCalledOnce()
})

test('renders cancel button', () => {
  render(<LoadModal stories={[]} onLoad={noop} onClose={noop} />)
  expect(screen.getByText('Cancel')).toBeInTheDocument()
})
