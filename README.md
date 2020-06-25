# z-auto-route 基于 Vue Router 自动化路由

### 安装

```sh
npm i -S z-auto-route
```

### webpack 配置项

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

```
|-- views
  |-- _layout.vue // 全局布局组件
  |-- homepage.vue // 首页
  |-- system // 系统管理
    |-- _layout.vue // 嵌套路由
    |-- role // 角色管理
      |-- index.vue
    |-- user // 用户管理
      |-- index
      |-- _id // 用户详情
        |-- index.vue
```

#### 示例生成路由结构

```js
import _layout from '@/views/_layout.vue'
function system__layout() {
  return import(
    /* webpackChunkName: "system-layout" */ '@/views/system/_layout.vue'
  )
}
function system_role_index() {
  return import(
    /* webpackChunkName: "system-role-index" */ '@/views/system/role/index.vue'
  )
}
function system_user_index() {
  return import(
    /* webpackChunkName: "system-user-index" */ '@/views/system/user/index.vue'
  )
}
function system_user__id_index() {
  return import(
    /* webpackChunkName: "system-user-id-index" */ '@/views/system/user/_id/index.vue'
  )
}
import homepage from '@/views/homepage.vue'

export default [
  {
    name: 'layout',
    path: '/',
    component: _layout,
    meta: {
      title: '布局组件',
      hide: true,
    },
    dynamic: false,
    children: [
      {
        name: 'system-layout',
        path: '/system',
        component: system__layout,
        meta: {
          title: '系统管理',
        },
        sortIndex: 0,
        children: [
          {
            name: 'system-role',
            path: 'role',
            component: system_role_index,
            meta: {
              title: '角色管理',
            },
          },
          {
            name: 'system-user',
            path: 'user',
            component: system_user_index,
            meta: {
              title: '用户管理',
            },
          },
          {
            name: 'system-user-id',
            path: 'user/:id',
            component: system_user__id_index,
            meta: {
              title: '用户详情',
              hide: true,
            },
          },
        ],
      },
      {
        name: 'homepage',
        path: '/homepage',
        component: homepage,
        meta: {
          title: '首页',
        },
        dynamic: false,
        sortIndex: -1,
      },
    ],
  },
]
```

#### 效果图

![image](https://note.youdao.com/yws/public/resource/1bd71e3d09ed1aee2763fe2efcb0e114/53A610CD1092485EBC58A191C13BFF59?ynotemdtimestamp=1593085785896)
![image](https://note.youdao.com/yws/public/resource/1bd71e3d09ed1aee2763fe2efcb0e114/8874AB16BFD441CAA4C34E3977DB7625?ynotemdtimestamp=1593085785896)
