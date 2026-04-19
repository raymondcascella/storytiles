import { fas } from '@fortawesome/free-solid-svg-icons'

const seen = new Set()
export const ICONS = Object.values(fas).filter(icon => {
  if (seen.has(icon.iconName)) return false
  seen.add(icon.iconName)
  return true
})
