export function LoadModal({ stories, onLoad, onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="modal-title">Load Story</h2>
        {stories.length === 0 ? (
          <p className="modal-empty">No saved stories.</p>
        ) : (
          <ul className="story-list">
            {stories.map(story => (
              <li key={story.title}>
                <button className="story-item btn" onClick={() => onLoad(story)}>
                  {story.title}
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="btn btn-secondary modal-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
