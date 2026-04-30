import { useState } from 'react'

export function LoadModal({ stories: initial, onLoad, onDelete, onClose }) {
  const [stories, setStories] = useState(initial)

  function handleDelete(title) {
    onDelete(title)
    setStories(prev => prev.filter(s => s.title !== title))
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-stripe" style={{ background: '#1847d4' }} />
        <div className="modal-body">
          <h2 className="modal-title">Load Story</h2>
          {stories.length === 0 ? (
            <p className="modal-empty">No saved stories.</p>
          ) : (
            <ul className="story-list">
              {stories.map(story => (
                <li key={story.title} className="story-card">
                  <button className="story-card-load" onClick={() => onLoad(story)}>
                    <span className="story-card-title">{story.title}</span>
                    <span className="story-card-meta">{story.panels.length} panels</span>
                  </button>
                  <button className="story-card-delete" onClick={() => handleDelete(story.title)}>✕</button>
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-ghost modal-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
