import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'

import '@/icons'
Vue.use(VueRouter)
Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
