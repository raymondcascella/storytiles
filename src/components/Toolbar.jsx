export function Toolbar({ title, isDirty, onTitleChange, onCreateStory, onSaveStory, onLoadStory }) {
  return (
    <div className="toolbar">
      <span className="toolbar-logo">StoryTiles</span>
      <input
        className="toolbar-title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        placeholder="Untitled"
        aria-label="Story title"
      />
      <div className="toolbar-actions">
        <button className="btn btn-new" onClick={onCreateStory}>New</button>
        <button className={`btn btn-save${isDirty ? ' dirty' : ''}`} onClick={onSaveStory}>Save</button>
        <button className="btn btn-load" onClick={onLoadStory}>Load</button>
      </div>
    </div>
  )
}
