import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS } from '../data/icons'

export function IconSidebar({ isOpen, selectedIcon, onSelectIcon, onClose }) {
  if (!isOpen) return null

  return (
    <div className="sidebar-overlay">
      <div className="sidebar">
        <button className="sidebar-close btn btn-secondary" onClick={onClose}>✕</button>
        <div className="icon-grid">
          {ICONS.map(icon => (
            <span
              key={icon.iconName}
              className={`icon-item${icon.iconName === selectedIcon ? ' selected' : ''}`}
              title={icon.iconName}
              draggable
              onClick={() => onSelectIcon(icon.iconName)}
              onDragStart={e => {
                e.dataTransfer.setData('application/json', JSON.stringify({
                  type: 'sidebar-icon',
                  iconName: icon.iconName,
                }))
              }}
            >
              <FontAwesomeIcon icon={icon} size="2x" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
