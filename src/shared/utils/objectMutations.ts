export type AtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>
}[keyof T]

export const applyUpdate = <T extends object>(
  item: T,
  update: AtLeastOne<T>
): T => ({ ...item, ...update })

export const replaceWithin = <T, K extends keyof T>(
  obj: T,
  key: K,
  project: (current: T[K]) => T[K]
): T => ({ ...obj, [key]: project(obj[key]) })

export const replaceItemCur = <T, K extends keyof T>(
  obj: T,
  key: K,
  project: (current: T) => T[K]
): T => ({ ...obj, [key]: project(obj) })

export const replaceMany = <T extends object>(
  obj: T,
  updates: Partial<{ [K in keyof T]: (state: T) => T[K] }>
): T => {
  const result = { ...obj }

  for (const key in updates) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      const updater = updates[key]

      if (updater) Object.assign(result, { [key]: updater(obj) })
    }
  }

  return result
}
