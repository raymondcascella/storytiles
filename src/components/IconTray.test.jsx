import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IconTray } from './IconTray'

vi.mock('../data/icons', async () => {
  const { faStar, faHeart, faBolt } = await import('@fortawesome/free-solid-svg-icons')
  return { ICONS: [faStar, faHeart, faBolt] }
})

const noop = () => {}

function renderTray(overrides = {}) {
  return render(
    <IconTray
      isOpen={true}
      onToggle={noop}
      selectedIcon={null}
      onSelectIcon={noop}
      iconColor="#000000"
      onColorChange={noop}
      iconSize="small"
      onSizeChange={noop}
      {...overrides}
    />
  )
}

it('renders the tray toggle button', () => {
  renderTray({ isOpen: false })
  expect(screen.getByRole('button', { name: /icons/i })).toBeInTheDocument()
})

it('shows selected icon name in toggle button when an icon is selected', () => {
  renderTray({ isOpen: false, selectedIcon: 'star' })
  expect(screen.getByRole('button', { name: /star/i })).toBeInTheDocument()
})

it('calls onSelectIcon when an icon is clicked', async () => {
  const user = userEvent.setup()
  const onSelectIcon = vi.fn()
  renderTray({ onSelectIcon })
  const iconItems = document.querySelectorAll('.icon-item')
  await user.click(iconItems[0])
  expect(onSelectIcon).toHaveBeenCalled()
})

it('adds a selected icon to the recent list', async () => {
  const user = userEvent.setup()
  renderTray({ onSelectIcon: noop })
  const iconItems = document.querySelectorAll('.icon-item')
  await user.click(iconItems[0])
  expect(screen.getByText(/recent/i)).toBeInTheDocument()
})

it('filters icons when search input changes', async () => {
  const user = userEvent.setup()
  renderTray()
  const search = screen.getByPlaceholderText(/search/i)
  const allBefore = document.querySelectorAll('.icon-item').length
  await user.type(search, 'zzzzzzzzz')
  const allAfter = document.querySelectorAll('.icon-item').length
  expect(allAfter).toBeLessThan(allBefore)
})

it('calls onSizeChange when size button clicked', async () => {
  const user = userEvent.setup()
  const onSizeChange = vi.fn()
  renderTray({ onSizeChange })
  await user.click(screen.getByRole('button', { name: /medium/i }))
  expect(onSizeChange).toHaveBeenCalledWith('medium')
})
