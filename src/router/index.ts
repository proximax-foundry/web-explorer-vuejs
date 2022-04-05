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
    path: '/tx/:hash',
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

  {
    path: '/tx',
    name: 'ViewTransactionList',
    props: true,
    component: () => import('@/modules/transaction/views/ViewTransactionList.vue'),
    meta: {
      title: "View Transactions",
    }
  },

  {
    path: '/account/:accountParam',
    name: 'ViewAccount',
    props: true,
    component: () => import('@/modules/account/views/ViewAccount.vue'),
    meta: {
      title: "View Address",
    }
  },

  {
    path: '/block',
    name: 'ViewBlockList',
    props: true,
    component: () => import('@/modules/block/views/ViewBlockList.vue'),
    meta: {
      title: "View Blocks",
    }
  },
  
  {
    path: '/block/:blockHeight',
    name: 'ViewBlock',
    props: true,
    component: () => import('@/modules/block/views/ViewBlock.vue'),
    meta: {
      title: "View Block",
    }
  },

  {
    path: '/namespace/:namespaceParam',
    name: 'ViewNamespace',
    props: true,
    component: () => import('@/modules/namespace/views/ViewNamespace.vue'),
    meta: {
      title: "View Namespace",
    }
  },

  {
    path: '/search/:type/:param',
    name: 'ViewInvalidSearch',
    props: true,
    component: () => import('@/modules/search/views/ViewInvalidSearch.vue'),
    meta: {
      title: "View Invalid Search",
    }
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
