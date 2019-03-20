import VueRouter from 'vue-router'
import Layout from './Layout'

const routes = [
  {
    path: '/', component: Layout
  },
]

export default new VueRouter({
  routes
})