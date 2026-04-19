import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export function Panel({ panel, selectedIcon, onTitleChange, onCaptionChange, onIconPlace, onIconMove, onRemove }) {
  const zoneRef = useRef(null)

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

  return (
    <div className="panel">
      <div className="panel-header">
        <input
          className="panel-title"
          value={panel.title}
          onChange={e => onTitleChange(panel.id, e.target.value)}
          placeholder="Panel title"
        />
        <button className="panel-remove-btn" onClick={() => onRemove(panel.id)} title="Remove panel">✕</button>
      </div>
      <div
        ref={zoneRef}
        className="icon-zone"
        onClick={handleZoneClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {panel.icons.map(icon => (
          <span
            key={icon.id}
            className="placed-icon"
            style={{ left: `${icon.x}%`, top: `${icon.y}%`, color: icon.color ?? '#000000' }}
            draggable
            onDragStart={e => handleIconDragStart(e, icon)}
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
  )
}
