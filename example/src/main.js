import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(Element)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
