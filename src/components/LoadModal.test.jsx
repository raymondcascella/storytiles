import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoadModal } from './LoadModal'

const noop = () => {}

it('renders empty state when no stories', () => {
  render(<LoadModal stories={[]} onLoad={noop} onDelete={noop} onClose={noop} />)
  expect(screen.getByText(/no saved stories/i)).toBeInTheDocument()
})

it('renders story title and panel count', () => {
  const story = { id: '1', title: 'My Story', panels: [{ id: 'p1' }, { id: 'p2' }] }
  render(<LoadModal stories={[story]} onLoad={noop} onDelete={noop} onClose={noop} />)
  expect(screen.getByText('My Story')).toBeInTheDocument()
  expect(screen.getByText('2 panels')).toBeInTheDocument()
})

it('calls onDelete when delete button clicked', async () => {
  const user = userEvent.setup()
  const onDelete = vi.fn()
  const story = { id: '1', title: 'My Story', panels: [] }
  render(<LoadModal stories={[story]} onLoad={noop} onDelete={onDelete} onClose={noop} />)
  await user.click(screen.getByRole('button', { name: /✕/ }))
  expect(onDelete).toHaveBeenCalledWith('My Story')
})
