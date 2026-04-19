import { render, screen, fireEvent } from '@testing-library/react'
import { IconSidebar } from '../src/components/IconSidebar'

const noop = () => {}
const baseProps = {
  selectedIcon: null,
  onSelectIcon: noop,
}

test('renders icon grid', () => {
  render(<IconSidebar {...baseProps} />)
  const items = document.querySelectorAll('.icon-item')
  expect(items.length).toBeGreaterThan(0)
})

test('renders sidebar label', () => {
  render(<IconSidebar {...baseProps} />)
  expect(screen.getByText('Icons')).toBeInTheDocument()
})

test('calls onSelectIcon with icon name when icon clicked', () => {
  const fn = vi.fn()
  render(<IconSidebar {...baseProps} onSelectIcon={fn} />)
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
