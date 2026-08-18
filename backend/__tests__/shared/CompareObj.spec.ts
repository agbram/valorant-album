import { CompareObjs, Diff } from '../../src/shared'

describe('CompareObjs.difference (Date handling)', () => {
  test('scalar Date change -> ISO string', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const d2 = new Date('2024-01-02T00:00:00.000Z')

    const orig: Record<string, any> = { at: d1 }
    const next: Record<string, any> = { at: d2 }

    const diff = CompareObjs.difference(orig, next)
    expect(diff).toEqual<Diff<typeof next>>({
      at: d2.toISOString()
    })
  })

  test('added Date key -> ISO string', () => {
    const d2 = new Date('2024-01-02T00:00:00.000Z')
    const orig: Record<string, any> = {}
    const next: Record<string, any> = { at: d2 }

    const diff = CompareObjs.difference(orig as any, next)
    expect(diff).toEqual<Diff<typeof next>>({
      at: d2.toISOString()
    })
  })

  test('removed Date key -> null', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const orig: Record<string, any> = { at: d1 }
    const next: Record<string, any> = {}

    const diff = CompareObjs.difference(orig as any, next as any)
    expect(diff).toEqual({ at: null })
  })

  test('nested Date field -> ISO string', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const d2 = new Date('2024-01-02T00:00:00.000Z')

    const orig: Record<string, any> = { meta: { issuedAt: d1, unchanged: 'x' } }
    const next: Record<string, any> = { meta: { issuedAt: d2, unchanged: 'x' } }

    const diff = CompareObjs.difference(orig, next)
    expect(diff).toEqual<Diff<typeof next>>({
      meta: { issuedAt: d2.toISOString() }
    })
  })

  test('array of Dates -> ISO strings in added/removed', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const d2 = new Date('2024-01-02T00:00:00.000Z')
    const d3 = new Date('2024-01-03T00:00:00.000Z')

    const orig: Record<string, any> = { days: [d1, d2] }
    const next: Record<string, any> = { days: [d2, d3] }

    const diff = CompareObjs.difference(orig, next)
    expect(diff).toEqual({
      days: {
        added: [d3.toISOString()],
        removed: [d1.toISOString()]
      }
    })
  })

  test('array of objects containing Dates -> deep ISO normalization in added/removed', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const d2 = new Date('2024-01-02T00:00:00.000Z')

    const orig: Record<string, any> = { items: [{ id: 1, at: d1 }] }
    const next: Record<string, any> = {
      items: [
        { id: 1, at: d1 },
        { id: 2, at: d2 }
      ]
    }

    const diff = CompareObjs.difference(orig, next)
    expect(diff).toEqual({
      items: {
        added: [{ id: 2, at: d2.toISOString() }],
        removed: []
      }
    })
  })

  test('mixed: nested, arrays, scalars, removed', () => {
    const d1 = new Date('2024-01-01T00:00:00.000Z')
    const d2 = new Date('2024-01-02T00:00:00.000Z')
    const orig: Record<string, any> = {
      a: 1,
      b: [1, 2],
      c: { x: 1, when: d1 },
      d: 'keep',
      e: [{ id: 1, at: d1 }]
    }
    const next: Record<string, any> = {
      a: 2, // scalar
      b: [2, 3], // array primitives
      c: { x: 1, when: d2 }, // nested date
      e: [
        { id: 1, at: d1 },
        { id: 2, at: d2 }
      ], // array objects w/ date
      f: new Date('2024-01-05T00:00:00.000Z') // added date scalar
    }

    const diff = CompareObjs.difference(orig, next)
    expect(diff).toEqual({
      a: 2,
      b: { added: [3], removed: [1] },
      c: { when: d2.toISOString() },
      d: null,
      e: { added: [{ id: 2, at: d2.toISOString() }], removed: [] },
      f: (next.f as Date).toISOString()
    })
  })
})
