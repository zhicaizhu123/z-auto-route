import * as fs from 'fs'
import * as path from 'path'
import * as fg from 'fast-glob'
import { createRoutes } from './template/routes'
import { resolveRoutePaths } from './resolve'

export interface GenerateConfig {
  pages: string
  routePath?: string,
  importPrefix?: string
  dynamic?: boolean
  chunkNamePrefix?: string
  nested?: boolean
  layout?: string
}

export function generateRoutes({
  pages,
  importPrefix = '@/views/',
  dynamic = true,
  chunkNamePrefix = '',
  layout = '_layout.vue',
}: GenerateConfig): string {
  const patterns = ['**/*.vue', '!**/__*__.vue', '!**/__*__/**', '!**/components/**', `!**/${layout}`]

  const layoutPaths = fg.sync(`**/${layout}`, {
    cwd: pages,
    onlyFiles: true,
  })

  const pagePaths = fg.sync(patterns, {
    cwd: pages,
    onlyFiles: true,
  })

  const metaList = resolveRoutePaths(
    layoutPaths,
    pagePaths,
    importPrefix,
    layout,
    (file) => {
      return fs.readFileSync(path.join(pages, file), 'utf8')
    }
  )

  return createRoutes(metaList, dynamic, chunkNamePrefix)
}