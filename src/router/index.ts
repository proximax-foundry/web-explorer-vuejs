import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
  {
    path: '/404',
    name: 'PageNotFound',
    props: false,
    component: () => import('@/modules/search/views/PageNotFound.vue'),
    meta: {
      title: "Page Not Found",
    }
  }
];

let redirectionRoutes: RouteRecordRaw[] = [
  {
    path: '/result/blockHeight/:blockNum',
    props: false,
    redirect: to => {
      return { name: 'ViewBlock', params: { blockHeight: to.params.blockNum }}
    },
    name: "BlockSearchRedirect",
    meta: {
      title: "Block Search Redirect",
    },
    component: null
  },
  {
    path: '/result/publicKey/:publicKey',
    props: false,
    redirect: to => {
      return { name: 'ViewAccount', params: { accountParam: to.params.publicKey }}
    },
    name: "PublicKeySearchRedirect",
    meta: {
      title: "PublicKey Search Redirect",
    },
    component: null
  },
  {
    path: '/result/address/:address',
    props: false,
    redirect: to => {
      return { name: 'ViewAccount', params: { accountParam: to.params.address }}
    },
    name: "AddressSearchRedirect",
    meta: {
      title: "Address Search Redirect",
    },
    component: null
  },
  {
    path: '/result/hash/:hash',
    props: false,
    redirect: to => {
      return { name: 'ViewTransaction', params: { hash: to.params.hash }}
    },
    name: "TxHashSearchRedirect",
    meta: {
      title: "Transaction Search Redirect",
    },
    component: null
  },
  {
    path: '/result/namespaceInfo/:namespaceId',
    props: false,
    redirect: to => {
      return { name: 'ViewNamespace', params: { namespaceParam: to.params.namespaceId }}
    },
    name: "NamespaceSearchRedirect",
    meta: {
      title: "Namespace Search Redirect",
    },
    component: null
  },
  {
    path: '/result/assetInfo/:assetId',
    props: false,
    redirect: to => {
      return { name: 'ViewAsset', params: { id: to.params.assetId }}
    },
    name: "AssetSearchRedirect",
    meta: {
      title: "Asset Search Redirect",
    },
    component: null
  },
  {
    path: '/:pathMatch(.*)*',
    props: false,
    redirect: to =>{
      return { name: 'PageNotFound'}
    },
    name: "PageNotFoundRedirect",
    meta: {
      title: "Page Not Found Redirect",
    }
  },
];

let allRoutes: RouteRecordRaw[] = routes.concat(redirectionRoutes);

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: allRoutes
})

export default router
