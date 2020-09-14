import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../../../lib/routes'

Vue.use(VueRouter)

console.log('routes', routes)

function generatePath(routes, parentPath) {
  routes.forEach((item) => {
    item.fullUrl = `${parentPath}/${item.path}`.replace(/\/+/, '/')
    if (item.children && item.children.length) {
      generatePath(item.children, item.fullUrl)
    }
  })
}

const menus = [...routes][0].children

function createMenus(list) {
  list.sort((a, b) => {
    if (typeof a.sortIndex === 'number' && typeof b.sortIndex === 'number') {
      return a.sortIndex - b.sortIndex
    }
    return 0
  })
  list.forEach((item) => {
    if (!item.children || !item.children.length) return
    item.children = item.children.filter((item) => {
      return !item.meta.hide
    })
    if (item.children.length) {
      createMenus(item.children)
    }
  })
}

createMenus(menus)
generatePath(menus, '')

export const menuRoutes = menus

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
