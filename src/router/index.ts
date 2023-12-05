import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const redirectionRoutes: RouteRecordRaw[] = [
  {
    path: "/result/blockHeight/:blockNum",
    redirect: (to) => {
      return { name: "ViewBlock", query: { blockHeight: to.params.blockNum } };
    },
  },
  {
    path: "/result/publicKey/:publicKey",
    redirect: (to) => {
      return {
        name: "ViewAccount",
        params: { accountParam: to.params.publicKey },
      };
    },
  },
  {
    path: "/result/address/:address",
    redirect: (to) => {
      return {
        name: "ViewAccount",
        params: { accountParam: to.params.address },
      };
    },
  },
  {
    path: "/result/hash/:hash",
    redirect: (to) => {
      return { name: "ViewTransaction", params: { hash: to.params.hash } };
    },
  },
  {
    path: "/result/namespaceInfo/:namespaceId",
    redirect: (to) => {
      return {
        name: "ViewNamespace",
        params: { namespaceParam: to.params.namespaceId },
      };
    },
  },
  {
    path: "/result/assetInfo/:assetId",
    redirect: (to) => {
      return { name: "ViewAsset", params: { id: to.params.assetId } };
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      return { name: 'PageNotFound' }},
  },
];

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/modules/home/views/ViewHome.vue"),
    meta: {
      title: "Welcome to Sirius Explorer",
    },
  },

  {
    path: "/tx/:hash",
    name: "ViewTransaction",
    props: true,
    component: () => import("@/modules/transaction/views/ViewTransaction.vue"),
    meta: {
      title: "View Transaction",
    },
  },

  {
    path: "/asset/:id",
    name: "ViewAsset",
    props: true,
    component: () => import("@/modules/asset/views/ViewAsset.vue"),
    meta: {
      title: "View Asset",
    },
  },

  {
    path: "/tx",
    name: "ViewAccountTransactionList",
    props: route => ({ accountParam: route.query.a }),
    component: () =>
      import("@/modules/transaction/views/ViewTransactionList.vue"),
    meta: {
      title: "View Account Transactions",
    },
  },

  {
    path: "/tx",
    name: "ViewTransactionList",
    props: true,
    component: () =>
      import("@/modules/transaction/views/ViewTransactionList.vue"),
    meta: {
      title: "View Transactions",
    },
  },

  {
    path: "/account/:accountParam",
    name: "ViewAccount",
    props: true,
    component: () => import("@/modules/account/views/ViewAccount.vue"),
    meta: {
      title: "View Address",
    },
  },

  {
    path: "/block",
    name: "ViewBlockList",
    props: true,
    component: () => import("@/modules/block/views/ViewBlockList.vue"),
    meta: {
      title: "View Blocks",
    },
  },

  {
    path: "/block/:blockHeight",
    name: "ViewBlock",
    props: true,
    component: () => import("@/modules/block/views/ViewBlock.vue"),
    meta: {
      title: "View Block",
    },
  },

  {
    path: "/harvester",
    name: "ViewHarvesterList",
    props: true,
    component: () => import("@/modules/harvester/views/ViewHarvesterList.vue"),
    meta: {
      title: "View Harvesters",
    },
  },

  {
    path: "/namespace/:namespaceParam",
    name: "ViewNamespace",
    props: true,
    component: () => import("@/modules/namespace/views/ViewNamespace.vue"),
    meta: {
      title: "View Namespace",
    },
  },

  {
    path: "/payload",
    name: "ViewPayloadSearch",
    props: true,
    component: () => import("@/modules/transaction/views/ViewPayloadSearch.vue"),
    meta: {
      title: "View Payload",
    },
  },

  {
    path: "/payload/:payload",
    name: "ViewPayloadDirect",
    props: true,
    component: () => import("@/modules/transaction/views/ViewPayloadDirect.vue"),
    meta: {
      title: "View Payload",
    },
  },


  {
    path: "/searchInvalid/:type/:param",
    name: "ViewInvalidSearch",
    props: true,
    component: () => import("@/modules/search/views/ViewInvalidSearch.vue"),
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



let allRoutes: RouteRecordRaw[] = routes.concat(redirectionRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes: allRoutes
});

export default router;
