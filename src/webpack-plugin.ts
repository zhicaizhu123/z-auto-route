import * as fs from 'fs'
import * as path from 'path'
import { Compiler } from 'webpack'
import { generateRoutes, GenerateConfig } from './route-generator'

const pluginName = 'AutoRoutingPlugin'

interface Options extends GenerateConfig { }

namespace AutoRoutingPlugin {
  export type AutoRoutingOptions = Options
}

class AutoRoutingPlugin {
  constructor(private options: Options) { }

  apply(compiler: Compiler) {
    const generate = () => {
      const code = generateRoutes(this.options)
      let to
      if (this.options.routePath) {
        to = path.join(process.cwd(), this.options.routePath)
      } else {
        to = path.join(__dirname, './routes.js')
      }

      if (
        fs.existsSync(to) &&
        fs.readFileSync(to, 'utf8').trim() === code.trim()
      ) {
        return
      }

      fs.writeFileSync(to, code)
    }

    let watcher: any = null

    compiler.hooks.afterPlugins.tap(pluginName, () => {
      generate()
    })

    compiler.hooks.emit.tap(pluginName, () => {
      const chokidar = require('chokidar')
      watcher = chokidar.watch(path.join(process.cwd(), this.options.pages || 'src/views'), {
        persistent: true,
      }).on('change', () => {
        generate()
      });
    })

    compiler.hooks.watchClose.tap(pluginName, () => {
      if (watcher) {
        watcher.close()
        watcher = null
      }

    })
  }
}

export = AutoRoutingPlugin
