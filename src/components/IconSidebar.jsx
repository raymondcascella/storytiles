import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS } from '../data/icons'

const PRESET_COLORS = [
  '#111111', '#ffffff', '#e63946', '#f4a261',
  '#f9c74f', '#90be6d', '#43aa8b', '#4cc9f0',
  '#4361ee', '#7209b7', '#f72585', '#adb5bd',
]

const SIZES = [
  { key: 'small', label: 'S', px: 32 },
  { key: 'medium', label: 'M', px: 48 },
  { key: 'large', label: 'L', px: 64 },
]

export function IconSidebar({ selectedIcon, onSelectIcon, iconColor, onColorChange, iconSize, onSizeChange }) {
  return (
    <div className="sidebar">
      <div className="sidebar-label">Icons</div>
      <div className="size-picker">
        {SIZES.map(s => (
          <button
            key={s.key}
            className={`size-btn${iconSize === s.key ? ' active' : ''}`}
            onClick={() => onSizeChange(s.key)}
          >{s.label}</button>
        ))}
      </div>
      <div className="color-presets">
        {PRESET_COLORS.map(color => (
          <button
            key={color}
            className={`color-swatch${iconColor === color ? ' active' : ''}`}
            style={{ background: color }}
            onClick={() => onColorChange(color)}
            title={color}
          />
        ))}
      </div>
      <div className="icon-grid" style={{ '--icon-size': `${SIZES.find(s => s.key === iconSize)?.px ?? 32}px` }}>
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
            <FontAwesomeIcon icon={icon} />
          </span>
        ))}
      </div>
    </div>
  )
}
