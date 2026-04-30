import { useState, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ICONS } from '../data/icons'

const PRESET_COLORS = [
  '#111111', '#ffffff', '#e63946', '#f4a261',
  '#f9c74f', '#90be6d', '#43aa8b', '#4cc9f0',
  '#4361ee', '#7209b7', '#f72585', '#adb5bd',
]

const SIZES = [
  { key: 'small',  label: 'S' },
  { key: 'medium', label: 'M' },
  { key: 'large',  label: 'L' },
]

export function IconTray({ isOpen, onToggle, selectedIcon, onSelectIcon, iconColor, onColorChange, iconSize, onSizeChange }) {
  const [recentIconNames, setRecentIconNames] = useState([])
  const [search, setSearch] = useState('')

  const filteredIcons = useMemo(() =>
    search.trim()
      ? ICONS.filter(i => i.iconName.includes(search.trim().toLowerCase()))
      : ICONS,
    [search]
  )

  function handleSelect(iconName) {
    setRecentIconNames(prev => [iconName, ...prev.filter(n => n !== iconName)].slice(0, 8))
    onSelectIcon(iconName === selectedIcon ? null : iconName)
  }

  const recentSet = new Set(recentIconNames)
  const recentIconObjects = recentIconNames
    .filter(name => !search.trim() || name.includes(search.trim().toLowerCase()))
    .map(name => ICONS.find(i => i.iconName === name))
    .filter(Boolean)
  const mainIcons = filteredIcons.filter(i => !recentSet.has(i.iconName))

  const toggleLabel = isOpen
    ? '✕ Close'
    : selectedIcon
      ? `● ${selectedIcon}`
      : '🎨 Icons'

  return (
    <>
      <button
        className={`tray-toggle-btn${selectedIcon ? ' has-icon' : ''}`}
        onClick={onToggle}
        aria-label={toggleLabel}
      >
        {toggleLabel}
      </button>

      <div className={`icon-tray${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="tray-controls">
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
          <div className="size-picker">
            {SIZES.map(s => (
              <button
                key={s.key}
                className={`size-btn${iconSize === s.key ? ' active' : ''}`}
                onClick={() => onSizeChange(s.key)}
                aria-label={s.key}
              >{s.label}</button>
            ))}
          </div>
          <input
            className="tray-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search icons..."
            aria-label="Search icons"
          />
        </div>

        <div className="tray-body">
          {recentIconObjects.length > 0 && (
            <>
              <div className="tray-section-label">Recent</div>
              <div className="icon-grid">
                {recentIconObjects.map(icon => (
                  <span
                    key={icon.iconName}
                    className={`icon-item${icon.iconName === selectedIcon ? ' selected' : ''}`}
                    title={icon.iconName}
                    onClick={() => handleSelect(icon.iconName)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleSelect(icon.iconName)}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </span>
                ))}
              </div>
            </>
          )}

          {recentIconObjects.length > 0 && <div className="tray-section-label">All</div>}
          <div className="icon-grid">
            {mainIcons.map(icon => (
              <span
                key={icon.iconName}
                className={`icon-item${icon.iconName === selectedIcon ? ' selected' : ''}`}
                title={icon.iconName}
                draggable
                onClick={() => handleSelect(icon.iconName)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleSelect(icon.iconName)}
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
      </div>
    </>
  )
}
