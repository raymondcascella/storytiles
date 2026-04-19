import { render, screen, fireEvent } from '@testing-library/react'
import { IconSidebar } from '../src/components/IconSidebar'

const noop = () => {}
const baseProps = {
  isOpen: true,
  selectedIcon: null,
  onSelectIcon: noop,
  onClose: noop,
}

test('renders nothing when closed', () => {
  const { container } = render(<IconSidebar {...baseProps} isOpen={false} />)
  expect(container.firstChild).toBeNull()
})

test('renders icon grid when open', () => {
  render(<IconSidebar {...baseProps} />)
  // ICONS has 37 items; all should be rendered
  const items = document.querySelectorAll('.icon-item')
  expect(items.length).toBeGreaterThan(0)
})

test('renders close button', () => {
  render(<IconSidebar {...baseProps} />)
  expect(screen.getByText('✕')).toBeInTheDocument()
})

test('calls onClose when close button clicked', () => {
  const fn = vi.fn()
  render(<IconSidebar {...baseProps} onClose={fn} />)
  fireEvent.click(screen.getByText('✕'))
  expect(fn).toHaveBeenCalledOnce()
})

test('calls onSelectIcon with icon name when icon clicked', () => {
  const fn = vi.fn()
  render(<IconSidebar {...baseProps} onSelectIcon={fn} />)
  // click the first icon item
  const firstItem = document.querySelector('.icon-item')
  fireEvent.click(firstItem)
  expect(fn).toHaveBeenCalledWith(expect.any(String))
})

test('selected icon has selected class', () => {
  render(<IconSidebar {...baseProps} selectedIcon="star" />)
  const selected = document.querySelector('.icon-item.selected')
  expect(selected).toBeInTheDocument()
  expect(selected.title).toBe('star')
})

test('non-selected icons do not have selected class', () => {
  render(<IconSidebar {...baseProps} selectedIcon="star" />)
  const unselected = document.querySelectorAll('.icon-item:not(.selected)')
  expect(unselected.length).toBeGreaterThan(0)
})

test('icon drag start sets sidebar-icon data', () => {
  render(<IconSidebar {...baseProps} />)
  const firstItem = document.querySelector('.icon-item')
  const setData = vi.fn()
  fireEvent.dragStart(firstItem, { dataTransfer: { setData } })
  expect(setData).toHaveBeenCalledWith(
    'application/json',
    expect.stringContaining('"type":"sidebar-icon"')
  )
})
