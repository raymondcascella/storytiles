import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '../src/components/Toolbar'

const noop = () => {}

test('renders three buttons', () => {
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={() => {}} onSaveStory={() => {}} onLoadStory={() => {}} />)
  expect(screen.getByText('New')).toBeInTheDocument()
  expect(screen.getByText('Save')).toBeInTheDocument()
  expect(screen.getByText('Load')).toBeInTheDocument()
})

test('calls onCreateStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={fn} onSaveStory={() => {}} onLoadStory={() => {}} />)
  fireEvent.click(screen.getByText('New'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onSaveStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={() => {}} onSaveStory={fn} onLoadStory={() => {}} />)
  fireEvent.click(screen.getByText('Save'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onLoadStory on click', () => {
  const fn = vi.fn()
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={() => {}} onSaveStory={() => {}} onLoadStory={fn} />)
  fireEvent.click(screen.getByText('Load'))
  expect(fn).toHaveBeenCalledOnce()
})
