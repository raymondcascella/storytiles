import { render, screen, fireEvent } from '@testing-library/react'
import { StoryEditor } from '../src/components/StoryEditor'
import { describe, test, expect, vi } from 'vitest'

const noop = () => {}

const baseStory = {
  id: 's1',
  title: 'My Story',
  panels: [
    { id: 'p1', title: 'Panel 1', caption: '', icons: [] },
    { id: 'p2', title: 'Panel 2', caption: '', icons: [] },
  ],
}

const baseProps = {
  story: baseStory,
  selectedIcon: null,
  onTitleChange: noop,
  onCaptionChange: noop,
  onIconPlace: noop,
  onIconMove: noop,
  onAddPanel: noop,
}

describe('StoryEditor', () => {
  test('renders all panels', () => {
    render(<StoryEditor {...baseProps} />)
    expect(screen.getByDisplayValue('Panel 1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Panel 2')).toBeInTheDocument()
  })

  test('renders Add Panel button', () => {
    render(<StoryEditor {...baseProps} />)
    expect(screen.getByText('+ Add Panel')).toBeInTheDocument()
  })

  test('calls onAddPanel when Add Panel clicked', () => {
    const fn = vi.fn()
    render(<StoryEditor {...baseProps} onAddPanel={fn} />)
    fireEvent.click(screen.getByText('+ Add Panel'))
    expect(fn).toHaveBeenCalledOnce()
  })

  test('renders empty panel list when no panels', () => {
    const story = { ...baseStory, panels: [] }
    render(<StoryEditor {...baseProps} story={story} />)
    // Add Panel button still renders
    expect(screen.getByText('+ Add Panel')).toBeInTheDocument()
  })

  test('passes selectedIcon to panels', () => {
    render(<StoryEditor {...baseProps} selectedIcon="star" />)
    // selectedIcon is passed through; panels render without error
    expect(screen.getAllByPlaceholderText('Panel title').length).toBe(2)
  })
})
