import { useState } from 'react'
import { useStories } from './hooks/useStories'
import { Toolbar } from './components/Toolbar'
import { ConfirmModal } from './components/ConfirmModal'
import { LoadModal } from './components/LoadModal'
import { IconSidebar } from './components/IconSidebar'
import { StoryEditor } from './components/StoryEditor'

function createPanel() {
  return { id: crypto.randomUUID(), title: '', caption: '', icons: [] }
}

function createNewStory() {
  return {
    id: crypto.randomUUID(),
    title: 'Untitled',
    panels: [createPanel(), createPanel(), createPanel()],
  }
}

export default function App() {
  const stories = useStories()
  const [currentStory, setCurrentStory] = useState(createNewStory)
  const [isDirty, setIsDirty] = useState(false)
  const [confirmState, setConfirmState] = useState(null)
  const [showLoad, setShowLoad] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState(null)

  function withDirtyCheck(action) {
    if (!isDirty) { action(); return }
    setConfirmState({
      message: 'You have unsaved changes. Continue?',
      confirmLabel: 'Continue',
      onConfirm: () => { setConfirmState(null); action() },
      onCancel: () => setConfirmState(null),
    })
  }

  function handleCreateStory() {
    withDirtyCheck(() => {
      setCurrentStory(createNewStory())
      setIsDirty(false)
      setSelectedIcon(null)
    })
  }

  function handleSaveStory() {
    const resolved = stories.resolveTitle(currentStory.title, stories.loadAll())
    setConfirmState({
      message: `Save as "${resolved}"?`,
      confirmLabel: 'Save',
      onConfirm: () => {
        stories.save(currentStory)
        setIsDirty(false)
        setConfirmState(null)
      },
      onCancel: () => setConfirmState(null),
    })
  }

  function handleLoadStory() {
    withDirtyCheck(() => setShowLoad(true))
  }

  function handleLoad(story) {
    setCurrentStory(story)
    setIsDirty(false)
    setShowLoad(false)
    setSelectedIcon(null)
  }

  function handleTitleChange(panelId, newTitle) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p => p.id === panelId ? { ...p, title: newTitle } : p),
    }))
    setIsDirty(true)
  }

  function handleCaptionChange(panelId, newCaption) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p => p.id === panelId ? { ...p, caption: newCaption } : p),
    }))
    setIsDirty(true)
  }

  function handleIconPlace(panelId, iconName, x, y) {
    setCurrentStory(prev => ({
      ...prev,
      panels: prev.panels.map(p =>
        p.id === panelId
          ? { ...p, icons: [...p.icons, { id: crypto.randomUUID(), iconName, x, y }] }
          : p
      ),
    }))
    setIsDirty(true)
    setSelectedIcon(null)
  }

  function handleIconMove(fromPanelId, iconId, toPanelId, x, y) {
    setCurrentStory(prev => {
      const icon = prev.panels.find(p => p.id === fromPanelId)?.icons.find(i => i.id === iconId)
      if (!icon) return prev
      return {
        ...prev,
        panels: prev.panels.map(p => {
          if (p.id === fromPanelId) return { ...p, icons: p.icons.filter(i => i.id !== iconId) }
          if (p.id === toPanelId) return { ...p, icons: [...p.icons, { ...icon, x, y }] }
          return p
        }),
      }
    })
    setIsDirty(true)
  }

  function handleAddPanel() {
    setCurrentStory(prev => ({ ...prev, panels: [...prev.panels, createPanel()] }))
    setIsDirty(true)
  }

  function handleSelectIcon(iconName) {
    setSelectedIcon(prev => prev === iconName ? null : iconName)
  }

  return (
    <div className="app">
      <Toolbar
        onCreateStory={handleCreateStory}
        onSaveStory={handleSaveStory}
        onLoadStory={handleLoadStory}
      />
      <div className="editor-layout">
        <StoryEditor
          story={currentStory}
          selectedIcon={selectedIcon}
          onTitleChange={handleTitleChange}
          onCaptionChange={handleCaptionChange}
          onIconPlace={handleIconPlace}
          onIconMove={handleIconMove}
          onAddPanel={handleAddPanel}
        />
        <IconSidebar
          selectedIcon={selectedIcon}
          onSelectIcon={handleSelectIcon}
        />
      </div>
      {showLoad && (
        <LoadModal
          stories={stories.loadAll()}
          onLoad={handleLoad}
          onClose={() => setShowLoad(false)}
        />
      )}
      <ConfirmModal
        message={confirmState?.message}
        confirmLabel={confirmState?.confirmLabel}
        onConfirm={confirmState?.onConfirm}
        onCancel={confirmState?.onCancel}
      />
    </div>
  )
}
