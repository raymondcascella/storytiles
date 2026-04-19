import { Panel } from './Panel'

export function StoryEditor({ story, selectedIcon, onTitleChange, onCaptionChange, onIconPlace, onIconMove, onAddPanel }) {
  return (
    <div className="story-editor">
      <div className="panels-container">
        {story.panels.map(panel => (
          <Panel
            key={panel.id}
            panel={panel}
            selectedIcon={selectedIcon}
            onTitleChange={onTitleChange}
            onCaptionChange={onCaptionChange}
            onIconPlace={onIconPlace}
            onIconMove={onIconMove}
          />
        ))}
        <button className="btn btn-secondary add-panel-btn" onClick={onAddPanel}>
          + Add Panel
        </button>
      </div>
    </div>
  )
}
