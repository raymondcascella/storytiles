import { Panel } from './Panel'

export function StoryEditor({ story, selectedIcon, onCaptionChange, onIconPlace, onIconMove, onRemoveIcon, onAddPanel, onRemovePanel }) {
  function handleContainerWheel(e) {
    e.preventDefault()
    e.currentTarget.scrollLeft += e.deltaY + e.deltaX
  }

  function handleContainerDrop(e) {
    e.preventDefault()
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.type === 'placed-icon') onRemoveIcon(data.fromPanelId, data.iconId)
    } catch {}
  }

  return (
    <div className="story-editor">
      <div
        className="panels-container"
        onWheel={handleContainerWheel}
        onDragOver={e => e.preventDefault()}
        onDrop={handleContainerDrop}
      >
        {story.panels.map((panel, idx) => (
          <Panel
            key={panel.id}
            panel={panel}
            panelIndex={idx}
            selectedIcon={selectedIcon}
            onCaptionChange={onCaptionChange}
            onIconPlace={onIconPlace}
            onIconMove={onIconMove}
            onRemoveIcon={onRemoveIcon}
            onRemove={onRemovePanel}
          />
        ))}
        <button className="add-panel-card" onClick={onAddPanel} aria-label="Add panel">
          +
        </button>
      </div>
    </div>
  )
}
