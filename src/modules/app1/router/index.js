import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  path: '/app1',
  component: () => import(/* webpackChunkName: "app1/index"*/ '@app1/components/layout.vue'),
  children: [{
    path: '',
    component: () => import(/* webpackChunkName: "app1/index"*/'@app1/views/index.vue')
  }]
}]

export default createRouter({
  history: createWebHistory(),
  routes,
})
