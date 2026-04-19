import { useStories } from '../src/hooks/useStories'

beforeEach(() => localStorage.clear())

test('loadAll returns empty array when nothing saved', () => {
  const { loadAll } = useStories()
  expect(loadAll()).toEqual([])
})

test('save stores a story and loadAll returns it', () => {
  const { save, loadAll } = useStories()
  save({ title: 'My Story', panels: [] })
  expect(loadAll()).toEqual([{ title: 'My Story', panels: [] }])
})

test('resolveTitle returns original when no clash', () => {
  const { resolveTitle } = useStories()
  expect(resolveTitle('Hello', [])).toBe('Hello')
})

test('resolveTitle appends _2 on first clash', () => {
  const { resolveTitle } = useStories()
  expect(resolveTitle('Hello', [{ title: 'Hello' }])).toBe('Hello_2')
})

test('resolveTitle appends _3 when _2 also clashes', () => {
  const { resolveTitle } = useStories()
  expect(resolveTitle('Hello', [{ title: 'Hello' }, { title: 'Hello_2' }])).toBe('Hello_3')
})

test('save uses resolved title on clash', () => {
  const { save, loadAll } = useStories()
  save({ title: 'Story', panels: [] })
  save({ title: 'Story', panels: [] })
  const titles = loadAll().map(s => s.title)
  expect(titles).toContain('Story')
  expect(titles).toContain('Story_2')
})

test('save returns the resolved title', () => {
  const { save } = useStories()
  save({ title: 'X', panels: [] })
  const resolved = save({ title: 'X', panels: [] })
  expect(resolved).toBe('X_2')
})
