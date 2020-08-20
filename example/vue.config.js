const os = require('os')
const ZAutoRoute = require('../lib/webpack-plugin')

module.exports = {
  configureWebpack: (config) => {
    config.plugins = [
      ...config.plugins,
      new ZAutoRoute({
        pages: 'src/views',
        importPrefix: '@/views/',
      }),
    ]
  },
  parallel: os.cpus().length > 1, // 构建时开启多进程处理babel编译
}
