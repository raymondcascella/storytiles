const STORAGE_KEY = 'storytiles_stories'

export function useStories() {
  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    } catch {
      return []
    }
  }

  function resolveTitle(title, stories) {
    const existing = new Set(stories.map(s => s.title))
    if (!existing.has(title)) return title
    let n = 2
    while (existing.has(`${title}_${n}`)) n++
    return `${title}_${n}`
  }

  function save(story) {
    const stories = loadAll()
    const resolved = resolveTitle(story.title, stories)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...stories, { ...story, title: resolved }]))
    } catch (err) {
      throw new Error('Failed to save story: ' + err.message)
    }
    return resolved
  }

  function remove(title) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loadAll().filter(s => s.title !== title)))
  }

  return { loadAll, save, resolveTitle, remove }
}
