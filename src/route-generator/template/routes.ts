import * as prettier from 'prettier'
import { PageMeta } from '../resolve'

function isAllowedRouteOption(key: string): boolean {
  return !['name', 'meta', 'path', 'component'].includes(key)
}

function createChildrenRoute(children: PageMeta[]): string {
  return `,children: [${children.map(createRoute).join(',')}]`
}

function createRoute(meta: PageMeta): string {
  const children = !meta.children ? '' : createChildrenRoute(meta.children)

  const route = meta.route ?? {}

  // If default child is exists, the route should not have a name.
  const routeName =
    meta.children && meta.children.some((m) => m.path === '')
      ? ''
      : `name: '${route.name ?? meta.name}',`

  const routeMeta = meta.route?.meta
    ? ',meta: ' + JSON.stringify(route.meta, null, 2)
    : ',meta: {}'

  let otherOptions = Object.keys(route)
    .filter(isAllowedRouteOption)
    .map((key) => {
      let content = ''
      try {
        content = eval(`(${route[key]})`)
      } catch(e) {
        content = JSON.stringify(`${route[key]}`)
      }
      return `${key}: ${content}`
    })
    .join(',')
  otherOptions = otherOptions ? `,${otherOptions}` : ''

  return `
  {
    ${routeName}
    path: '${meta.path}',
    component: ${meta.specifier}${routeMeta}${otherOptions}${children}
  }`
}

function createImport(
  meta: PageMeta,
  dynamic: boolean,
  chunkNamePrefix: string
): string {
  // 根据不同页面
  const isDynamic = typeof meta.route?.dynamic === 'boolean' ? meta.route.dynamic : dynamic
  const code = isDynamic
    ? `function ${meta.specifier}() { return import(/* webpackChunkName: "${chunkNamePrefix}${meta.chunkName}" */ '${meta.component}') }`
    : `import ${meta.specifier} from '${meta.component}'`

  return meta.children
    ? [code]
      .concat(
        meta.children.map((child) => {
          const isDynamic = typeof child.route?.dynamic === 'boolean' ? child.route.dynamic : dynamic
          return createImport(child, isDynamic, chunkNamePrefix)
        })
      )
      .join('\n')
    : code
}

export function createRoutes(
  meta: PageMeta[],
  dynamic: boolean,
  chunkNamePrefix: string
): string {
  const imports = meta
    .map((m) => createImport(m, dynamic, chunkNamePrefix))
    .join('\n')
  const code = meta.map(createRoute).join(',')
  return prettier.format(`${imports}\n\nexport default [${code}]`, {
    parser: 'babel',
    semi: false,
    singleQuote: true,
  })
}