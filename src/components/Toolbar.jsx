export function Toolbar({ onCreateStory, onSaveStory, onLoadStory }) {
  return (
    <div className="toolbar">
      <button className="btn btn-secondary" onClick={onCreateStory}>Create Story</button>
      <button className="btn btn-primary" onClick={onSaveStory}>Save Story</button>
      <button className="btn btn-secondary" onClick={onLoadStory}>Load Story</button>
    </div>
  )
}
