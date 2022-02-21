import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/modules/home/views/ViewHome.vue'),
    meta: {
      title: "Welcome to Sirius Explorer",
    }
  },

  {
    path: '/txn/:hash',
    name: 'ViewTransaction',
    props: true,
    component: () => import('@/modules/transaction/views/ViewTransaction.vue'),
    meta: {
      title: "View Transaction",
    }
  },

  {
    path: '/asset/:id',
    name: 'ViewAsset',
    props: true,
    component: () => import('@/modules/asset/views/ViewAsset.vue'),
    meta: {
      title: "View Asset",
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
