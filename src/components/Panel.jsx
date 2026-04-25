import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ACCENT_COLORS = ['#1847d4', '#e63946', '#ffd60a']
const SIZES = { small: '32px', medium: '48px', large: '64px' }

export function Panel({ panel, panelIndex, selectedIcon, onCaptionChange, onIconPlace, onIconMove, onRemoveIcon, onRemove }) {
  const zoneRef = useRef(null)
  const lastTapRef = useRef({})

  function getRelativeCoords(e) {
    const rect = zoneRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  function handleZoneClick(e) {
    if (!selectedIcon) return
    const { x, y } = getRelativeCoords(e)
    onIconPlace(panel.id, selectedIcon, x, y)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    const data = JSON.parse(e.dataTransfer.getData('application/json'))
    const { x, y } = getRelativeCoords(e)
    if (data.type === 'sidebar-icon') {
      onIconPlace(panel.id, data.iconName, x, y)
    } else if (data.type === 'placed-icon') {
      onIconMove(data.fromPanelId, data.iconId, panel.id, x, y)
    }
  }

  function handleIconDragStart(e, icon) {
    e.stopPropagation()
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'placed-icon',
      fromPanelId: panel.id,
      iconId: icon.id,
    }))
  }

  function handleIconClick(e, icon) {
    e.stopPropagation()
    const now = Date.now()
    const last = lastTapRef.current[icon.id] ?? 0
    if (now - last < 300) {
      onRemoveIcon(panel.id, icon.id)
      lastTapRef.current[icon.id] = 0
    } else {
      lastTapRef.current[icon.id] = now
    }
  }

  function handleIconContextMenu(e, icon) {
    e.preventDefault()
    e.stopPropagation()
    onRemoveIcon(panel.id, icon.id)
  }

  const accentColor = ACCENT_COLORS[panelIndex % 3]

  return (
    <div className="panel">
      <button className="panel-remove-btn" onClick={() => onRemove(panel.id)} title="Remove panel">✕</button>
      <div className="panel-inner">
        <div className="panel-accent" style={{ background: accentColor }} />
        <div
          ref={zoneRef}
          className="icon-zone"
          data-testid="icon-zone"
          onClick={handleZoneClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {panel.icons.map(icon => (
            <span
              key={icon.id}
              className="placed-icon"
              title={icon.iconName}
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                color: icon.color ?? '#000000',
                fontSize: SIZES[icon.size] ?? '32px',
              }}
              draggable
              onDragStart={e => handleIconDragStart(e, icon)}
              onClick={e => handleIconClick(e, icon)}
              onContextMenu={e => handleIconContextMenu(e, icon)}
            >
              <FontAwesomeIcon icon={['fas', icon.iconName]} />
            </span>
          ))}
        </div>
        <textarea
          className="panel-caption"
          value={panel.caption}
          onChange={e => onCaptionChange(panel.id, e.target.value)}
          placeholder="Caption..."
        />
      </div>
    </div>
  )
}
