import Vue from 'vue';
import App from '../src/pages/index/user/index.vue';
Vue.config.productionTip = false;
new Vue({ render: h => h(App) }).$mount('#app'); 