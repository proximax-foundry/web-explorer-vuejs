import { createApp } from 'vue';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbvue/build/css/mdb.css'
//import App from './App.vue'
import router from './router'
// import store from './models/stores/storeProperties'
import './registerServiceWorker'
import { nodeConfig } from './models/stores';

let currentNode = localStorage.getItem('currentNode')
//const app = createApp(App);
//app.use(router);
//app.mount('#app');

function protocol() {
  const href = window.location.href;
  const arr = href.split("/");
  return arr[0];
}

const configIntegration = async (currentNodeExist:boolean) => {
  try {
    let configInfo = await fetch('../config/config.json', {
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      }
    }).then((res) => res.json()).then((networksInfo) => { return networksInfo });
    const configData = configInfo;
    const configDataName = Object.keys(configData);
    console.log(configDataName);

    if (currentNodeExist === false) {
      let node = new nodeConfig('currentNode');
      node.updateConfig(configInfo);
      node.saveToLocalStorage();
    }
    // Vue.prototype.$config = new Config(configInfo.data)
    // if (currentNodeExist === false) {
    //   localStorage.setItem('currentNode', configInfo.data.Nodes[0])
    //   Vue.prototype.$proxProvider = new proximaxProvider(Vue.prototype.$utils.buildUrl(`${protocol()}//${configInfo.data.Nodes[0]}`))
    // } else {
    //   Vue.prototype.$proxProvider = new proximaxProvider(Vue.prototype.$utils.buildUrl(`${protocol()}//${currentNode}`))
    // }
  } catch (e) {
    console.error(e);
  }

  // new Vue({
  //   router,
  //   store,
  //   render: function (h) { return h(App) }
  // }).$mount('#app')
}

if (currentNode === null) {
  console.log('No Current Node')
  configIntegration(false)
} else {
//  console.log('Current Node is', Vue.prototype.$utils.buildUrl(`${protocol()}//${currentNode}`))
  configIntegration(true)
}