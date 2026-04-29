import { render, screen, fireEvent } from '@testing-library/react'
import { Panel } from './Panel'

const basePanel = { id: 'p1', caption: '', icons: [] }
const noop = () => {}

function makePanel(overrides = {}) {
  return { ...basePanel, ...overrides }
}

it('renders caption textarea', () => {
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  expect(screen.getByPlaceholderText(/caption/i)).toBeInTheDocument()
})

it('calls onIconPlace when zone clicked with selectedIcon', () => {
  const onIconPlace = vi.fn()
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon="star" onCaptionChange={noop} onIconPlace={onIconPlace} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  fireEvent.click(screen.getByTestId('icon-zone'))
  expect(onIconPlace).toHaveBeenCalledWith('p1', 'star', expect.any(Number), expect.any(Number))
})

it('does not call onIconPlace when zone clicked without selectedIcon', () => {
  const onIconPlace = vi.fn()
  render(<Panel panel={makePanel()} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={onIconPlace} onIconMove={noop} onRemoveIcon={noop} onRemove={noop} />)
  fireEvent.click(screen.getByTestId('icon-zone'))
  expect(onIconPlace).not.toHaveBeenCalled()
})

it('calls onRemoveIcon on context menu of placed icon', () => {
  const onRemoveIcon = vi.fn()
  const panel = makePanel({ icons: [{ id: 'i1', iconName: 'star', x: 50, y: 50, color: '#000', size: 'small' }] })
  render(<Panel panel={panel} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={onRemoveIcon} onRemove={noop} />)
  fireEvent.contextMenu(screen.getByTitle('star'))
  expect(onRemoveIcon).toHaveBeenCalledWith('p1', 'i1')
})

it('calls onRemoveIcon on double-click of placed icon', () => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(1700000000000))
  const onRemoveIcon = vi.fn()
  const panel = makePanel({ icons: [{ id: 'i1', iconName: 'star', x: 50, y: 50, color: '#000', size: 'small' }] })
  render(<Panel panel={panel} panelIndex={0} selectedIcon={null} onCaptionChange={noop} onIconPlace={noop} onIconMove={noop} onRemoveIcon={onRemoveIcon} onRemove={noop} />)
  const iconEl = screen.getByTitle('star')
  fireEvent.click(iconEl)
  expect(onRemoveIcon).not.toHaveBeenCalled()
  vi.setSystemTime(new Date(1700000000200))
  fireEvent.click(iconEl)
  expect(onRemoveIcon).toHaveBeenCalledWith('p1', 'i1')
  vi.useRealTimers()
})
