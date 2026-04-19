import { Panel } from './Panel'

export function StoryEditor({ story, selectedIcon, onTitleChange, onCaptionChange, onIconPlace, onIconMove, onRemoveIcon, onAddPanel, onRemovePanel }) {
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
      <input
          className="story-title"
          value={story.title}
          onChange={e => onTitleChange(story.id, e.target.value)}
          placeholder="Story title"
        />
      <div
        className="panels-container"
        onWheel={handleContainerWheel}
        onDragOver={e => e.preventDefault()}
        onDrop={handleContainerDrop}
      >
        {story.panels.map(panel => (
          <Panel
            key={panel.id}
            panel={panel}
            selectedIcon={selectedIcon}
            onCaptionChange={onCaptionChange}
            onIconPlace={onIconPlace}
            onIconMove={onIconMove}
            onRemoveIcon={onRemoveIcon}
            onRemove={onRemovePanel}
          />
        ))}
        <button className="btn btn-secondary add-panel-btn" onClick={onAddPanel}>
          + Add Panel
        </button>
      </div>
    </div>
  )
}
