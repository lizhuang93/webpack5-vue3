import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/app2',
    component: () => import(/* webpackChunkName: "app2/index"*/ '@app2/components/layout.vue'),
    children: [
      {
        path: '',
        component: () => import(/* webpackChunkName: "app2/index"*/ '@app2/views/index.vue'),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
