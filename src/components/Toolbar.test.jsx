import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from './Toolbar'

const noop = () => {}

it('renders the logo', () => {
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  expect(screen.getByText(/storytiles/i)).toBeInTheDocument()
})

it('calls onTitleChange when title input changes', async () => {
  const user = userEvent.setup()
  const handler = vi.fn()
  render(<Toolbar title="My Story" isDirty={false} onTitleChange={handler} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  await user.clear(screen.getByPlaceholderText(/untitled/i))
  await user.type(screen.getByPlaceholderText(/untitled/i), 'X')
  expect(handler).toHaveBeenCalled()
})

it('save button has dirty class when isDirty is true', () => {
  render(<Toolbar title="" isDirty={true} onTitleChange={noop} onCreateStory={noop} onSaveStory={noop} onLoadStory={noop} />)
  expect(screen.getByRole('button', { name: /save/i })).toHaveClass('dirty')
})

it('calls onCreateStory, onSaveStory, onLoadStory on button clicks', async () => {
  const user = userEvent.setup()
  const onCreate = vi.fn(), onSave = vi.fn(), onLoad = vi.fn()
  render(<Toolbar title="" isDirty={false} onTitleChange={noop} onCreateStory={onCreate} onSaveStory={onSave} onLoadStory={onLoad} />)
  await user.click(screen.getByRole('button', { name: /new/i }))
  await user.click(screen.getByRole('button', { name: /save/i }))
  await user.click(screen.getByRole('button', { name: /load/i }))
  expect(onCreate).toHaveBeenCalledTimes(1)
  expect(onSave).toHaveBeenCalledTimes(1)
  expect(onLoad).toHaveBeenCalledTimes(1)
})
