import { render, screen, fireEvent } from '@testing-library/react'
import { StoryEditor } from '../src/components/StoryEditor'
import { describe, test, expect, vi } from 'vitest'

const noop = () => {}

const baseStory = {
  id: 's1',
  title: 'My Story',
  panels: [
    { id: 'p1', caption: '', icons: [] },
    { id: 'p2', caption: '', icons: [] },
  ],
}

const baseProps = {
  story: baseStory,
  selectedIcon: null,
  onCaptionChange: noop,
  onIconPlace: noop,
  onIconMove: noop,
  onRemoveIcon: noop,
  onAddPanel: noop,
  onRemovePanel: noop,
}

describe('StoryEditor', () => {
  test('renders panels container', () => {
    render(<StoryEditor {...baseProps} />)
    expect(document.querySelector('.panels-container')).toBeInTheDocument()
  })

  test('renders one panel per story panel', () => {
    render(<StoryEditor {...baseProps} />)
    expect(document.querySelectorAll('.panel').length).toBe(2)
  })

  test('renders add panel card', () => {
    render(<StoryEditor {...baseProps} />)
    expect(screen.getByRole('button', { name: /add panel/i })).toBeInTheDocument()
  })

  test('calls onAddPanel when add panel card clicked', () => {
    const fn = vi.fn()
    render(<StoryEditor {...baseProps} onAddPanel={fn} />)
    fireEvent.click(screen.getByRole('button', { name: /add panel/i }))
    expect(fn).toHaveBeenCalledOnce()
  })

  test('renders empty panel list when no panels', () => {
    const story = { ...baseStory, panels: [] }
    render(<StoryEditor {...baseProps} story={story} />)
    expect(screen.getByRole('button', { name: /add panel/i })).toBeInTheDocument()
    expect(document.querySelectorAll('.panel').length).toBe(0)
  })
})
