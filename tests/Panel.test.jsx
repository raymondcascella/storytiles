import { render, screen, fireEvent } from '@testing-library/react'
import { Panel } from '../src/components/Panel'

const basePanel = {
  id: 'p1',
  caption: 'A caption',
  icons: [],
}

const noop = () => {}
const baseProps = {
  panel: basePanel,
  panelIndex: 0,
  selectedIcon: null,
  onCaptionChange: noop,
  onIconPlace: noop,
  onIconMove: noop,
  onRemoveIcon: noop,
  onRemove: noop,
}

test('renders caption textarea with panel caption', () => {
  render(<Panel {...baseProps} />)
  expect(screen.getByDisplayValue('A caption')).toBeInTheDocument()
})

test('calls onCaptionChange when caption changes', () => {
  const fn = vi.fn()
  render(<Panel {...baseProps} onCaptionChange={fn} />)
  fireEvent.change(screen.getByDisplayValue('A caption'), { target: { value: 'New caption' } })
  expect(fn).toHaveBeenCalledWith('p1', 'New caption')
})

test('renders placed icons', () => {
  const panel = {
    ...basePanel,
    icons: [{ id: 'i1', iconName: 'star', x: 50, y: 50 }],
  }
  render(<Panel {...baseProps} panel={panel} />)
  // FontAwesomeIcon renders an svg; check the placed-icon span exists
  const span = document.querySelector('.placed-icon')
  expect(span).toBeInTheDocument()
  expect(span.style.left).toBe('50%')
  expect(span.style.top).toBe('50%')
})

test('clicking icon zone with selectedIcon calls onIconPlace', () => {
  const fn = vi.fn()
  render(<Panel {...baseProps} selectedIcon="star" onIconPlace={fn} />)
  const zone = document.querySelector('.icon-zone')
  fireEvent.click(zone, { clientX: 0, clientY: 0 })
  expect(fn).toHaveBeenCalledWith('p1', 'star', expect.any(Number), expect.any(Number))
})

test('clicking icon zone without selectedIcon does not call onIconPlace', () => {
  const fn = vi.fn()
  render(<Panel {...baseProps} selectedIcon={null} onIconPlace={fn} />)
  const zone = document.querySelector('.icon-zone')
  fireEvent.click(zone)
  expect(fn).not.toHaveBeenCalled()
})

test('drop from sidebar calls onIconPlace', () => {
  const fn = vi.fn()
  render(<Panel {...baseProps} onIconPlace={fn} />)
  const zone = document.querySelector('.icon-zone')
  const dropData = JSON.stringify({ type: 'sidebar-icon', iconName: 'heart' })
  fireEvent.drop(zone, {
    dataTransfer: { getData: () => dropData },
  })
  expect(fn).toHaveBeenCalledWith('p1', 'heart', expect.any(Number), expect.any(Number))
})

test('drop from placed icon calls onIconMove', () => {
  const fn = vi.fn()
  render(<Panel {...baseProps} onIconMove={fn} />)
  const zone = document.querySelector('.icon-zone')
  const dropData = JSON.stringify({ type: 'placed-icon', fromPanelId: 'p2', iconId: 'i1' })
  fireEvent.drop(zone, {
    dataTransfer: { getData: () => dropData },
  })
  expect(fn).toHaveBeenCalledWith('p2', 'i1', 'p1', expect.any(Number), expect.any(Number))
})
