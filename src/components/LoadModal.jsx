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
        <h2 className="modal-title">Load Story</h2>
        {stories.length === 0 ? (
          <p className="modal-empty">No saved stories.</p>
        ) : (
          <ul className="story-list">
            {stories.map(story => (
              <li key={story.title} className="story-list-item">
                <button className="story-item btn" onClick={() => onLoad(story)}>
                  {story.title}
                </button>
                <button className="story-delete-btn" onClick={() => handleDelete(story.title)}>✕</button>
              </li>
            ))}
          </ul>
        )}
        <button className="btn btn-secondary modal-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
