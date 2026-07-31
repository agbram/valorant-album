import isEqual from 'lodash/isEqual'

// Values you allow in your domain (add more if needed)
export type JSONLike =
  | string
  | number
  | boolean
  | null
  | Date
  | JSONLike[]
  | { [k: string]: JSONLike }

// Normalize Date -> string (ISO) everywhere, preserve structures
export type Normalize<V> = V extends Date
  ? string
  : V extends (infer E)[]
  ? Normalize<E>[]
  : V extends { [k: string]: JSONLike }
  ? { [K in keyof V]: Normalize<V[K]> }
  : V

// Diff shape per value kind:
// - arrays -> { added, removed } (normalized)
// - objects -> nested Diff | null (removed)
// - scalars -> new value | null (removed); Dates become string | null
export type DiffValue<V> = V extends (infer E)[]
  ? { added: Normalize<E>[]; removed: Normalize<E>[] }
  : V extends Date
  ? string | null
  : V extends { [k: string]: JSONLike }
  ? Diff<V> | null
  : V | null

export type Diff<T extends { [k: string]: JSONLike }> = {
  [K in keyof T]?: DiffValue<T[K]>
}

export class CompareObjs {
  private static isPlainObject(value: JSONLike): value is { [k: string]: JSONLike } {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    )
  }

  private static normalizeValue(value: JSONLike): Normalize<JSONLike> {
    if (value instanceof Date) return value.toISOString()
    if (Array.isArray(value)) {
      const out: Array<Normalize<JSONLike>> = []
      for (const item of value) out.push(this.normalizeValue(item))
      return out as Normalize<JSONLike>
    }
    if (this.isPlainObject(value)) {
      const out: { [k: string]: Normalize<JSONLike> } = {}
      for (const k of Object.keys(value)) {
        out[k] = this.normalizeValue(value[k])
      }
      return out as Normalize<JSONLike>
    }
    return value as Normalize<JSONLike>
  }

  private static arrayDiff<E extends JSONLike>(
    next: ReadonlyArray<E>,
    prev: ReadonlyArray<E>
  ): { added: Normalize<E>[]; removed: Normalize<E>[] } {
    const added: Normalize<E>[] = []
    const removed: Normalize<E>[] = []

    for (const n of next) {
      if (!prev.some(p => isEqual(n, p))) added.push(this.normalizeValue(n) as Normalize<E>)
    }
    for (const p of prev) {
      if (!next.some(n => isEqual(n, p))) removed.push(this.normalizeValue(p) as Normalize<E>)
    }
    return { added, removed }
  }

  static difference<T extends { [k: string]: JSONLike }>(origObj: T, newObj: T): Diff<T> {
    const changes = <U extends { [k: string]: JSONLike }>(next: U, prev: U): Diff<U> => {
      const out: { [K in keyof U]?: DiffValue<U[K]> } = {}
      const allKeys = new Set<keyof U>([
        ...(Object.keys(next) as Array<keyof U>),
        ...(Object.keys(prev) as Array<keyof U>)
      ])

      for (const key of allKeys) {
        const hasNext = Object.prototype.hasOwnProperty.call(next, key)
        const hasPrev = Object.prototype.hasOwnProperty.call(prev, key)

        if (!hasNext) {
          // Key removed
          out[key] = null as DiffValue<U[typeof key]>
          continue
        }

        const nextVal = next[key]

        if (!hasPrev) {
          // Key added
          if (this.isPlainObject(nextVal)) {
            out[key] = changes(
              nextVal as { [k: string]: JSONLike },
              {} as { [k: string]: JSONLike }
            ) as DiffValue<U[typeof key]>
          } else if (nextVal instanceof Date) {
            out[key] = nextVal.toISOString() as DiffValue<U[typeof key]>
          } else {
            out[key] = this.normalizeValue(nextVal) as DiffValue<U[typeof key]>
          }
          continue
        }

        const prevVal = prev[key]

        // Both present
        if (Array.isArray(prevVal) && Array.isArray(nextVal)) {
          const diff = this.arrayDiff(nextVal, prevVal)
          if (diff.added.length || diff.removed.length) {
            out[key] = diff as DiffValue<U[typeof key]>
          }
          continue
        }

        if (!isEqual(nextVal, prevVal)) {
          if (this.isPlainObject(nextVal) && this.isPlainObject(prevVal)) {
            out[key] = changes(
              nextVal as { [k: string]: JSONLike },
              prevVal as { [k: string]: JSONLike }
            ) as DiffValue<U[typeof key]>
          } else if (nextVal instanceof Date) {
            out[key] = nextVal.toISOString() as DiffValue<U[typeof key]>
          } else {
            out[key] = this.normalizeValue(nextVal) as DiffValue<U[typeof key]>
          }
        }
      }

      return out as Diff<U>
    }

    return changes(newObj, origObj)
  }
}
