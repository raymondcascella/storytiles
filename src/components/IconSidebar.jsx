import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS } from '../data/icons'

export function IconSidebar({ selectedIcon, onSelectIcon }) {
  return (
    <div className="sidebar">
      <div className="sidebar-label">Icons</div>
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
            <FontAwesomeIcon icon={icon} size="lg" />
          </span>
        ))}
      </div>
    </div>
  )
}
