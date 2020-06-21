// import * as fs from 'fs'
// import * as path from 'path'

export interface NestedMap<T> {
  value?: T
  children?: Map<string, NestedMap<T>>
}

export function setToMap<T>(map: NestedMap<T>, paths: string[], value: T): void {
  const target = paths.reduce((item, key) => {
    if (!item.children) {
      item.children = new Map()
    }

    let child = item.children.get(key)
    if (!child) {
      child = {}
      item.children.set(key, child)
    }

    return child
  }, map)

  target.value = value
}