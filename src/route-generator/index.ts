import * as fs from 'fs'
import * as path from 'path'
import * as fg from 'fast-glob'
import { createRoutes } from './template/routes'
import { resolveRoutePaths } from './resolve'

export interface GenerateConfig {
  pages?: string
  routePath?: string,
  importPrefix?: string
  dynamic?: boolean
  chunkNamePrefix?: string
  layout?: string
}

export function generateRoutes({
  pages = 'src/views',
  importPrefix = '@/views/',
  dynamic = true,
  chunkNamePrefix = '',
  layout = '_layout.vue',
}: GenerateConfig): string {
  // 指定文件不需要生成路由配置
  const patterns = ['**/*.vue', `!**/${layout}`]

  // 获取所有layout的文件路径
  const layoutPaths = fg.sync(`**/${layout}`, {
    cwd: pages,
    onlyFiles: true,
  })

  // 获取所有需要路由配置的文件路径
  const paths = fg.sync(patterns, {
    cwd: pages,
    onlyFiles: true,
  })

  // 获取路由配置信息
  const metaList = resolveRoutePaths(
    {
      layoutPaths,
      paths,
      importPrefix,
      layout,
      readFile: (file) => {
        return fs.readFileSync(path.join(pages, file), 'utf8')
      }
    }
  )

  // 返回需要写入路由文件的内容
  return createRoutes(metaList, dynamic, chunkNamePrefix)
}