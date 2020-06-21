# z-auto-route 基于 Vue Router 自动化路由

### 安装

```sh
npm i -S z-auto-route
```

### webpack 配置项

pages: string
routePath?: string,
importPrefix?: string
dynamic?: boolean
chunkNamePrefix?: string
layout?: string

| 属性            | 描述                                                                                           | 类型   | 是否必选 | 默认值         |
| --------------- | ---------------------------------------------------------------------------------------------- | ------ | -------- | -------------- |
| pages           | 需要自动生成文件的目录                                                                         | String | 否       |                | 'src/views' |
| importPrefix    | import 引入页面文件的前缀目录                                                                  | String | 否       | '@/views'      |
| dynamic         | 是否按需加载                                                                                   | String | 否       | true           |
| chunkNamePrefix | 按需加载 chunkName 的前缀                                                                      | String | 否       | 无             |
| layout          | 处理成布局文件的文件名                                                                         | String | 否       | '\_layout.vue' |
| routePath       | 路由生成的文件目录，如果设置了则会在当前项目指定目录生成路由文件，否则可以从`z-auto-route`导入 | String | 否       | 无             |

### 页面 customBlock 配置

在需要生成路由的 vue 文件头部加上`z-route`标签，里面为 json

```html
<z-route>
  { "dynamic": false, "meta": { "title": "根布局页面" } }
</z-route>
```

其中`meta`为`vue-router`配置的`meta`属性一致，`dynamic`为单独设置该路由是否为按需加载，不设置默认使用全局配置的`dynamic`

**注意**：

- 如果没有`z-route`标签则该页面不会不会生成路由
- 暂时只支持`meta`和`dynamic`两个设置项。
- 如果需要`z-route`标签高亮，可以设置 `vs-code` 的 `settings.json`

  ```json
  "vetur.grammar.customBlocks": {
    "z-route": "json"
  }
  ```

  执行 vscode 命令

  ```sh
  > Vetur: Generate grammar from vetur.grammar.customBlocks
  ```

### 使用

#### webpack 配置

在 weppack 配置文件中配置内容，以下为 vue.config.js 的配置信息

```js
// vue.config.js
...
  configureWebpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new ZAutoRoute({
        pages: 'src/views', // 路由页面文件存放地址， 默认为'src/views'
        importPrefix: '@/views/', // import引入页面文件的前缀目录，默认为'@/views/'
      }),
    ]
  }
...
```

#### 路由文件配置

```js
// 路由初始化
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from 'z-auto-route'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
```

#### 示例项目目录

#### 示例生成路由结构

```js
import _layout from '@/views/_layout.vue'
function data__layout() {
  return import(
    /* webpackChunkName: "data-layout" */ '@/views/data/_layout.vue'
  )
}
function data__id() {
  return import(/* webpackChunkName: "data-id" */ '@/views/data/_id.vue')
}
function about() {
  return import(/* webpackChunkName: "about" */ '@/views/about.vue')
}
function home() {
  return import(/* webpackChunkName: "home" */ '@/views/home.vue')
}

export default [
  {
    name: 'layout',
    path: '/',
    component: _layout,
    meta: {
      title: '根布局页面',
    },
    dynamic: false,
    children: [
      {
        name: 'data-layout',
        path: '/data',
        component: data__layout,
        meta: {
          title: '子页面',
        },
        children: [
          {
            name: 'data-id',
            path: ':id?',
            component: data__id,
            meta: {
              title: '子页面-动态路由页面',
            },
          },
        ],
      },
      {
        name: 'about',
        path: '/about',
        component: about,
        meta: {
          title: '关于',
        },
      },
      {
        name: 'home',
        path: '/home',
        component: home,
        meta: {
          title: '首页',
        },
      },
    ],
  },
]
```
