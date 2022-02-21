import "./assets/scss/main.scss";
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import 'animate.css';
import vueDebounce from 'vue-debounce'
import mitt from 'mitt';
import PrimeVue from 'primevue/config';
import "primeicons/primeicons.css";
// import "primevue/resources/primevue.min.css";
// import "primevue/resources/themes/saga-blue/theme.css";
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Import Font Awesome Icons



import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

import VueBlocksTree from 'vue3-blocks-tree';
import 'vue3-blocks-tree/dist/vue3-blocks-tree.css';

const app = createApp(App);
const emitter = mitt();
let defaultoptions = {treeName:'blocks-tree'}
app.config.globalProperties.emitter = emitter;
app.use(router)
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

app.use(vueDebounce);
app.use(VueBlocksTree,defaultoptions)
app.mount('#app');
// Use Components

app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);


// NetworkStateUtils.checkDefaultNetwork();

